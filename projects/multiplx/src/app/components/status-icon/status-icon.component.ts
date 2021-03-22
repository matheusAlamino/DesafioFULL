import { Component, Input, OnInit } from '@angular/core';
import { StatusType } from '../../models/status-type.model';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html'
})
export class StatusIconComponent implements OnInit {

    @Input() idStatus: number = 0

    statusType: StatusType[] = []

    constructor(
        private statusService: StatusService
    ) { }

    ngOnInit(): void {
        this.statusType = this.statusService.statusType
    }

    getClassByStatus() {
        return this.statusType.filter(item => item.id == this.idStatus)[0].class
    }
}
