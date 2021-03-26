import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProcessService {
    api: any = environment.api

    constructor(private http: HttpClient) { }

    // BEGIN PROCESS
    monthlyAmount(): Observable<any> {
        return this.http.get(`${this.api.mpx}process/reports/monthly-amount`).pipe(map(response => response));
    }

    list(term: string = '', status: any, page, pageSize): Observable<any> {
        let data: any = {}

        if (term) {
            data.term = term
        }

        if (status != null) {
            data.status = status
        }

        let params = '?page=' + page
        data.pageSize = pageSize

        return this.http.get<any>(`${this.api.mpx}process${params}`, { params: data }).pipe(map((response) => response));
    }

    show(id): Observable<any> {
        return this.http.get(`${this.api.mpx}process/${id}`).pipe(map(response => response));
    }

    save(data): Observable<any> {
        return this.http.post(`${this.api.mpx}process`, data).pipe(map(response => response));
    }

    edit(id, data): Observable<any> {
        return this.http.put(`${this.api.mpx}process/${id}`, data).pipe(map(response => response));
    }
    // END PROCESS

    getStatusOptions(): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}status`).pipe(map((response) => response));
    }

    // BEGIN PROCESS_FILES
    saveFiles(data): Observable<any> {
        return this.http.post(`${this.api.mpx}process-files`, data).pipe(map(response => response));
    }

    deleteFile(id): Observable<any> {
        return this.http.delete(`${this.api.mpx}process-files/${id}`).pipe(map(response => response));
    }

    getFilesProcess(data): Observable<any> {
        return this.http.get(`${this.api.mpx}process-files`, { params: data }).pipe(map(response => response));
    }
    // END PROCESS_FILES

    // BEGIN PROCESS_CLIENTS
    deleteClientProcess(data): Observable<any> {
        return this.http.post(`${this.api.mpx}process-clients/delete`, data).pipe(map(response => response));
    }
    // END PROCESS_CLIENTS
}
