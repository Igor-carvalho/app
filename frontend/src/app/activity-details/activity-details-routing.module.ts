import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {ActivityDetailsComponent} from "./activity-details.component";


const routes: Routes = [
    {
        path: '',
        component: ActivityDetailsComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityDetailsRoutingModule {
}
