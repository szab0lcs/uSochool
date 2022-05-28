export interface User {
    uid: string;
    email: string;
    displayName: string;
 }
export interface AllUserData {
    userId: string;
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
    firstName: string;
    lastName: string;
    parentInitial?: string;
    email: string;
    active: boolean;
    promotionYear?: number;
    userImage?: string;
}
export interface UserRole {
    roleId: string;
    roleName: string;
}
