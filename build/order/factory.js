"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naive_array_list_1 = require("../structures/naive-array-list");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const vector_clock2_1 = require("./vector-clock2");
const emptyVector = new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([]));
function createVectorClock2(id, version, vector) {
    return new vector_clock2_1.VectorClock2(new vector_clock2_1.Id(id, version ? version : 0), vector ? vector : emptyVector);
}
exports.createVectorClock2 = createVectorClock2;
//# sourceMappingURL=factory.js.map