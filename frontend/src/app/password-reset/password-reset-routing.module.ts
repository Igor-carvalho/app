import {NgModule} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import {PasswordResetComponent} from './password-reset.component';

const routes: Routes = [
    {
        path: '',
        component: PasswordResetComponent,
        data: {
            title: 'Password Reset'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PasswordResetRoutingModule {
}
