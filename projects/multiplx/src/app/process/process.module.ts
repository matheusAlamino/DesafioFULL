import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../utils/pagination/pagination.module';

const ROUTES: Routes = [
    { path: '', component: ProcessComponent },
]

@NgModule({
    declarations: [
        ProcessComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        NgxMaskModule.forRoot(),
        FormsModule,
        PaginationModule
    ]
})
export class ProcessModule { }
