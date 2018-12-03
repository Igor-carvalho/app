import {LanguageContent} from "./language-content";

export class Activities {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
    images: any;
    date_starts: string;
    date_ends: string;
    budget: string;
    max_people: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    weather_types: number[];
    macro_category: number[];
    micro_category: number[];
    time_start_hh: string;
    time_start_mm: string;
    time_end_hh: string;
    time_end_mm: string;
    duration: number;

    priority: string;

    translations: LanguageContent[];


    constructor(values: Object = {}) {
        this.time_end_hh = "00";
        this.time_end_mm = "00";
        this.time_start_hh = "00";
        this.time_start_mm = "00";


        Object.assign(this, values);
    }


}
