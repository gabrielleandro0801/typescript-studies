import bigdecimal from "js-big-decimal";

const PRECISION: number = 2;

type CompareToOutput = {
    areEquals: boolean;
    isGreater: boolean;
    isSmaller: boolean;
};

export class CustomNumber {
    private _value: number;

    constructor(value: number | string) {
        this._value = this.convert(value);
    }

    get value(): number {
        return this._value;
    }

    add(number: CustomNumber | number) {
        const valueToAdd: number = number instanceof CustomNumber ? number.value : number;

        this._value = Number(bigdecimal.add(this._value, valueToAdd));
    }

    subtract(number: CustomNumber | number) {
        const valueToSubtract: number = number instanceof CustomNumber ? number.value : number;

        this._value = Number(bigdecimal.subtract(this._value, valueToSubtract));
    }

    compareTo(secondValue: CustomNumber): CompareToOutput {
        const areEquals: number = 0;
        const firstIsGreater: number = 1;
        const secondIsGreater: number = -1;

        const response: 0 | 1 | -1 = bigdecimal.compareTo(this.convert(this._value), this.convert(secondValue.value));

        return {
            areEquals: response === areEquals,
            isGreater: response === firstIsGreater,
            isSmaller: response === secondIsGreater,
        };
    }

    private convert(value: number | string) {
        return Number(bigdecimal.round(value, PRECISION, bigdecimal.RoundingModes.HALF_EVEN));
    }
}

export const zero: CustomNumber = new CustomNumber(0);
