import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    api: any = environment.api

    constructor(private http: HttpClient) { }

    list(): Observable<any> {

        return this.http.get<any>(`${this.api.challenge}titles`).pipe(map((response) => response));
    }

    show(id): Observable<any> {
        return this.http.get(`${this.api.challenge}titles/${id}`).pipe(map(response => response));
    }

    save(data): Observable<any> {
        return this.http.post(`${this.api.challenge}titles`, data).pipe(map(response => response));
    }

    edit(id, data): Observable<any> {
        return this.http.put(`${this.api.challenge}titles/${id}`, data).pipe(map(response => response));
    }

    deleteTitles(id): Observable<any> {
        return this.http.delete(`${this.api.challenge}titles/${id}`).pipe(map(response => response));
    }
}
