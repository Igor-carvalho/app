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
import {Activities} from "../model/Activities";
import {HttpUtils} from "../utilities/http-utils";
import {Itinerary} from "../model/itinerary/Itinerary";
import {ActivityFilter} from "../model/ActivityFilter";
import {ItineraryActivities} from "../model/ItineraryActivities";

@Injectable()
export class ItineraryDataService {

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

    cookItinerary(activities: any, activityFilter: ActivityFilter): Observable<Itinerary> {
        let headers = this.getHeaders();

        var parameters = {
            num_childs: activityFilter.num_adults,
            num_adults: activityFilter.num_adults,
            date_starts: activityFilter.date_starts,
            date_ends: activityFilter.date_ends,
            budget_type: activityFilter.budget_type,
            macro_categories: activityFilter.macro_categories,
            activities: activities
        };

        console.log(activityFilter);
        console.log(parameters);


        return this._authHttp.get(
            this._globalService.apiHost + '/itinerary/cooking?' + HttpUtils.ObjectToUriParams(parameters),
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

    getOne(id: number): Observable<Itinerary> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/itinerary/' + id,
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

    getPublic(id: number): Observable<Itinerary> {
        let headers = this.getHeaders();

        return this._authHttp.get(
            this._globalService.apiHost + '/itinerary/public/' + id,
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

    updatePublic(id: number, itineraries: ItineraryActivities[]): Observable<any> {
        let headers = this.getHeaders();

        let param = {
            itinerary_activities: itineraries
        };

        return this._authHttp.post(
            this._globalService.apiHost + '/itinerary/public-update/' + id,
            JSON.stringify(param),
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

    exportItinerary(id: number) {
        let headers = this.getHeaders();


        return this._authHttp.get(
            this._globalService.apiHost + '/itinerary/export/' + id,
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
            console.log(error);
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }
}
