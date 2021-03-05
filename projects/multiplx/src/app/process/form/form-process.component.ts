import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Process } from '../../models/process.model';

@Component({
  selector: 'app-form-process',
  templateUrl: './form-process.component.html'
})
export class FormProcessComponent implements OnInit {

    clients: any[] = []
    process: Process = {
        id: null,
        client_id: null,
        user_id: null,
        year: null,
        month: null,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        payment_year: null,
        value_rough: null,
        value_author: null,
        outgoing_operationals: null,
        outgoing_judicials: null,
        total_value: null,
        date_receive: null,
        percentual_gain: null,
        status: null
    }
    error: boolean = false

    constructor(private datePipe: DatePipe) { }

    ngOnInit(): void {
        //
    }

    onChangeSelect(id) {
        this.process.client_id = id
    }

    onChangeStatusSelect(id) {
        this.process.status = id
    }

    saveProcess() {
        console.log(this.process)
    }
}
