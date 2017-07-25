'use strict';

function bench(name, func, ctx) {
  return function() {
    const start = new Date();
    const result = func.apply(ctx, arguments);
    const end = new Date();

    console.log({name, time: end.getTime() - start.getTime()});

    return result;
  }
}

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

function create(id) {
  return new crdt.Discrete(id, {});
}

function snapshot(text) {
  return text.next();
}

function shiftCursorPositionRelativeTo(text, position, diff) {
  diff = diff |0;
  return text.reduce(({shiftBy, position}, operation) => {
    if (operation instanceof crdt.Insert) {
      if (operation.at <= (position + diff)) {
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
  const operations = text.setMap.get(text.order)
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
    const selection = e.target.selectionEnd - e.target.selectionStart;
    const pos = e.target.selectionStart;

    // HACK: reset selection when keypress was made
    // without it selection do not disaperes
    // and this makes situations like
    // insert removes selected block all the time
    editorElement.setSelectionRange(pos, pos);

    return {
      key: (e.type === 'paste') ? e.clipboardData.getData('text/plain') : e.key,
      code: e.keyCode || e.type,
      pos,
      selection,
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
          : new crdt.Delete(Math.max(0, pos-1), 1)
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
  .on(op => bench('key-apply', database.apply, database)(op))
  .on(onFrame(render, (op, start, end) => setCursorOnKey([op], start, end)))
  // .timeout(300) // here is issue with empty sends
  .on(_ => {
    const data = bench('key-serialise', serialise)(database);
    database = bench('key-snapshot', snapshot)(database);
    ws.send(data);
  })
;

messages
  .map(e => e.data)
  .map(bench('ws-deserialise', deserialise))
  .on(e => {
    database = bench('ws-merge', database.merge, database)(e);
  })
  .debounce(10)
  .on(onFrame(render, setCursorOnUpdate))
;

function renderer(text) {
  // const order = text.order;
  // const val = order.vector[order.id];

  return text.reduce((accumulator, operation) => {
    return operation.apply(accumulator);
  }, []).join('');
}

function onFrame(f1, f2) {
  return (arg) => {
    requestAnimationFrame(() => {
      const
      start = editorElement.selectionStart,
        end = editorElement.selectionEnd;

      const shiftBy = f2(arg, start, end);
      f1(arg);
      editorElement.setSelectionRange(start + shiftBy, end + shiftBy);
    });
  };
}

function setCursorOnKey(e, start, end) {
  return bench('cursor-key-calculate', () => {
    return shiftCursorPositionRelativeTo(e, start);
  })();
}

function setCursorOnUpdate(e, start, end) {
  return bench('cursor-up-calculate', () => {
    return shiftCursorPositionRelativeTo(e, start, -1);
  })();
}

function render() {
    const string = bench('render-string', () => {
      return renderer(database);
    })();

    bench('render-set', () => editorElement.value = string)();
}
