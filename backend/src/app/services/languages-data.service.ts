import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {AuthHttp} from 'angular2-jwt';
import {GlobalService} from "../model/global.service";
import {StaffService} from "../model/staff.service";
import {MacroCategories} from "../model/macro-categories";
import {Activities} from "../model/activities";
import {Language} from "../model/language";


@Injectable()
export class LanguagesDataService {

    constructor(private _globalService: GlobalService,
                private _staffService: StaffService,
                private _authHttp: AuthHttp) {
    }

    public(): Observable<Language[]> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/languages/public',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Language[]>response.data;
            })
            .catch(this.handleError);
    }


    private handleError(error: Response | any) {

        let errorMessage: any = {};
        // Connection error
        if (error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: "Sorry, there was a connection error occurred. Please try again.",
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._staffService.getToken(),
        });
    }


}
