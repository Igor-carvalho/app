import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Layouts
import {FrontendLayoutComponent} from './layouts/frontend-layout.component';
import {P404Component} from './pages/404.component';

import {AuthGuard} from './model/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: 'app/tutorial-one/tutorial-one.module#TutorialOneModule'
    },
    {
        path: '',
        component: FrontendLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'account',
                loadChildren: 'app/account/account.module#AccountModule'
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'tutorial-one',
                loadChildren: 'app/tutorial-one/tutorial-one.module#TutorialOneModule'
            },
            {
                path: 'tutorial-two',
                loadChildren: 'app/tutorial-two/tutorial-two.module#TutorialTwoModule'
            },
            {
                path: 'login',
                loadChildren: 'app/login/login.module#LoginModule'
            },
            {
                path: 'logout',
                loadChildren: 'app/logout/logout.module#LogoutModule'
            },
            {
                path: 'signup',
                loadChildren: 'app/signup/signup.module#SignupModule'
            },
            {
                path: 'confirm',
                loadChildren: 'app/confirm/confirm.module#ConfirmModule'
            },
            {
                path: 'password-reset-request',
                loadChildren: 'app/password-reset-request/password-reset-request.module#PasswordResetRequestModule'
            },
            {
                path: 'password-reset',
                loadChildren: 'app/password-reset/password-reset.module#PasswordResetModule'
            },
        ],
    },
    {
        path: '',
        component:FrontendLayoutComponent,
        children: [

            {
                path: 'sample-page',
                loadChildren: 'app/sample-page/sample-page.module#SamplePageModule'
            },
            {
                path: 'tutorial-one',
                loadChildren: 'app/tutorial-one/tutorial-one.module#TutorialOneModule'
            },
            {
                path: 'tutorial-two',
                loadChildren: 'app/tutorial-two/tutorial-two.module#TutorialTwoModule'
            },
            {
                path: 'wishlist',
                loadChildren: 'app/wishlist/wishlist.module#WishlistModule'
            },
            {
                path: 'itinerary',
                loadChildren: 'app/itinerary/Itinerary.module#ItineraryModule'
            },
            {
                path: 'activity-details',
                loadChildren: 'app/activity-details/activity-details.module#ActivityDetailsModule'
            }
        ],
    },
    // otherwise redirect to home
    { path: '**', component: P404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
