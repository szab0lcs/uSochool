import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PublicData, UserRole } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  userForm = new FormGroup({});
  userType$ = new BehaviorSubject<'teacher' | 'student'>('student');
  userTypeSub: Subscription | undefined;
  
  constructor(
    public navS: NavigationService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { 
  }
  
  ngOnInit() {
    this.userForm = new FormGroup({
      firstName: new FormControl('',[Validators.required, Validators.pattern("^[A-Z].*$")]),
      lastName: new FormControl('',[Validators.required, Validators.pattern("^[A-Z].*$")]),
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
        this.userForm.addControl('parentInitial', new FormControl(
          '',
          [Validators.required,
          Validators.maxLength(1),
          Validators.pattern("^[A-Z]")])
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

  get parentInitial() {
    return this.userForm.get('parentInitial');
  }

  get email() {
    return this.userForm.get('email');
  }

  get promotionYear() {
    return this.userForm.get('promotionYear');
  }
  
  onFormSubmit() {
    if (this.userForm.valid && this.firstName && this.lastName && this.email) {
      let publicData: PublicData = {
        userId: '',
        firstName: this.firstName.value as string,
        lastName: this.lastName.value as string,
        email: this.email.value as string,
        active: true,
        teacher: this.userType$.value === 'teacher'
      }
      let userRoles: UserRole[] = [];

      if(this.userType$.value === 'student' && this.promotionYear && this.parentInitial) {
        publicData.promotionYear = this.promotionYear.value;
        publicData.parentInitial = this.parentInitial.value;
        publicData.classId = ''
        userRoles.push({roleId: 'student', roleName: 'Student'});
      } else {
        userRoles.push({roleId: 'teacher', roleName: 'Teacher'});
      }

      this.authService.registerUser(this.email.value,publicData,userRoles).then(() => {
        this.toastr.success('User successfully created',`Registration`,{
          positionClass: 'toast-bottom-center',
        });
        this.userForm.reset();
      })
      .catch( error => {
        this.toastr.error(error,`Registration`,{
          positionClass: 'toast-bottom-center',
        });
      })
    }
  }

  ngOnDestroy(): void {
    if(this.userTypeSub) this.userTypeSub.unsubscribe();
  }
}
