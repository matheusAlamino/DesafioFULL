import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { FormsModule } from '@angular/forms';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';

export const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {}

@NgModule({
  declarations: [
      UploadFileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropzoneModule
  ],
  exports: [
    UploadFileComponent
  ],
  providers: [
    {
        provide: DROPZONE_CONFIG,
        useValue: DEFAULT_DROPZONE_CONFIG
    }
]
})
export class ComponentsModule {}
