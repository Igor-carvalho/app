import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './../model/global.service';
import {UserService} from './../model/user.service';
import {AuthHttp} from 'angular2-jwt';


@Injectable()
export class StaticDataService {


    constructor(private _globalService: GlobalService,
                private _userService: UserService,
                private _authHttp: AuthHttp) {
        // this._authHttp.gl
    }

    public getWeatherTypes(): Observable<any> {
        const headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/static-data/weather-types',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <any>response.data;
            })
            .catch(this.handleError);
    }

    public getMacroCategories(): Observable<any> {
        const headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/static-data/macro-categories',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <any>response.data;
            })
            .catch(this.handleError);
    }

    public getMicroCategories(): Observable<any> {
        const headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/static-data/micro-categories',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <any>response.data;
            })
            .catch(this.handleError);
    }

    public getBudgetTypes(): Observable<any> {
        const headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/static-data/budget-types',
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <any>response.data;
            })
            .catch(this.handleError);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._userService.getToken(),
        });
    }

    private handleError(error: Response | any) {

        let errorMessage: any = {};
        // Connection error
        if (error.status === 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: 'Sorry, there was a connection error occurred. Please try again.',
            };
        } else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }


}
