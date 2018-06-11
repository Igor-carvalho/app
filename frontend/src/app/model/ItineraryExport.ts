import {ItineraryCooking} from "./itinerary/ItineraryCooking";

export class ItineraryExport {
    export_all: boolean;
    skip_export_activities: number[];
    total_activities_count: number;

    constructor(values: Object = {}) {
        this.skip_export_activities = [];
        this.export_all = false;
        this.total_activities_count = 0;

        Object.assign(this, values);

    }

    public toggleExportAll() {
        console.log(this.export_all);
        if (this.export_all)
            this.export_all = false;
        else
            this.export_all = true;
    }

    public calculateTotalActivities(itineraryCooking: ItineraryCooking) {
        this.total_activities_count = 0;
        itineraryCooking.days.forEach((day) => {

            day.hours.forEach((hour) => {
                this.total_activities_count++;
            })

        })
    }

}