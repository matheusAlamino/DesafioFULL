import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'projects/multiplx/src/app/app.component';
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
                birth_date: null,
                phone: null,
                email: null,
                last_access: null,
                status: 1,
                certificado_digital: 0,
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
            'cep': this.client.cep,
            'numero': this.client.numero,
            'complemento': this.client.complemento,
            'logradouro': this.client.logradouro,
            'bairro': this.client.bairro,
            'cidade': this.client.cidade,
            'uf': this.client.uf,
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
            'cep': this.client.cep,
            'numero': this.client.numero,
            'complemento': this.client.complemento,
            'logradouro': this.client.logradouro,
            'bairro': this.client.bairro,
            'cidade': this.client.cidade,
            'uf': this.client.uf,
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
        if (this.client.cep == null || this.client.cep == '') {
            return
        }

        this.clientService.searchCEP(this.client.cep).subscribe(response => {
            if (response.ret == 1) {
                this.client.logradouro = response.data.logradouro
                this.client.bairro = response.data.bairro
                this.client.cidade = response.data.localidade
                this.client.uf = response.data.uf
            } else {
                this.client.logradouro = null
                this.client.bairro = null
                this.client.cidade = null
                this.client.uf = null
            }
        }, error => {
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

}
