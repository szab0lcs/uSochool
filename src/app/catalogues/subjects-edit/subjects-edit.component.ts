import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { DialogData } from 'src/app/shared/components/prompt/prompt.component';
import { IAbsence, IClass, IGrade, ISubject } from 'src/app/shared/interfaces/catalogue';
import { IPerson } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
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
  editableAbsences = false;
  gradesAbsences$: Observable<{
    grades: IGrade[], 
    semesterGrade: IGrade | undefined,
    absences: IAbsence[]
  }> | undefined;

  constructor(
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<SubjectsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subject: ISubject, student: IPerson, classId: string, isMaster: boolean},
    public promptService: PromptService,
    private catService: CatalogueService,
  ) { }

  ngOnInit(): void {
    this.gradesAbsences$ = this.catService.getStudentSubjectDetailsForCurrentPeriod$(
      this.data.classId,
      this.data.subject.subjectId,
      this.data.student.userId
    ).pipe(map( value => {
      let grades: IGrade[]= [];
      let semesterGrade: IGrade | undefined;
      value.grades.forEach( grade => {
        if (grade.type === 'general') grades.push(grade);
        else semesterGrade = grade;
      })
      return {grades, semesterGrade, absences: value.absences}
    }))
  }

  async editGrade(grade: IGrade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = grade;

    const dialog: MatDialogRef<EditGradesComponent, {grade: IGrade, action: 'edit' | 'delete'}> = this.matDialog.open(EditGradesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    if (value && value.grade.id && value.action === 'edit') await this.catService.editGrade(value.grade,value.grade.id,this.data.classId);
    if (value && value.grade.id && value.action === 'delete') await this.catService.deleteGrade(value.grade.id,this.data.classId);
  }
  
  async addGrade(canAddSemester: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.autoFocus = false;
    dialogConfig.data = canAddSemester;
    
    const dialog: MatDialogRef<AddGradesComponent, IGrade> = this.matDialog.open(AddGradesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();    
    if (value) await this.catService.addGrade(
        this.data.classId,
        this.data.student.userId,
        this.data.subject.subjectId,
        value.grade,
        value.type,
        value.date);
  }
  
  async editAbsence(absence: IAbsence) {
    const dialogConfig = new MatDialogConfig<DialogData>();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {
      title: 'Prove absence',
      text: absence.proven ? 'Do you want to mark as not proven?' : 'Do you want to prove the absence?',
      okButton: 'Yes',
      cancelButton: 'No',
      extraData: {
        hideCancel: true
      }
    };
    const dialogData = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
    if (dialogData && absence.id) this.catService.proveAbsence(absence,this.data.classId);
    
  }

  async addAbsence() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.autoFocus = false;
    
    const dialog: MatDialogRef<AddAbsencesComponent, Timestamp> = this.matDialog.open(AddAbsencesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    if (value) this.catService.addAbsence(this.data.classId,this.data.student.userId, this.data.subject.subjectId, value);
  }

  formatDate(value: Timestamp) {
    return moment(value.toDate()).format(this.dateFormat);
  }

  finalGrade(grades: IGrade[], semesterGrade: IGrade) {
    let gradesSum = 0;
    grades.forEach( grade => gradesSum += grade.grade);
    const gradesAvg = gradesSum/grades.length;
    const finalGrade = ((gradesAvg * 3) + semesterGrade.grade) / 4;    
    return Math.round(finalGrade);
  }
  
  totalAbsences(absences: IAbsence[]) {
    return absences.filter(absence => !absence.proven).length;
  }
}
