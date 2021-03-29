import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
    api: any = environment.api;

    constructor(private http: HttpClient) { }

    listProcess(client_id): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}clients/${client_id}/list-process`).pipe(map(
            (response) => response));
    }

    showProcess(process_id): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}process/${process_id}`).pipe(map(
            (response) => response));
    }
}
