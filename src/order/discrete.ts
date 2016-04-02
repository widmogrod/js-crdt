import {clone, union, common} from '../utils'

type Key = string
type Vector = { [id: string]: number }

export class Discrete {
    id: Key
    vector: Vector
    constructor(id, vector) {
        vector = clone(vector);
        vector[id] = vector[id] || 0;

        this.id = id;
        this.vector = vector;
    }

    next() {
        const vector = clone(this.vector);

        ++vector[this.id];

        return new Discrete(this.id, vector);
    }

    merge(b) {
        const vector = union(
            Object.keys(this.vector),
            Object.keys(b.vector)
        ).reduce((vector, key) => {
            vector[key] = Math.max(
                this.vector[key] || 0,
                b.vector[key] || 0
            );

            return vector;
        }, {});

        return new Discrete(this.id, vector);
    }

    equal(b) {
        return this.compare(b) === 0;
    }

    compare(b) {
        const position = common(this.vector, b.vector)
            .reduce((result, key) => {
                return result + (this.vector[key] - b.vector[key]);
            }, 0);

        if (position === 0) {
            const tipPosition = this.vector[this.id] - b.vector[b.id];

            if (tipPosition !== 0) {
                return tipPosition;
            }

            const ha = b.vector.hasOwnProperty(this.id);
            const hb = this.vector.hasOwnProperty(b.id);

            if (!ha && !hb) {
                return this.id < b.id ? -1 : 1;
            } else if (ha && !hb) {
                return -1;
            } else if (hb && !ha) {
                return 1;
            }
        }

        return position;
    }
}
