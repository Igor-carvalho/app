import {Day} from "./Day";

export class ItineraryCooking {
    id: number;
    date_starts: string;
    date_ends: string;
    adults: number;
    childrens: number;
    budget_type: number;
    macro_categories: number[];
    days: Day[];


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}