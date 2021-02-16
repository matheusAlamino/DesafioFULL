import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessComponent } from './process/process.component';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from './guards/storage.service';
import { Swal } from './utils/index';
import { registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt'
import { HttpClient, HttpClientModule } from '@angular/common/http';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent,
        MenuLeftComponent,
        DashboardComponent,
        ProcessComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
    ],
    providers: [
        LocalStorageService,
        AuthGuard,
        Swal,
        HttpClient,
        {
            provide: LOCALE_ID,
            useValue: 'pt-BR',
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
