import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { HeaderInterceptor } from './guards/auth.interceptor';
import { LocalStorageService } from './guards/storage.service';
import { Swal } from './utils';
import localePt from '@angular/common/locales/pt'
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { HomeComponent } from './home/home.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ComponentsModule
    ],
    providers: [
        LocalStorageService,
        AuthGuard,
        Swal,
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
