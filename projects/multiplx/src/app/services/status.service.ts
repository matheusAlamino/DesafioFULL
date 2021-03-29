import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StatusClassEnum, StatusNameEnum, StatusProcessEnum } from '../enums/status-process.enum';
import { StatusType } from '../models/status-type.model';

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    api: any = environment.api

    public statusType: StatusType[] = [
        {
            id: StatusProcessEnum.analysis,
            name: StatusNameEnum.analysis,
            class: StatusClassEnum.analysis
        },
        {
            id: StatusProcessEnum.executing,
            name: StatusNameEnum.executing,
            class: StatusClassEnum.executing
        },
        {
            id: StatusProcessEnum.done,
            name: StatusNameEnum.done,
            class: StatusClassEnum.done
        },
        {
            id: StatusProcessEnum.reopened,
            name: StatusNameEnum.reopened,
            class: StatusClassEnum.reopened
        }
    ]

    constructor(private http: HttpClient) { }

    getStatusOptions(): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}status`).pipe(map((response) => response));
    }

    save(data): Observable<any> {
        return this.http.post(`${this.api.mpx}status`, data).pipe(map(response => response));
    }

    edit(id, data): Observable<any> {
        return this.http.put(`${this.api.mpx}status/${id}`, data).pipe(map(response => response));
    }

    delete(id): Observable<any> {
        return this.http.delete(`${this.api.mpx}status/${id}`).pipe(map(response => response));
    }
}
