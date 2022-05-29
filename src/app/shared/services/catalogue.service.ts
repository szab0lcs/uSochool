import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {
  IClass,
  IClosure,
  IPeriod,
  ISubjectClosure,
  ISubjectsWithTeachers,
} from '../interfaces/catalogue';
import { IPerson, PublicData, UserRole } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  constructor(private afs: AngularFirestore) {}

  async addNewClass(newClassDoc: IClass, newPeriodId = 1) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const newPeriod: IPeriod = {
      active: true,
      lastPeriodOfYear: false,
      id: newPeriodId.toString(),
      endState: null,
      name: `${newClassDoc.promotionYear - 4}_${
        newClassDoc.promotionYear - 3
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
        `users/${newClassDoc.headMaster.id}/classes`
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
      .collection<UserRole>(`users/${newClassDoc.headMaster.id}/role`)
      .add({
        roleId: 'master',
        roleName: 'Head Master',
      });
    promises.push(currentPromise);
    currentPromise = this.afs
      .doc<PublicData>(`users/${newClassDoc.headMaster.id}`)
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
}
