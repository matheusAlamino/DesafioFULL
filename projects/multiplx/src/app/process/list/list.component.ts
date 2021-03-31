import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { PageSizeEnum } from '../../enums/page-size.enum';
import { Process } from '../../models/process.model';
import { StatusType } from '../../models/status-type.model';
import { ProcessService } from '../../services/process.service';
import { StatusService } from '../../services/status.service';
import { Swal } from '../../utils';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

    term: string = ''
    status: any
    statusLeg: any
    error: boolean = false
    currentPage: number = 1
    pageSize: number = PageSizeEnum.default

    statusType: StatusType[] = []

    process: Process[] = []
    processPag: any

    constructor(
        private app: AppComponent,
        private processService: ProcessService,
        private statusService: StatusService,
        private swal: Swal
    ) { }

    ngOnInit(): void {
        if (this.app.storage) {
            this.loadProcess()
        } else {
            this.app.getAuthGuard().login.subscribe((resp) => {
                if (resp) {
                    this.loadProcess()
                }
            })
        }

        this.statusType = this.statusService.statusType
    }

    loadProcess() {
        this.app.toggleLoading(true)
        this.processService.list(this.term, this.status, this.currentPage, this.pageSize).subscribe(data => {
            this.app.toggleLoading(false)
            this.process = data.data
            this.processPag = data
        })
    }

    onChangeStatus(status = null) {
        this.status = null
        this.statusLeg = null
        if (status != null) {
            this.statusLeg = this.statusType.filter(item => item.id == status)[0].name
            this.status = status
        }
        this.loadProcess()
    }

    pageChanged(data) {
        this.currentPage = data.currentPage
        this.pageSize = data.pageSize
        this.loadProcess()
    }

    getClassByStatus(status_id) {
        return this.statusType.filter(item => item.id == status_id)[0].class
    }

    onDeleteProcess(id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este processo e seus dependentes? Ao selecionar esta opção não será possível recuperar o processo!', 'info', 'Sim', 'Cancelar', { callback: () => this.deleteProcess(id) })
    }

    deleteProcess(id) {
        this.processService.deleteProcess(id).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Processo removido com sucesso', 'success')
                this.loadProcess()
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este processo!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('processos')
            }
        })
    }
}
