export class AppInitialSettings {

    isSingleDay: boolean;

    private static LOCAL_STORAGE_LABEL = "AppInitialSettings";

    constructor() {

        this.isSingleDay = false;

        let settingsJson: string = localStorage.getItem(AppInitialSettings.LOCAL_STORAGE_LABEL);
        if (settingsJson != null) {
            let object = JSON.parse(settingsJson);
            Object.assign(this, object);
        }
    }

    public store() {
        localStorage.setItem(AppInitialSettings.LOCAL_STORAGE_LABEL, JSON.stringify(this));
    }

}