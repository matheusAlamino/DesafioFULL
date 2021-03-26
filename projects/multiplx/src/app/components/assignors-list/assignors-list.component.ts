import { Component, Input, OnInit } from '@angular/core';
import {of as observableOf, concat as observableConcat,  Observable, Subject } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { Client, ProcessClient } from '../../models/process.model';
import { ClientService } from '../../services/client.service';
import { ProcessService } from '../../services/process.service';
import { Swal } from '../../utils';

@Component({
  selector: 'app-assignors-list',
  templateUrl: './assignors-list.component.html'
})
export class AssignorsListComponent implements OnInit {

    @Input() assignors: Client[] = []
    @Input() process_id: number = null
    @Input() percentAvailable: number = 0
    @Input() totalValue: number = 0

    assignor: ProcessClient = {
        process_id: null,
        client_id: null,
        percentual: null,
        value: null
    }

    clientsAssignors$: Observable<Client[]>;
    clientLoadingAssignor = false;
    clientinputAssignor$ = new Subject<string>();

    constructor(
        private clientService: ClientService,
        private swal: Swal,
        private app: AppComponent,
        private processService: ProcessService
    ) { }

    ngOnInit(): void {
        this.loadAssignors();
    }

    openModal(assignorElement = null) {
        if (assignorElement) {
            this.loadAssignors([assignorElement])
            this.assignor = {
                process_id: this.process_id,
                client_id: assignorElement.id,
                percentual: assignorElement.process_client.percentual.toString().replace(".", ","),
                value: assignorElement.process_client.value
            }
        } else {
            this.clearObject()
        }
    }

    clearObject() {
        this.assignor = {
            process_id: this.process_id,
            client_id: null,
            percentual: null,
            value: null
        }
    }

    onChangePercentual(percentual) {
        this.assignor.value = this.totalValue != 0 ? (this.totalValue * percentual) / 100 : null
    }

    loadAssignors(assignors: any = []) {
        this.clientsAssignors$ = observableConcat(
            observableOf(assignors),
            this.clientinputAssignor$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.clientLoadingAssignor = true)),
                switchMap((term) =>
                    this.clientService
                        .getClients(term)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.clientLoadingAssignor = false))
                        )
                )
            )
        )
    }

    onSaveFiles() {
        //
    }

    onDeleteFile(id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este arquivo do processo?', 'info', 'Sim', 'Cancelar', { callback: () => this.deleteFile(id) })
    }

    deleteFile(client_id) {
        let data: any = {
            process_id: this.process_id,
            client_id: client_id,
            type: 0
        }

        this.processService.deleteFile(data).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Arquivo removido com sucesso', 'success')
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este arquivo!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }
}
