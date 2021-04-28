import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FormClientsService {

    api: any = environment.api

    constructor() { }

    runAssignorForm(token){
        window.open(`${this.api.mpx}generate-assignor-form?token=${token}`, '_blank');
    }
}
