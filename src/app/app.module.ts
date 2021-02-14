import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessComponent } from './process/process.component';

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
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
