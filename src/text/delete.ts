import { ensureArrayLength } from '../utils';
import { concat, Applicator } from '../functions';

export class Delete {
    at: number
    length: number
    constructor(at: number, length: number) {
        this.at = at;
        this.length = length;
    }

    apply(data) {
        if (this.at < 0) return data

        data = ensureArrayLength(data, this.at);

        return concat(
            data.slice(0, this.at),
            data.slice(this.at + this.length)
        );
    }
}
