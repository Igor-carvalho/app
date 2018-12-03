import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItineraryComponent} from './Itinerary.component';
import {ItineraryRoutingModule} from './Itinerary-routing.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ItineraryRoutingModule
    ],
    declarations: [
        ItineraryComponent,
    ]
})
export class ItineraryModule {
}
