import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CustomValidators} from 'ng2-validation';
import {ContainsValidators} from "../shared/contains-validator.directive";
import {FormGroup, FormBuilder, Validators, FormArray} from "@angular/forms";


import {StaffDataService} from "../model/staff-data.service";
import {Staff} from "../model/staff";
import {StaffService} from "../model/staff.service";

import * as moment from "moment";
import * as _ from "underscore";
import {Activities} from "../model/activities";
import {ActivitiesDataService} from "../model/activities-data.service";
import {IMultiSelectOption} from "angular-2-dropdown-multiselect";
import {ImageUploadService} from "../model/image-upload.service";
import {StaticDataService} from "../model/static-data.service";
import {IMyDpOptions} from 'angular4-datepicker/src/my-date-picker';
import {DateUtils} from "../utilities/DateUtils";
import {Language} from "../model/language";
import {LanguagesTablesColumns} from "../model/languages-tables-columns";
import {LanguagesDataService} from "../services/languages-data.service";
import {LanguagesTableColumnsDataService} from "../services/languages-table-columns-data.service";
import {LanguageContent} from "../model/language-content";


@Component({
    templateUrl: './activities-form.component.html',
})
export class ActivitiesFormComponent implements OnInit, OnDestroy {
    private _mode = '';

    private _id: number;
    private _parameters: any;
    private _activity: Activities;

    private weatherTypes: IMultiSelectOption[];
    private macroCategories: IMultiSelectOption[];
    private microCategories: IMultiSelectOption[];

    public languages: Language[];
    public languageTableColumns: LanguagesTablesColumns[];

    private budgetList: any;
    private hoursLlist: any;
    private minutesList: any;
    public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    private _errorMessage: string;

    private _form: FormGroup;
    private _formErrors: any;
    private _submitted: boolean = false;


    constructor(private _activitiesDataService: ActivitiesDataService,
                private _staffService: StaffService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _imageUpload: ImageUploadService,
                private _staticData: StaticDataService,
                private _languagesService: LanguagesDataService,
                private _languagesTableColumnService: LanguagesTableColumnsDataService,
                private _formBuilder: FormBuilder) {
        this.weatherTypes = [];
        this.microCategories = [];
        this.macroCategories = [];

        this._activity = new Activities();

        this.hoursLlist = DateUtils.HOURS;
        this.minutesList = DateUtils.MINUTES;

        this.getLanguageData();

        console.log(this._activity);


    }

    private _setFormErrors(errorFields: any): void {
        for (let key in errorFields) {
            let errorField = errorFields[key];
            // skip loop if the property is from prototype
            if (!this._formErrors.hasOwnProperty(key)) continue;

            // let message = errorFields[error.field];
            this._formErrors[key].valid = false;
            this._formErrors[key].message = errorField;
        }
    }

    private _resetFormErrors(): void {
        this._formErrors = {
            name: {valid: true, message: ''},
            description: {valid: true, message: ''},
            address: {valid: true, message: ''},
            city: {valid: true, message: ''},
            country: {valid: true, message: ''},
            longitude: {valid: true, message: ''},
            latitude: {valid: true, message: ''},
            date_starts: {valid: true, message: ''},
            date_ends: {valid: true, message: ''},
            budget: {valid: true, message: ''},
            max_people: {valid: true, message: ''},
        };
    }

    private _isValid(field): boolean {
        let isValid: boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if (this._form.controls[field].touched == false) {
            isValid = true;
        }
        // If the field is touched and valid value, then it is considered as valid.
        else if (this._form.controls[field].touched == true && this._form.controls[field].valid == true) {
            isValid = true;
        }

        return isValid;
    }

    public onValueChanged(data?: any) {
        if (!this._form) {
            return;
        }
        const form = this._form;
        for (let field in this._formErrors) {
            // clear previous error message (if any)
            let control = form.get(field);
            if (control && control.dirty) {
                this._formErrors[field].valid = true;
                this._formErrors[field].message = '';
            }
        }
    }

    private _resetActivity() {
        this._activity = new Activities();
        this._activity.name = '';
        this._activity.description = '';
        this._activity.address = '';
        this._activity.city = '';
        this._activity.country = '';
        this._activity.longitude = "";
        this._activity.latitude = "";
        this._activity.images = [];
        this._activity.date_starts = "";
        this._activity.date_ends = "";
        this._activity.budget = "";
        this._activity.max_people = 0;
    }

