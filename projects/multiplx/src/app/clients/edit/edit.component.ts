import { Component, ElementRef, Input, OnInit, ViewChild, EventEmitter } from '@angular/core';
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

    @ViewChild("form") $form: any
    @ViewChild('closeModal') $closeModal: ElementRef
    error: boolean = false

    public saveEvent = new EventEmitter()

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
                birth_date: null,
                phone: null,
                email: null,
                last_access: null,
                status: 1
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
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status ? 1 : 0,
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
            'birth_date': this.client.birth_date,
            'phone': this.client.phone,
            'email': this.client.email,
            'status': this.client.status ? 1 : 0,
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

}
