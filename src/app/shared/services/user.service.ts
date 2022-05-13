import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AllUserData, PrivateData, PublicData, UserRole } from '../interfaces/user';
import { AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: AllUserData | null = null;
  private readonly user$ = new BehaviorSubject(this.user);
  private loggedOut$ = new Subject();
  constructor(
    private afs: AngularFirestore
  ) {}

  get currentUser(){
    return this.user;
  }

  get currentUser$(){
    return this.user$.asObservable();
  }

  onUserDataChanged(user: any){
    this.user$.next(user);
  }
  
  onLogOut(){
    this.loggedOut$.next();
    this.user$.next(null);
  }

  getUserDataFromFirestore(uid: string) {
    combineLatest([this.getUserPublicData$(uid),this.getUserPrivateData$(uid),this.getUserRoles$(uid)])
      .pipe(
        takeUntil(this.loggedOut$),
        map(([publicData,privateData,roles]) => {
          if (publicData && privateData && roles) {
            const userData: AllUserData = {
              userId: uid,
              publicData,
              privateData,
              roles
            }
            return userData;
          }
          return null;
        })
        )
      .subscribe( data => this.onUserDataChanged(data))
  }

  getUserPublicData$(userId: string){
    return this.afs.doc<PublicData>(`users/${userId}`).valueChanges();
  }

  getUserPrivateData$(userId: string){
    return this.afs.doc<PrivateData>(`users/${userId}/data/private`).valueChanges();
  }

  getUserRoles$(userId: string){
    return this.afs.collection<UserRole>(`users/${userId}/role`).valueChanges();
  }

}

