import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginService } from './services/login.service';

const routes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: '**',
        component: AppComponent
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        FormsModule,
    ],
    providers: [
        LoginService
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
