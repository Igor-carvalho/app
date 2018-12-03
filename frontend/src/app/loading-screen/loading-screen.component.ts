import {Component, OnInit} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
    animations: [
        trigger('myAwesomeAnimation', [
            state('small', style({
                transform: 'scale(1)',
            })),
            state('large', style({
                transform: 'scale(1.2)',
            })),
            transition('small => large', animate('100ms ease-in')),
        ]),
    ]
})
export class LoadingScreenComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
