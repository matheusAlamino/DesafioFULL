import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    api: any = environment.api;

    constructor(private http: HttpClient) { }

    login(data) : Observable<any> {
        const headers = new HttpHeaders();
        headers.set('Access-Control-Allow-Origin', '*')
        return this.http.post<any>(`${this.api.mpx}login`, data, { headers }).pipe(map((response) => response));
    }
}
