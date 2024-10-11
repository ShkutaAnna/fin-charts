import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetInstrumentsParams, IGetExchangesParams, IInstrumentsResponse, IProvidersResponse } from '@interfaces/api.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiInstrumentsService extends ApiBaseService {
  private _instrumentsBaseUrl = 'api/instruments/v1';

  public getExchanges(params?: IGetExchangesParams): Observable<any> {
    return this.getData(`${this._instrumentsBaseUrl}/exchanges`, params);
  }

  public getInstruments(params?: IGetInstrumentsParams): Observable<IInstrumentsResponse> {
    return this.getData(`${this._instrumentsBaseUrl}/instruments`, params);
  }

  public getProviders(): Observable<IProvidersResponse> {
    return this.getData(`${this._instrumentsBaseUrl}/providers`);
  }
}
