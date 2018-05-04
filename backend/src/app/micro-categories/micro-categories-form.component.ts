import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

import {FormGroup, FormBuilder, Validators, FormArray} from "@angular/forms";


import {StaffService} from "../model/staff.service";

import * as moment from "moment";
import {MicroCategories} from "../model/micro-categories";
import {MicroCategoriesDataService} from "../model/micro-categories-data.service";

@Component({
    templateUrl: './micro-categories-form.component.html',
})
export class MicroCategoriesFormComponent implements OnInit, OnDestroy {
    private _mode = '';

    private _id: number;
    private _parameters: any;
    private _object: MicroCategories;

    private _errorMessage: string;

    private _formErrors: any;
    private _submitted: boolean = false;


    constructor(private _dataService: MicroCategoriesDataService,
                private _staffService: StaffService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute) {

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


    private _resetForm() {
        this._object = new MicroCategories();
        this._object.id = null;
        this._object.label = '';
    }

    public ngOnInit() {
        this._resetForm();


        // _route is activated route service. this._route.params is observable.
        // subscribe is method that takes function to retrieve parameters when it is changed.
        this._parameters = this._activatedRoute.params.subscribe(params => {
            // plus(+) is to convert 'id' to number
            if (typeof params['id'] !== "undefined") {
                this._id = Number.parseInt(params['id']);
                this._errorMessage = "";
                this._dataService.one(this._id)
                    .subscribe(
                        object => {
                            this._object = object;
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

            }
        });
    }

    public ngOnDestroy() {
        this._parameters.unsubscribe();
        this._object = new MicroCategories();
    }

    public onSubmit() {
        this._submitted = true;
        if (this._mode == 'create') {
            this._dataService.add(this._object)
                .subscribe(
                    result => {
                        if (result.success) {
                            this._router.navigate(['/micro-categories']);
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
            this._dataService.update(this._object)
                .subscribe(
                    result => {
                        if (result.success) {
                            this._router.navigate(['/micro-categories']);
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


}

function validateDateTime(fieldKeys: any) {
    return (group: FormGroup) => {
        for (let i = 0; i < fieldKeys.length; i++) {
            let field = group.controls[fieldKeys[i]];
            if (typeof field !== "undefined" && (field.value != "" && field.value != null)) {
                if (moment(field.value, "YYYY-MM-DD HH:mm:ss", true).isValid() == false) {
                    return field.setErrors({validateDateTime: true});
                }
            }
        }
    }
}
