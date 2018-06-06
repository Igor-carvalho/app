import {Injectable} from '@angular/core';
import * as moment from "moment";
import {environment} from '../../environments/environment';


@Injectable()
export class GlobalService{
    public apiHost:string;

    public setting:any = {};

    constructor(){
        if(environment.production == true) {
            this.apiHost = 'http://18.217.74.152/v1';
        } else {
            this.apiHost = 'http://localhost/dobedoo/source/api/web/v1';
        }
    }

    loadGlobalSettingsFromLocalStorage():void{
        if(localStorage.getItem('backend-setting') != null){
            this.setting = JSON.parse(localStorage.getItem('backend-setting'));
        }

    }
}