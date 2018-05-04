import {Component, OnInit} from '@angular/core';
import {ActivitiesDataService} from "app/services/activities-data.service";
import {UserService} from "../model/user.service";

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

    constructor(private _activitesDataService: ActivitiesDataService,
                private _userService: UserService) {

    }

    ngOnInit() {
    }
}
