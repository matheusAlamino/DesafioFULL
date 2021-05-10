import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { environment } from 'projects/multiplx/src/environments/environment';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { CivilStatusEnum } from '../../enums/civil-status.enum';
import { Client } from '../../models/client.model';
import { FileClient } from '../../models/file-client.model';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { Swal } from '../../utils';
import { ClientEditComponent } from '../edit/edit.component';

@Component({
    selector: 'app-client=view',
    templateUrl: './view.component.html'
})
export class ClientViewComponent implements OnInit {
    api: any = environment.api

    banks: any
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
        rg_emitter: null,
        rg_date: null,
        birth_date: null,
        phone: null,
        email: null,
        profession: null,
        nationality: null,
        last_access: null,
        status: 1,
        certificado_digital: 0,
        certificado_digital_type: null,
        civil_status: CivilStatusEnum.naoInformado,
        conjuge_id: null,
        mother_name: null,
        father_name: null,
        obs: null,
        own_client: 1,
        tutelado: 0,
        bank_code: null,
        bank_account: null,
        bank_agency: null,
        bank_pix: null,
        cartorio: null,
        termo: null,
        livro: null,
        ato: null,
        address: {
            cep: null,
            numero: null,
            complemento: null,
            logradouro: null,
            bairro: null,
            cidade: null,
            uf: null,
        }
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
        private router: Router,
        private bankService: BankService
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
                this.loadBanks()
            }
        });

        this.loadCountFiles()
        this.loadListProcess()
    }

    loadBanks() {
        this.bankService.list().subscribe(response => {
            this.banks = response
            this.loadClient()
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao carregar a lista de bancos!', 'warning', 'Ok')
            this.router.navigate(['/clientes'])
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
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
        if (this.client.address.logradouro) {
            msg += this.client.address.logradouro
        }

        if (this.client.address.numero) {
            if (msg != '') {
                msg += ', '
            }
            msg += 'Nº ' + this.client.address.numero
        }

        if (this.client.address.bairro) {
            if (msg != '') {
                msg += ', '
            }
            msg += this.client.address.bairro
        }

        if (this.client.address.cep) {
            if (msg != '') {
                msg += ', '
            }
            msg += 'CEP ' + this.client.address.cep
        }

        if (this.client.address.cidade) {
            if (msg != '') {
                msg += ', '
            }
            msg += this.client.address.cidade
        }

        if (this.client.address.uf) {
            if (msg != '') {
                msg += ' - '
            }
            msg += this.client.address.uf
        }

        if (this.client.address.complemento) {
            if (msg != '') {
                msg += '<br>'
            }
            msg += this.client.address.complemento
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

    getCivilStatus(civil_status) {
        switch (civil_status) {
            case 0: return 'Não informado'
                break
            case 1: return 'Solteiro(a)'
                break
            case 2: return 'Casado(a)'
                break
            case 3: return 'Separado(a)'
                break
            case 4: return 'Divorciado(a)'
                break
            case 5: return 'Viúvo(a)'
                break
        }
    }

    getLegBank() {
        let leg = ''
        if (this.client.bank_code != null) {
            let bank = this.banks.filter((element) => element.code == this.client.bank_code)[0];
            leg += 'Banco ' + bank.description
        }

        if (this.client.bank_agency != null) {
            if (leg != '') {
                leg += ' - ';
            }
            leg += 'Agência ' + this.client.bank_agency
        }

        if (this.client.bank_account != null) {
            if (leg != '') {
                leg += ' - ';
            }
            leg += 'Conta ' + this.client.bank_account
        }

        if (this.client.bank_pix != null) {
            if (leg != '') {
                leg += ' - ';
            }
            leg += 'PIX ' + this.client.bank_pix
        }

        return leg;
    }

    getLegCartorio() {
        let leg = ''
        if (this.client.cartorio != null) {
            if (leg != '') {
                leg += ' - ';
            }
            leg += 'Cartório ' + this.client.cartorio
        }

        if (this.client.livro != null) {
            if (leg != '') {
                leg += ', ';
            }
            leg += 'Livro ' + this.client.livro
        }

        if (this.client.termo != null) {
            if (leg != '') {
                leg += ', ';
            }
            leg += 'Termo ' + this.client.termo
        }

        if (this.client.ato != null) {
            if (leg != '') {
                leg += ', ';
            }
            leg += 'Ato ' + this.client.ato
        }

        return leg;
    }
}
