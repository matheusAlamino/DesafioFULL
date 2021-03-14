import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    api: any = environment.api

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
}
