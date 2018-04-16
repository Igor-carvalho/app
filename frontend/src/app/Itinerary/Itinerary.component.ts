import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

@Component({
    selector: 'app-itinerary',
    templateUrl: './itinerary.component.html',
})
export class ItineraryComponent implements OnInit {

    constructor() {


    }

    ngOnInit() {
        TweenLite.to("#heading", 2, {rotation:360});
    }
}
