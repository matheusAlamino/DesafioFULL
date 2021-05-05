import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, concat as observableConcat, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators'
import { AppComponent } from '../../app.component';
import { CivilStatusEnum } from '../../enums/civil-status.enum';
import { ClientMin } from '../../models/client-min.model';
import { Client, Conjuge } from '../../models/client.model';
import { BankService } from '../../services/bank.service';
import { ClientService } from '../../services/client.service';
import { Swal } from '../../utils';

@Component({
    selector: 'app-client-form',
    templateUrl: './form.component.html'
})
export class ClientFormComponent implements OnInit {

    banks: any
    client_id: number = null
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
    error: boolean = false
    @ViewChild("form") $form: any

    conjuges$: Observable<Conjuge[]>;
    conjugeLoading = false;
    conjugeinput$ = new Subject<string>();
    clientExcluded: any = []

    constructor(
        private app: AppComponent,
        private clientService: ClientService,
        private swal: Swal,
        private router: Router,
        private route: ActivatedRoute,
        private bankService: BankService
    ) { }

    ngOnInit(): void {
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
        this.loadBanks()

        this.route.params.subscribe((params: any) => {
            if (params.client_id) {
                this.client_id = params.client_id
                this.clientExcluded = [this.client_id]
                this.loadClient()
            } else {
                this.loadConjuges()
                this.clientExcluded = []
            }
        });
    }

    loadBanks() {
        this.bankService.list().subscribe(response => {
            this.banks = response
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao carregar a lista de bancos!', 'warning', 'Ok')
            this.router.navigate(['/clientes'])
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }

    loadConjuges(conjuges: any = []) {
        this.conjuges$ = observableConcat(
            observableOf(conjuges),
            this.conjugeinput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.conjugeLoading = true)),
                 switchMap((term) =>
                    this.clientService.getClients(term, this.clientExcluded, true)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.conjugeLoading = false))
                        )
                )
            )
        )
    }

    loadClient() {
        this.clientService.show(this.client_id).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.client = response.client

                if (this.client.conjuge) {
                    this.loadConjuges([this.client.conjuge])
                }

                if (this.client.address == null) {
                    this.client.address = {
                        cep: null,
                        numero: null,
                        complemento: null,
                        logradouro: null,
                        bairro: null,
                        cidade: null,
                        uf: null,
                    }
                }
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
        this.checkConjuge()

        this.client.status = this.client.status ? 1 : 0
        this.client.own_client = this.client.own_client ? 1 : 0
        this.client.tutelado = this.client.tutelado ? 1 : 0
        if (this.client.certificado_digital) {
            this.client.certificado_digital = 1
        } else {
            this.client.certificado_digital = 0
            this.client.certificado_digital_type = null
        }
        if (this.client.id != null) {
            this.update()
            return;
        }

        this.app.toggleLoading(true)
        this.clientService.save(this.client).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.router.navigate(['/clientes'])
                this.swal.msgAlert('Sucesso', 'Cliente cadastrado com sucesso!', 'success')
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
        this.app.toggleLoading(true)
        this.clientService.update(this.client.id, this.client).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.router.navigate(['/clientes'])
                this.swal.msgAlert('Sucesso', 'Dados do cliente atualizados com sucesso!', 'success')
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

    onChangeCivilStatus() {
        this.checkConjuge()
    }

    checkConjuge() {
        if (this.client.civil_status != 2 && this.client.civil_status != 4 && this.client.civil_status != 4) {
            this.client.conjuge_id = null;
        }
    }
}
