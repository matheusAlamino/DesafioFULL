import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { DropzoneComponent , DropzoneDirective,
  DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppComponent } from '../../app.component';
import { File } from '../../models/file.model';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent implements OnInit {

    public disabled: boolean = false;
    public params = new EventEmitter()
    public files: File[] = []

    @ViewChild('dropzoneUpload') componentRef: DropzoneComponent;

    @Input() config: DropzoneConfigInterface = {
        clickable: false,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: null
    }
    @Input() saveFileEvent: any = null
    @Input() deleteFileEvent: any = null

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
        this.saveFileEvent.emit(true)
        if (args[1].ret) {
            this.files.push(args[1].data)
        }
    }

    public resetDropzone() {
        this.componentRef.directiveRef.reset();
        this.files = []
        //console.log(this.files)
        //this.files.splice(0, 1)
    }
}
