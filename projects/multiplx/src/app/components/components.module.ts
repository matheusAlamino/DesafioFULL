import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { FormsModule } from '@angular/forms';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { environment } from '../../environments/environment';
import { TimelineStatusComponent } from './timeline-status/timeline-status.component';
import { StatusIconComponent } from './status-icon/status-icon.component';

const api: any = environment.api

export const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: api.mpx,
    acceptedFiles: 'image/*',
    createImageThumbnails: true
}

@NgModule({
  declarations: [
      UploadFileComponent,
      TimelineStatusComponent,
      StatusIconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropzoneModule
  ],
  exports: [
    UploadFileComponent,
    TimelineStatusComponent,
    StatusIconComponent
  ],
  providers: [
    {
        provide: DROPZONE_CONFIG,
        useValue: DEFAULT_DROPZONE_CONFIG
    }
]
})
export class ComponentsModule {}
