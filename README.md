# js-crdt [![Build Status](https://travis-ci.org/widmogrod/js-crdt.svg?branch=master)](https://travis-ci.org/widmogrod/js-crdt)
## Introduction
CRDT Conflict-free Replication Data Type in JavaScript.

## Development
```
npm install
npm run build
npm test
nom run dist
```

## How `crdt/Text` type with `order/discrete` should work? (WIP)
Consider two actors `a` and `b` working concurrently on some document.
Actor `a` and `b` have __same origin__ of the document `origin:0`.
For simplification, origin is not shown here.

```
a:0
b:0
```

First actor started working on version `a:0`, and did some changes `xxx`.
Actor `b` did not start working on document.
```
a:0  xxx
b:0
```

Actor `a` decided to send his version `a:1` to actor `b`,
but before that, he want to be sure that regardless if `b` receives his changes, he can continue on working his version of document. 
so he created a snapshot `a:1` of his version of document and send changes to actor `b`.

```
a:0  xxx  a:1 
b:0
```

Actor `b` sees incoming changes `a:0` of the actor `a`,
so he merge them with his current state and create new version it `b:1 a:0`
```
a:0  xxx  a:1 
            |             
b:0      b:1 a:0
```

Actor `b` decides to add something to document `yyy`, and send his changes to actor `a`.
Actor `b` in the same manner, before sending his changes to actor `a` 
he creates snapshot of his version of document `b:2 a:0` and send changes `b:1 a:0` to `a`.

```
a:0  xxx  a:1          
            |             
b:0      b:1 a:0  yyy  b:2 a:0
```

When actor `a` sees incoming changes, he merge them with his document.
```
a:0  xxx  a:1          a:2 b:1
            |             |
b:0      b:1 a:0  yyy  b:2 a:0
```
