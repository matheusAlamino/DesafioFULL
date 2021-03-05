import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../utils/pagination/pagination.module';
import { ListComponent } from './list/list.component';
import { FormProcessComponent } from './form/form-process.component';

const ROUTES: Routes = [
    { path: '', component: ListComponent },
    { path: 'cadastro', component: FormProcessComponent },
]

@NgModule({
    declarations: [
        ListComponent,
        FormProcessComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        NgxMaskModule.forRoot(),
        FormsModule,
        PaginationModule
    ],
    providers: [
        DatePipe
    ]
})
export class ProcessModule { }
