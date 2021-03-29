import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StatusProcessEnum } from '../../enums/status-process.enum';
import { PivotStatus, Status } from '../../models/process.model';
import { StatusService } from '../../services/status.service';

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
        description: null,
        created_at: null,
        updated_at: null
    }

    isEdit: boolean = false

    statusOptions: Status[] = []
    error: boolean = false

    constructor(
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

    clearObject() {
        this.status = {
            id: null,
            process_id: this.idProcess,
            status_id: null,
            description: null,
            created_at: null,
            updated_at: null
        }
    }

    insertObject(response) {
        return {
            id: this.status.status_id,
            name: this.statusOptions.filter(item => item.id == this.status.status_id)[0].name,
            pivot: {
                id: response.data.id,
                process_id: this.status.process_id,
                status_id: this.status.status_id,
                description: this.status.description,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            }
        }
    }
}
