import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ProcessService } from '../services/process.service';
import { Swal } from '../utils';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    storage: any
    process: any
    processDetails: any
    client: { name: string, first_name: string, email: string } = { name: 'Cliente', first_name: '', email: '' }

    constructor(
        private app: AppComponent,
        private swal: Swal,
        private processService: ProcessService
    ) { }

    ngOnInit(): void {
        if (this.app.storage) {
            this.listProcess()
        } else {
            this.app.getAuthGuard().login.subscribe((resp) => {
                if (resp) {
                    this.listProcess()
                }
            })
        }
    }

    listProcess() {
        this.processService.listProcess(14).subscribe(response => {
            if (response.ret == 1) {
                this.process = response.data
                console.log(this.process)
                if (this.process.length > 0) {
                    this.showProcess(this.process[0].id)
                }
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            console.log(error)
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar seus dados!', 'warning', 'Ok')
            if (error.status == 401) {
                this.app.logout()
            }
        })
    }

    showProcess(process_id) {
        this.processService.showProcess(process_id).subscribe(response => {
            if (response.ret == 1) {
                this.processDetails = response.data
            } else {
                this.swal.msgAlert('Atenção', response.msg, 'warning', 'Ok')
            }
        }, error => {
            console.log(error)
            this.swal.msgAlert('Atenção', 'Ocorreu um problema ao tentar atualizar seus dados!', 'warning', 'Ok')
            if (error.status == 401) {
                this.app.logout()
            }
        })
    }
}
