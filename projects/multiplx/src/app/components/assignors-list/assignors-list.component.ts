import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {of as observableOf, concat as observableConcat,  Observable, Subject } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AppComponent } from '../../app.component';
import { Client, ProcessClient } from '../../models/process.model';
import { ClientService } from '../../services/client.service';
import { ProcessService } from '../../services/process.service';
import { Swal } from '../../utils';
import { ConvertNumerics } from '../../utils/convertNumerics';

@Component({
  selector: 'app-assignors-list',
  templateUrl: './assignors-list.component.html'
})
export class AssignorsListComponent implements OnInit {

    @Input() assignors: Client[] = []
    @Input() process_id: number = null
    @Input() percentAvailable: number = 0
    @Input() totalValue: number = 0
    @Input() process_active: boolean = false

    @ViewChild('form') formulario: any
    @ViewChild('closeModalFile') $closeModalFile: ElementRef

    assignor: ProcessClient = {
        process_id: null,
        client_id: null,
        percentual: null,
        value: null
    }

    idsExcluded: number[] = []

    clientsAssignors$: Observable<Client[]>;
    clientLoadingAssignor = false;
    clientinputAssignor$ = new Subject<string>();

    error: boolean = false
    percentUnavailable: boolean = false
    isEdit: boolean = false

    constructor(
        private clientService: ClientService,
        private swal: Swal,
        private app: AppComponent,
        private processService: ProcessService,
        private convertNumerics: ConvertNumerics
    ) { }

    ngOnInit(): void {
        this.loadAssignors();
    }

    loadAssignorsList() {
        this.percentAvailable = 0
        this.processService.getAssignorsProcess(this.process_id).subscribe(data => {
            this.assignors = data.assignors.filter(ass => ass.process_client != null)

            this.assignors.forEach((element) => {
                element.process_client.value = this.totalValue != null ? (this.totalValue * element.process_client.percentual) / 100 : 0
                element.process_client.valueString = element.process_client.value.toString().replace(".", ",")

                let value: number = +element.process_client.percentual
                this.percentAvailable += value
            })
            this.percentAvailable = 100 - this.percentAvailable
        })
    }

    openModal(assignorElement = null) {
        if (assignorElement) {
            this.isEdit = true
            this.excludedIds(assignorElement.id)
            this.loadAssignors([assignorElement])
            this.assignor = {
                process_id: this.process_id,
                client_id: assignorElement.id,
                percentual: assignorElement.process_client.percentual.toString().replace(".", ","),
                value: assignorElement.process_client.value,
                valueString: assignorElement.process_client.value.toString().replace(".", ",")
            }
        } else {
            this.excludedIds()
            this.isEdit = false
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

    excludedIds(client_id = null) {
        let items = []
        if (client_id) {
            items = this.assignors.filter(element => element.process_client.client_id != client_id)
        } else {
            items = this.assignors
        }

        items.forEach(element => {
            this.idsExcluded.push(element.id)
        })
    }

    onChangePercentual(percentual) {
        this.percentUnavailable = false
        this.assignor.valueString = this.totalValue != 0 ? ((this.totalValue * percentual) / 100).toString().replace(".", ",") : null
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
                        .getClients(term, this.idsExcluded)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.clientLoadingAssignor = false))
                        )
                )
            )
        )
    }

    onSaveAssignor() {
        if (!this.formulario.valid) {
            this.error = true
            return false
        }

        if (!this.isEdit) {
            let percent = this.convertNumerics.convertToAmericanValue(this.assignor.percentual.toString())

            if (percent > this.percentAvailable) {
                this.error = true
                this.percentUnavailable = true
                return false
            }
        }

        if (this.isEdit) {
            this.editAssignor()
        } else {
            this.createAssignor()
        }
    }

    createAssignor() {
        this.processService.saveClientProcess(this.assignor).subscribe(response => {
            if (response.ret == 1) {
                this.$closeModalFile.nativeElement.click()
                this.swal.msgAlert('Sucesso', 'Cedente inserido com sucesso', 'success')
                this.loadAssignorsList()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar inserir este cedente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }

    editAssignor() {
        this.processService.editClientProcess(this.assignor).subscribe(response => {
            if (response.ret == 1) {
                this.$closeModalFile.nativeElement.click()
                this.swal.msgAlert('Sucesso', 'Cedente atualizado com sucesso', 'success')
                this.loadAssignorsList()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar este cedente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }

    onDeleteAssignor(id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este cedente do processo?', 'info', 'Sim', 'Cancelar', { callback: () => this.deleteAssignor(id) })
    }

    deleteAssignor(client_id) {
        let data: any = {
            process_id: this.process_id,
            client_id: client_id,
            type: 0
        }

        this.processService.deleteClientProcess(data).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Cedente removido com sucesso', 'success')
                this.loadAssignorsList()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este cedente!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }
}
