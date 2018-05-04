import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ActivitiesFormComponent} from "./activities-form.component";
import {ActivitiesListComponent} from "./activities-list.component";

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Activities'
        },
        children: [
            {
                path: 'list',
                component: ActivitiesListComponent,
                data: {
                    title: 'List',
                }
            },
            {
                path: 'create',
                component: ActivitiesFormComponent,
                data: {
                    title: 'Create'
                }
            },
            {
                path: ':id',
                component: ActivitiesFormComponent,
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
export class ActivitiesRoutingModule {}
