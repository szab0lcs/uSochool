import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { IClass, ISubject, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { IPerson, TeacherWithSubjects } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {
  subjects$: Observable<ISubject[]> | undefined;
  teachers$: Observable<TeacherWithSubjects[]> | undefined;
  eligibleTeachers$: Observable<IPerson[]> | undefined;
  selectedSubject$ = new BehaviorSubject<ISubject | undefined>(undefined);
  selectedTeacher: IPerson | undefined;
  constructor(
    public matDialogRef: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClass,
    private userService: UserService,
    private catalagoueService: CatalogueService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.subjects$ = this.catalagoueService.getSubjects().pipe(map(subjects => {
      let existingSubjects: string[] = [];
      this.data.subjects.forEach(subject => existingSubjects.push(subject.subject.subjectId));
      const filteredSubjects = subjects.filter(subject => !existingSubjects.includes(subject.subjectId));
      return filteredSubjects;
    }
    ));

    this.teachers$ = this.userService.getTeachers$()
      .pipe(map(teachers => {
        let teachersWSubjects: TeacherWithSubjects[] = [];
        teachers.forEach(async teacher => teachersWSubjects.push({
          ...teacher,
          canTeach: await this.userService.getTeacherWhatCanTeach(teacher.userId)
        }))
        return teachersWSubjects;
      }));
    
    this.eligibleTeachers$ = combineLatest([
      this.teachers$,
      this.selectedSubject$.asObservable()
    ]).pipe(map(([teachers, selectedSubject]) => {
      let eligibleTeachers: IPerson[] = [];
      if (selectedSubject) {
        teachers.forEach(teacher => {
          teacher.canTeach.forEach(subject => {
            if (subject.subjectId === selectedSubject.subjectId) eligibleTeachers.push(teacher);
          })
        });
      }
      return eligibleTeachers;
    }))
  }

  async onSubmit() {
    const selectedSubject = this.selectedSubject$.value;
    const selectedTeacher = this.selectedTeacher
    if ( selectedSubject && selectedTeacher) {
      await this.catalagoueService.addSubjectToClass({
        subject: {
          subjectId: selectedSubject.subjectId,
          subjectName: selectedSubject.subjectName
        },
        teacher: {
          userId: selectedTeacher.userId,
          firstName: selectedTeacher.firstName,
          lastName: selectedTeacher.lastName
        },
        subjectDocId: selectedSubject.subjectDocId ? selectedSubject.subjectDocId : '',
        classId: this.data.classId,
        name: this.data.name
      }, this.data);
      this.matDialogRef.close();
      this.toastr.success('Subject added.', `Succesful!`, {
        positionClass: 'toast-bottom-center',
      });
    } else {
      this.toastr.error('The form is not valid!', `Invalid!`, {
        positionClass: 'toast-bottom-center',
      });
    }
  }

}
