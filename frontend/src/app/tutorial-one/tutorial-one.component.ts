import {Component, OnInit} from '@angular/core';
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
} from "gsap";
import {UserService} from "../model/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-tutorial-one',
    templateUrl: './tutorial-one.component.html',
})
export class TutorialOneComponent implements OnInit {

    constructor(private _router: Router,
                private _userService: UserService) {

        if (!this._userService.isLoggedIn()) {
            this._router.navigate(['/login']);
        }
    }

    ngOnInit() {
        TweenLite.from("#heading", 1, {top: -200, opacity: 0, ease: Bounce.easeOut, delay: 0.5});
        TweenLite.from(".icon_one", 0.5, {scale: 0, delay: 1, rotation: -70, ease: Back.easeOut});
        TweenLite.from(".icon_two", 0.5, {scale: 0, delay: 1.2, rotation: -70, ease: Back.easeOut});
        TweenLite.from(".icon_three", 0.5, {scale: 0, delay: 1.4, rotation: -70, ease: Back.easeOut});
        TweenMax.staggerFrom(".description", 0.4, {
            opacity: 0,
            rotationX: -90,
            transformOrigin: "50% top",
            delay: 1
        }, 0.4);
        TweenLite.from(".tutorials_get_started_wrapper", 0.8, {scale: 0, delay: 1.6, ease: Back.easeOut});
        TweenLite.from(".underline_border_get_started", 1, {scale: 0, delay: 1.6, ease: Power0.easeNone});
    }

    get_started_button() {

    }
}
