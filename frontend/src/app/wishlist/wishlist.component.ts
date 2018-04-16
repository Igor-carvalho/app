import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, TimelineLite, TweenLite} from "gsap";

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {

    constructor() {


    }

    ngOnInit() {
        TweenLite.to("#heading", 2, {rotation:360});
    }
}
