import {ArrayUtils} from '../utilities/ArrayUtils';
import {DateUtils} from '../utilities/date-utils';
import {isDefined} from '@angular/compiler/src/util';

export class ActivityFilter {
    num_childs: number;
    num_adults: number;
    date_starts: string;
    date_ends: string;
    budget_type: number;
    macro_categories: number[];

    time_from: number;
    time_to: number;

    lat:number;
    lng:number;
    citylat:number;
    citylng:number;

    constructor(values: Object = {}) {
        this.macro_categories = [];
        this.num_adults = 1;
        this.num_childs = 0;

        this.lat = null;
        this.lng = null;
        this.citylat = 40.8518;
        this.citylng = 14.2681;

        this.budget_type = 0;

        const today = new Date();
        // Y-m-d
        const today_formated = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.date_starts = today_formated;
        this.date_ends = today_formated;

        this.time_from = new Date().getHours();
        this.time_to = new Date().getHours() + 1;
        Object.assign(this, values);
    }

    toggleMacroCategory(id) {
        id = id + '';
        console.log(typeof id);
        // const arrayUtils = new ArrayUtils();
        const index = this.macro_categories.indexOf(id);
        if (index != -1) {
            console.log('remove');
            this.macro_categories.splice(index, 1);
        } else {
            console.log('add');
            // console.log(this.macro_categories);
            this.macro_categories.push(id);
        }

        console.log(this.macro_categories);
    }


}
