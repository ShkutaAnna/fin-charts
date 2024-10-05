import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
    private baseUrl = environment.apiUrl;

    constructor(
        private _http: HttpClient,
    ) {}

    public getData(endpoint: string, params?: any): Observable<any> {
        let httpParams = new HttpParams();

        for (const key in params) {
            if (params[key] !== undefined) {
                httpParams = httpParams.append(key, params[key].toString());
            }
        }

        return this._http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams });
    }
}