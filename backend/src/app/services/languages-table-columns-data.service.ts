import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {AuthHttp} from 'angular2-jwt';
import {GlobalService} from "../model/global.service";
import {StaffService} from "../model/staff.service";
import {LanguagesTablesColumns} from "../model/languages-tables-columns";
import {HttpUtils} from "../utilities/http-utils";


@Injectable()
export class LanguagesTableColumnsDataService {

    constructor(private _globalService: GlobalService,
                private _staffService: StaffService,
                private _authHttp: AuthHttp) {
    }

    public(table_name: string): Observable<LanguagesTablesColumns[]> {
        let headers = this.getHeaders();

        var parameters = {
            table_name: table_name,
        };

        return this._authHttp.get(
            this._globalService.apiHost + '/languages-table-columns/public?' + HttpUtils.ObjectToUriParams(parameters),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <LanguagesTablesColumns[]>response.data;
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
