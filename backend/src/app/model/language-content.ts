export class LanguageContent {

    id: number;
    languages_id: number;
    languages_tables_columns_id: number;
    languages_tables_id: number;
    translation: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);

    }

}
