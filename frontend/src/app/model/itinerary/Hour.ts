import {Activities} from "../Activities";

export class Hour {
    hour_from: number;
    hour_to: number;
    scheduled_hour_from: string;
    scheduled_hour_to: string;
    distances_activity: number;
    duration: number;
    activity: Activities;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}