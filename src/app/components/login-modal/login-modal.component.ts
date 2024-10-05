import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent {
  username: string = '';
  password: string = '';

  constructor(
    private _authService: AuthService,
    private _dialogRef: MatDialogRef<LoginModalComponent>,
  ) {}

  onSubmit() {
    this._authService.login(this.username, this.password).subscribe(
      response => {
        this._dialogRef.close(!!response);
      },
      error => {
        console.log('Login error: ', error);
      },
    );
  }
}
