import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
import { CivilStatusEnum } from '../../enums/civil-status.enum';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';
import { Swal } from '../../utils';

@Component({
    selector: 'app-client-edit',
    templateUrl: './edit.component.html'
})
export class ClientEditComponent implements OnInit {

    @Input() client: Client
    @Input() saveEvent: any

    @ViewChild("form") $form: any
    @ViewChild('closeModal') $closeModal: ElementRef
    error: boolean = false

    //public saveEvent = new EventEmitter()

    constructor(
        private app: AppComponent,
        private clientService: ClientService,
        private swal: Swal
    ) { }

    ngOnInit(): void {
        if (this.client == null) {
            this.client = {
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
        }
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
            'rg': this.client.rg,
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status ? 1 : 0,
            'certificado_digital': this.client.certificado_digital ? 1 : 0,
            'cep': this.client.address.cep,
            'numero': this.client.address.numero,
            'complemento': this.client.address.complemento,
            'logradouro': this.client.address.logradouro,
            'bairro': this.client.address.bairro,
            'cidade': this.client.address.cidade,
            'uf': this.client.address.uf,
        }
        this.app.toggleLoading(true)
        this.clientService.save(data).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Cliente cadastrado com sucesso!', 'success')
                this.$closeModal.nativeElement.click()
                this.saveEvent.emit(true)
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
            'rg': this.client.rg,
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status ? 1 : 0,
            'certificado_digital': this.client.certificado_digital ? 1 : 0,
            'cep': this.client.address.cep,
            'numero': this.client.address.numero,
            'complemento': this.client.address.complemento,
            'logradouro': this.client.address.logradouro,
            'bairro': this.client.address.bairro,
            'cidade': this.client.address.cidade,
            'uf': this.client.address.uf,
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

    searchCEP() {
        if (this.client.address.cep == null || this.client.address.cep == '') {
            return
        }

        this.clientService.searchCEP(this.client.address.cep).subscribe(response => {
            if (response.ret == 1) {
                this.client.address.logradouro = response.data.logradouro
                this.client.address.bairro = response.data.bairro
                this.client.address.cidade = response.data.localidade
                this.client.address.uf = response.data.uf
            } else {
                this.client.address.logradouro = null
                this.client.address.bairro = null
                this.client.address.cidade = null
                this.client.address.uf = null
            }
        }, error => {
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

}
