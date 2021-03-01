import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { PageSizeEnum } from '../enums/page-size.enum';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Swal } from '../utils';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

    @ViewChild("form") form: any
    @ViewChild('closeModal') $closeModal: ElementRef

    users: User[] = []
    usersPag: any
    user: User = {
        id: null,
        name: '',
        cpf: '',
        email: '',
        phone: '',
        birth_date: null,
        admin: false,
        status: true
    }
    termo: string = ''
    status: any
    statusLeg: any
    error: boolean = false
    currentPage: number = 1
    pageSize: number = PageSizeEnum.default

    constructor(
        private userService: UserService,
        private app: AppComponent,
        private swal: Swal
    ) { }

    ngOnInit(): void {
        if (this.app.storage) {
            this.loadUsers()
        } else {
            this.app.getAuthGuard().login.subscribe((resp) => {
                if (resp) {
                    this.loadUsers()
                }
            })
        }
    }

    loadUsers(): void {
        this.app.toggleLoading(true)
        this.userService.getAllUsers(this.termo, this.status, this.currentPage, this.pageSize).subscribe(data => {
            this.app.toggleLoading(false)
            this.users = data.data
            this.usersPag = data
        })
    }

    onUpdateStatus(event, user) {
        let status = (event.target.checked) ? 1 : 0
        let msg = 'Deseja realmente desativar o cadastro deste usuário?'

        if (status == 1) {
            msg = 'Deseja realmente ativar o cadastro deste usuário?'
        }

        this.swal.confirmAlertCustom('Atenção',
            msg,
            'info',
            'Sim',
            'Não',
            { callback: () => this.updateStatus(user, status) },
            { callback: () => user.status = status == 1 ? 0 : 1})
    }

    onChangeStatus(status = null) {
        this.status = null
        this.statusLeg = null
        if (status != null) {
            this.statusLeg = status == 1 ? 'Ativos' : 'Bloqueados'
            this.status = status
        }
        this.loadUsers()
    }

    updateStatus(user, status) {
        this.app.toggleLoading(true)
        this.userService.update(user.id, status).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Status atualizado com sucesso!', 'success')
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
                user.status = status == 1 ? 0 : 1
            }
        }, error => {
            this.app.toggleLoading(false)
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar o status do usuário!', 'warning', 'Ok')
            user.status = status == 1 ? 0 : 1
            if (error.status == 401) {
                this.app.logout('usuarios')
            }
        })
    }

    newUser() {
        this.user = {
            id: null,
            name: '',
            cpf: '',
            email: '',
            phone: '',
            birth_date: null,
            admin: false,
            status: true
        }
    }

    editUser(user_selected) {
        this.user = user_selected
    }

    saveUser() {
        if (!this.form.valid) {
            this.error = true
            return
        }

        let msg = 'Deseja realmente salvar este usuário?'
        if (this.user.id != null) {
            msg = 'Deseja realmente atualizar os dados do usuário?'
        }

        this.swal.confirmAlertCustom('Atenção', msg, 'info', 'Sim', 'Cancelar', { callback: () => this.save() })
    }

    save() {
        if (this.user.id != null) {
            this.update(this.user)
            return;
        }

        this.app.toggleLoading(true)
        this.userService.save(this.user).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Usuário cadastrado com sucesso!', 'success')
                this.$closeModal.nativeElement.click()
                this.loadUsers()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar cadastrar o usuário!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('usuarios')
            }
        })
    }

    update(data) {
        this.app.toggleLoading(true)
        this.userService.update(data.id, data).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Usuário atualizado com sucesso!', 'success')
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.app.toggleLoading(false)
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar o usuário!', 'warning', 'Ok')
            if (error.status == 401) {
                this.app.logout('usuarios')
            }
        })
    }

    onDelete(user_id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este usuário?', 'info', 'Sim', 'Cancelar', { callback: () => this.delete(user_id) })
    }

    delete(user_id) {
        this.userService.delete(user_id).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Usuário removido com sucesso!', 'success')
                this.loadUsers()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este usuário!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('usuarios')
            }
        })
    }

    pageChanged(data) {
        this.currentPage = data.currentPage
        this.pageSize = data.pageSize
        this.loadUsers()
    }
}
