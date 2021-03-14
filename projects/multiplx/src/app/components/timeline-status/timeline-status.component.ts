import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StatusProcessEnum } from '../../enums/status-process.enum';
import { PivotStatus, Status } from '../../models/process.model';
import { StatusService } from '../../services/status.service';
import { Swal } from '../../utils';

@Component({
  selector: 'timeline-status',
  templateUrl: './timeline-status.component.html',
})
export class TimelineStatusComponent implements OnInit {

    @Input() allStatus: Status[]
    @Input() idProcess: number = null
    @ViewChild('closeModal') $closeModal: ElementRef

    statusAnalysis = StatusProcessEnum.analysis
    statusExecuting = StatusProcessEnum.executing
    statusDone = StatusProcessEnum.done

    isDone: boolean = false

    status: PivotStatus = {
        id: null,
        process_id: this.idProcess,
        status_id: null,
        description: null
    }

    isEdit: boolean = false

    statusOptions: Status[] = []
    error: boolean = false

    constructor(
        private swal: Swal,
        private statusService: StatusService
    ) { }

    ngOnInit(): void {
        this.loadStatusOptions()
    }

    loadStatusOptions() {
        this.statusService.getStatusOptions().subscribe(response => {
            this.statusOptions = response
        })
    }

    checkIsDone() {
        this.allStatus.forEach(element => {
            if (element.id == this.statusDone) {
                this.isDone = true
            }
        });
    }

    openModal(status_id = null, desc = null, id = null) {
        if (id == null) {
            this.clearObject()
            this.isEdit = false
        } else {
            this.isEdit = true
            this.status = {
                id: id,
                process_id: this.idProcess,
                status_id: status_id,
                description: desc
            }
        }
    }

    clearObject() {
        this.status = {
            id: null,
            process_id: this.idProcess,
            status_id: null,
            description: null
        }
    }

    onSave() {
        if (this.idProcess == null) {
            this.swal.msgAlert('Atenção', 'É necessário salvar o processo para poder inserir um status!', 'warning', 'Ok')
            return false
        }

        if (this.status.status_id == null) {
            this.error = true
            return false
        }

        if (!this.isEdit) {
            this.statusService.save(this.status).subscribe(response => {
                if (response.ret == 1) {
                    this.allStatus.push({
                        id: this.status.status_id,
                        name: this.statusOptions.filter(item => item.id == this.status.status_id)[0].name,
                        pivot: {
                            id: response.id,
                            process_id: this.status.process_id,
                            status_id: this.status.status_id,
                            description: this.status.description
                        }
                    })
                    this.$closeModal.nativeElement.click()
                    this.clearObject()
                }
            })
        } else {
            this.statusService.edit(this.status.id, this.status).subscribe(response => {
                if (response.ret == 1) {
                    let index = this.allStatus.findIndex(item => item.pivot.id == this.status.id)
                    this.allStatus[index] = {
                        id: this.status.status_id,
                        name: this.statusOptions.filter(item => item.id == this.status.status_id)[0].name,
                        pivot: {
                            id: response.id,
                            process_id: this.status.process_id,
                            status_id: this.status.status_id,
                            description: this.status.description
                        }
                    }
                    this.$closeModal.nativeElement.click()
                    this.clearObject()
                }
            })
        }
    }
}
