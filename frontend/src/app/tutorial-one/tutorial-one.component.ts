import {Component, OnInit, AfterViewInit} from '@angular/core';
import {
    TweenMax,
    Power2,
    Back,
    Power0,
    Elastic,
    Bounce,
    SplitText,
    TimelineLite,
    TweenLite,
    CSSPlugin,
    EasePack
} from 'gsap';
import {Params, Router, ActivatedRoute} from '@angular/router';
import {AppInitialSettings} from '../model/AppInitialSettings';
import * as $ from 'jquery';

@Component({
    selector: 'app-tutorial-one',
    templateUrl: './tutorial-one.component.html',
})
export class TutorialOneComponent implements OnInit, AfterViewInit {

    private appInitSettings: AppInitialSettings;

    constructor(private activatedRoute: ActivatedRoute, private _router: Router) {
            this.appInitSettings = new AppInitialSettings();
        this.activatedRoute.queryParams.subscribe(params => {
            // console.log('singled...',params.isSingleDay);
            if (params.isSingleDay != undefined) {
                if (params.isSingleDay != null) {
                    this.appInitSettings.isSingleDay = true;
                } else {
                    this.appInitSettings.isSingleDay = false;
                }
            } else {
                this.appInitSettings.isSingleDay = false;
            }
            this.appInitSettings.store();
        });
    }
    userlat = null;
    userlng = null;
    citylat = 40.8518;
    citylng = 14.2681;

    ngAfterViewInit() {
    }

    ngOnInit() {
        var r = confirm("Do you want to share your loaction?");
        console.log(r);
        if (r){
            window.navigator.geolocation.getCurrentPosition((position) => {
                this.userlat = position.coords.latitude;
                this.userlng = position.coords.longitude;
                console.log('userPosition1',position);
            }, (err) => {
                this.userlat = null;
                this.userlng = null;
                alert('Geolocation is not supported.');
            }, {enableHighAccuracy: true, maximumAge: 10000});
        } else {
            this.userlat = null;
            this.userlng = null;
        }

        $('#header-button-wrapper').css('display', 'list-item');
        $('#edit-filter').css('display', 'none');
        $('#menu_back_icon').css('display', 'none');

        $('.app').css('background-color', '#E52050');

        TweenLite.from('#heading', 1, {top: -200, opacity: 0, ease: Bounce.easeOut, delay: 0.5});
        TweenLite.from('.icon_one', 0.5, {scale: 0, delay: 1, rotation: -70, ease: Back.easeOut});
        TweenLite.from('.icon_two', 0.5, {scale: 0, delay: 1.2, rotation: -70, ease: Back.easeOut});
        TweenLite.from('.icon_three', 0.5, {scale: 0, delay: 1.4, rotation: -70, ease: Back.easeOut});
        TweenMax.staggerFrom('.description', 0.4, {
            opacity: 0,
            rotationX: -90,
            transformOrigin: '50% top',
            delay: 1
        }, 0.4);
        TweenLite.from('.tutorials_get_started_wrapper', 0.8, {scale: 0, delay: 1.6, ease: Back.easeOut});
        TweenLite.from('.underline_border_get_started', 1, {scale: 0, delay: 1.6, ease: Power0.easeNone});
    }

    goTutorialTwo() {
        if (this.userlat == null || this.userlng == null) {
            this._router.navigate(['/tutorial-two']);
        }
        else {
            let params = {
                lat: this.userlat,
                lng: this.userlng,
                citylat: this.citylat,
                citylng: this.citylng
            };
            this._router.navigate(['/tutorial-two'], {queryParams: params});
        }
    }
}
