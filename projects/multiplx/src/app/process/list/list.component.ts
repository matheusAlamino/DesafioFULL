import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { PageSizeEnum } from '../../enums/page-size.enum';
import { Process } from '../../models/process.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

    termo: string = ''
    status: any
    statusLeg: any
    error: boolean = false
    currentPage: number = 1
    pageSize: number = PageSizeEnum.default

    process: Process[] = []
    processPag: any

    constructor(
        private app: AppComponent,
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
        //
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
