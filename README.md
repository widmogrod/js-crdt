# js-crdt [![Build Status](https://travis-ci.org/widmogrod/js-crdt.svg?branch=master)](https://travis-ci.org/widmogrod/js-crdt)
## Introduction
Real time collaboration is a fascinating concept.
Main purpose of this libriary it to explore applications of data structure called `CRDT` in context of real time collaboration
and learn answers to questions like:

- How to write collaborative applications?
- How to ensure strong eventual consistency?
- What are limirations of CRDTs?

> CRDT stands for Conflict-free Replication Data Type in JavaScript.

## Components
Compoents that can be found in this libriary:

- Data structures like `Immutable SortedSet`, `Immutable Lists`, `Immutable Maps`
- Partial ordering algorithms like `Vector clock`
- Higher order component `text` that encapsulates operation on plain text that can be used in collaborative editing.

## Applications
- https://github.com/widmogrod/notepad-app - Collaborative notepad app (demo).

## Development
Basic development requires at least `nodejs@8`.

To quickly start developmen run:
```
npm install
npm test
```

Before pull request run following commands to ensure code quality:
```
npm test
npm run lint
npm run dist
```
