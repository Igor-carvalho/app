import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

@Component({
    selector: 'app-activity-details',
    templateUrl: './activity-details.component.html',
})
export class ActivityDetailsComponent implements OnInit {

    constructor() {


    }

    ngOnInit() {
        TweenLite.to("#heading", 2, {rotation:360});
    }
}
