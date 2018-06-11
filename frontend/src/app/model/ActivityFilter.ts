import {ArrayUtils} from '../utilities/ArrayUtils';

export class ActivityFilter {
    num_childs: number;
    num_adults: number;
    date_starts: string;
    date_ends: string;
    budget_type: number;
    macro_categories: number[];

    time_from: number;
    time_to: number;


    constructor(values: Object = {}) {
        this.macro_categories = [];
        this.num_adults = 1;
        this.num_childs = 0;

        this.date_starts = new Date().toISOString().substring(0, 10);
        this.date_ends = new Date().toISOString().substring(0, 10);

        this.time_from = new Date().getHours();
        this.time_to = new Date().getHours() + 1;
        Object.assign(this, values);
    }

    toggleMacroCategory(id) {
        id = id + "";
        console.log(id);
        let arrayUtils = new ArrayUtils();
        var index = this.macro_categories.indexOf(id);
        if (index != -1) {
            console.log("remove");
            this.macro_categories.splice(index, 1);
        } else {
            console.log("add");
            this.macro_categories.push(id);
        }

        console.log(this.macro_categories);
    }


}