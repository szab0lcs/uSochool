import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManageClassesComponent } from './components/manage-classes/manage-classes.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManageLibraryComponent } from './components/manage-library/manage-library.component';
import { ManageNewsComponent } from './components/manage-news/manage-news.component';
import { ManageContactsComponent } from './components/manage-contacts/manage-contacts.component';



@NgModule({
  declarations: [
    ManageClassesComponent,
    ManageUsersComponent,
    ManageLibraryComponent,
    ManageNewsComponent,
    ManageContactsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManagerModule { }
