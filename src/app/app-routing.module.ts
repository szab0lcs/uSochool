import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCatalogueComponent } from './catalogues/student-catalogue/student-catalogue.component';
import { TeacherCatalogueComponent } from './catalogues/teacher-catalogue/teacher-catalogue.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './library/library.component';
import { LoginComponent } from './login/login.component';
import { ManageClassesComponent } from './manager/components/manage-classes/manage-classes.component';
import { ManageContactsComponent } from './manager/components/manage-contacts/manage-contacts.component';
import { ManageLibraryComponent } from './manager/components/manage-library/manage-library.component';
import { ManageNewsComponent } from './manager/components/manage-news/manage-news.component';
import { ManageUsersComponent } from './manager/components/manage-users/manage-users.component';
import { NewsComponent } from './news/news.component';
import { ProfileComponent } from './profile/profile.component';
import { TimetableComponent } from './timetable/timetable.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';
import { AddUserComponent } from './manager/components/manage-users/add-user/add-user.component';
import { UsersListComponent } from './manager/components/manage-users/users-list/users-list.component';
import { EditUserComponent } from './manager/components/manage-users/edit-user/edit-user.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
  {
    path: 'student-catalogue',
    component: StudentCatalogueComponent
  },
  {
    path: 'teacher-catalogue',
    component: TeacherCatalogueComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'library',
    component: LibraryComponent
  },
  {
    path: 'timetable',
    component: TimetableComponent
  },
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'manage-classes',
    component: ManageClassesComponent
  },
  {
    path: 'manage-contacts',
    component: ManageContactsComponent
  },
  {
    path: 'manage-library',
    component: ManageLibraryComponent
  },
  {
    path: 'manage-news',
    component: ManageNewsComponent
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
  {
    path: 'users-list',
    component: UsersListComponent
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export enum ExistingRoutes {
  Default = '',
  Home = 'home',
  Login = 'login',
  StudentCatalogue = 'student-catalogue',
  TeacherCatalogue = 'teacher-catalogue',
  News = 'news',
  Profile = 'profile',
  Library = 'library',
  Contacts = 'contacts',
  Timetable = 'timetable',
  ManageClasses = 'manage-classes',
  ManageContacts = 'manage-contacts',
  ManageLibrary = 'manage-library',
  ManageNews = 'manage-news',
  ManageUsers = 'manage-users',
  AddUser = 'add-user',
  UsersList = 'users-list',
  EditUser = 'edit-user'
}
