import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/prompt/prompt.component';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { Absence, Grade, Student, Subject } from '../catalogue-types';
import { AddAbsencesComponent } from './add-absences/add-absences.component';
import { AddGradesComponent } from './add-grades/add-grades.component';
import { EditGradesComponent } from './edit-grades/edit-grades.component';

@Component({
  selector: 'app-subjects-edit',
  templateUrl: './subjects-edit.component.html',
  styleUrls: ['./subjects-edit.component.scss']
})
export class SubjectsEditComponent implements OnInit {
  dateFormat = 'YYYY MMMM D';
  grades: Grade[] = [
    {
      id: '123456789',
      value: 9,
      date: 1628511984
    },
    {
      id: '123456789',
      value: 5,
      date: 1632151164
    },
    {
      id: '123456789',
      value: 8,
      date: 1625833584
    },
    {
      id: '123456789',
      value: 10,
      date: 1625747184
    },
  ]

  absences: Absence[] = [
    {
      id: '123456789',
      date: 1632151164,
      proven: true
    },
    {
      id: '123456789',
      date: 1628511984,
      proven: false
    },
    {
      id: '123456789',
      date: 1632151164,
      proven: false
    },
    {
      id: '123456789',
      date: 1628511984,
      proven: true
    },
  ]
  editableAbsences = false;

  constructor(
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<SubjectsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subject: Subject, student: Student},
    public promptService: PromptService,
  ) { }

  ngOnInit(): void {
  }

  async editGrade(grade: Grade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = grade;

    const dialog = this.matDialog.open(EditGradesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    console.log({value});
  }
  
  async addGrade() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.autoFocus = false;
    
    const dialog = this.matDialog.open(AddGradesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    console.log({value});
  }
  
  async editAbsence(absence: Absence) {
    const dialogConfig = new MatDialogConfig<DialogData>();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {
      title: 'Prove absence',
      text: 'Do you want to prove the absence?',
      okButton: 'Yes',
      cancelButton: 'No',
      extraData: {
        booleanValue: absence.proven
      }
    };
    const dialogData = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
    console.log({dialogData});
    
  }

  async addAbsence() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.autoFocus = false;
    
    const dialog = this.matDialog.open(AddAbsencesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    console.log({value});
  }

  formatDate(value: number | null) {
    if (value === null) return;
    return moment.unix(value).format(this.dateFormat);
  }
  
}
