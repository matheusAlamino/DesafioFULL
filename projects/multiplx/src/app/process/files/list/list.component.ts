import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FileProcess } from '../../../models/file-process.model';
import { ClientService } from '../../../services/client.service';
import { ProcessService } from '../../../services/process.service';
import { Swal } from '../../../utils';

@Component({
  selector: 'app-process-file-list',
  templateUrl: './list.component.html'
})
export class ProcessFileListComponent implements OnInit {

    @Input() filesProcess: FileProcess[] = []

    constructor(
        private app: AppComponent,
        private processService: ProcessService,
        private swal: Swal,
    ) { }

    ngOnInit(): void {
    }

    onDeleteFile(id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este arquivo do processo?', 'info', 'Sim', 'Cancelar', { callback: () => this.deleteFile(id) })
    }

    deleteFile(id) {
        this.processService.deleteFile(id).subscribe(response => {
            if (response.ret == 1) {
                this.swal.msgAlert('Sucesso', 'Arquivo removido com sucesso', 'success')
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar remover este arquivo!', 'error', 'Ok')
            if (error.status == 401) {
                this.app.logout('clientes')
            }
        })
    }
}
