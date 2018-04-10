import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TutorialOneComponent} from "./tutorial-one.component";
import {TutorialOneRoutingModule} from "./tutorial-one-routing.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TutorialOneRoutingModule
    ],
    declarations: [
        TutorialOneComponent,
    ]
})
export class TutorialOneModule {
}
