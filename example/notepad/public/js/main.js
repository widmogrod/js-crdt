'use strict';

function uuid() {
  const array = new Uint32Array(2);
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

function serialise(text) {
  const operations = text.operationsIndex[text.index]
    .reduce((result, operation) => {
      let value = operation instanceof crdt.Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);
      return result
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
  editorElement.addEventListener('keydown', e => {onValue(e);});
  editorElement.addEventListener('keyup', e => {onValue(e);});
  editorElement.addEventListener('keypress', e => {onValue(e);});
});


let host = window.document.location.host.replace(/:.*/, '');
let ws = new WebSocket('ws://' + host + ':8080');

let messages = new jef.stream(function(onValue) {
  ws.onmessage = onValue;
});

let database = new crdt.Text(create(uuid()));

const BACKSPACE = 8;
const ENTER = 13;

keyup
  .filter(e => {
    switch(e.type) {
      case 'keydown':
        return e.keyCode === BACKSPACE;
      case 'keypress':
        return true;
      default:
        return false;
    }
  })
  .map(e => {
    return {
      key: e.key,
      code: e.keyCode,
      pos: e.target.selectionStart,
      selection: e.target.selectionEnd - e.target.selectionStart
    };
  })
  .flatMap(({key, code, pos, selection}) => {
    if (code === ENTER) {
      key = '\n';
    }
    if (code === BACKSPACE) {
      return jef.stream.fromValue(
        selection
          ? new crdt.Delete(pos, selection)
          : new crdt.Delete(pos-1, 1)
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
  .map(op => database.apply(op))
  .on(_ => {
    ws.send(serialise(database));
    database = snapshot(database);
  })
;

messages
  .map(e => e.data)
  .map(deserialise)
  .on(e => {
    database = database.merge(e);
    editorElement.value = database.toString();
  })
;
