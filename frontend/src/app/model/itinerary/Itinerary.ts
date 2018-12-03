import {ItineraryCooking} from "./ItineraryCooking";

export class Itinerary {
    id: number;
    date_starts: string;
    date_ends: string;
    adults: number;
    childrens: number;
    budget_type: number;
    macro_categories: number[];
    itinerary_cook_raw: ItineraryCooking;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}