import { Component } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from './guards/storage.service';
import { ProcessService } from './services/process.service';
import { Swal } from './utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    title = 'cliente';
    storage: any
    process: any
    processDetails: any
    client: { name: string, first_name: string, email: string } = { name: 'Cliente', first_name: '', email: '' }

    constructor(
        private authGuard: AuthGuard,
        public storageService: LocalStorageService,
        private swal: Swal,
        private processService: ProcessService
    ) {}

     ngOnInit() {
        this.authGuard.login.subscribe(async resp => {
            if (resp) {
                this.storage = this.storageService.getStorage('client')
                this.client.name = this.storage.name
                this.client.first_name = this.storage.name.split(' ')[0]
                this.client.email = this.storage.email
            }
        })
    }

    getAuthGuard() {
        return this.authGuard
    }

    logout(path = 'login') {
        this.authGuard.clearStorage(path)
    }
}
