import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {MacroCategoriesRoutingModule} from "./macro-categories-routing.module";
import {MacroCategoriesListComponent} from "./macro-categories-list.component";
import {MacroCategoriesFormComponent} from "./macro-categories-form.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MacroCategoriesRoutingModule
    ],
    declarations: [
        MacroCategoriesListComponent,
        MacroCategoriesFormComponent
    ]
})
export class MacroCategoriesModule {
}
