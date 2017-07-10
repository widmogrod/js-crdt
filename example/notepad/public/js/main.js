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

let editor = document.getElementById('editor');
let keyup = new jef.stream(function(onValue){
  // editor.addEventListener('keydown', e => e.preventDefault());
  editor.addEventListener('keyup', e => {onValue(e);});
});


let host = window.document.location.host.replace(/:.*/, '');
let ws = new WebSocket('ws://' + host + ':8080');

let messages = new jef.stream(function(onValue) {
  ws.onmessage = onValue;
});

let database = new crdt.Text(create(uuid()));

keyup
  .map(e => {
    return {key: e.key, pos: e.target.selectionStart}
  })
  .map(({key, pos}) => {
    return (key === 'Backspace')
      ? new crdt.Delete(pos+1, 1)
      : new crdt.Insert(pos, key)
    ;
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
    // console.log('before:', database.toString())
    database = database.merge(e);
    // console.log('after :', database.toString())
    editor.value = database.toString();:w

  })
;
