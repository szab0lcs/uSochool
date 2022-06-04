import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
} from '@angular/fire/compat/firestore';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { getDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { Student } from 'src/app/catalogues/catalogue-types';
import {
  IClass,
  IClassProfile,
  IClosure,
  IPeriod,
  ISubject,
  ISubjectClosure,
  ISubjectsWithTeachers,
} from '../interfaces/catalogue';
import { IPerson, PublicData, UserRole } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  constructor(private afs: AngularFirestore) { }

  async addNewClass(newClassDoc: IClass, newPeriodId = 1) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const newPeriod: IPeriod = {
      active: true,
      lastPeriodOfYear: false,
      id: newPeriodId.toString(),
      endState: null,
      name: `${newClassDoc.promotionYear - 4}_${newClassDoc.promotionYear - 3
        }_${newPeriodId}`,
    };
    currentPromise = this.afs
      .doc<IPeriod>(`classes/${newClassDoc.classId}/periods/${newPeriodId}`)
      .set(newPeriod);
    promises.push(currentPromise);
    currentPromise = this.afs
      .doc<IClass>(`classes/${newClassDoc.classId}`)
      .set(newClassDoc);
    promises.push(currentPromise);
    for (let student of newClassDoc.students) {
      promises.push(
        ...this.addPeriodalClosures(
          student,
          newClassDoc.classId,
          newPeriod,
          newClassDoc.subjects
        )
      );
    }
    currentPromise = this.afs
      .collection<ISubjectsWithTeachers>(
        `users/${newClassDoc.headMaster.userId}/classes`
      )
      .add({
        teacher: newClassDoc.headMaster,
        subject: {
          subjectId: 'headMaster',
          subjectName: 'Master Class',
        },
        classId: newClassDoc.classId,
        name: newClassDoc.name,
      });
    promises.push(currentPromise);
    currentPromise = this.afs
      .collection<UserRole>(`users/${newClassDoc.headMaster.userId}/role`)
      .add({
        roleId: 'master',
        roleName: 'Head Master',
      });
    promises.push(currentPromise);
    currentPromise = this.afs
      .doc<PublicData>(`users/${newClassDoc.headMaster.userId}`)
      .update({
        headMaster: newClassDoc.classId,
      });
    promises.push(currentPromise);
    await Promise.all(promises);
  }

  addPeriodalClosures(
    student: IPerson,
    classId: string,
    currentPeriod: IPeriod,
    subjects: ISubjectsWithTeachers[]
  ) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const periodalClosuresDoc: IClosure = {
      ...student,
      medianGrade: 0,
    };
    currentPromise = this.afs
      .collection<IClosure>(
        `classes/${classId}/periods/${currentPeriod.id}/periodalClosures`
      )
      .add(periodalClosuresDoc);
    promises.push(currentPromise);
    for (let subject of subjects) {
      const subjectClosureDoc: ISubjectClosure = {
        subject: subject.subject,
        grade: 0,
        ...student,
      };
      currentPromise = this.afs
        .collection<ISubjectClosure>(
          `classes/${classId}/periods/${currentPeriod.id}/periodalSubjectClosures`
        )
        .add(subjectClosureDoc);
      promises.push(currentPromise);
      if (currentPeriod.lastPeriodOfYear) {
        currentPromise = this.afs
          .collection<ISubjectClosure>(
            `classes/${classId}/periods/${currentPeriod.id}/yearlySubjectClosures`
          )
          .add(subjectClosureDoc);
        promises.push(currentPromise);
      }
    }
    if (currentPeriod.lastPeriodOfYear) {
      currentPromise = this.afs
        .collection<IClosure>(
          `classes/${classId}/periods/${currentPeriod.id}/yearlyClosures`
        )
        .add(periodalClosuresDoc);
      promises.push(currentPromise);
    }
    return promises;
  }

  removePeriodalClosures(
    student: IPerson,
    classId: string,
    currentPeriod: IPeriod
  ) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;


    currentPromise = this.afs
      .collection<IClosure>(
        `classes/${classId}/periods/${currentPeriod.id}/periodalClosures`,
        ref => ref.where('userId', '==', student.userId)
      ).get().toPromise().then(snapshot => snapshot.docs.forEach(doc => doc.ref.delete()));
    promises.push(currentPromise);

    currentPromise = this.afs
      .collection<ISubjectClosure>(
        `classes/${classId}/periods/${currentPeriod.id}/periodalSubjectClosures`,
        ref => ref.where('userId', '==', student.userId)
      ).get().toPromise().then(snapshot => snapshot.docs.forEach(doc => doc.ref.delete()));
    promises.push(currentPromise);

    currentPromise = this.afs
      .collection<ISubjectClosure>(
        `classes/${classId}/periods/${currentPeriod.id}/yearlySubjectClosures`,
        ref => ref.where('userId', '==', student.userId)
      ).get().toPromise().then(snapshot => snapshot.docs.forEach(doc => doc.ref.delete()));
    promises.push(currentPromise);

    currentPromise = this.afs
      .collection<IClosure>(
        `classes/${classId}/periods/${currentPeriod.id}/yearlyClosures`,
        ref => ref.where('userId', '==', student.userId)
      ).get().toPromise().then(snapshot => snapshot.docs.forEach(doc => doc.ref.delete()));
    promises.push(currentPromise);
    return promises;
  }

  getAllClasses(): Observable<IClass[]> {
    return this.afs.collection<IClass>('classes').valueChanges();
  }

  getClassesByPromotionYear(promotionYear: number): Observable<IClass[]> {
    return this.afs
      .collection<IClass>('classes', (ref) =>
        ref.where('promotionYear', '==', promotionYear)
      )
      .valueChanges();
  }

  async addStudentsToClass(students: IPerson[], classId: string) {
    const promises: Promise<any>[] = [];
    for (const student of students) {
      promises.push(this.addStudentToClass(student, classId));
    }
    await Promise.all(promises);
  }

  async addStudentToClass(student: IPerson, classId: string) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classId}`).ref;
    const userDocRef = this.afs.doc<PublicData>(`users/${student.userId}`).ref;

    currentPromise = updateDoc(classDocRef, { students: arrayUnion(student) });
    promises.push(currentPromise);

    currentPromise = updateDoc(userDocRef, { classId });
    promises.push(currentPromise);

    const thisClass = await this.getClassDoc(classId).pipe(take(1)).toPromise();
    const subjects = thisClass && thisClass.subjects ? thisClass.subjects : [];
    const currentPeriod = await this.getActivePeriod(classId);
    promises.push(
      ...this.addPeriodalClosures(student, classId, currentPeriod, subjects)
    );
    await Promise.all(promises);
  }

  async removeStudentsFromClass(students: IPerson[], classId: string) {
    const promises: Promise<any>[] = [];
    for (const student of students) {
      promises.push(this.removeStudentFromClass(student, classId));
    }
    await Promise.all(promises);
  }

  async removeStudentFromClass(student: IPerson, classId: string) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classId}`).ref;
    const userDocRef = this.afs.doc<PublicData>(`users/${student.userId}`).ref;

    currentPromise = updateDoc(classDocRef, { students: arrayRemove(student) });
    promises.push(currentPromise);

    currentPromise = updateDoc(userDocRef, { classId: '' });
    promises.push(currentPromise);

    const currentPeriod = await this.getActivePeriod(classId);
    promises.push(
      ...this.removePeriodalClosures(student, classId, currentPeriod)
    );
    await Promise.all(promises);
  }

  async addSubjectToClass(subject: ISubjectsWithTeachers, classId: string) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classId}`).ref;
    const teacherDocRef = this.afs.collection<ISubjectsWithTeachers>(`users/${subject.teacher.userId}/classes`).ref;
    const classDocSnapData = (await getDoc(classDocRef)).data()
    let subjects = classDocSnapData ? classDocSnapData.subjects : [];
    subjects.push(subject);
    currentPromise = classDocRef.update({subjects})
    promises.push(currentPromise);

    currentPromise = teacherDocRef.add(subject);
    promises.push(currentPromise);

    await Promise.all(promises);
  }

  async removeSubjectsFromClass(subjects: ISubjectsWithTeachers[],subjectId: string, classId: string) {
    const promises: Promise<any>[] = [];
    for (const subject of subjects) {
      promises.push(...this.removeSubjectFromClass(subject, subjectId, classId));
    }
    await Promise.all(promises);
  }

  removeSubjectFromClass(subject: ISubjectsWithTeachers,subjectId: string, classId: string) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classId}`).ref;
    const teacherCollRef = this.afs.collection<ISubjectsWithTeachers>(`users/${subject.teacher.userId}/classes`).ref;

    currentPromise = updateDoc(classDocRef, { subjects: arrayRemove(subject) });
    promises.push(currentPromise);

    currentPromise = teacherCollRef.doc(subjectId).delete();
    promises.push(currentPromise);

    return promises;
  }

  getClassDoc(classId: string) {
    const docRef = this.afs.doc<IClass>(`classes/${classId}`);
    return docRef.valueChanges().pipe(distinctUntilChanged());
  }

  getActivePeriod(classId: string) {
    return new Promise<IPeriod>(async (resolve, reject) => {
      const queries = (ref: CollectionReference) =>
        ref.where('active', '==', true);
      const result = await this.afs
        .collection<IPeriod>(`classes/${classId}/periods`, queries)
        .valueChanges()
        .pipe(take(1))
        .toPromise();
      if (result.length !== 1) {
        // something is rellly bad, cant be more active periods //TO DO error handling
        reject('More than one active period');
      }
      resolve(result[0]);
    });
  }

  getEligibleStudentForClass(promotionYear: number): Observable<IPerson[]> {
    const queries = (ref: CollectionReference) => ref
      .where('promotionYear', '==', promotionYear)
      .where('classId', '==', '')
    return this.afs.collection<PublicData>('users', queries).valueChanges()
      .pipe(map(users => {
        let persons: IPerson[] = [];
        users.forEach(user => {
          persons.push({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
          })
        })
        return persons;
      }));
  }

  getProfiles() {
    return this.afs.collection<IClassProfile>('profiles').valueChanges();
  }

  addProfile(profile: IClassProfile) {
    return this.afs.collection<IClassProfile>('profiles').add(profile);
  }

  async removeProfile(profileId: string) {
    const querySnapshot = await this.afs.collection<IClassProfile>('profiles', ref_1 => ref_1.where('id', '==', profileId))
    .get()
    .pipe(take(1))
    .toPromise();
    querySnapshot.forEach(async doc => await doc.ref.delete());
  }

  getSubjects() {
    return this.afs.collection<ISubject>('subjects').valueChanges({idField: 'id'});
  }

  addSubject(subject: ISubject) {
    return this.afs.collection<ISubject>('subjects').add(subject);
  }

  async removeSubject(subjectId: string) {
    const querySnapshot = await this.afs.collection<ISubject>('subjects', ref_1 => ref_1.where('subjectId', '==', subjectId))
      .get()
      .pipe(take(1))
      .toPromise();
    querySnapshot.forEach(async doc => await doc.ref.delete());
  }
}
