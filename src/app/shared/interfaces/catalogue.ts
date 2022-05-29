import { Timestamp } from '@firebase/firestore-types';
import { IPerson } from './user';

export type GradeType = 'general' | 'periodal';
export interface IGrade {
    grade: number;
    date: Timestamp;
    type: GradeType;
    subject: string;
    student: string;
    period: string; 
}

export interface IAbsence {
    date: Timestamp;
    proven: boolean;
    subject: string;
    period: string;
    student: string;
}

export interface ISubject {
    subjectId: string;
    subjectName: string;
}
export interface IClassProfile {
    id: string;
    name: string;
}

export interface IPeriod {
    id: string;
    endState: IClass | null;
    active: boolean;
    name: string; // 2021-22 smester 1
    lastPeriodOfYear: boolean;
}

export interface ISubjectsWithTeachers {
    teacher: IPerson,
    subject: ISubject,
    classId: string;
    name: string;
}
export interface IClass {
    classId: string;
    name: string;
    students: Array<IPerson>;
    subjects: Array<ISubjectsWithTeachers>
    headMaster: IPerson;
    profile: IClassProfile;
    promotionYear: number;
}

export interface IClosure extends IPerson {
    medianGrade: number;
}

export interface ISubjectClosure extends IPerson {
    subject: ISubject;
    grade: number;
}

export const PERIOD_COUNT_IN_YEAR = 2;