    public ngOnInit() {

        this._resetFormErrors();
        this._resetActivity();

        this.getWeatherTypes();
        this.getMacroCategories();
        this.getMicroCategories();
        this.getBudgetTypes();

        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if (typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";
                this._activitiesDataService.getActivityById(this._id)
                    .subscribe(
                        activity => {
                            this._activity = activity;
                            this.restoreLanguageData(activity.translations);
                            this._mode = 'update';
                        },
                        error => {
                            // unauthorized access
                            if (error.status == 401 || error.status == 403) {
                                this._staffService.unauthorizedAccess(error);
                            } else {
                                this._errorMessage = error.data.message;
                            }
                        }
                    );
            } else {
                this._mode = 'create';
                //TODO:  write here anything that request to be fetched on new activity create
            }
        });
    }

    public ngOnDestroy() {
        this._parameters.unsubscribe();
        this._activity = new Activities();
    }

    public onSubmit() {
        this._submitted = true;


        this._activity.translations = this.formatTranslationData(this.languages);


        console.log(this._activity);
        console.log(this.languages);

        this._resetFormErrors();
        if (this._mode == 'create') {
            this._activitiesDataService.addActivity(this._activity)
                .subscribe(
                    result => {
                        if (result.success) {
                            this._router.navigate(['/activities']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if (error.status == 422) {
                            let errorFields = JSON.parse(error.data.message);
                            this._setFormErrors(errorFields);
                        }
                        // Unauthorized Access
                        if (error.status == 401 || error.status == 403) {
                            this._staffService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        } else if (this._mode == 'update') {
            this._activitiesDataService.updateActivityById(this._activity)
                .subscribe(
                    result => {
                        if (result.success) {
                            this._router.navigate(['/activities']);
                        } else {
                            this._submitted = false;
                        }
                    },
                    error => {
                        this._submitted = false;
                        // Validation errors
                        if (error.status == 422) {
                            let errorFields = JSON.parse(error.data.message);
                            this._setFormErrors(errorFields);
                            //this._setFormErrors(error.data);
                        }
                        // Unauthorized Access
                        else if (error.status == 401 || error.status == 403) {
                            this._staffService.unauthorizedAccess(error);
                        }
                        // All other errors
                        else {
                            this._errorMessage = error.data.message;
                        }
                    }
                );
        }
    }

    public fileUploadRequest(event) {
        let upload = event.target.files[0];
        console.log(upload);
        this._imageUpload.uploadImage(upload, (error, data) => {
            if (error) {
                alert(error);
            } else {
                var file_path = data.Location;
                this._activity.images.push(file_path);
            }
        });
    }

    private getWeatherTypes() {
        this._staticData.getWeatherTypes()
            .subscribe(
                result => {
                    // console.log(result);
                    var weathers = [];
                    result.forEach(each => {
                        weathers.push({id: each.id, name: each.label});
                    });
                    this.weatherTypes = weathers;
                },
                error => {
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }

    private getMacroCategories() {
        this._staticData.getMacroCategories()
            .subscribe(
                result => {
                    // console.log(result);
                    var requiredFormat = [];
                    result.forEach(each => {
                        requiredFormat.push({id: each.id, name: each.label});
                    });
                    this.macroCategories = requiredFormat;
                },
                error => {
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }

    private getMicroCategories() {
        this._staticData.getMicroCategories()
            .subscribe(
                result => {
                    // console.log(result);
                    var requiredFormat = [];
                    result.forEach(each => {
                        requiredFormat.push({id: each.id, name: each.label});
                    });
                    this.microCategories = requiredFormat;
                },
                error => {
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }

    private getBudgetTypes() {
        this._staticData.getBudgetTypes()
            .subscribe(
                result => {
                    // console.log(result);
                    this.budgetList = result;
                },
                error => {
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );
    }


    private getLanguageData() {
        this._languagesService.public()
            .subscribe(
                result => {
                    // console.log(result);
                    this.languages = result;

                    this.languages.forEach((each) => {
                        each['activity'] = new Activities();
                    });
                    console.log(this.languages);
                },
                error => {
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );

        this._languagesTableColumnService.public(ActivitiesDataService.TABLE_NAME)
            .subscribe(
                result => {
                    // console.log(result);
                    this.languageTableColumns = result;
                    console.log(this.languageTableColumns);
                },
                error => {
                    alert("Translation Data wasn't populated, Saving might lose, translation changes.");
                    this._submitted = false;
                    // Validation errors
                    if (error.status == 422) {
                        let errorFields = JSON.parse(error.data.message);
                        this._setFormErrors(errorFields);
                    }
                    // Unauthorized Access
                    if (error.status == 401 || error.status == 403) {
                        this._staffService.unauthorizedAccess(error);
                    }
                    // All other errors
                    else {
                        this._errorMessage = error.data.message;
                    }
                }
            );


    }

    private restoreLanguageData(translations: LanguageContent[]) {

        this.languages.forEach((eachLang) => {

            translations.forEach(function (activityTranslation) {
                if (activityTranslation.languages_id == eachLang.id && eachLang.id == Language.DB_COLUMN_ID_REFERENCE.it.language_id) {
                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.it.activities.columns[0].id)
                        eachLang.activity.description = activityTranslation.translation;

                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.it.activities.columns[1].id)
                        eachLang.activity.name = activityTranslation.translation;

                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.it.activities.columns[2].id) {
                        eachLang.activity.address = activityTranslation.translation;
                        // console.log("set address", activityTranslation.translation);
                    }

                }

                if (activityTranslation.languages_id == eachLang.id && eachLang.id == Language.DB_COLUMN_ID_REFERENCE.fr.language_id) {
                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.fr.activities.columns[0].id)
                        eachLang.activity.description = activityTranslation.translation;

                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.fr.activities.columns[1].id)
                        eachLang.activity.name = activityTranslation.translation;

                    if (activityTranslation.languages_tables_columns_id == Language.DB_COLUMN_ID_REFERENCE.fr.activities.columns[2].id) {
                        eachLang.activity.address = activityTranslation.translation;
                        // console.log("set address", activityTranslation.translation);
                    }

                }

            });


        });

        console.log(this.languages);

    }

    private formatTranslationData(languages: Language[]) {

        let languageContents = [];

        languages.forEach((eachLanguage) => {
            if (eachLanguage.short_code != 'en') {

                Language.DB_COLUMN_ID_REFERENCE.it.activities.columns.forEach((eachColumn) => {
                    let langContent = new LanguageContent();
                    langContent.languages_id = eachLanguage.id;
                    langContent.languages_tables_columns_id = eachColumn.id;
                    langContent.languages_tables_id = Language.DB_COLUMN_ID_REFERENCE.it.activities.table_id;
                    langContent.translation = eachLanguage.activity[eachColumn.name];

                    languageContents.push(langContent);
                });


            }
        });

        console.log(languageContents);

        return languageContents;

    }

}
