import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { take } from 'rxjs/operators';
import { fadeInAnimation } from '../_animations';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { testUsers } from 'src/_testUsers/testUsers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    // this.registerUsers();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    })
  }

  navigateToHome() {
    this.router.navigateByUrl('home');
  }

  async forgotPassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';

    const dialog = this.matDialog.open(ForgotPasswordComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();    
  }

  async registerUsers() {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    
    // testUsers.teachers.forEach(teacher => {
    //   const email = teacher.email.toLowerCase().replace(/\s/g,'');
    //   currentPromise = this.authService.registerUser(email, {
    //     firstName: teacher.first_name,
    //     lastName: teacher.last_name,
    //     email,
    //     userId: '',
    //     active: true,
    //     teacher: true
    //   }, [
    //     { roleId: 'teacher', roleName: 'Teacher' }
    //   ], {
    //     idNumber: teacher.idNumber,
    //     birthday: teacher.birthday,
    //     address: teacher.address,
    //     phone: teacher.phone
    //   })
    //   promises.push(currentPromise);
    // })
    
    
    // testUsers.staff.forEach( staff => {
    //   const email = staff.publicData.email.toLowerCase().replace(/\s/g,'');
    //   currentPromise = this.authService.registerUser(email, {
    //     firstName: staff.publicData.firstName,
    //     lastName: staff.publicData.lastName,
    //     email,
    //     userId: '',
    //     active: true,
    //     teacher: false
    //   }, [
    //     staff.role
    //   ])
    //   promises.push(currentPromise);
    // })
    

    // testUsers.students.forEach( student => {
    //   const email = student.email.toLowerCase().replace(/\s/g,'');
    //   currentPromise = this.authService.registerUser(email, {
    //     firstName: student.first_name,
    //     lastName: student.last_name,
    //     email,
    //     userId: '',
    //     active: true,
    //     teacher: false,
    //     promotionYear: +student.promotionYear,
    //     parentInitial: student.parentInitial,
    //     classId: ''
    //   }, [
    //     { roleId: 'student', roleName: 'Student' }
    //   ], {
    //     idNumber: student.idNumber,
    //     birthday: student.birthday,
    //     address: student.address,
    //     phone: student.phone
    //   })
    //   promises.push(currentPromise);
    // })
    await Promise.all(promises);

  }

}
