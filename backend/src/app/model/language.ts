import {Activities} from "./activities";

export class Language {

    id: number;
    name: string;
    short_code: string;
    icon: string;
    activity: Activities;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }


    //Database references.

    public static DB_COLUMN_ID_REFERENCE = {
        it: {
            activities: {
                table_id: 1,
                columns: [
                    // column sequence should remain same.
                    {id: 2, name: "description"},
                    {id: 1, name: "name"},
                    {id: 3, name: "address"}
                ]
            },
            language_id: 2,
        },
        fr: {
            activities: {
                table_id: 1,
                columns: [
                    // column sequence should remain same.
                    {id: 2, name: "description"},
                    {id: 1, name: "name"},
                    {id: 3, name: "address"}
                ]
            },
            language_id: 3,
        }
    };

}
