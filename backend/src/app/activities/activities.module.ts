import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';


import {ActivitiesFormComponent} from "./activities-form.component";
import {ActivitiesListComponent} from "./activities-list.component";
import {ActivitiesRoutingModule} from "./activities-routing.module";
import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {MyDatePickerModule} from 'angular4-datepicker/src/my-date-picker';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ActivitiesRoutingModule,
        MultiselectDropdownModule,
        MyDatePickerModule
    ],
    declarations: [
        ActivitiesListComponent,
        ActivitiesFormComponent,
    ]
})
export class ActivitiesModule {
}
