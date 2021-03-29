import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    host: { 'class': 'componentTag' }
})
export class AppComponent {
    @ViewChild('form') $form: any

    title = 'login';
    api = environment.api
    email: string
    password: string
    msg: string
    msgError: boolean = true;
    user = {email: null, password: null }
    error: boolean = false
    url: string

    constructor(
        private loginService: LoginService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (params.l) {
                this.url = atob(params.l)
            }

            if (params.c) {
                this.verifyEmail(params.c)
            }
        });
    }

    login() {
        if (!this.$form.valid) {
            this.error = true
            return
        }

        this.loginService.login(this.user).subscribe(
            (response) => {
                if (response.ret == 1) {
                    let params = '?t=' + response.token
                    if (response.password_reset == 1) {
                        params += '&reset=1'
                    }

                    if (!this.url) {
                        this.url = response.type == 1 ? this.api.local : this.api.client
                    }

                    window.location.href = this.url + params
                } else {
                    this.msg = response.msg
                    this.msgError = true
                    this.user.password = null
                }
            },
            (error) => {
                console.log(error)
            }
        );
    }

    verifyEmail(hash) {
        this.loginService.verifyEmail(hash).subscribe((response) => {
            this.msg = response.msg
            this.msgError = false
        }, (error) => {
            console.log(error)
        });
    }
}
