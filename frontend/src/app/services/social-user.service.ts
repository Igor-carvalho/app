import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {GlobalService} from './../model/global.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
import {Router} from "@angular/router";

import {tokenNotExpired} from 'angular2-jwt';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {HttpUtils} from "../utilities/http-utils";


@Injectable()
export class SocialUserService {
    private loggedIn = false;
    public redirectURL = '';
    public jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _globalService: GlobalService,
                private _router: Router,
                private _authHttp: AuthHttp) {
        this.loggedIn = this.isLoggedIn();
    }

    public login(authToken, provider) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        var parameters = {
            authToken: authToken,
            provider: provider
        };

        return this._authHttp
            .get(
                this._globalService.apiHost + '/social-user/login?' + HttpUtils.ObjectToUriParams(parameters),
                {headers: headers}
            )
            .map(response => response.json())
            .map((response) => {
                if (response.success) {
                    console.log("Access Token: ", response.data.access_token);
                    localStorage.setItem('frontend-token', response.data.access_token);
                    this.loggedIn = true;
                } else {
                    localStorage.removeItem('frontend-token');
                    this.loggedIn = false;
                }
                return response;
            })
            .catch(this.handleError);
    }

    public signup(authToken, provider) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        var parameters = {
            authToken: authToken,
            provider: provider
        };


        return this._authHttp
            .get(
                this._globalService.apiHost + '/social-user/signup?' + HttpUtils.ObjectToUriParams(parameters),
                {headers: headers}
            )
            .map(response => response.json())
            .map((response) => {
                if (response.success) {
                } else {
                }
                return response;
            })
            .catch(this.handleError);
    }


    public isLoggedIn(): boolean {
        return tokenNotExpired('frontend-token');
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