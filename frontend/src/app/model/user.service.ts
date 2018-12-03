import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {GlobalService} from './global.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';

import {tokenNotExpired} from 'angular2-jwt';
import {AuthHttp, JwtHelper} from 'angular2-jwt';


@Injectable()
export class UserService {
    private loggedIn = false;
    public redirectURL = '';
    public jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _globalService: GlobalService,
                private _router: Router,
                private _authHttp: AuthHttp) {
        this.loggedIn = this.isLoggedIn();
    }

    public login(username, password) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/login',
                JSON.stringify({
                    'LoginForm': {
                        'username': username,
                        'password': password
                    }
                }),
                {headers: headers}
            )
            .map(response => response.json())
            .map((response) => {
                if (response.success) {
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

    public signup(username, email, password) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        const parameters = {
            'SignupForm': {
                'username': username,
                'email': email,
                'password': password
            }
        };

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/signup',
                JSON.stringify(parameters),
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

    public signupConfirm(id, auth_key) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/confirm',
                JSON.stringify({
                    'SignupConfirmForm': {
                        'id': id,
                        'auth_key': auth_key,
                    }
                }),
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

    public passwordResetRequest(email) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/password-reset-request',
                JSON.stringify({
                    'PasswordResetRequestForm': {
                        'email': email
                    }
                }),
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


    public passwordResetTokenVerification(token) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/password-reset-token-verification',
                JSON.stringify({
                    'PasswordResetTokenVerificationForm': {
                        'token': token,
                    }
                }),
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

    public passwordReset(token, password) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');

        return this._authHttp
            .post(
                this._globalService.apiHost + '/user/password-reset',
                JSON.stringify({
                    'PasswordResetForm': {
                        'token': token,
                        'password': password
                    }
                }),
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

    public logout(): void {
        localStorage.removeItem('frontend-token');
        this.loggedIn = false;
    }

    public getToken(): any {
        return localStorage.getItem('frontend-token');
    }

    private checkToken(): any {
        return !!localStorage.getItem('frontend-token');
    }

    public unauthorizedAccess(error: any, returnUrl = null): void {
        this.logout();
        this._router.navigate(['/login'], {queryParams: {r: this._router.url}});
    }

    public isLoggedIn(): boolean {
        return tokenNotExpired('frontend-token');
    }

    public getJWTValue(): any {
        if (this.isLoggedIn()) {
            const token = this.getToken();
            return this.jwtHelper.decodeToken(token);
        } else {
            return null;
        }
    }

    private handleError(error: Response | any) {

        let errorMessage: any = {};
        // Connection error
        if (error.status == 0) {
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
