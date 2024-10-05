import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _dialog: MatDialog,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.getToken();

    let authReq = req;
    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.openLoginModal().pipe(
      switchMap(() => {
        return next.handle(this.addToken(request, this._authService.getToken() ?? ''));
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

    private openLoginModal(): Observable<any> {
      const dialogRef = this._dialog.open(LoginModalComponent, {
        width: '300px',
      });

      return dialogRef.afterClosed();
    }
}
