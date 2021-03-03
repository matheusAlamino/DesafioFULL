import { HttpClient } from '@angular/common/http';
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
        return this.http.post<any>(`${this.api.mpx}login`, data).pipe(map((response) => response));
    }

    verifyEmail(hash) : Observable<any> {
        return this.http.get<any>(`${this.api.mpx}user/verify-email/${hash}`).pipe(map((response) => response));
    }
}
