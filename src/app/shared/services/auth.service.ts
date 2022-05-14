import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PublicData, UserRole } from '../interfaces/user';
import { NavigationService } from './navigation.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userService.getUserDataFromFirestore(user.uid);
      } else {
        userService.onLogOut();
      }
    });

  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo(this.navigationService.eRoutes.Home);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.toastr.success('Password reset email sent, check your inbox.',`Email sent.`,{
          positionClass: 'toast-bottom-center',
        });
      })
      .catch((error) => {
        const errorText = error.toString();
        this.toastr.error(errorText,`Error!`,{
          positionClass: 'toast-bottom-center',
        });
      });
  }

  async registerUser(email: string, password: string, publicData: PublicData, userRoles: UserRole[]) {
    const newUser = await this.afAuth.createUserWithEmailAndPassword(email,password);
    if (newUser && newUser.user) return this.userService.createNewUser(newUser.user.uid,publicData,userRoles)
    return;
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}