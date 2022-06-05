import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClass, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { IPerson } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';

@Component({
  selector: 'app-remove-subjects',
  templateUrl: './remove-subjects.component.html',
  styleUrls: ['./remove-subjects.component.scss']
})
export class RemoveSubjectsComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  subjects$: Observable<ISubjectsWithTeachers[]> | undefined;
  selectedSubjects$ = new BehaviorSubject<ISubjectsWithTeachers[]>([]);
  canSave = false;
  constructor(
    private catalogueService: CatalogueService,
    public matRef: MatDialogRef<RemoveSubjectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClass,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.promotionYear) {
      this.subjects$ = this.selectedSubjects$.pipe(
        map((selected) => {
          return this.data.subjects.filter(subject => !selected.includes(subject))
        })
      )
    }
  }

  onSearchChange(el: any): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.search(el), 250);
  }

  search(el: any) {
    const target = el ? el.target : undefined;
    const value = target && target.value ? target.value : '';
    this.query = value;
  }

  selectSubject(subject: ISubjectsWithTeachers, selectedSubjects: ISubjectsWithTeachers[]) {
    const index = this.selectedSubjects$.value.indexOf(subject);
    if (index === -1) this.selectedSubjects$.next([...selectedSubjects, subject]);
  }

  removeSubject(subject: ISubjectsWithTeachers, selectedSubjects: ISubjectsWithTeachers[]) {
    const index = this.selectedSubjects$.value.indexOf(subject);
    if (index > -1) {
      selectedSubjects.splice(index, 1)
      this.selectedSubjects$.next(selectedSubjects);
    }
  }

  removeSubjects(selectedSubjects: ISubjectsWithTeachers[]) {
    if (!this.canSave) {
      this.canSave = true;
      setTimeout(() => {
        this.canSave = false;
      }, 5000);
    } else {

      this.catalogueService.removeSubjectsFromClass(selectedSubjects, this.data.classId);
      this.matRef.close();
    }
  }
}
