import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivityDetailsRoutingModule} from "./activity-details-routing.module";
import {ActivityDetailsComponent} from "./activity-details.component";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ActivityDetailsRoutingModule
    ],
    declarations: [
        ActivityDetailsComponent
    ]
})
export class ActivityDetailsModule {
}
