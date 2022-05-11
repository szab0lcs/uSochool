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
    date: number,
    value: number
}
