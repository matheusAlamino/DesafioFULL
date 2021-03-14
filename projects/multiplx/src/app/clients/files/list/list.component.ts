import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ClientService } from '../../../services/client.service';
import { Swal } from '../../../utils';

@Component({
  selector: 'app-client-file-list',
  templateUrl: './list.component.html'
})
export class ClientFileListComponent implements OnInit {

    @Input() filesClient

    constructor(
        private app: AppComponent,
        private clientService: ClientService,
        private swal: Swal,
    ) { }

    ngOnInit(): void {
    }

    onDeleteFile(id) {
        this.swal.confirmAlertCustom('Atenção', 'Deseja realmente remover este arquivo do cliente?', 'info', 'Sim', 'Cancelar', { callback: () => this.deleteFile(id) })
    }

    deleteFile(id) {
        this.clientService.deleteFile(id).subscribe(response => {
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
