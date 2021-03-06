import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {StaffDataService} from "../model/staff-data.service";
import {Staff} from "../model/staff";
import {StaffService} from "../model/staff.service";
import {MacroCategories} from "../model/macro-categories";
import {MacroCategoriesDataService} from "../model/macro-categories-data.service";

@Component({
    templateUrl: './macro-categories-list.component.html',
})
export class MacroCategoriesListComponent implements OnInit {
    private _lists: MacroCategories[];
    private _errorMessage: string;

    constructor(private _dataService: MacroCategoriesDataService,
                private _staffService: StaffService,
                private _router: Router) {
    }

    ngOnInit() {
        this.getAll();
    }

    public getAll() {
        this._lists = null;
        this._dataService.all()
            .subscribe(
                all => {
                    this._lists = all
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
    }

    public view(object: MacroCategories): void {
        this._router.navigate(['/macro-categories', object.id]);
    }

    public confirmDelete(object: MacroCategories): void {
        // Due to sweet alert scope issue, define as function variable and pass to swal

        let parent = this;
        // let getStaffs = this.getStaffs;
        this._errorMessage = '';

        swal({
            title: 'Are you sure?',
            text: "Once delete, you won't be able to revert this!",
            type: 'question',
            showLoaderOnConfirm: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: function () {
                return new Promise(function (resolve, reject) {
                    parent._dataService.delete(object.id)
                        .subscribe(
                            result => {
                                parent.getAll();
                                resolve();
                            },
                            error => {
                                // unauthorized access
                                if (error.status == 401 || error.status == 403) {
                                    parent._staffService.unauthorizedAccess(error);
                                } else {
                                    parent._errorMessage = error.data.message;
                                }
                                resolve();

                            }
                        );
                })
            }
        }).then(function (result) {
            // handle confirm, result is needed for modals with input

        }, function (dismiss) {
            // dismiss can be "cancel" | "close" | "outside"
        });
    }
}