import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NAV_DROPDOWN_DIRECTIVES} from './shared/nav-dropdown.directive';

import {ChartsModule} from 'ng2-charts/ng2-charts';
import {SIDEBAR_TOGGLE_DIRECTIVES} from './shared/sidebar.directive';
import {AsideToggleDirective} from './shared/aside.directive';
import {BreadcrumbsComponent} from './shared/breadcrumb.component';
import {SmartResizeDirective} from './shared/smart-resize.directive';

import {SocialLoginModule, AuthServiceConfig} from 'angularx-social-login';
import {GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login';

const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('468914330550-ehmk8qsfdna76v3tmdm9mqpfa3i2nnd8.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('427439887695383')
    },
]);

export function provideConfig() {
    return config;
}

// Routing Module
import {AppRoutingModule} from './app.routing';

// Layouts
import {FrontendLayoutComponent} from './layouts/frontend-layout.component';
import {P404Component} from './pages/404.component';

// Shared
import {AuthGuard} from './model/auth.guard';
import {SharedModule} from './shared/shared.module';

// Model & Services
import {GlobalService} from './model/global.service';
import {UserService} from './model/user.service';
import {UserDataService} from './model/user-data.service';
import {SettingDataService} from './model/setting-data.service';
import {ActivitiesDataService} from './services/activities-data.service';
import {StaticDataService} from './services/static-data.service';
import {ItineraryDataService} from './services/itinerary-data.service';
import {LoadingScreenComponent} from './loading-screen/loading-screen.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocialUserService} from './services/social-user.service';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        HttpModule,
        SharedModule,
        BrowserAnimationsModule,
        SocialLoginModule
    ],
    declarations: [
        AppComponent,
        FrontendLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        SmartResizeDirective,
        P404Component,
    ],
    providers: [
        AuthGuard,
        UserService,
        GlobalService,
        SettingDataService,
        ActivitiesDataService,
        ItineraryDataService,
        StaticDataService,
        SocialUserService,
        UserDataService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
