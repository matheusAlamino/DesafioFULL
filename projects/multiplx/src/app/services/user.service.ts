import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    api: any = environment.api;

    constructor(private http: HttpClient) { }

    getAllUsers(termo: string = '', status: any, page, pageSize): Observable<any> {
        let data: any = {}

        if (termo) {
            data.termo = termo
        }

        if (status != null) {
            data.status = status
        }

        let params = '?page=' + page
        data.pageSize = pageSize

        return this.http.get<any>(`${this.api.mpx}users${params}`, { params: data }).pipe(map((response) => response));
    }

    save(data): Observable<any> {
        return this.http.post<any>(`${this.api.mpx}users`, data).pipe(map((response) => response));
    }

    update(user_id, data): Observable<any> {
        return this.http.put<any>(`${this.api.mpx}users/${user_id}`, data).pipe(map((response) => response));
    }

    delete(user_id): Observable<any> {
        return this.http.delete(`${this.api.mpx}users/${user_id}`).pipe(map(response => response));
    }

    show(user_id): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}users/${user_id}`).pipe(map(
            (response) => response));
    }

    updatePassword(user_id, data): Observable<any> {
        return this.http.put<any>(`${this.api.mpx}users/${user_id}/password`, data).pipe(map((response) => response));
    }

    resendConfirmationMail(user_id): Observable<any> {
        return this.http.get<any>(`${this.api.mpx}users/${user_id}/resend-confirmation-mail`).pipe(map(
            (response) => response));
    }
}
