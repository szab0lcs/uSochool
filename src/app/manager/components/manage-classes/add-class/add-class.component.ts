import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IClass, IClassProfile, romanNumbers } from 'src/app/shared/interfaces/catalogue';
import { IPerson, PublicData, UserRole } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss'],
})
export class AddClassComponent implements OnInit, OnDestroy {
  classForm = new FormGroup({});
  promotionYearSub: Subscription | undefined;
  thisYear = new Date().getFullYear();
  GRADES = [9, 10, 11, 12];
  PROFILES: IClassProfile[] = [
    {
      id: 'A',
      name: 'Mathematic',
    },
    {
      id: 'B',
      name: 'Biology',
    },
    {
      id: 'C',
      name: 'Physic',
    },
    {
      id: 'D',
      name: 'Phylology',
    },
  ];
  profiles: IClassProfile[] = [];
  nonHeadMasters$: Observable<IPerson[]> | undefined;

  constructor(
    public navS: NavigationService,
    private userService: UserService,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<AddClassComponent>,
    private catalogueService: CatalogueService
  ) {}

  ngOnInit() {
    this.nonHeadMasters$ = this.userService.getNonHeadMasters$();
    this.classForm = new FormGroup({
      promotionYear: new FormControl('', [
        Validators.min(this.thisYear),
        Validators.max(this.thisYear + 5),
        Validators.pattern('^[0-9]*$'),
      ]),
      grade: new FormControl(9, [
        Validators.required,
        Validators.min(9),
        Validators.max(12),
      ]),
      profile: new FormControl('', [Validators.required]),
      headMaster: new FormControl('', [Validators.required]),
    });

    this.profile && this.profile.disable();

    if (this.promotionYear) {
      this.promotionYearSub = this.promotionYear.valueChanges.subscribe(
        (promotionYear) => {
          if (this.promotionYear && this.promotionYear.valid) {
            this.catalogueService
              .getClassesByPromotionYear(promotionYear)
              .pipe(take(1))
              .toPromise()
              .then((classes) => {
                this.profiles = this.PROFILES.filter(
                  (profile) =>
                    classes.findIndex((currentClass) => currentClass.profile.id === profile.id) === -1
                );
                this.profile && this.profile.enable();
              });
          }
        }
      );
    }
  }

  get promotionYear() {
    return this.classForm.get('promotionYear');
  }

  get profile() {
    return this.classForm.get('profile');
  }

  get headMaster() {
    return this.classForm.get('headMaster');
  }

  get grade() {
    return this.classForm.get('grade');
  }

  async onFormSubmit() {
    if (
      this.classForm.valid &&
      this.promotionYear &&
      this.profile &&
      this.headMaster &&
      this.grade
    ) {
      const newClass: IClass = {
        classId: this.promotionYear.value + '_' + this.profile.value.id,
        name: this.convertClassToRoman(+this.grade.value) + '.' + this.profile.value.id,
        students: [],
        subjects: [],
        headMaster: {
          id: this.headMaster.value.id,
          firstName: this.headMaster.value.firstName,
          lastName: this.headMaster.value.lastName,
        },
        profile: this.profile.value,
        promotionYear: this.promotionYear.value,
      };
      await this.catalogueService.addNewClass(newClass);
      this.toastr.success('New class successfully created', `Succesful!`, {
        positionClass: 'toast-bottom-center',
      });
      this.matDialogRef.close();
    } else {
      this.toastr.error('The form is not valid!', `Invalid!`, {
        positionClass: 'toast-bottom-center',
      });
    }
  }

  convertClassToRoman(year: number): romanNumbers {
    switch (year) {
      case 9:
        return 'IX'
      case 10:
        return 'X'
      case 11:
        return 'XI'
      case 12:
        return 'XII'
      default:
        return 'IX'
    }
  }

  ngOnDestroy(): void {}
}
