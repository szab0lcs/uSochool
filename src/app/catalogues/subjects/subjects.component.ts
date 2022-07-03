import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAbsence, IGrade, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  dateFormat = 'YYYY MMMM D, H:mm';
  gradesAbsences$: Observable<{
    grades: IGrade[], 
    semesterGrade: IGrade | undefined,
    absences: IAbsence[]
  }>;

  constructor(
    public matDialogRef: MatDialogRef<SubjectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subject: ISubjectsWithTeachers, userId: string},
    private catalogueService: CatalogueService,
  ) { 
    this.gradesAbsences$ = this.catalogueService.getStudentSubjectDetailsForCurrentPeriod$(
      this.data.subject.classId,
      this.data.subject.subject.subjectId,
      this.data.userId
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

  ngOnInit(): void {
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
