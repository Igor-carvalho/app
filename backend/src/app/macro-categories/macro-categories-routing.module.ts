import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MacroCategoriesListComponent} from "./macro-categories-list.component";
import {MacroCategoriesFormComponent} from "./macro-categories-form.component";


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Macro Categories'
        },
        children: [
            {
                path: 'list',
                component: MacroCategoriesListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: MacroCategoriesFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: MacroCategoriesFormComponent,
                data: {
                    title: 'Update'
                }
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacroCategoriesRoutingModule {
}
