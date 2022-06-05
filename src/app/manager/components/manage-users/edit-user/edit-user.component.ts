import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/prompt/prompt.component';
import { ISubject } from 'src/app/shared/interfaces/catalogue';
import { AllUserData, PrivateData, PublicData, UserRole } from 'src/app/shared/interfaces/user';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  userForm = new FormGroup({});
  isStudent = false;
  dataLoaded = false;
  userId: string | null = '';
  canSave = false;
  canSave$ = new Subject;
  userData: AllUserData | null = null;
  canTeachSelected: ISubject[] = [];
  subjects$: Observable<ISubject[]> | undefined;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public navS: NavigationService,
    private toastr: ToastrService,
    private promptService: PromptService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.initFormControl(this.userId);
      this.userService.getTeacherWhatCanTeach$(this.userId)
        .pipe(take(1)).toPromise()
        .then( subjects => this.canTeachSelected = subjects);
    }
  }

  async initFormControl(userId: string) {
    this.userData = await this.getUserData(userId);
    if(this.userData && this.userData.publicData && this.userData.privateData && this.userData.roles) {
      const thisYear = new Date().getFullYear();
      const address = this.userData.privateData.address ? this.userData.privateData.address : '';
      const birthday = this.userData.privateData.birthday ? this.userData.privateData.birthday : moment(new Date()).unix();
      const phone = this.userData.privateData.phone ? this.userData.privateData.phone : '';
      const idNumber = this.userData.privateData.idNumber ? this.userData.privateData.idNumber : '';
      this.isStudent = this.userData.roles.findIndex(obj => obj.roleId === 'student') !== -1;
      this.userForm = new FormGroup({
        firstName: new FormControl(this.userData.publicData.firstName,[Validators.required, Validators.pattern("^[A-Z].*$")]),
        lastName: new FormControl(this.userData.publicData.lastName,[Validators.required, Validators.pattern("^[A-Z].*$")]),
        email: new FormControl(this.userData.publicData.email,[Validators.required, Validators.email]),
        address: new FormControl(address,Validators.required),
        birthday: new FormControl(birthday,[Validators.required]),
        phone: new FormControl(phone,Validators.required),
        idNumber: new FormControl(idNumber,[Validators.required, Validators.pattern("^[0-9]*$")]),
      })
      console.log({userData: this.userData});
      
      if(this.isStudent) {
        this.userForm.addControl('promotionYear', new FormControl(
          this.userData.publicData.promotionYear,
          [Validators.required,
          Validators.min(thisYear-5),
          Validators.max(thisYear+15),
          Validators.pattern("^[0-9]*$")])
        )
        this.userForm.addControl('parentInitial', new FormControl(
          this.userData.publicData.parentInitial,
          [Validators.required,
          Validators.maxLength(1),
          Validators.pattern("^[A-Z]")])
        )
      }
    this.dataLoaded = true;
    }
    this.userForm.valueChanges.pipe(takeUntil(this.canSave$)).subscribe((event) => this.checkIfTheSame(event));
  }

  checkIfTheSame(event: any) {
    console.log({event});
    if (this.userData) {
      const allData: any = { ...this.userData.publicData, ...this.userData.privateData};
      for (const key in event) {
        console.log({allData: allData[key],event: event[key]});
        
        if (allData[key] !== event[key]) {
          this.canSave = true;
          this.canSave$.next();
        }
      }
    }
  }

  async getUserData(userId: string) {
     return await this.userService.getAllData$(userId).pipe(take(1)).toPromise();
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
  get address() {
    return this.userForm.get('address');
  }
  get birthday() {
    return this.userForm.get('birthday');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get idNumber() {
    return this.userForm.get('idNumber');
  }

  async onFormSubmit() {
    if (!this.canSave) return;
    const allUserData = this.getAllFormData();
    console.log({allUserData});
    
    if( allUserData && this.userId ) {
      await this.userService.setAllUserData(allUserData);
      this.toastr.success('User data successfully updated!',`Data updated`,{
        positionClass: 'toast-bottom-center',
      });
      this.canSave = false;
      this.initFormControl(this.userId);
    }
  }

  getAllFormData(): AllUserData | undefined {
    if (this.userId && this.userForm.valid && this.firstName && this.lastName && this.email
      && this.address && this.birthday && this.phone && this.idNumber) {
      const publicData: PublicData = {
        userId: this.userId,
        firstName: this.firstName.value as string,
        lastName: this.lastName.value as string,
        email: this.email.value as string,
        active: true,
        teacher: !this.isStudent
      }

      let roles: UserRole[] = [];
      
      if(this.isStudent && this.promotionYear && this.parentInitial) {
        publicData.promotionYear = this.promotionYear.value;
        publicData.parentInitial = this.parentInitial.value;
        roles.push({roleId: 'student', roleName: 'student'});
      } else roles.push({roleId: 'teacher', roleName: 'teacher'});
      
      const privateData: PrivateData = {
        address: this.address.value,
        birthday: this.birthday.value,
        phone: this.phone.value,
        idNumber: this.idNumber.value
      }

      return { publicData, roles, privateData };
    }
    return undefined;
  }

  async back() {
    if (this.canSave) {
      const dialogConfig = new MatDialogConfig<DialogData>();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = {
        title: 'Exit',
        text: 'Do you want to go back without save?',
        okButton: 'Yes',
        cancelButton: 'No',
        extraData: {
          hideCancel: true,
        }
      };
      const confirmation = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
      if (confirmation) this.navS.back();
    } else this.navS.back();
  }

}
