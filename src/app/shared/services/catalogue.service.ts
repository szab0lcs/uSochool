import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
} from '@angular/fire/compat/firestore';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { combineLatest, from, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import {
  GradeType,
  IAbsence,
  IClass,
  IClassProfile,
  IClosure,
  IGrade,
  IPeriod,
  ISubject,
  ISubjectClosure,
  ISubjectsWithTeachers,
  PERIOD_COUNT_IN_YEAR,
} from '../interfaces/catalogue';
import { IPerson, PublicData, UserRole } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  constructor(private afs: AngularFirestore) { }

  async addNewClass(newClassDoc: IClass, grade: number) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const newPeriodId = 1
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
        subjectDocId: 'headMaster',
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
    if (grade !== 9) {
      const timesToPromote = (3 - (12 - grade)) * 2;
      for (let index = 0; index < timesToPromote; index++) {
        console.log('promoteClass');
        
        await this.promoteClass(newClassDoc.classId,newClassDoc);
      }
    }
    await Promise.all(promises);
  }

  async calculateClosureGrade(
    student: IPerson,
    classId: string,
    subject: ISubjectsWithTeachers
  ) {
      const grades = await this.getGradesForCurrentPeriod(classId,student.userId,subject.subject.subjectId).pipe(take(1)).toPromise();
      let generalGrades: number[] = [];
      let semesterGrade = 0;
      grades.forEach( grade => {
        if (grade.type === 'general') generalGrades.push(grade.grade);
        if (grade.type === 'periodal') semesterGrade = grade.grade;
      })
      return this.finalGrade(generalGrades,semesterGrade);
  }

  finalGrade(grades: number[], semesterGrade?: number) {
    let gradesSum = 0;
    grades.forEach( grade => gradesSum += grade);
    const gradesAvg = gradesSum/grades.length;
    let finalGrade = 0;
    if (semesterGrade) {
      finalGrade = ((gradesAvg * 3) + semesterGrade) / 4;
    } else finalGrade = gradesAvg;
    return Math.round(finalGrade);
  }

  calculateMedianGrade(subjectsWithClosures: ISubjectClosure[]) {
    const grades = subjectsWithClosures.map(subwc => subwc.grade);
    let gradesSum = 0;
    grades.forEach( grade => gradesSum += grade);
    const gradesAvg = gradesSum/grades.length;
    return gradesAvg.toFixed(2);
  }

  async getStudentClosureFromSubject(classId: string, period: number, student: IPerson, subject: ISubject) {
    const periodRef = this.afs.doc<IPeriod>(`classes/${classId}/periods/${period}`)
    .collection<ISubjectClosure>(
      `periodalSubjectClosures`, 
      ref => ref.where('userId', '==', student.userId)
    );
    const closures = await periodRef.valueChanges().pipe(take(1)).toPromise();
    for (const closure of closures) {
      if (closure.subject.subjectId === subject.subjectId) return closure.grade;
    }
    return 0;
  }

  getStudentMedian(classId: string, period: IPeriod, student: IPerson) {
    const periodRef = this.afs.doc<IPeriod>(`classes/${classId}/periods/${period.id}`)
    .collection<IClosure>(
      `periodalClosures`, 
      ref => ref.where('userId', '==', student.userId)
    );
    return periodRef.doc().valueChanges().pipe(take(1)).toPromise();
  }

  async addPeriodalClosures(
    student: IPerson,
    classId: string,
    currentPeriod: IPeriod,
    subjects: ISubjectsWithTeachers[]
  ) {
    const currentPeriodRef = this.afs.doc<IPeriod>(`classes/${classId}/periods/${currentPeriod.id}`)
    let subjectsWithClosures: ISubjectClosure[] = [];
    for (const subject of subjects) {
      const grade = await this.calculateClosureGrade(student,classId,subject);
      subjectsWithClosures.push({...student,subject: subject.subject, grade})
    }
    for (const subjectsWithClosure of subjectsWithClosures) {
      await currentPeriodRef.collection<ISubjectClosure>(`periodalSubjectClosures`).add(subjectsWithClosure);
    }
    const periodalClosuresDoc: IClosure = {
      ...student,
      medianGrade: +this.calculateMedianGrade(subjectsWithClosures),
    };
    await currentPeriodRef.collection<IClosure>(`periodalClosures`).add(periodalClosuresDoc)

    if (currentPeriod.lastPeriodOfYear) {
      let finalSubjectsWithClosures: ISubjectClosure[] = [];
      for (const subjectsWithClosure of subjectsWithClosures) {
        const firstPeriodId = +currentPeriod.id - 1;
        const firstPeriodClosure = await this.getStudentClosureFromSubject(classId, firstPeriodId, student, subjectsWithClosure.subject);
        console.log({subjectsWithClosure,firstPeriodClosure});
        finalSubjectsWithClosures.push({
          ...subjectsWithClosure,
          grade: (firstPeriodClosure + subjectsWithClosure.grade) / 2
        })
      }

      for (const finalSubjectsWithClosure of finalSubjectsWithClosures) {
        await currentPeriodRef.collection<ISubjectClosure>(`yearlySubjectClosures`).add(finalSubjectsWithClosure);
      }
      const yearlyClosuresDoc: IClosure = {
        ...student,
        medianGrade: +this.calculateMedianGrade(finalSubjectsWithClosures),
      };
      await currentPeriodRef.collection<IClosure>(`yearlyClosures`).add(yearlyClosuresDoc)
    }

    //OLD CODE
    // const periodalClosuresDoc: IClosure = {
    //   ...student,
    //   medianGrade: 0,
    // };
    // currentPromise = this.afs
    //   .collection<IClosure>(
    //     `classes/${classId}/periods/${currentPeriod.id}/periodalClosures`
    //   )
    //   .add(periodalClosuresDoc);
    // promises.push(currentPromise);
    
    // for (let subject of subjects) {
    //   const subjectClosureDoc: ISubjectClosure = {
    //     subject: subject.subject,
    //     grade: 0,
    //     ...student,
    //   };
    //   currentPromise = this.afs
    //     .collection<ISubjectClosure>(
    //       `classes/${classId}/periods/${currentPeriod.id}/periodalSubjectClosures`
    //     )
    //     .add(subjectClosureDoc);
    //   promises.push(currentPromise);
    //   if (currentPeriod.lastPeriodOfYear) {
    //     currentPromise = this.afs
    //       .collection<ISubjectClosure>(
    //         `classes/${classId}/periods/${currentPeriod.id}/yearlySubjectClosures`
    //       )
    //       .add(subjectClosureDoc);
    //     promises.push(currentPromise);
    //   }
    // }
    // if (currentPeriod.lastPeriodOfYear) {
    //   currentPromise = this.afs
    //     .collection<IClosure>(
    //       `classes/${classId}/periods/${currentPeriod.id}/yearlyClosures`
    //     )
    //     .add(periodalClosuresDoc);
    //   promises.push(currentPromise);
    // }
    // return promises;
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

  async addSubjectToClass(subject: ISubjectsWithTeachers, classDoc: IClass) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classDoc.classId}`).ref;
    const teacherDocRef = this.afs.collection<ISubjectsWithTeachers>(`users/${subject.teacher.userId}/classes`).ref;

    let newSubjects = classDoc.subjects;
    newSubjects.push(subject);
    currentPromise = updateDoc(classDocRef, { subjects: newSubjects })
    promises.push(currentPromise);

    currentPromise = teacherDocRef.doc(subject.subjectDocId).set(subject);
    promises.push(currentPromise);

    await Promise.all(promises);
  }

  async removeSubjectsFromClass(subjects: ISubjectsWithTeachers[], classId: string) {
    const promises: Promise<any>[] = [];
    for (const subject of subjects) {
      promises.push(...this.removeSubjectFromClass(subject, classId));
    }
    await Promise.all(promises);
  }

  removeSubjectFromClass(subject: ISubjectsWithTeachers, classId: string) {
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const classDocRef = this.afs.doc<IClass>(`classes/${classId}`).ref;
    const teacherCollRef = this.afs.collection<ISubjectsWithTeachers>(`users/${subject.teacher.userId}/classes`).ref;

    currentPromise = updateDoc(classDocRef, { subjects: arrayRemove(subject) });
    promises.push(currentPromise);

    currentPromise = teacherCollRef.doc(subject.subjectDocId).delete();
    promises.push(currentPromise);

    return promises;
  }

  getClassDoc$(classId: string) {
    const docRef = this.afs.doc<IClass>(`classes/${classId}`);
    return docRef.valueChanges().pipe(distinctUntilChanged());
  }

  async getClassDoc(classId: string) {
    return new Promise<IClass>(async (resolve, reject) => {
      const classDoc = await this.getClassDoc$(classId).pipe(take(1)).toPromise();
      if (classDoc) resolve(classDoc);
      else reject('No class doc!')
    })
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
    return this.afs.collection<ISubject>('subjects').valueChanges({ idField: 'subjectDocId' })
      .pipe(map(subjects => {
        let subjectsWithDocId: ISubject[] = [];
        subjects.forEach(subject => subjectsWithDocId.push({
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          subjectDocId: subject.subjectDocId
        }))
        return subjectsWithDocId;
      }
      ));
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

  async isPromoted(classId: string) {
    const classDoc = await this.getClassDoc(classId);
    return classDoc.promoted;
  }

  async promoteClass(classId: string, newClassDoc: IClass) {
    const isPromoted = await this.isPromoted(classId);
    if (isPromoted) return;
    const promises: Promise<any>[] = [];
    let currentPromise: Promise<any>;
    const currentPeriod = await this.getActivePeriod(classId);
    const currentClassDoc = await this.getClassDoc(classId);

    for (let student of newClassDoc.students) {
      await this.addPeriodalClosures(student, classId, currentPeriod, newClassDoc.subjects);
    }

    if (currentPeriod.id === '8') {
      await this.afs.doc<IClass>(`classes/${classId}`).update({promoted: true});
      return;
    }

    const newPeriodId = parseInt(currentPeriod.id) + 1;
    let newPeriodName = '';
    if (currentPeriod.lastPeriodOfYear) {
      const currentPeriodNumber = +currentPeriod.id;
      const yearsLeftToPromote = 4 - (currentPeriodNumber / 2);
      if (yearsLeftToPromote === 0) return;
      const newPeriodYear = currentClassDoc.promotionYear - yearsLeftToPromote;
      newPeriodName = newPeriodYear + '_' + (newPeriodYear + 1) + '_1'
    } else {
      newPeriodName = currentPeriod.name.replace(/\d$/, '2')
    }
    const newPeriod: IPeriod = {
      active: true,
      lastPeriodOfYear: newPeriodId % PERIOD_COUNT_IN_YEAR === 0,
      id: newPeriodId.toString(),
      endState: null,
      name: newPeriodName
    }

    currentPromise = this.afs.doc<IPeriod>(`classes/${classId}/periods/${currentPeriod.id}`).update({
      endState: currentClassDoc,
      active: false
    });
    promises.push(currentPromise);
    currentPromise = this.afs.doc<IPeriod>(`classes/${classId}/periods/${newPeriodId}`).set(newPeriod);
    promises.push(currentPromise);
    currentPromise = this.afs.doc<IClass>(`classes/${classId}`).set(newClassDoc);
    promises.push(currentPromise);
    await Promise.all(promises);
  }

  async addGrade(classId: string, studentId: string, subject: string, grade: number, type: GradeType, date: Timestamp) {
    if (grade > 10 || grade < 1 || grade % 1 !== 0) {
      //TO-DO error handling
      return;
    }
    const period = await this.getActivePeriod(classId);
    const newGrade: IGrade = {
      grade,
      date,
      type,
      subject,
      period: period.id,
      student: studentId
    }
    return this.afs.collection<IGrade>(`classes/${classId}/grades`).add(newGrade);
  }
  
  editGrade(grade: IGrade, gradeId: string, classId: string) {
    const gradeRef = this.afs.collection<IGrade>(`classes/${classId}/grades`).doc(gradeId).ref;
    return updateDoc(gradeRef,grade);
  }
  
  deleteGrade(gradeId: string, classId: string) {
    const gradeRef = this.afs.collection<IGrade>(`classes/${classId}/grades`).doc(gradeId).ref;
    return gradeRef.delete();
  }
  
  async addAbsence(classId: string, studentId: string, subject: string, date: Timestamp) {
    const period = await this.getActivePeriod(classId);
    const newAbsence: IAbsence = {
      date,
      subject,
      proven: false,
      period: period.id,
      student: studentId
    }
    this.afs.collection<IAbsence>(`classes/${classId}/absences`).add(newAbsence);
  }

  proveAbsence(absence: IAbsence, classId: string) {
    if(!absence.id) return
    return this.afs.doc<IAbsence>(`classes/${classId}/absences/${absence.id}`).update({
        proven: !absence.proven,
    });
}

  getGrades(classId: string, studentId: string, period: string, subject: string) {
    const queries = (ref: CollectionReference) => ref
      .where('subject', '==', subject)
      .where('period', '==', period)
      .where('student', '==', studentId)
    return this.afs.collection<IGrade>(`classes/${classId}/grades`, queries).valueChanges({ idField: 'id' });
  }

  getGradesForCurrentPeriod(classId: string, studentId: string, subject: string) {
    const currentPeriod$ = from(this.getActivePeriod(classId));
    return currentPeriod$.pipe(
      switchMap(period => this.getGrades(classId, studentId, period.id, subject))
    );
  }


  getAbsences(classId: string, studentId: string, period: string, subject: string) {
    const queries = (ref: CollectionReference) => ref
      .where('subject', '==', subject)
      .where('period', '==', period)
      .where('student', '==', studentId)
    return this.afs.collection<IAbsence>(`classes/${classId}/absences`, queries).valueChanges({ idField: 'id' });
  }

  getAbsencesForCurrentPeriod(classId: string, studentId: string, subject: string) {
    const currentPeriod$ = from(this.getActivePeriod(classId));
    return currentPeriod$.pipe(
      switchMap(period => this.getAbsences(classId, studentId, period.id, subject))
    );
  }

  getStudentSubjectDetailsForCurrentPeriod$(classId: string, subjectId: string, studentId: string): Observable<{ grades: IGrade[], absences: IAbsence[] }> {
    return combineLatest([
      this.getGradesForCurrentPeriod(classId, studentId, subjectId), 
      this.getAbsencesForCurrentPeriod(classId, studentId, subjectId)])
      .pipe(map(([grades, absences]) => {
        return { grades, absences }
      }))
  }
}
