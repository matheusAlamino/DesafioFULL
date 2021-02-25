import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { ClientService } from '../services/client.service';
import { Swal } from '../utils';
import { PageSizeEnum } from '../enums/page-size.enum'
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from '../../environments/environment';
import { UploadFileComponent } from '../components/upload-file/upload-file.component';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
    api: any = environment.api

    @ViewChild("form") $form: any
    @ViewChild('closeModal') $closeModal: ElementRef
    @ViewChild('dzoneUpload') $dzoneUpload: UploadFileComponent

    clients: any
    filter: any
    status: any
    statusLeg: any
    error: boolean = false
    client: any = {
        id: null,
        name: null,
        cpf: null,
        birth_date: null,
        phone: null,
        email: null,
        password: null,
        status: null
    }

    currentPage: number = 1
    pageSize: number = PageSizeEnum.default

    config: DropzoneConfigInterface = {
        clickable: true,
        url: `${this.api.mpx}clients-files`,
        createImageThumbnails: false,
        maxFilesize: 300
    }
    paramsClient: any

    constructor(
        private app: AppComponent,
        private clientService: ClientService,
        private swal: Swal
    ) { }

    ngOnInit(): void {
        this.app.toggleLoading(true)
        if (this.app.storage) {
            this.init()
        } else {
            this.app.getAuthGuard().login.subscribe((resp) => {
                if (resp) {
                    this.init()
                }
            })
        }
    }

    init() {
        this.loadClients()
    }

    loadClients() {
        this.clientService.list(this.currentPage, this.pageSize, this.filter, this.status).subscribe(response => {
            this.app.toggleLoading(false)
            this.clients = response
        }, error => {
            this.app.toggleLoading(false)
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    search() {
        this.app.toggleLoading(true)
        this.loadClients()
    }

    onChangeStatus(status = null) {
        this.status = null
        this.statusLeg = null
        if (status != null) {
            this.statusLeg = status == 1 ? 'Ativos' : 'Bloqueados'
            this.status = status
        }
        this.search()
    }

    onUpdateStatus(event, client) {
        let status = (event.target.checked) ? 1 : 0
        let msg = 'Deseja realmente desativar o cadastro deste cliente?'
        if (status == 1) {
            msg = 'Deseja realmente ativar o cadastro deste cliente?'
        }
        this.swal.confirmAlertCustom('Atenção',
            msg,
            'info',
            'Sim',
            'Não',
            { callback: () => this.updateStatus(client, status) },
            { callback: () => client.status = status == 1 ? 0 : 1})
    }

    updateStatus(client, status) {
        this.clientService.updateStatus(client.id, status).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Status atualizado com sucesso!', 'success')
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
                client.status = status == 1 ? 0 : 1
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar o status do cliente!', 'error', 'Ok')
            client.status = status == 1 ? 0 : 1
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    onSave() {
        if (!this.$form.valid) {
            this.error = true
            return
        }

        let msg = 'Deseja realmente salvar este cliente?'
        if (this.client.id != null) {
            msg = 'Deseja realmente atualizar os dados do cliente?'
        }

        this.swal.confirmAlertCustom('Atenção', msg, 'info', 'Sim', 'Cancelar', { callback: () => this.save() })
    }

    save() {
        if (this.client.id != null) {
            this.update()
            return;
        }

        let data = {
            'id': null,
            'name': this.client.name,
            'cpf': this.client.cpf,
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status,
        }
        this.app.toggleLoading(true)
        this.clientService.save(data).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Cliente cadastrado com sucesso!', 'success')
                this.$closeModal.nativeElement.click()
                this.loadClients()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar cadastrar o cliente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    update() {
        let data = {
            'name': this.client.name,
            'cpf': this.client.cpf,
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status,
        }
        this.app.toggleLoading(true)
        this.clientService.update(this.client.id, data).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Dados do cliente atualizado com sucesso!', 'success')
                this.$closeModal.nativeElement.click()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar os dados do cliente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    onDelete(client_id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este cliente?', 'info', 'Sim', 'Cancelar', { callback: () => this.delete(client_id) })
    }

    delete(client_id) {
        this.clientService.delete(client_id).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Cliente removido com sucesso', 'success')
                this.loadClients()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este cliente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    openModal(client = null) {
        this.error = false
        if (client == null) {
            this.clearObject()
            client = this.client
        }

        this.client = {
            id: client.id,
            name: client.name,
            cpf: client.cpf,
            birth_date: client.birth_date,
            phone: client.phone,
            email: client.email,
            status: client.status
        }
    }

    clearObject() {
        this.client = {
            id: null,
            name: null,
            cpf: null,
            birth_date: null,
            phone: null,
            email: null,
            status: 1
        }
    }

    pageChanged(data) {
        this.currentPage = data.currentPage
        this.pageSize = data.pageSize
        this.loadClients()
    }

    setParamsClientUpload(client_id) {
        this.paramsClient = {
            client_id: client_id
        }
        this.$dzoneUpload.params.emit({
            client_id: client_id
        })
    }
}
