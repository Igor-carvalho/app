import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MicroCategoriesListComponent} from "./micro-categories-list.component";
import {MicroCategoriesFormComponent} from "./micro-categories-form.component";


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Micro Categories'
        },
        children: [
            {
                path: 'list',
                component: MicroCategoriesListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: MicroCategoriesFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: MicroCategoriesFormComponent,
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
export class MicroCategoriesRoutingModule {
}
