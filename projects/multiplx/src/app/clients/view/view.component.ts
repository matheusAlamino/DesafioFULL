import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { environment } from 'projects/multiplx/src/environments/environment';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { Client } from '../../models/client.model';
import { FileClient } from '../../models/file-client.model';
import { ClientService } from '../../services/client.service';
import { Swal } from '../../utils';
import { ClientEditComponent } from '../edit/edit.component';

@Component({
    selector: 'app-client=view',
    templateUrl: './view.component.html'
})
export class ClientViewComponent implements OnInit {
    api: any = environment.api

    client_id: number
    filesClient: FileClient[] = []
    countFiles: number = 0
    countProcess: number = 0
    process: any
    error: boolean = false
    client: Client = {
        id: null,
        name: null,
        cpf: null,
        rg: null,
        birth_date: null,
        phone: null,
        email: null,
        last_access: null,
        status: null,
        certificado_digital: null,
        cep: null,
        numero: null,
        complemento: null,
        logradouro: null,
        bairro: null,
        cidade: null,
        uf: null,
    }

    public saveEvent = new EventEmitter()
    public deleteFileEvent = new EventEmitter()

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
        private route: ActivatedRoute,
        private clientService: ClientService,
        private swal: Swal,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.app.toggleLoading(true)

        this.saveEvent.subscribe(resp => {
            this.loadClient()
        })

        this.deleteFileEvent.subscribe(resp => {
            this.loadClientFiles()
        })

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
            if (params.client_id) {
                this.client_id = params.client_id
                this.loadClient()
            }
        });

        this.loadCountFiles()
        this.loadListProcess()
    }

    loadClient() {
        this.clientService.show(this.client_id).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.client = response.client
                this.loadClientFiles()
            } else {
                this.swal.msgAlert('Atenção', 'Cliente não encontrado!', 'warning', 'Ok')
                this.router.navigate(['/clientes'])
            }
        }, error => {
            this.app.toggleLoading(false)
            this.swal.msgAlert('Atenção', 'Cliente não encontrado!', 'warning', 'Ok')
            this.router.navigate(['/clientes'])
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    loadClientFiles() {
        let data = {
            'client_id': this.client.id
        }
        this.clientService.getFilesClient(data).subscribe(response => {
            this.filesClient = response.files
        }, error => {
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    loadCountFiles() {
        this.clientService.countFiles(this.client_id).subscribe(response => {
            if (response.ret == 1) {
                this.countFiles = response.count
            }
        }, error => {
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    loadListProcess() {
        this.clientService.listProcess(this.client_id).subscribe(response => {
            if (response.ret == 1) {
                this.process = response.data
                this.countProcess = response.data.length
            }
        }, error => {
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
                    this.$closeModalFile.nativeElement.click()
                    this.swal.msgAlert('Sucesso', 'Novo arquivo adicionado com sucesso!', 'success')
                    this.loadClientFiles()
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

    onResetPassword() {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente redefinir a senha do cliente? Será enviado um e-mail com a nova senha.', 'info', 'Sim', 'Não', { callback: () => this.resetPassword() })
    }

    resetPassword() {
        this.clientService.resetPassword(this.client.id).subscribe(resp => {
            if (resp.ret) {
                this.swal.msgAlert('Sucesso', 'Senha foi redefinida! A nova senha foi enviada para: ' + this.client.email, 'success', 'Ok')
            } else {
                this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar redefinir a senha!', 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar redefinir a senha!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    getAddress() {
        let msg = ''
        if (this.client.logradouro) {
            msg += this.client.logradouro
        }

        if (this.client.numero) {
            if (msg != '') {
                msg += ', '
            }
            msg += 'Nº ' + this.client.numero
        }

        if (this.client.bairro) {
            if (msg != '') {
                msg += ', '
            }
            msg += this.client.bairro
        }

        if (this.client.cep) {
            if (msg != '') {
                msg += ', '
            }
            msg += 'CEP ' + this.client.cep
        }

        if (this.client.cidade) {
            if (msg != '') {
                msg += ', '
            }
            msg += this.client.cidade
        }

        if (this.client.uf) {
            if (msg != '') {
                msg += ' - '
            }
            msg += this.client.uf
        }

        if (this.client.complemento) {
            if (msg != '') {
                msg += '<br>'
            }
            msg += this.client.complemento
        }

        return msg
    }

    setParamsClientUpload(client_id) {
        this.paramsClient = client_id
        this.$dzoneUpload.params.emit({
            client_id: client_id
        })
    }

    lastAccess(last_access) {
        if (last_access == null) {
            return 'Nunca'
        } else {
            return (new Date(last_access),'dd/MM/yyyy HH:mm')
        }
    }
}
