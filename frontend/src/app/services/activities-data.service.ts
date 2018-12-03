import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

import {GlobalService} from './../model/global.service';
import {UserService} from './../model/user.service';
import {Setting} from './../model/setting';
import {AuthHttp} from 'angular2-jwt';
import {Activities} from '../model/Activities';
import {HttpUtils} from '../utilities/http-utils';
import {Itinerary} from '../model/itinerary/Itinerary';

@Injectable()
export class ActivitiesDataService {

    constructor(private _globalService: GlobalService,
                private _userService: UserService,
                private _authHttp: AuthHttp) {
    }


    private getHeaders(): Headers {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._userService.getToken(),
        });
    }

    // GET /v1/setting
    filterActivites(numberOfPeople, budgetType, macros, dateStart, dateEnd, lat, lng, citylat, citylng): Observable<Activities[]> {
        const headers = this.getHeaders();

        const parameters = {
            people: numberOfPeople,
            budget: budgetType,
            macros: macros,
            date_start: dateStart,
            date_end: dateEnd,
            lat: lat,
            lng: lng,
            citylat: citylat,
            citylng: citylng,
        };


        return this._authHttp.get(
            this._globalService.apiHost + '/activities/filter?' + HttpUtils.ObjectToUriParams(parameters),
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

    filterSingleDay(numberOfPeople, budgetType, macros, dateStart, dateEnd, time_from, time_to, lat, lng, citylat, citylng): Observable<Itinerary> {
        const headers = this.getHeaders();

        const parameters = {
            people: numberOfPeople,
            budget: budgetType,
            macros: macros,
            date_start: dateStart,
            date_end: dateEnd,
            time_from: time_from,
            time_to: time_to,
            lat: lat,
            lng: lng,
            citylat: citylat,
            citylng: citylng
        };


        return this._authHttp.get(
            this._globalService.apiHost + '/activities/filter-single-day?' + HttpUtils.ObjectToUriParams(parameters),
            {
                headers: headers
            }
        )
            .map(response => response.json())
            .map((response) => {
                return <Itinerary>response.data;
            })
            .catch(this.handleError);
    }

    replaceFilter(itinerary_id: number, activity_id: number, current_activities: string) {
        const headers = this.getHeaders();

        const parameters = {
            activity_id: activity_id,
            current_activities: current_activities
        };


        return this._authHttp.get(
            this._globalService.apiHost + '/activities/replace-filter/' + itinerary_id + '?' + HttpUtils.ObjectToUriParams(parameters),
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


    private handleError(error: Response | any) {
        let errorMessage: any = {};

        // Connection error
        if (error.status == 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: 'Sorry, there was a connection error occurred. Please try again.',
            };
        }
        else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }


    replaceActivity(itinerary, activity_id: number, current_activities: string, time_from, time_to) {
        const headers = this.getHeaders();

        const parameters = {
            itinerary: itinerary,
            activity_id: activity_id,
            time_from: time_from,
            time_to: time_to,
            current_activities: current_activities
        };


        return this._authHttp.post(
            this._globalService.apiHost + '/activities/replace-activity', parameters,
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


}
