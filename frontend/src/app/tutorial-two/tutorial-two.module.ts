import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TutorialTwoComponent} from './tutorial-two.component';
import {TutorialTwoRoutingModule} from './tutorial-two-routing.module';

import { AgmCoreModule } from '@agm/core';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TutorialTwoRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAcJ5d4Mt1E6cYl992hrZhUzhIjBFJP2AU'
        })
    ],
    declarations: [
        TutorialTwoComponent,
    ]
})
export class TutorialTwoModule {
}
