# Collaborative editing
## Introduction
## TODO

- Text toString() is not optimal!
    - this is event worst than sorting - becose of evey element is calculated ~1ms * k order elements:

          const orderIndex = this.ordersIndex.findIndex(o => o.equal(order));

      solution temporary:

          const orderIndex = this.ordersIndex.findIndex(o => o === order);

    - array.slice(0) - almost none overhead - ~0ms
    - array.sort - also very decent - ~3ms

    - but the real time consuming element are Insert & Delete operations
        after changing `concat` to Array.splice
        there is no lag!

- Text reduce is sub optimal comptation wise
  - Sort is done on every reduce use i.e SortedSet
        When I used naive sorted set - render time was reduced drasticly

- Text merging should not do snapshots,
  snapshots should be done when sending changes

- Better serialisation
  - right now is JSON and it could be more compact
  - better responsivenes

- Develop a way to compact operations
  because to many changes result in longer computation time
  - find minimum common change and from it apply new changes?

- Observability.
  - implement features to gather metrics about the behaviour of the system

