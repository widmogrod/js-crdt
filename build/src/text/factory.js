"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("./text");
const set_map_1 = require("../structures/set-map");
const naive_immutable_map_1 = require("../structures/naive-immutable-map");
const sorted_set_array_1 = require("../structures/sorted-set-array");
const naive_array_list_1 = require("../structures/naive-array-list");
function createFromOrderer(order) {
    return new text_1.Text(order, new set_map_1.SetMap(new sorted_set_array_1.SortedSetArray(new naive_array_list_1.NaiveArrayList([])), new naive_immutable_map_1.NaiveImmutableMap()));
}
exports.createFromOrderer = createFromOrderer;
//# sourceMappingURL=factory.js.map