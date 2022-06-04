import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClass, ISubject, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { IPerson } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {
  subjects$: Observable<ISubject[]> | undefined;
  teachers$: Observable<IPerson[]> | undefined;
  selectedSubject: ISubject | undefined;
  selectedTeacher: IPerson | undefined;
  constructor(
    public matDialogRef: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClass,
    private userService: UserService,
    private catalagoueService: CatalogueService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.subjects$ = this.catalagoueService.getSubjects().pipe(map( subjects =>
      {
        let existingSubjects: string[] = [];
        this.data.subjects.forEach( subject => existingSubjects.push(subject.subject.subjectId));
        const filteredSubjects = subjects.filter( subject => !existingSubjects.includes(subject.subjectId));
        console.log({existingSubjects, filteredSubjects});
        
        return filteredSubjects;
      }
    ));
    this.teachers$ = this.userService.getTeachers$();
  }

  async onSubmit() {
    if(this.selectedSubject && this.selectedTeacher){
      await this.catalagoueService.addSubjectToClass({
        subject: this.selectedSubject,
        teacher: this.selectedTeacher,
        classId: this.data.classId,
        name: this.data.name
      },this.data.classId);
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
