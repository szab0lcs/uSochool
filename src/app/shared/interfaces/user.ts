export interface User {
    uid: string;
    email: string;
    displayName: string;
 }
export interface AllUserData {
    publicData: PublicData;
    privateData: PrivateData;
    roles: UserRole[];
}

export interface PrivateData {
    idNumber: string;
    birthday: string;
    address: string;
    phone: string;
}

export const INITIAL_PRIVATE_DATA_VALUE: PrivateData = {
    idNumber: '',
    birthday: '',
    address: '',
    phone: '',
}

export interface PublicData {
    userId: string;
    firstName: string;
    lastName: string;
    parentInitial?: string;
    email: string;
    active: boolean;
    promotionYear?: number;
    userImage?: string;
    teacher: boolean;
    headMaster?: string;
    classId?: string;
}
export interface UserRole {
    roleId: string;
    roleName: string;
}

export interface IPerson {
    userId: string;
    firstName: string;
    lastName: string;
    roles?: UserRole[];
    headMaster?: string;
}

export const INITIAL_PERSON_VALUE: IPerson = {
    userId: '',
    firstName: '',
    lastName: '',
}
