import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TutorialTwoComponent} from "./tutorial-two.component";
import {TutorialTwoRoutingModule} from "./tutorial-two-routing.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TutorialTwoRoutingModule
    ],
    declarations: [
        TutorialTwoComponent,
    ]
})
export class TutorialTwoModule {
}
