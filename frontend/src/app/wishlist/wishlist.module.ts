import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WishlistRoutingModule} from "./wishlist-routing.module";
import {WishlistComponent} from "./wishlist.component";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WishlistRoutingModule
    ],
    declarations: [
        WishlistComponent,
    ]
})
export class WishlistModule {
}
