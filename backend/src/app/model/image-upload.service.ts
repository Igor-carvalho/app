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


import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Injectable()
export class ImageUploadService {

    access_key_id = "AKIAIUS5EFGOWLE7RHZA";
    secret_access_key = "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";
    bucket_name = "dobedoo-uploads";
    bucket_region = "us-east-1";


    constructor(private _globalService: GlobalService,
                private _staffService: StaffService,
                private _authHttp: AuthHttp) {
        // this._authHttp.gl
    }

    // POST /v1/activities
    uploadImage(fileHandler: File, onResult): any {
        const bucket = new S3(
            {
                accessKeyId: this.access_key_id,
                secretAccessKey: this.secret_access_key,
                region: this.bucket_region
            }
        );

        const params = {
            Bucket: this.bucket_name,
            Key: 'activities-images/' + fileHandler.name,
            Body: fileHandler,
            ACL: 'public-read'
        };

        bucket.upload(params, function (err, data) {
            onResult(err, data);
        });
    }

    private getHeaders(): Headers {
        return new Headers({
            // 'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + this._staffService.getToken(),
        });
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
