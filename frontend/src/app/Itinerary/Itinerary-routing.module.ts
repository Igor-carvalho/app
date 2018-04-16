import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {ItineraryComponent} from "./Itinerary.component";


const routes: Routes = [
    {
        path: '',
        component: ItineraryComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItineraryRoutingModule {
}
