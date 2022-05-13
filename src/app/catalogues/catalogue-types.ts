export interface Subject {
    id: string,
    name: string
}

export interface Classes {
    id: string,
    name: string,
    subjects: Subject[]
}

export interface Student {
    id: string,
    name: string
}

export interface Grade {
    id: string,
    date: number | null,
    value: number | null
}

export const INITIAL_GRADE_VALUE: Grade = {
    id: '',
    date: null,
    value: null
}

export interface Absence {
    id: string,
    date: number | null,
    proven: boolean
}

export const INITIAL_ABSENCE_VALUE: Absence = {
    id: '',
    date: null,
    proven: false
}
