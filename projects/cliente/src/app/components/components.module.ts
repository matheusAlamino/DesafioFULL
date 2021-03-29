import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { TimelineStatusComponent } from './timeline-status/timeline-status.component';

const api: any = environment.api

@NgModule({
  declarations: [
      TimelineStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TimelineStatusComponent
  ],
  providers: []
})
export class ComponentsModule {}
