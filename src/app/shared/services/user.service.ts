import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import {
  AllUserData,
  INITIAL_PRIVATE_DATA_VALUE,
  IPerson,
  PrivateData,
  PublicData,
  UserRole,
} from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ISubject, ISubjectsWithTeachers } from '../interfaces/catalogue';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: AllUserData | null = null;
  private readonly user$ = new BehaviorSubject(this.user);
  private loggedOut$ = new Subject();
  constructor(private afs: AngularFirestore) { }

  get currentUser() {
    return this.user;
  }

  get currentUser$() {
    return this.user$.asObservable();
  }

  get userId$() {
    return this.currentUser$.pipe(
      map((user) => user?.publicData.userId),
      distinctUntilChanged()
    );
  }

  onUserDataChanged(user: any) {
    this.user$.next(user);
  }

  onLogOut() {
    this.loggedOut$.next();
    this.user$.next(null);
  }

  getUserDataFromFirestore(uid: string) {
    this.getAllData$(uid).subscribe((data) => this.onUserDataChanged(data));
  }

  /**OBSERVABLES */
  getUserPublicData$(userId: string) {
    return this.afs.doc<PublicData>(`users/${userId}`).valueChanges();
  }

  getUserPrivateData$(userId: string) {
    return this.afs
      .doc<PrivateData>(`users/${userId}/data/private`)
      .valueChanges();
  }

  getUserRoles$(userId: string) {
    return this.afs.collection<UserRole>(`users/${userId}/role`).valueChanges();
  }

  getAllData$(uid: string) {
    return combineLatest([
      this.getUserPublicData$(uid),
      this.getUserPrivateData$(uid),
      this.getUserRoles$(uid),
    ]).pipe(
      takeUntil(this.loggedOut$),
      map(([publicData, privateData, roles]) => {
        if (publicData && privateData && roles) {
          const userData: AllUserData = {
            publicData,
            privateData,
            roles,
          };
          return userData;
        }
        return null;
      })
    );
  }

  getAllUser$() {
    return this.afs
      .collection<PublicData>(`users`)
      .valueChanges({ idField: 'userId' })
      .pipe(distinctUntilChanged());
  }

  getUserMainRole$() {
    return this.currentUser$.pipe(
      map((userData) => {
        if (userData && userData.roles) {
          const roles = userData.roles;
          const mainRoles = ['admin', 'teacher', 'student'];
          for (const mainRole of mainRoles) {
            if (roles.findIndex((roles) => roles.roleId === mainRole) > -1)
              return mainRole;
          }
        }
        return '';
      })
    );
  }

  /**SET/UPDATE DATA */
  setUserPublicData(studentId: string, publicData: PublicData) {
    return this.afs.doc<PublicData>(`users/${studentId}`).set(publicData);
  }

  setUserPrivateData(studentId: string, privateData: PrivateData) {
    return this.afs
      .doc<PrivateData>(`users/${studentId}/data/private`)
      .set(privateData);
  }

  async setUserRoles(studentId: string, userRoles: UserRole[]) {
    const promises: Promise<any>[] = [];
    for (const userRole of userRoles) {
      const promise = this.afs
        .doc<UserRole>(`users/${studentId}`)
        .collection('role')
        .add(userRole);
      promises.push(promise);
    }
    return await Promise.all(promises);
  }

  updateUserPrivateData(studentId: string, privateData: Partial<PrivateData>) {
    return this.afs
      .doc<PrivateData>(`users/${studentId}/data/private`)
      .update(privateData);
  }

  async setAllUserData(userData: AllUserData) {
    await this.afs
      .doc<PublicData>(`users/${userData.publicData.userId}`)
      .set(userData.publicData);

    await this.afs
      .doc<PrivateData>(`users/${userData.publicData.userId}/data/private`)
      .set({
        address: userData.privateData.address,
        birthday: userData.privateData.birthday,
        idNumber: userData.privateData.idNumber,
        phone: userData.privateData.phone,
      });

    const roleCollection = this.afs.collection<UserRole>(
      `users/${userData.publicData.userId}/role`
    );
    const userRoles: UserRole[] = await this.getUserRoles$(userData.publicData.userId)
      .pipe(take(1))
      .toPromise();
    userRoles.forEach(async (existingRole) => {
      if (
        userData.roles.findIndex((x) => x.roleId === existingRole.roleId) < 0
      ) {
        const oldRole = roleCollection.ref.where(
          'roleId',
          '==',
          existingRole.roleId
        );
        oldRole.get().then((ref) =>
          ref.forEach(async function (doc) {
            await doc.ref.delete();
          })
        );
      }
    });
    userData.roles.forEach(async (role) => {
      if (userRoles.findIndex((x) => x.roleId === role.roleId) < 0) {
        await roleCollection.add({
          roleId: role.roleId,
          roleName: role.roleName,
        });
      }
    });
  }

  async setTeacherWhatCanTeach(userId: string, canTeach: ISubject[]) {
    const canTeachCollection = this.afs.collection<ISubject>(
      `users/${userId}/canTeach`
    );
    const currentSubjects = await canTeachCollection.valueChanges().pipe(take(1)).toPromise();
    currentSubjects.forEach(cSubject => {
      if (!canTeach.includes(cSubject)) canTeachCollection.ref
        .where('subjectId', '==', cSubject.subjectId)
        .get().then((ref) =>
          ref.forEach(async function (doc) {
            await doc.ref.delete();
          })
        );
    })
    canTeach.forEach(async (subject) => {
      if (!currentSubjects.includes(subject)) await canTeachCollection.add(subject);
    })
  }

  getTeacherWhatCanTeach$(userId: string): Observable<ISubject[]> {
    return this.afs.collection<ISubject>(`users/${userId}/canTeach`).valueChanges();
  }

  getTeacherWhatCanTeach(userId: string): Promise<ISubject[]> {
    return this.getTeacherWhatCanTeach$(userId).pipe(take(1)).toPromise();
  }

  getTeachersClasses$(teacherId: string) {
    return this.afs.collection<ISubjectsWithTeachers>(`users/${teacherId}/classes`).valueChanges();
  }

  /**NEW USER */
  async createNewUser(
    publicData: PublicData,
    userRoles: UserRole[],
    privateData?: PrivateData
  ) {
    const promises: Promise<any>[] = [];
    promises.push(this.setUserPublicData(publicData.userId, publicData));
    promises.push(this.setUserPrivateData(publicData.userId, privateData ? privateData : INITIAL_PRIVATE_DATA_VALUE));
    promises.push(this.setUserRoles(publicData.userId, userRoles));
    return await Promise.all(promises);
  }

  getTeachers$(): Observable<IPerson[]> {
    return this.afs
      .collection<PublicData>(`users`, ref => ref.where('teacher', '==', true))
      .valueChanges({ idField: 'userId' })
      .pipe(
        map(teachers => {
          let teachersPerson: IPerson[] = [];
          teachers.forEach(teacher => teachersPerson.push({
            userId: teacher.userId,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            headMaster: teacher.headMaster
          }))
          return teachersPerson;
        }),
        distinctUntilChanged()
      );
  }

  getNonHeadMasters$(): Observable<IPerson[]> {
    return this.getTeachers$().pipe(map(teachers =>
      teachers.filter(teacher => !teacher.headMaster)
    ))
  }

  async getClassIdIfHeadMaster(userId: string): Promise<string | undefined>{
    const masterClassId = await this.getTeachersClasses$(userId).pipe(
      take(1),
      map(tClasses => {
        let mClassId: string | undefined;
        tClasses.forEach( tClass => {
          if (tClass.subject.subjectId === 'headMaster') mClassId = tClass.classId;
        })
        return mClassId;
    })).toPromise();
    return masterClassId;
  }
}
