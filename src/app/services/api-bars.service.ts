import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetDateRangeParams, IGetCountBackParams, IBarsResponse } from '../interfaces/api.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBarsService {
    private _barsBaseUrl = 'api/bars/v1/bars';

    constructor(private _baseApiService: ApiBaseService) {}

    public getCountBack(params?: IGetCountBackParams): Observable<IBarsResponse> {
        return this._baseApiService.getData(`${this._barsBaseUrl}/count-back`, params);
    }

    public getDateRange(params?: IGetDateRangeParams): Observable<IBarsResponse> {
        return this._baseApiService.getData(`${this._barsBaseUrl}/date-range`, params);
    }
}
