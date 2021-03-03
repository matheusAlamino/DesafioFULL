import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LocalStorageService } from './guards/storage.service';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { Swal } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'Multiplx'

    @ViewChild("formPassword") $formPassword: any
    @ViewChild('closeModalPassword') $closeModalPassword: ElementRef
    @ViewChild('openModalPassword') $openModalPassword: ElementRef
    @ViewChild("formProfile") $formProfile: any
    @ViewChild('closeModalProfile') $closeModalProfile: ElementRef

    loading: boolean = true
    loadingText: string = ''
    isLogin: boolean = false
    storage: any
    activeMenu: string
    error: boolean = false

    user: { name: string, first_name: string, email: string } = { name: 'Usuário', first_name: '', email: '' }
    userProfile: User =  {
        id: null,
        name: null,
        cpf: null,
        email: null,
        admin: null,
        status: null,
        phone: null,
        birth_date: null
    }

    userPassword = {
        current: null,
        new: null,
        confirm: null
    }

    constructor(
        private authGuard: AuthGuard,
        public storageService: LocalStorageService,
        private userService: UserService,
        private swal: Swal
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

        this.authGuard.resetPassword.subscribe(async response => {
            this.$openModalPassword.nativeElement.click()
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

    logout(path = 'login') {
        this.authGuard.clearStorage(path)
    }

    onUpdateProfile() {
        if (!this.$formProfile.valid) {
            this.error = true
            return
        }

        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente alterar os dados do seu perfil?', 'info', 'Sim', 'Cancelar', { callback: () => this.updateProfile() })
    }

    updateProfile() {

    }

    openUserProfile() {
        this.error = false
        this.loadUserProfile()
    }

    loadUserProfile() {
        this.userService.show(this.storage.user_id).subscribe(data => {
            this.userProfile = data.user
        })
    }

    openChangePassword() {
        this.error = false
        this.userPassword = {
            current: null,
            new: null,
            confirm: null
        }
    }

    onUpdatePassword() {
        if (!this.$formPassword.valid) {
            this.error = true
            return
        }

        if (this.userPassword.new != this.userPassword.confirm) {
            this.error = true
            return
        }

        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente alterar a sua senha de acesso?', 'info', 'Sim', 'Cancelar', { callback: () => this.updatePassword() })
    }

    updatePassword() {
        this.userService.updatePassword(this.storage.user_id, this.userPassword).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Senha atualizada com sucesso!', 'success')
                this.$closeModalPassword.nativeElement.click()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar sua senha!', 'error', 'Ok')
            if (error.status == 401) {
                this.logout()
            }
        })
    }
}
