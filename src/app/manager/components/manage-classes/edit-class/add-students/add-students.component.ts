import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClass } from 'src/app/shared/interfaces/catalogue';
import { IPerson } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';

@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.scss']
})
export class AddStudentsComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  eligibleStudents$: Observable<IPerson[]> | undefined;
  selectedUsers$ = new BehaviorSubject<IPerson[]>([]);
  canSave = false;
  constructor(
    private catalogueService: CatalogueService,
    public matRef: MatDialogRef<AddStudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClass,
  ) { }

  ngOnInit(): void {
    if(this.data && this.data.promotionYear) {
      this.eligibleStudents$ = combineLatest([
        this.catalogueService.getEligibleStudentForClass(this.data.promotionYear),
        this.selectedUsers$
      ]).pipe(
        map(([fromObs,selected]) => {
          return fromObs.filter( student => !selected.includes(student))
        })
      )
    }
  }

  onSearchChange(el: any): void {  
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.search(el), 250);
  }
  
  search(el: any){
    const target = el? el.target : undefined;
    const value = target && target.value ? target.value : '';
    this.query = value;
  }

  selectUser(user: IPerson, selectedUsers: IPerson[]) {
    const index = this.selectedUsers$.value.indexOf(user);
    if(index === -1) this.selectedUsers$.next([...selectedUsers,user]);
  }

  removeUser(user: IPerson, selectedUsers: IPerson[]) {
    const index = this.selectedUsers$.value.indexOf(user);
    if(index > -1) {
      selectedUsers.splice(index,1)
      this.selectedUsers$.next(selectedUsers);
    }
  }

  addUsers(selectedUsers: IPerson[]){
    if (!this.canSave) {
      this.canSave = true;
      setTimeout(() => {
        this.canSave = false;
      }, 5000);
    } else {
      this.catalogueService.addStudentsToClass(selectedUsers,this.data.classId);
      this.matRef.close();
    }
  }
}
