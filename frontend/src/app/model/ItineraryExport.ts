

export class ItineraryExport {
    export_all: boolean;
    skip_export_activities: number[];

    constructor(values: Object = {}) {
        this.skip_export_activities = [];
        this.export_all = false;

        Object.assign(this, values);

    }

    public toggleExportAll() {
        console.log(this.export_all);
        if (this.export_all)
            this.export_all = false;
        else
            this.export_all = true;
    }

}