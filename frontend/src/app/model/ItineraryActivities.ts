export class ItineraryActivities {
    itineraries_id: number;
    activities_id: string;
    start_time: string;
    end_time: string;



    constructor(values: Object = {}) {

        Object.assign(this, values);

    }

}