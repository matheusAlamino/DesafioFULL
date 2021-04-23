import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BankService {
    api: any = environment.api

    constructor(private http: HttpClient) { }

    list(): Observable<any> {
        return this.http.get(`${this.api.mpx}banks`).pipe(map(response => response));
    }
}
