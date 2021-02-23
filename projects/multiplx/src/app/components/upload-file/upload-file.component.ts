import { Component, OnInit } from '@angular/core';
import { DropzoneComponent , DropzoneDirective,
  DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

    public disabled: boolean = false;

    public config: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: null
    };

    constructor() { }

    ngOnInit(): void {
    }

    public onUploadInit(args: any): void {
        console.log('onUploadInit:', args);
    }

    public onUploadError(args: any): void {
        console.log('onUploadError:', args);
    }

    public onUploadSuccess(args: any): void {
        console.log('onUploadSuccess:', args);
    }
}
