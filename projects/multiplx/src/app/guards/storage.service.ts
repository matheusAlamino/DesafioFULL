import { Inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service'

import { environment } from '../../environments/environment'

@Injectable()
export class LocalStorageService {
    api: any = environment.api

    constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

    async setStorage(key: string, val: any) {
        return await this.storage.set(key, val)
    }

    getStorage(key: string) {
        return this.storage.get(key)
    }

    removeStorage(key: string): void {
        return this.storage.remove(key)
    }

    async getRefreshToken(token: any): Promise<any> {
        return await this.http.post(`${this.api.mpx}refresh-token`, {}, { }).toPromise()
    }

    async getDataStorage(token: any) {
        return await this.http.get(`${this.api.mpx}get-storage`, {  }).toPromise()
    }
}
