import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ISubject } from 'src/app/shared/interfaces/catalogue';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-teacher-subjects',
  templateUrl: './edit-teacher-subjects.component.html',
  styleUrls: ['./edit-teacher-subjects.component.scss']
})
export class EditTeacherSubjectsComponent implements OnInit {
  canTeachSelected: ISubject[] = [];
  subjects$: Observable<ISubject[]> | undefined;
  constructor(
    private catalogueService: CatalogueService,
    private userService: UserService,
    public matDialogRef: MatDialogRef<EditTeacherSubjectsComponent>,
    @Inject(MAT_DIALOG_DATA) public userId: string,

  ) { }

  ngOnInit(): void {
    this.userService.getTeacherWhatCanTeach$(this.userId)
    .pipe(take(1)).toPromise()
    .then( subjects => this.canTeachSelected = subjects);
    this.subjects$ = this.catalogueService.getSubjects().pipe(map(
      subjects => subjects.filter(subject => !this.canTeachSelected.includes(subject))
    ),
    tap(val => console.log({val})));
  }

  async saveSubjects(selected: ISubject[]) {
    await this.userService.setTeacherWhatCanTeach(this.userId, selected);
    this.matDialogRef.close();
  }

}
