import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {TutorialOneComponent} from "./tutorial-one.component";



const routes: Routes = [
    {
        path: '',
        component: TutorialOneComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TutorialOneRoutingModule {
}
