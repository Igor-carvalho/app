import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import swal, {SweetAlertOptions} from 'sweetalert2';

import {StaffDataService} from "../model/staff-data.service";
import {Staff} from "../model/staff";
import {StaffService} from "../model/staff.service";
import {Activities} from "../model/activities";
import {ActivitiesDataService} from "../model/activities-data.service";

@Component({
    templateUrl: './activities-list.component.html',
})
export class ActivitiesListComponent implements OnInit {
    private _activities: Activities[];
    private _errorMessage: string;

    constructor(private _activityDataService: ActivitiesDataService,
                private _staffService: StaffService,
                private _router: Router) {
    }

    ngOnInit() {
        this.getActivities();
    }

    public getActivities() {
        this._activities = null;
        this._activityDataService.getAllActivities()
            .subscribe(
                activities => {
                    this._activities = activities
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

    public viewActivity(activity: Activities): void {
        this._router.navigate(['/activities', activity.id]);
    }

    public confirmDeleteStaff(activity: Activities): void {
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
                    parent._activityDataService.deleteActivityById(activity.id)
                        .subscribe(
                            result => {
                                parent.getActivities();
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