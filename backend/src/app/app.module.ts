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

// Routing Module
import {AppRoutingModule} from './app.routing';

// Layouts
import {FullLayoutComponent} from './layouts/full-layout.component';
import {SimpleLayoutComponent} from './layouts/simple-layout.component';
import {P404Component} from './pages/404.component';

// Shared
import {AuthGuard} from './model/auth.guard';
import {SharedModule} from './shared/shared.module';

// Model & Services
import {GlobalService} from './model/global.service';
import {StaffService} from './model/staff.service';
import {StaffDataService} from './model/staff-data.service';
import {UserDataService} from './model/user-data.service';
import {SettingDataService} from './model/setting-data.service';
import {ActivitiesDataService} from "./model/activities-data.service";
import {ImageUploadService} from "./model/image-upload.service";
import {StaticDataService} from "./model/static-data.service";
import {MacroCategoriesDataService} from "./model/macro-categories-data.service";
import {MicroCategoriesDataService} from "./model/micro-categories-data.service";
import {LanguagesDataService} from "./services/languages-data.service";
import {LanguagesTableColumnsDataService} from "./services/languages-table-columns-data.service";

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        HttpModule,
        SharedModule,
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SimpleLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        SmartResizeDirective,
        P404Component,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        AuthGuard,
        StaffService,
        GlobalService,
        SettingDataService,
        StaffDataService,
        ActivitiesDataService,
        ImageUploadService,
        StaticDataService,
        MacroCategoriesDataService,
        MicroCategoriesDataService,
        LanguagesDataService,
        LanguagesTableColumnsDataService,
        UserDataService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
