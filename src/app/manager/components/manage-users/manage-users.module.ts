import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ManageUsersComponent,
    AddUserComponent,
    UsersListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageUsersModule { }
