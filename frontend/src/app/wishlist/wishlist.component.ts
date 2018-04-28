import {Component, OnInit} from '@angular/core';
import {TweenMax, Power2, Back, Power0, Elastic, Bounce, SplitText, TimelineLite, TweenLite, CSSPlugin, EasePack} from "gsap";
import * as $ from 'jquery';

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
    
    addPeople(event) {
        console.log(event.target.id);
    }

}
