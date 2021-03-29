import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { Injectable } from '@angular/core'
import { catchError } from 'rxjs/operators'
import { AuthGuard } from './auth.guard'
import { Router } from '@angular/router'
import { LocalStorageService } from './storage.service'

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private authGuard: AuthGuard, private storageService: LocalStorageService, private _router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let storage = this.storageService.getStorage('client')
        if (!storage.token) {
            this.authGuard.clearStorage('login')
        }

        const headers = req.headers.set('Content-Type', 'application/json')
        const authReq = req.clone({
            headers: headers.append('Authorization', `Bearer ${storage.token}`)
        })

        return next.handle(authReq).pipe(
            catchError((httpErrorResponse: HttpErrorResponse) => {
                const status = httpErrorResponse.status

                if (status == 401) {
                    this.authGuard.clearStorage('login')
                }

                return throwError(httpErrorResponse)
            })
        )
    }
}
