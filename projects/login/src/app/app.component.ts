import { Component, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    @ViewChild('form') $form: any

    title = 'login';
    api = environment.api
    email: string
    password: string
    msg: string
    user = {email: null, password: null }
    error: boolean = false

    constructor(
        private loginService: LoginService
    ) {}

    login() {
        if (!this.$form.valid) {
            this.error = true
            return
        }

        this.loginService.login(this.user).subscribe(
            (response) => {
                if (response.ret == 1) {
                    let a = document.createElement('a')
                    a.target = '_self'
                    a.href = this.api.local + '/home?t=' + response.token
                    a.click()
                } else {
                    this.msg = response.msg
                }
            },
            (error) => {
                console.log(error)
            }
        );
    }
}
