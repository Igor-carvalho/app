import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

@Component({
    selector: 'app-tutorial-one',
    templateUrl: './tutorial-one.component.html',
})
export class TutorialOneComponent implements OnInit {

    constructor() {


    }

    ngOnInit() {
        TweenLite.to("#heading", 2, {rotation:360});
    }
}
