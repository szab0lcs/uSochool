import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

    // roles: UserRole[] = [
    //   { roleId: 'admin', roleName: 'Admin' }, 
    //   { roleId: 'teacher', roleName: 'Teacher' }, 
    //   { roleId: 'master', roleName: 'Class Master' }, 
    //   { roleId: 'math_teacher', roleName: 'Math Teacher' }, 
    //   { roleId: 'geography_teacher', roleName: 'Geography Teacher' }, 
    //   { roleId: 'history_teacher', roleName: 'History Teacher' }, 
    //   { roleId: 'english_teacher', roleName: 'English Teacher' }];
      thisYear = new Date().getFullYear();
      userForm = new FormGroup({});
      userType$ = new BehaviorSubject<'teacher' | 'student'>('student');
      userTypeSub: Subscription | undefined;
      
      constructor(
        public navS: NavigationService,
        private fb: FormBuilder,
        private authService: AuthService,
      ) { 
      }
      
      ngOnInit() {
        this.userForm = new FormGroup({
          firstName: new FormControl('',Validators.required),
          lastName: new FormControl('',Validators.required),
          email: new FormControl('',[Validators.required, Validators.email]),
        })

        this.userTypeSub = this.userType$.subscribe( userType => {
          if(userType === 'student') {
            const thisYear = new Date().getFullYear();
            this.userForm.addControl('promotionYear', new FormControl(
              '',
              [Validators.required,
              Validators.min(thisYear-5),
              Validators.max(thisYear+15),
              Validators.pattern("^[0-9]*$")])
            )
          } else {
            this.userForm.removeControl('promotionYear');
          }
        })
      }

      switchUserType(){
        if (this.userType$.value === 'student') this.userType$.next('teacher');
        else this.userType$.next('student');
      }

      get firstName() {
        return this.userForm.get('firstName');
      }

      get lastName() {
        return this.userForm.get('lastName');
      }

      get email() {
        return this.userForm.get('email');
      }

      get promotionYear() {
        return this.userForm.get('promotionYear');
      }
      
      onFormSubmit() {
        if(this.firstName && this.firstName.valid) console.log(this.firstName.value);
        if(this.lastName && this.lastName.valid) console.log(this.lastName.value);
        if(this.email && this.email.valid) console.log(this.email.value);
        if(this.promotionYear && this.promotionYear.valid) console.log(this.promotionYear.value);
      }

      ngOnDestroy(): void {
        if(this.userTypeSub) this.userTypeSub.unsubscribe();
      }

  
  // onSubmit() {
  //   console.log(`onSubmit`,this.profileForm.value);
  //   if(this.isStudent) {
  //     const userRoles: UserRole[] = [{roleId: 'student', roleName: 'Student'}];
  //     const userObject: PublicData = {
  //       name: this.profileForm.value.name,
  //       email: this.profileForm.value.email,
  //       promotionYear: this.profileForm.value.promotionYear,
  //       active: true,
  //     }
      
  //     this.userService.addNewUser(this.profileForm.value.email,this.profileForm.value.password,userObject,userRoles)
  //   } else {
  //     const userRoles: UserRole[] = this.profileForm.value.role;
  //     const userObject: PublicData = {
  //       name: this.profileForm.value.name,
  //       email: this.profileForm.value.email,
  //       active: true,
  //     }
  //     this.userService.addNewUser(this.profileForm.value.email,this.profileForm.value.password,userObject,userRoles);
  //   }
  //   this.resetForm();
  // }
  
  // Choose role using select dropdown
  // changeRole(e: any) { 
  //   this.role.setValue(e.target.value, {
  //     onlySelf: true
  //   })
  //   console.log(`role`,this.role.value);
  // }
  // get name() {
  //   return this.profileForm.get('name')
  // }
  // get email() {
  //   return this.profileForm.get('email')
  // }
  // get password() {
  //   return this.profileForm.get('password')
  // }
  // get passwordConfirmation(){
  //   return this.profileForm.get('password')
  // }
  // get role() {
  //   return this.profileForm.get('role')
  // }
  // get promotionYear() {
  //   return this.profileForm.get('promotionYear')
  // }
  // resetForm() {
  //   this.profileForm.reset();
  // }

  
  // dismiss() {
  //   this.modalController.dismiss({
  //       'dismissed': true
  //   });
  // }

  // passwordMatchValidator(g: FormGroup) {
  //   return g.get('password').value === g.get('passwordConfirmation').value
  //     ? null : {'mismatch': true};
  // }



}
