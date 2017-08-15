import { ensureArrayLength } from '../utils';

export class Delete {
    constructor(public at: number, public length: number) {
        this.at = at;
        this.length = length;
    }

    apply(data) {
        if (this.at < 0) return data

        let copy = data.slice(0);
        copy = ensureArrayLength(copy, this.at);
        copy.splice(this.at, this.length);
        return copy;
    }
}
