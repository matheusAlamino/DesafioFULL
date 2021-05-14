import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TitlesComponent } from './titles.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';

const ROUTES: Routes = [
    { path: '', component: TitlesComponent},
    { path: 'titles/cadastro', component: FormComponent },
    { path: 'titles/editar/:id', component: FormComponent },
]

@NgModule({
    declarations: [
        TitlesComponent,
        FormComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        NgxMaskModule.forRoot(),
        FormsModule
    ],
    providers: [
        DatePipe
    ]
})
export class TitlesModule { }
