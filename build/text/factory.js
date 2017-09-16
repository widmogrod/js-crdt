"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naive_array_list_1 = require("../structures/naive-array-list");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
const ordered_map_1 = require("../structures/ordered-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const text_1 = require("./text");
function createFromOrderer(order) {
    return new text_1.Text(order, new ordered_map_1.OrderedMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new naive_immutable_map_1.NaiveImmutableMap()));
}
exports.createFromOrderer = createFromOrderer;
//# sourceMappingURL=factory.js.map