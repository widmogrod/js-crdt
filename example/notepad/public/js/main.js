'use strict';

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

function create(id) {
  return new crdt.Discrete(id, {});
}

function snapshot(text) {
  return new crdt.Text(
    text.order.next(),
    text.ordersIndex,
    text.operationsIndex
  );
}

function shiftCursorPositionRelativeTo(text, position) {
  return text.reduce(({shiftBy, position}, operation) => {
    if (operation instanceof crdt.Insert) {
      if (operation.at <= position) {
        shiftBy += operation.value.length;
        position += operation.value.length;
      }
    } else if (operation instanceof crdt.Delete) {
      if (operation.at < position) {
        shiftBy -= operation.length;
      }
    }

    return {shiftBy, position};
  }, {shiftBy: 0, position}).shiftBy;
}

function serialise(text) {
  const operations = text.operationsIndex[text.index]
    .reduce((result, operation) => {
      let value = operation instanceof crdt.Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);

      return result;
    }, {
      operations: [],
      order: {
        id: text.order.id,
        vector: text.order.vector,
      }
    });

  return JSON.stringify(operations);
}

function deserialise(string) {
  const {order, operations} = JSON.parse(string);
  const {id, vector} = order;

  return operations.reduce((text, {type, args}) => {
    const operation = (type === 'insert')
      ? new crdt.Insert(args[0], args[1])
      : new crdt.Delete(args[0], args[1]);

    text.apply(operation)
    return text
  }, new crdt.Text(new crdt.Discrete(id, vector)));
}

let editorElement = document.getElementById('editor');
let keyup = new jef.stream(function(onValue){
  editorElement.addEventListener('keydown', e => { onValue(e);});
  editorElement.addEventListener('keyup', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('keypress', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('paste', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('cut', e => {e.preventDefault(); onValue(e);});
});

let host = window.document.location.host.replace(/:.*/, '');
let ws = new WebSocket('ws://' + host + ':8080');

let messages = new jef.stream(function(onValue) {
  ws.onmessage = onValue;
});

let database = new crdt.Text(create(uuid()));

const BACKSPACE = 8;
const DELETE = 46;
const ENTER = 13;

keyup
  .filter(e => {
    switch(e.type) {
      case 'keydown':
        return e.keyCode === BACKSPACE || e.keyCode === DELETE;
      case 'keypress':
        return true;
      case 'cut':
      case 'paste':
        return true;
      default:
        return false;
    }
  })
  .map(e => {
    return {
      key: (e.type === 'paste') ? e.clipboardData.getData('text/plain') : e.key,
      code: e.keyCode || e.type,
      pos: e.target.selectionStart,
      selection: e.target.selectionEnd - e.target.selectionStart
    };
  })
  .flatMap(({key, code, pos, selection}) => {
    if (code === ENTER) {
      key = '\n';
    }

    if (code === 'cut') {
      return jef.stream.fromValue(
          new crdt.Delete(pos, selection)
      );
    }

    if (code === BACKSPACE) {
      return jef.stream.fromValue(
        selection
          ? new crdt.Delete(pos, selection)
          : new crdt.Delete(pos-1, 1)
      );
    }

    if (code === DELETE) {
      return jef.stream.fromValue(
        selection
          ? new crdt.Delete(pos, selection)
          : new crdt.Delete(pos, 1)
      );
    }

    if (selection) {
      return jef.stream.fromArray([
        new crdt.Delete(pos, selection),
        new crdt.Insert(pos, key),
      ]);
    }

    return jef.stream.fromValue(new crdt.Insert(pos, key))
  })
  .on(op => database.apply(op))
  .on(render)
  .on(op => setCursor([op]))
  .timeout(100)
  .on(_ => {
    const data = serialise(database);
    database = snapshot(database);
    ws.send(data);
  })
;

messages
  .map(e => e.data)
  .map(deserialise)
  .on(e => {
    database = database.merge(e);
  })
  .debounce(50)
  .on(render)
  .on(e => setCursor(e))
;

function setCursor(e) {
  const
  start = editorElement.selectionStart,
    end = editorElement.selectionEnd;

  const shiftBy = shiftCursorPositionRelativeTo(e, start);

  requestAnimationFrame(() => {
    editorElement.setSelectionRange(start + shiftBy, end + shiftBy);
  });
}

function render() {
  requestAnimationFrame(() => {
    editorElement.value = database.toString();
  });
}