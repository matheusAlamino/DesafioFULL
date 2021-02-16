import { Component } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from './guards/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'mpx'

    loading: boolean = true
    loadingText: string = ''
    isLogin: boolean = false
    storage: any

    user: { name: string, first_name: string, email: string } = { name: 'Usuário', first_name: '', email: '' }

    constructor(
        private authGuard: AuthGuard,
        public storageService: LocalStorageService
    ) {}

    ngOnInit() {
        this.authGuard.login.subscribe(async resp => {
            if (resp) {
                this.storage = this.storageService.getStorage('user')
                this.user.name = this.storage.name
                this.user.first_name = this.storage.name.split(' ')[0]
                this.user.email = this.storage.email
            }
        })
    }

    toggleLoading(show, text = '') {
        let time = (show == true) ? 0 : 500

        this.loadingText = text

        setTimeout(() => {
            this.loading = show
        }, time)
    }

    getAuthGuard() {
        return this.authGuard
    }

    logout() {
        this.authGuard.clearStorage('login')
    }
}
