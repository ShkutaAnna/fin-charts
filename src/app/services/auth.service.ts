import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authUrl = '/apiurl/identity/realms/fintatech/protocol/openid-connect/token';

  private _token: string = '';
  private _refreshToken: string = '';
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {}

  public login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this._http.post(this._authUrl, body.toString(), { headers }).pipe(
      tap((response: any) => {
          this._token = response.access_token;
          this._refreshToken = response.refresh_token;
          this._isAuthenticatedSubject.next(true);
          localStorage.setItem('token', this._token);
          localStorage.setItem('refreshToken', this._refreshToken);
      }),
      catchError((error) => {
          this._isAuthenticatedSubject.next(false);
          throw error;
      })
    );
  }

  public logout(): void {
    this._token = '';
    this._refreshToken = '';
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._isAuthenticatedSubject.next(false);
  }

  public isAuthenticated(): Observable<boolean> {
    return this._isAuthenticatedSubject.asObservable();
  }

  public getToken(): string | null {
    return this._token || localStorage.getItem('token');
  }
}
