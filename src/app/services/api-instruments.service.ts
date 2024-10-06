import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetInstrumentsParams, IGetExchangesParams, IInstrumentsResponse, IProvidersResponse } from '../interfaces/api.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiInstrumentsService {
  private _instrumentsBaseUrl = 'api/instruments/v1';

  constructor(private _baseApiService: ApiBaseService) {}

  public getExchanges(params?: IGetExchangesParams): Observable<any> {
    return this._baseApiService.getData(`${this._instrumentsBaseUrl}/exchanges`, params);
  }

  public getInstruments(params?: IGetInstrumentsParams): Observable<IInstrumentsResponse> {
    return this._baseApiService.getData(`${this._instrumentsBaseUrl}/instruments`, params);
  }

  public getProviders(): Observable<IProvidersResponse> {
    return this._baseApiService.getData(`${this._instrumentsBaseUrl}/providers`);
  }
}
