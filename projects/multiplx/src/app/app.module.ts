import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from './guards/storage.service';
import { Swal } from './utils/index';
import { registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt'
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './guards/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ConvertNumerics } from './utils/convertNumerics';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent,
        MenuLeftComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        FormsModule,
        NgApexchartsModule
    ],
    providers: [
        LocalStorageService,
        AuthGuard,
        Swal,
        ConvertNumerics,
        HttpClient,
        {
            provide: LOCALE_ID,
            useValue: 'pt-BR',
        },
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
