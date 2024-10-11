import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetDateRangeParams, IGetCountBackParams, IBarsResponse } from '@interfaces/api.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBarsService extends ApiBaseService{
    private _barsBaseUrl = 'api/bars/v1/bars';

    public getCountBack(params?: IGetCountBackParams): Observable<IBarsResponse> {
        return this.getData(`${this._barsBaseUrl}/count-back`, params);
    }

    public getDateRange(params?: IGetDateRangeParams): Observable<IBarsResponse> {
        return this.getData(`${this._barsBaseUrl}/date-range`, params);
    }
}
