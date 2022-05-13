import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.navigationService.navigateTo('home');
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  ForgotPassword(passwordResetEmail: string) {
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

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}