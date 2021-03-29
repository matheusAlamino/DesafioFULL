import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Process, Client, User, PivotStatus } from '../../models/process.model';
import {of as observableOf, concat as observableConcat,  Observable, Subject } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ClientService } from '../../services/client.service';
import { ProcessService } from '../../services/process.service';
import { AppComponent } from '../../app.component';
import { Swal } from '../../utils';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StatusProcessEnum } from '../../enums/status-process.enum';
import { StatusService } from '../../services/status.service';
import { FileProcess } from '../../models/file-process.model';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from 'projects/multiplx/src/environments/environment';
import { ConvertNumerics } from '../../utils/convertNumerics';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html'
})
export class FormProcessComponent implements OnInit {
    api: any = environment.api

    @ViewChild('form') formulario: any

    clients: any[] = []
    filesProcess: FileProcess[] = []
    countFiles: number = 0
    assignors: Client[] = []
    percentAvailable: number = 0
    totalValue: number = 0
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
        status: null,
        active: 1,
        assignors: [],
        assignee_id: []
    }
    error: boolean = false

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
    statusReopen = StatusProcessEnum.reopened

    layoutSize: any = {
        container: "container",
        col: "col-md-12"
    }
    isDone: boolean = false

    @ViewChild('dzoneUpload') $dzoneUpload: UploadFileComponent
    @ViewChild('closeModalFile') $closeModalFile: ElementRef

    paramsClient: any
    config: DropzoneConfigInterface = {
        clickable: true,
        url: `${this.api.mpx}uploads/process`,
        createImageThumbnails: false,
        maxFilesize: 300,
        acceptedFiles: '.zip,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png'
    }

    constructor(
        private datePipe: DatePipe,
        private clientService: ClientService,
        private processService: ProcessService,
        private userService: UserService,
        private app: AppComponent,
        private swal: Swal,
        private router: Router,
        private route: ActivatedRoute,
        private statusService: StatusService,
        private convertNumeric: ConvertNumerics
    ) { }

    ngOnInit(): void {
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
                this.layoutSize = {
                    container: "container-fluid",
                    col: "col-md-8"
                }
                this.loadProcess()
            } else {
                this.app.loading = false
                this.loadAssignees()
                this.loadResponsable()
            }
        })
    }

    loadProcess() {
        this.processService.show(this.process_id).subscribe(response => {
            this.process = response.data

            if (this.process.assignors) {
                this.adjustAssignors()
            }

            if (this.process.assignees) {
                this.adjustAssignees(this.process.assignees)
            }

            if (this.process.responsable) {
                this.loadResponsable([this.process.responsable])
            }

            if (this.process.status) {
                this.checkIsDone(this.process.status)
            }

            if (this.process.process_files.length > 0) {
                this.filesProcess = this.process.process_files
                this.countFiles = this.filesProcess.length
            }
        })
    }

    loadProcessFiles() {
        let data = {
            'process_id': this.process.id
        }
        this.processService.getFilesProcess(data).subscribe(response => {
            this.process.process_files = response.files
            this.filesProcess = response.files
            this.countFiles = this.filesProcess.length
        }, error => {
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }

    checkIsDone(status) {
        status.forEach((element, index) => {
            if (element.id == this.statusDone) {
                this.isDone = true
            } else {
                this.isDone = false
            }
        });
    }

    adjustAssignors() {
        this.totalValue = this.process.total_value != null ? this.convertNumeric.convertToAmericanValue(this.process.total_value.toString()) : null

        this.process.assignors.forEach((element) => {
            element.process_client.value = this.totalValue != null ? (this.totalValue * element.process_client.percentual) / 100 : 0

            let value: number = +element.process_client.percentual
            this.percentAvailable += value
        })
        this.assignors = this.process.assignors
        this.percentAvailable = 100 - this.percentAvailable
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

    closeProcess(event) {
        if (event.closeProcess == true) {
            this.process.active = 0
            this.saveProcess()
        } else if (event.deleteStatus) {
            //When deletes a specific status
            this.process.status = this.process.status.filter(element => element.pivot.id != event.id)
        }
    }

    reopenProcess() {
        this.process.active = 1

        this.saveProcess(true)
    }

    saveProcess(reopen: boolean = false) {
        if (!reopen) {
            if (!this.formulario.valid || (this.process.assignors.length == 0 && this.process.assignee_id?.length == 0 && this.process_id)) {
                this.error = true
                return false
            }
        }

        if (this.process.id) {
            this.app.toggleLoading(true)
            this.processService.edit(this.process_id, this.process).subscribe(response => {
                this.app.toggleLoading(false)
                if (response.ret == 1) {
                    if (reopen) {
                        this.addStatusReopen()
                    }
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
                    this.swal.msgAlert('Sucesso', 'Para concluir o cadastro do processo insira agora cedentes ou cessionários ao processo!', 'success', 'Ok')
                    this.router.navigate([`/processos/editar/${response.id}`])
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

    addStatusReopen() {
        let data: PivotStatus = {
            id: null,
            process_id: this.process.id,
            status_id: this.statusReopen,
            description: 'Processo reaberto',
            created_at: null,
            updated_at: null
        }

        this.statusService.save(data).subscribe()
    }

    setParamsClientUpload(process_id) {
        this.paramsClient = process_id
        this.$dzoneUpload.params.emit({
            process_id: process_id
        })
    }

    onSaveFiles() {
        if (this.$dzoneUpload.files.length > 0) {
            let data = {
                files: this.$dzoneUpload.files,
                process_id: this.paramsClient
            }
            this.processService.saveFiles(data).subscribe(resp => {
                if (resp.ret) {
                    //this.$dzoneUpload.resetDropzone()
                    this.$closeModalFile.nativeElement.click()
                    this.loadProcessFiles()
                    this.swal.msgAlert('Sucesso', 'Arquivo salvo com sucesso!', 'success')
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

    onDeleteFile(assignor_id) {
        //
    }
}
