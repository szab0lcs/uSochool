import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/prompt/prompt.component';
import { IClass, IPeriod } from 'src/app/shared/interfaces/catalogue';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddStudentsComponent } from './add-students/add-students.component';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { RemoveStudentsComponent } from './remove-students/remove-students.component';
import { RemoveSubjectsComponent } from './remove-subjects/remove-subjects.component';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.scss']
})
export class EditClassComponent implements OnInit, OnDestroy {
  classId: string | null = null;
  classDocSub: Subscription | undefined;
  classDoc$ = new BehaviorSubject<IClass | undefined>(undefined);
  expand: 'addStudent' | 'removeStudent' | 'addSubject' | 'removeSubject' | '' = '';
  expandTimeout: NodeJS.Timeout | undefined;
  searchTimeout: NodeJS.Timeout | undefined;
  query = '';
  querySubject = '';
  expanded: 'students-list' | 'subjects-list' = 'students-list';
  canPromote = false;
  userId$: Observable<string | undefined>;
  activePeriod$: Promise<IPeriod> | undefined;
  constructor(
    private catalogueService: CatalogueService,
    private route: ActivatedRoute,
    public navS: NavigationService,
    private matDialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private promptService: PromptService,
  ) {
    this.userId$ = this.userService.userId$;
  }
  
  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId) {
      this.activePeriod$ = this.catalogueService.getActivePeriod(this.classId);
      this.classDocSub = this.catalogueService.getClassDoc$(this.classId).subscribe(classDoc => {
        if(classDoc) this.classDoc$.next(classDoc);
      });
    }
  }

  async promoteClass() {
    const activePeriod = await this.activePeriod$;
    if (!activePeriod) return;
    if (!this.canPromote) {
      this.canPromote = true;
      setTimeout(() => {
        this.canPromote = false;
      }, 3000);
    } else {
      if (this.classId && this.classDoc$.value) {
        const dialogConfig = new MatDialogConfig<DialogData>();
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'forgot-password';
        dialogConfig.backdropClass = 'forgot-password-backdrop';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.data = {
          title: 'Promote class',
          text: `Current period name is ${activePeriod.name}. Do you want to promote class?. This will be archive all current class data.`,
          okButton: 'Yes',
          cancelButton: 'No',
          extraData: {
            hideCancel: true,
          }
        };
        const confirmation = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
        if (confirmation) {
          this.catalogueService.promoteClass(this.classId,this.classDoc$.value);
        }
      }
    }
  }

  onSearchChange(el: any, type: 'subject' | 'student'): void {  
    if(this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.search(el,type), 250);
  }

  search(el: any, type: 'subject' | 'student'){
    const target = el? el.target : undefined;
    const value = target && target.value ? target.value : '';
    if (type === 'student') this.query = value;
    else this.querySubject = value;
  }

  async addStudent(data: IClass) {
    if (this.expand !== 'addStudent') {
      this.expand = 'addStudent';
      this.resetExpand();
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = data;

      const dialog = this.matDialog.open(AddStudentsComponent,dialogConfig);
      await dialog.afterClosed().pipe(take(1)).toPromise();
    }
  }

  async removeStudent(data: IClass) {
    if (this.expand !== 'removeStudent') {
      this.expand = 'removeStudent';
      this.resetExpand();
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = data;

      const dialog = this.matDialog.open(RemoveStudentsComponent,dialogConfig);
      await dialog.afterClosed().pipe(take(1)).toPromise();
    }
  }

  async addSubject(data: IClass) {
    if (this.expand !== 'addSubject') {
      this.expand = 'addSubject';
      this.resetExpand();
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = data;

      const dialog = this.matDialog.open(AddSubjectComponent,dialogConfig);
      await dialog.afterClosed().pipe(take(1)).toPromise();
    }
  }

  async removeSubjects(data: IClass) {
    if (this.expand !== 'removeSubject') {
      this.expand = 'removeSubject';
      this.resetExpand();
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = data;

      const dialog = this.matDialog.open(RemoveSubjectsComponent,dialogConfig);
      await dialog.afterClosed().pipe(take(1)).toPromise();
    }
  }

  resetExpand() {
    this.expandTimeout && clearTimeout(this.expandTimeout);
    this.expandTimeout = setTimeout(() => {
      this.expand = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.classDocSub && this.classDocSub.unsubscribe();
  }
}
