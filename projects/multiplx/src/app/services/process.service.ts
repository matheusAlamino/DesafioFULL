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

    monthlyAmount(): Observable<any> {
        return this.http.get(`${this.api.mpx}process/reports/monthly-amount`).pipe(map(response => response));
    }
}
