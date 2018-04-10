import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {TutorialTwoComponent} from "./tutorial-two.component";


const routes: Routes = [
    {
        path: '',
        component: TutorialTwoComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TutorialTwoRoutingModule {
}
