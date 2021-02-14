import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';

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
  ]
})
export class UsersModule { }
