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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export type ExistingRoutes = 
  '' |
  'home' |
  'login' |
  'student-catalogue' |
  'teacher-catalogue' |
  'news' |
  'profile' |
  'library' |
  'contacts' |
  'timetable' |
  'manage-classes' |
  'manage-contacts' |
  'manage-library' |
  'manage-news' |
  'manage-users';
