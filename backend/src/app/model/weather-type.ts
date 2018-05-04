export class WeatherType {
    id: number;
    key: string;
    label: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
