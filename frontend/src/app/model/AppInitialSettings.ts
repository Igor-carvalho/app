export class AppInitialSettings {

    private static LOCAL_STORAGE_LABEL = 'AppInitialSettings';

    isSingleDay: boolean;

    constructor() {

        this.isSingleDay = false;

        const settingsJson: string = localStorage.getItem(AppInitialSettings.LOCAL_STORAGE_LABEL);
        if (settingsJson != null) {
            const object = JSON.parse(settingsJson);
            Object.assign(this, object);
        }
    }

    public store() {
        localStorage.setItem(AppInitialSettings.LOCAL_STORAGE_LABEL, JSON.stringify(this));
    }

}
