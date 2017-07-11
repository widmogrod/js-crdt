import { ensureArrayLength } from '../utils';
import { concat, Applicator } from '../functions';

export class Insert {
    at: number
    value: string
    constructor(at, value) {
        this.at = at < 0 ? 0 : at;
        this.value = String(value);
    }

    apply(data) {
        data = ensureArrayLength(data, this.at);

        return concat(
            concat(data.slice(0, this.at), this.value.split('')),
            data.slice(this.at)
        );
    }
}
