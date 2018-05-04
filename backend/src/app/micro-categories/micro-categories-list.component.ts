import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {StaffService} from "../model/staff.service";
import {MicroCategories} from "../model/micro-categories";
import {MicroCategoriesDataService} from "../model/micro-categories-data.service";

@Component({
    templateUrl: './micro-categories-list.component.html',
})
export class MicroCategoriesListComponent implements OnInit {
    private _lists: MicroCategories[];
    private _errorMessage: string;

    constructor(private _dataService: MicroCategoriesDataService,
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

    public view(object: MicroCategories): void {
        this._router.navigate(['/micro-categories', object.id]);
    }

    public confirmDelete(object: MicroCategories): void {
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