import {Injectable} from '@angular/core';
import * as moment from "moment";
import {environment} from '../../environments/environment';


@Injectable()
export class GlobalService{
    public apiHost:string;

    public setting:any = {};

    constructor(){
        if(environment.production == true) {
            this.apiHost = 'http://dobedoo.acorn-labs.com/api/web/v1';
        } else {
            this.apiHost = 'http://dobedoo.acorn-labs.com/api/web/v1';
        }
    }

    loadGlobalSettingsFromSessionStorage():void{
        if(sessionStorage.getItem('frontend-setting') != null){
            this.setting = JSON.parse(sessionStorage.getItem('frontend-setting'));
        }

    }
}