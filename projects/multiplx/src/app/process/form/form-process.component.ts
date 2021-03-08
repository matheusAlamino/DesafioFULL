import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientSelect } from '../../models/client-select.model';
import { Process } from '../../models/process.model';
import {of as observableOf, concat as observableConcat,  Observable, Subject } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ClientService } from '../../services/client.service';
import { ProcessService } from '../../services/process.service';
import { AppComponent } from '../../app.component';
import { Swal } from '../../utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html'
})
export class FormProcessComponent implements OnInit {

    @ViewChild('form') formulario: any

    clients: any[] = []
    process: Process = {
        id: null,
        client_id: null,
        user_id: null,
        year: null,
        month: null,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        payment_year: null,
        value_rough: null,
        value_author: null,
        outgoing_operationals: null,
        outgoing_judicials: null,
        total_value: null,
        date_receive: null,
        percentual_gain: null,
        status: null
    }
    error: boolean = false
    clients$: Observable<ClientSelect[]>;
    clientLoading = false;
    clientinput$ = new Subject<string>();

    constructor(
        private datePipe: DatePipe,
        private clientService: ClientService,
        private processService: ProcessService,
        private app: AppComponent,
        private swal: Swal,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadClients()
    }

    onChangeSelect(id) {
        this.process.client_id = id
    }

    onChangeStatusSelect(id) {
        this.process.status = id
    }

    saveProcess() {
        if (!this.formulario.valid) {
            this.error = true
        }

        this.app.toggleLoading(true)
        this.processService.save(this.process).subscribe(response => {
            this.app.toggleLoading(false)
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Processo cadastrado com sucesso!', 'success')
                this.router.navigate([`/processos`])
            } else {
                this.swal.msgAlert('Atenção', 'Erro ao inserir processo!', 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar cadastrar o processo!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }

    loadClients(clients: any = []) {
        this.clients$ = observableConcat(
            observableOf(clients),
            this.clientinput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.clientLoading = true)),
                switchMap((term) =>
                    this.clientService
                        .getClients(term)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.clientLoading = false))
                        )
                )
            )
        )
    }
}
