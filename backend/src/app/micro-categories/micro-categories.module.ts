import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {MicroCategoriesRoutingModule} from "./micro-categories-routing.module";
import {MicroCategoriesListComponent} from "./micro-categories-list.component";
import {MicroCategoriesFormComponent} from "./micro-categories-form.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MicroCategoriesRoutingModule
    ],
    declarations: [
        MicroCategoriesListComponent,
        MicroCategoriesFormComponent
    ]
})
export class MicroCategoriesModule {
}
