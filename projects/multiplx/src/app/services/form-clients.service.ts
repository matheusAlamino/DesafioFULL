import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FormClientsService {

    api: any = environment.api

    constructor() { }

    runAssignorForm(token, client_id, process_id){
        window.open(`${this.api.mpx}generate-assignor-form?token=${token}&client_id=${client_id}&process_id=${process_id}`, '_blank');
    }

    runAssigneeForm(token, client_id, process_id){
        window.open(`${this.api.mpx}generate-assignee-form?token=${token}&client_id=${client_id}&process_id=${process_id}`, '_blank');
    }
}
