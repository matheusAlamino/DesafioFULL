import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule, Routes } from '@angular/router';
import { MaskPipe, NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../utils/pagination/pagination.module';

const ROUTES: Routes = [
    { path: '', component: ClientsComponent },
]

@NgModule({
    declarations: [
        ClientsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        NgxMaskModule.forRoot(),
        FormsModule,
        PaginationModule
    ],
    providers: [
        MaskPipe,
    ]
})
export class ClientsModule { }
