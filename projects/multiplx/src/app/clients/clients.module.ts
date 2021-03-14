import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule, Routes } from '@angular/router';
import { MaskPipe, NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../utils/pagination/pagination.module';
import { ComponentsModule } from '../components/components.module';
import { UploadFileComponent } from '../components/upload-file/upload-file.component';
import { ClientFileListComponent } from './files/list/list.component';
import { ClientViewComponent } from './view/view.component';
import { ClientEditComponent } from './edit/edit.component';

const ROUTES: Routes = [
    { path: ':new', component: ClientsComponent },
    { path: 'view/:client_id', component: ClientViewComponent },
    { path: '**', component: ClientsComponent },
]

@NgModule({
    declarations: [
        ClientsComponent,
        ClientFileListComponent,
        ClientViewComponent,
        ClientEditComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        NgxMaskModule.forRoot(),
        FormsModule,
        PaginationModule,
        ComponentsModule,
    ],
    providers: [
        MaskPipe,
        UploadFileComponent,
        ClientsComponent,
        ClientEditComponent
    ]
})
export class ClientsModule { }
