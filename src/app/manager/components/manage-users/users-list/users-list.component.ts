import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AllUserData, PublicData } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  users$: Observable<PublicData[]> | undefined;
  userType$ = new BehaviorSubject<'teacher' | 'student'>('student');

  constructor(
    public matDialog: MatDialog,
    public navS: NavigationService,
    public userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.users$ = combineLatest([
      this.userService.getAllUser$(),
      this.userType$.asObservable()
    ]).pipe(map( ([users, userType]) => {
      return users.filter( user => user.teacher === (userType === 'teacher'));
    }));
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

  switchUserType(){
    if (this.userType$.value === 'student') this.userType$.next('teacher');
    else this.userType$.next('student');
  }
}
