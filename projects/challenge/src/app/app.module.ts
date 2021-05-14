import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MenuLeftComponent } from 'projects/challenge/src/app/menu-left/menu-left.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Swal } from './utils';
import { ConvertNumerics } from './utils/convertNumerics';

@NgModule({
    declarations: [
        AppComponent,
        MenuLeftComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        ConvertNumerics,
        Swal
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
