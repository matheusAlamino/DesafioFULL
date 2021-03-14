import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { PageSizeEnum } from '../../enums/page-size.enum';
import { StatusProcessEnum } from '../../enums/status-process.enum';
import { Process } from '../../models/process.model';
import { ProcessService } from '../../services/process.service';

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

    process: Process[] = []
    processPag: any

    constructor(
        private app: AppComponent,
        private processService: ProcessService,
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
            this.statusLeg = status == 1 ? 'Ativos' : 'Bloqueados'
            this.status = status
        }
        this.loadProcess()
    }

    pageChanged(data) {
        this.currentPage = data.currentPage
        this.pageSize = data.pageSize
        this.loadProcess()
    }
}
