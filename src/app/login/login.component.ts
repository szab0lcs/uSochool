import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    })
  }

  onSubmit() {
    console.log(`submit`);
  }

  async forgotPassword() {
    const dialog = this.matDialog.open(ForgotPasswordComponent);
    await dialog.afterClosed().pipe(take(1)).toPromise();
    console.log(`closed`);
    
  }

}
