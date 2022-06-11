import { Timestamp } from 'firebase/firestore';
import { IPerson } from './user';

export type GradeType = 'general' | 'periodal';
export interface IGrade {
    id?: string;
    grade: number;
    date: Timestamp;
    type: GradeType;
    subject: string;
    student: string;
    period: string; 
}

export const INITIAL_GRADE_VALUE: IGrade = {
    date: Timestamp.now(),
    grade: 10,
    type: 'general',
    subject: '',
    student: '',
    period: ''
}

export interface IAbsence {
    id?: string;
    date: Timestamp;
    proven: boolean;
    subject: string;
    period: string;
    student: string;
}

export interface ISubject {
    subjectId: string;
    subjectName: string;
    subjectDocId?: string;
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
    subjectDocId: string;
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

export type romanNumbers = 'IX' | 'X' | 'XI' | 'XII';
