import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';



@NgModule({
    declarations: [
        PaginationComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        PaginationComponent,
        CommonModule,
    ]
})
export class PaginationModule { }
