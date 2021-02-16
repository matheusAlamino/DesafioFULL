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

    private storage(key) {
        return this.storageService.getStorage(key)
    }

    private redirectLogin() {
        window.location.href = this.api.login + '?l=' + this.url
        return false
    }

    private redirectLogout() {
        window.location.href = this.api.logout + '?l=' + this.url
        return false
    }

    public clearStorage(redirect: string) {
        this.storageService.removeStorage('user')

        if (redirect == 'login') this.redirectLogin()
        else if (redirect == 'logout') this.redirectLogout()
        else this.url = btoa(this.api.local + redirect)
        this.redirectLogout()
    }

    private verificaStorage() {
        let _user = this.storageService.getStorage('user')

        return (_user == null || _user == undefined) ? false : true
    }

    private async getUsuario(token) {
        await this.storageService.getDataStorage(token).then(async (data: any) => {
            if (data != null) {
                data.token = token

                await this.storageService.setStorage('user', data)
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
            this.storageService.setStorage('user', {token: this.params.t})
            await this.storageService
                .getRefreshToken(this.params.t)
                .then(async (data) => {
                    await this.getUsuario(data.token)
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
