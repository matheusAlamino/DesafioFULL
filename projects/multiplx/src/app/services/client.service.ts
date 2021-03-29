import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    api: any = environment.api

    constructor(private http: HttpClient) { }

    list(page, pageSize, filter: string = null, status: number = null): Observable<any> {
        let params = 'page=' + page + '&pageSize=' + pageSize
        if (filter != null) {
            params += '&filter=' + filter
        }
        if (status != null) {
            params += '&status=' + status
        }

        return this.http.get(`${this.api.mpx}clients?${params}`).pipe(map(response => response));
    }

    show(client_id): Observable<any> {
        return this.http.get(`${this.api.mpx}clients/${client_id}`).pipe(map(response => response));
    }

    updateStatus(client_id, status): Observable<any> {
        return this.http.put(`${this.api.mpx}clients/${client_id}/update-status`, { 'status': status }).pipe(map(response => response));
    }

    save(data): Observable<any> {
        return this.http.post(`${this.api.mpx}clients`, data).pipe(map(response => response));
    }

    update(client_id, data): Observable<any> {
        return this.http.put(`${this.api.mpx}clients/${client_id}`, data).pipe(map(response => response));
    }

    delete(client_id): Observable<any> {
        return this.http.delete(`${this.api.mpx}clients/${client_id}`).pipe(map(response => response));
    }

    count(): Observable<any> {
        return this.http.get(`${this.api.mpx}clients/reports/count`).pipe(map(response => response));
    }

    saveFiles(data): Observable<any> {
        return this.http.post(`${this.api.mpx}clients-files`, data).pipe(map(response => response));
    }

    getFilesClient(data): Observable<any> {
        return this.http.get(`${this.api.mpx}clients-files`, { params: data }).pipe(map(response => response));
    }

    deleteFile(id): Observable<any> {
        return this.http.delete(`${this.api.mpx}clients-files/${id}`).pipe(map(response => response));
    }

    countFiles(client_id): Observable<any> {
        return this.http.get(`${this.api.mpx}clients/reports/${client_id}/files/count`).pipe(map(response => response));
    }

    countProcess(client_id): Observable<any> {
        return this.http.get(`${this.api.mpx}clients/reports/${client_id}/process/count`).pipe(map(response => response));
    }

    listProcess(client_id): Observable<any> {
        return this.http.get(`${this.api.mpx}clients/${client_id}/list-process`).pipe(map(response => response));
    }

    getClients(term: string, idsExcluded: number[] = []): Observable<any> {
        let data: any = {
            term: term
        }

        if (idsExcluded.length > 0) {
            data.idsExcluded = JSON.stringify(idsExcluded)
        }

        return this.http.get(`${this.api.mpx}clients-select`, { params: data }).pipe(map(response => response));
    }
}
