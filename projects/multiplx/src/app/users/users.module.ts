import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderInterceptor } from '../guards/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes = [
  { path: '', component: UsersComponent },
]

@NgModule({
    declarations: [
        UsersComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        FormsModule
    ],
    providers: [
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
    ]
})
export class UsersModule { }
