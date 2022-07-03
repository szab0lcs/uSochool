import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditTeacherSubjectsComponent } from './edit-user/edit-teacher-subjects/edit-teacher-subjects.component';

@NgModule({
  declarations: [
    ManageUsersComponent,
    AddUserComponent,
    UsersListComponent,
    EditUserComponent,
    EditTeacherSubjectsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class ManageUsersModule { }
