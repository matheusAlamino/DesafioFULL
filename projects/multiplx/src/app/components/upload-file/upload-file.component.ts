import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DropzoneComponent , DropzoneDirective,
  DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

    public disabled: boolean = false;
    public params = new EventEmitter()

    @Input() config: DropzoneConfigInterface = {
        clickable: false,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: null
    }

    constructor(private app: AppComponent,) { }

    ngOnInit(): void {
        this.config.headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${this.app.storage.token}`
        }

        this.params.subscribe(data => {
            this.config.params = data
        })
    }

    public onUploadInit(args: any): void {
        // console.log('onUploadInit:', this.config);
    }

    public onUploadError(args: any): void {
        // console.log('onUploadError:', args);
    }

    public onUploadSuccess(args: any): void {
        // console.log('onUploadSuccess:', args);
    }
}
