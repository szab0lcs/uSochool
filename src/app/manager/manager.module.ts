import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManageLibraryComponent } from './components/manage-library/manage-library.component';
import { ManageNewsComponent } from './components/manage-news/manage-news.component';
import { ManageContactsComponent } from './components/manage-contacts/manage-contacts.component';
import { ManageClassesModule } from './components/manage-classes/manage-classes.module';
import { ManageUsersModule } from './components/manage-users/manage-users.module';
import { ManageSubjectsComponent } from './components/manage-subjects/manage-subjects.component';
import { ManageSubjectsModule } from './components/manage-subjects/manage-subjects.module';



@NgModule({
  declarations: [
    ManageLibraryComponent,
    ManageNewsComponent,
    ManageContactsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManageClassesModule,
    ManageUsersModule,
    ManageSubjectsModule
  ]
})
export class ManagerModule { }
