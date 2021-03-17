import { Component, Input, OnInit } from '@angular/core';
import { StatusProcessEnum } from '../../enums/status-process.enum';
import { StatusType } from '../../models/status-type.model';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html'
})
export class StatusIconComponent implements OnInit {

    @Input() idStatus: number = 0

    statusType: StatusType = {
        analysis: StatusProcessEnum.analysis,
        executing: StatusProcessEnum.executing,
        done: StatusProcessEnum.done,
        reopen: StatusProcessEnum.reopened
    }

    constructor() { }

    ngOnInit(): void {
    }
}
