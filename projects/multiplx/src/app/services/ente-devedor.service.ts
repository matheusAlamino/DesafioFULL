import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EnteDevedorService {
    api: any = environment.api

    constructor(private http: HttpClient) { }

    save(data): Observable<any> {
        return this.http.post(`${this.api.mpx}ente-devedores`, data).pipe(map(response => response));
    }

    getEntes(term: string): Observable<any> {
        let data: any = {
            term: term
        }

        return this.http.get(`${this.api.mpx}entes-select`, { params: data }).pipe(map(response => response));
    }
}
