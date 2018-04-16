import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import {WishlistComponent} from "./wishlist.component";




const routes: Routes = [
    {
        path: '',
        component: WishlistComponent,
        data: {
            title: 'Main Page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WishlistRoutingModule {
}
