import {Component, OnInit} from '@angular/core';
import {UserService} from "../model/user.service";
import {
    TweenMax,
    Power2,
    Back,
    Power0,
    Elastic,
    Bounce,
    SplitText,
    TimelineLite,
    TimelineMax,
    TweenLite,
    CSSPlugin,
    EasePack
} from "gsap";
import * as $ from 'jquery';
import { Location } from '@angular/common';
import {Router} from "@angular/router";

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend-layout.component.html'
})
export class FrontendLayoutComponent implements OnInit {

    public disabled: boolean = false;
    public status: { isopen: boolean } = {isopen: false};
    public static loading;

    public userData: any = {};

    constructor(private _userService: UserService,
                private _location: Location) {
        FrontendLayoutComponent.loading = false;
    }

    ngOnInit(): void {
        let jwtValue: any = this._userService.getJWTValue();
        if (jwtValue != null) {
            this.userData = jwtValue.data;
        }

        var tl = new TimelineMax;
        var tlm = new TimelineMax;
        //tl.to('#bone_container', 2, {rotation: 360, repeatDelay:0, repeat: -1, yoyo:true});
        //tl.to('.eye_level_three_container', 2, {rotation: 360, repeatDelay:0, delay: 2, repeat: -1, yoyo:true});
        //tl.play();
        tl.to('#bone_container', 2, {rotation: 360, repeatDelay: 0, delay: 0, repeat: -1, ease: Power0.easeNone});
        tlm.to('.eye_level_three_container', 2, {
            rotation: 360,
            repeatDelay: 0,
            delay: 0,
            repeat: -1,
            ease: Power0.easeNone
        });
        tlm.play();
        tl.play();
    }

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    public openSideMenu() {
        $('.side_menu').toggle(400);
    }

    public goBack() {
        this._location.back();
    }
}
