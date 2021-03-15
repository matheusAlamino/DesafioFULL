import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { ClientService } from '../services/client.service';
import { Swal } from '../utils';
import { PageSizeEnum } from '../enums/page-size.enum'
import { environment } from '../../environments/environment';
import { UploadFileComponent } from '../components/upload-file/upload-file.component';
import { FileClient } from '../models/file-client.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { Client } from '../models/client.model'
import { ClientEditComponent } from './edit/edit.component'
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
    api: any = environment.api

    @ViewChild('openModalClient') $openModalClient;

    clients: any
    client_id: number
    filesClient: FileClient[] = []
    filter: any
    status: any
    statusLeg: any
    client: Client = {
        id: null,
        name: null,
        cpf: null,
        birth_date: null,
        phone: null,
        email: null,
        last_access: null,
        status: null
    }

    editClient: Client

    currentPage: number = 1
    pageSize: number = PageSizeEnum.default
    hideButtons: boolean = true

    @ViewChild('dzoneUpload') $dzoneUpload: UploadFileComponent
    @ViewChild('closeModalFile') $closeModalFile: ElementRef

    paramsClient: any
    config: DropzoneConfigInterface = {
        clickable: true,
        url: `${this.api.mpx}uploads/clients`,
        createImageThumbnails: false,
        maxFilesize: 300,
        acceptedFiles: '.zip,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png'
    }

    constructor(
        private app: AppComponent,
        private clientService: ClientService,
        private swal: Swal,
        private uploadComponent: UploadFileComponent,
        private route: ActivatedRoute,
        private location: Location,
        private clientEditComponent: ClientEditComponent
    ) { }

    ngOnInit(): void {
        this.uploadComponent.fileAdded.subscribe(async resp => {
            this.hideButtons = false
        })

        this.clientEditComponent.saveEvent.subscribe(resp => {
            this.loadClients()
        })

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
        this.route.params.subscribe((params: any) => {
            if (params.new) {
                setTimeout(() => {
                    this.location.replaceState('clientes')
                    this.$openModalClient.nativeElement.click()
                }, 500)
            }
        });

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

    onSaveFiles() {
        if (this.$dzoneUpload.files.length > 0) {
            let data = {
                files: this.$dzoneUpload.files,
                client_id: this.paramsClient
            }
            this.clientService.saveFiles(data).subscribe(resp => {
                if (resp.ret) {
                    //this.$dzoneUpload.resetDropzone()
                    this.swal.msgAlert('Sucesso', 'Cliente cadastrado com sucesso!', 'success')
                    this.$closeModalFile.nativeElement.click()
                } else {
                    this.swal.msgAlert('Atenção', 'Erro ao salvar upload(s)!', 'warning', 'Ok')
                }
            }, error => {
                this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar salvar o(s) upload(s)!', 'error', 'Ok')
                if (error.status == 401) {
                    this.app.logout('clientes')
                }
            })
        } else {
            this.swal.msgAlert('Atenção', 'Não possui itens para salvar na área de upload(s)!', 'error', 'Ok')
        }
    }

    openModal(client = null) {

        if (client == null) {
            this.clearObject()
            client = this.client
        }
        this.editClient = this.client

        this.client = {
            id: client.id,
            name: client.name,
            cpf: client.cpf,
            birth_date: client.birth_date,
            phone: client.phone,
            email: client.email,
            last_access: client.last_acess,
            status: client.status
        }
        if (client.id != null) {
            this.editClient = client
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
            last_access: null,
            status: 1
        }
    }

    pageChanged(data) {
        this.currentPage = data.currentPage
        this.pageSize = data.pageSize
        this.loadClients()
    }

    setParamsClientUpload(client_id) {
        this.paramsClient = client_id
        this.$dzoneUpload.params.emit({
            client_id: client_id
        })
    }
}
