import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './global.service';
import {StaffService} from './staff.service';
import {AuthHttp} from 'angular2-jwt';
import {Activities} from "./activities";
import {MacroCategories} from "./macro-categories";


@Injectable()
export class MacroCategoriesDataService {

    constructor(private _globalService: GlobalService,
                private _staffService: StaffService,
                private _authHttp: AuthHttp) {
    }

    // POST /v1/activities
    add(object: MacroCategories): Observable<any> {
        let headers = this.getHeaders();

        return this._authHttp.post(
            this._globalService.apiHost + '/macro-categories',
            JSON.stringify(object),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // DELETE /v1/activities/1
    delete(id: number): Observable<boolean> {
        let headers = this.getHeaders();

        return this._authHttp.delete(
            this._globalService.apiHost + '/macro-categories/' + id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    // PUT /v1/activities/1
    update(object: MacroCategories): Observable<any> {
        let headers = this.getHeaders();

        return this._authHttp.put(
            this._globalService.apiHost + '/macro-categories/' + object.id,
            JSON.stringify(object),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return response;
            })
            .catch(this.handleError);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._staffService.getToken(),
        });
    }

    // GET /v1/activities
    all(): Observable<MacroCategories[]> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/macro-categories?sort=-id',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Activities[]>response.data;
            })
            .catch(this.handleError);
    }

    // GET /v1/activities/1
    one(id: number): Observable<MacroCategories> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/macro-categories/' + id,
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Activities>response.data;
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


}
