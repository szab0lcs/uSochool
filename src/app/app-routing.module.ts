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
import { EditClassComponent } from './manager/components/manage-classes/edit-class/edit-class.component';
import { ManageSubjectsComponent } from './manager/components/manage-subjects/manage-subjects.component';

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
    component: StudentCatalogueComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'teacher-catalogue/:id',
    component: TeacherCatalogueComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'news',
    component: NewsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'library',
    component: LibraryComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'timetable',
    component: TimetableComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'manage-classes',
    component: ManageClassesComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-classes/:id',
    component: EditClassComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-contacts',
    component: ManageContactsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-library',
    component: ManageLibraryComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-subjects',
    component: ManageSubjectsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-news',
    component: ManageNewsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
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
  ManageSubjects = 'manage-subjects',
  ManageNews = 'manage-news',
  ManageUsers = 'manage-users',
  AddUser = 'add-user',
  UsersList = 'users-list',
  EditUser = 'edit-user',
}
