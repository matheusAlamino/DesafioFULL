import { Injectable, EventEmitter } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'

import { LocalStorageService } from './storage.service'

import { Swal } from '../utils/index'
import { environment } from '../../environments/environment'

@Injectable()
export class AuthGuard implements CanActivate {

    params: any
    pagina: string
    url: string

    api: any = environment.api

    public login = new EventEmitter()
    public resetPassword = new EventEmitter()

    constructor(
        private storageService: LocalStorageService,
        private router: Router,
        private swal: Swal) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.pagina = route.routeConfig.path
        this.params = route.queryParams
        this.url = btoa(this.api.local + this.pagina)
        this.verifyAccess()
        return true
    }

    private redirectLogin() {
        window.location.href = this.api.login
        return false
    }

    public clearStorage(redirect: string) {
        this.storageService.removeStorage('client')

        if (redirect == 'login') {
            this.redirectLogin()
        } else {
            this.url = btoa(this.api.local + redirect)
            this.redirectLogin()
        }
    }

    private verificaStorage() {
        let _client = this.storageService.getStorage('client')

        return (_client == null || _client == undefined) ? false : true
    }

    private async getClient(token) {
        await this.storageService.getDataStorage(token).then(async (data: any) => {
            if (data != null) {
                data.token = token

                await this.storageService.setStorage('client', data)
                this.login.emit(true)
                this.router.navigate([`/${this.pagina}`])
            } else {
                this.swal.confirmAlertCustom('Atenção', 'Sem permissão para acessar o sistema!', 'info', 'Ok', { callback: () => this.clearStorage('login') })
            }
        }).catch((error) => {
            if (error.ok == false && error.status == 401) this.clearStorage('login')

            return false
        })
    }

    public async verifyAccess() {
        if (this.params != undefined && this.params.t) {
            this.storageService.setStorage('client', {token: this.params.t})
            if (this.params.reset) {
                this.resetPassword.emit()
            }
            await this.storageService
                .getRefreshToken(this.params.t)
                .then(async (data) => {
                    await this.getClient(data.token)
                })
                .catch((error) => {
                    if (error.ok == false && error.status == 500) this.pagina ? this.clearStorage(this.pagina) : this.clearStorage('login')
                })
        } else {
            if (this.verificaStorage()) {
                this.login.emit(true)
                return true
            } else {
                this.pagina ? this.clearStorage(this.pagina) : this.clearStorage('login')
            }
        }
    }
}
