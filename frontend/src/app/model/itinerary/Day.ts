import {Hour} from "./Hour";

export class Day {
    day: string;
    hours: Hour[];


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}