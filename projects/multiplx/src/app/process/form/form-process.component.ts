import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Process, Client, User } from '../../models/process.model';
import {of as observableOf, concat as observableConcat,  Observable, Subject } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ClientService } from '../../services/client.service';
import { ProcessService } from '../../services/process.service';
import { AppComponent } from '../../app.component';
import { Swal } from '../../utils';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StatusProcessEnum } from '../../enums/status-process.enum';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html'
})
export class FormProcessComponent implements OnInit {

    @ViewChild('form') formulario: any

    clients: any[] = []
    process_id: number = null
    process: Process = {
        id: null,
        user_id: null,
        responsable_id: null,
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

    clientsAssignors$: Observable<Client[]>;
    clientLoadingAssignor = false;
    clientinputAssignor$ = new Subject<string>();

    clientsAssignees$: Observable<Client[]>;
    clientLoadingAssignee = false;
    clientinputAssignee$ = new Subject<string>();

    clientsResponsable$: Observable<User[]>;
    clientLoadingResponsable = false;
    clientinputResponsable$ = new Subject<string>();

    titleCard: string = "Novo"

    statusAnalysis = StatusProcessEnum.analysis
    statusExecuting = StatusProcessEnum.executing
    statusDone = StatusProcessEnum.done

    constructor(
        private datePipe: DatePipe,
        private clientService: ClientService,
        private processService: ProcessService,
        private userService: UserService,
        private app: AppComponent,
        private swal: Swal,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        console.log(status)
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
            if (params.id) {
                this.process_id = params.id
                this.app.loading = true
                this.titleCard = "Editar"
                this.loadProcess()
            } else {
                this.app.loading = false
                this.loadAssignors()
                this.loadAssignees()
                this.loadResponsable()
            }
        })
    }

    loadProcess() {
        this.processService.show(this.process_id).subscribe(response => {
            this.process = response.data

            if (this.process.assignors) {
                this.adjustAssignors(this.process.assignors)
                this.adjustAssignees(this.process.assignees)
            }

            if (this.process.responsable) {
                this.loadResponsable([this.process.responsable])
            }
        })
    }

    adjustAssignors(assignors) {
        this.process.assignor_id = []
        this.loadAssignors(assignors)
        assignors.forEach((item) => {
            this.process.assignor_id.push(item.id)
        })
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

    adjustAssignees(assignees) {
        this.process.assignee_id = []
        this.loadAssignees(assignees)
        assignees.forEach((item) => {
            this.process.assignee_id.push(item.id)
        })
    }

    loadAssignees(assignees: any = []) {
        this.clientsAssignees$ = observableConcat(
            observableOf(assignees),
            this.clientinputAssignee$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.clientLoadingAssignee = true)),
                switchMap((term) =>
                    this.clientService
                        .getClients(term)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.clientLoadingAssignee = false))
                        )
                )
            )
        )
    }

    loadResponsable(responsables: any = []) {
        this.clientsResponsable$ = observableConcat(
            observableOf(responsables),
            this.clientinputResponsable$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => (this.clientLoadingResponsable = true)),
                switchMap((term) =>
                    this.userService
                        .getUsers(term)
                        .pipe(
                            catchError(() => observableOf([])), // empty list on error
                            tap(() => (this.clientLoadingResponsable = false))
                        )
                )
            )
        )
    }

    saveProcess() {
        if (!this.formulario.valid || ((this.process.assignor_id?.length == 0) && (this.process.assignee_id?.length == 0))) {
            // if (this.process.id == null && this.process.status == null) {
            //     this.swal.msgAlert('Atenção', 'É necessário inserir pelo menos um status!', 'warning', 'Ok')
            // }

            this.error = true
            return false
        }

        if (this.process.id) {
            this.app.toggleLoading(true)
            this.processService.edit(this.process_id, this.process).subscribe(response => {
                this.app.toggleLoading(false)
                if (response.ret == 1) {
                    this.swal.msgAlert('Sucesso', 'Processo editado com sucesso!', 'success')
                    this.router.navigate([`/processos`])
                } else {
                    this.swal.msgAlert('Atenção', 'Erro ao editar processo!', 'warning', 'Ok')
                }
            }, error => {
                this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar editar o processo!', 'error', 'Ok')
                if (error.status == 401) {
                    this.app.logout('processos')
                }
            })
        } else {
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
    }
}
