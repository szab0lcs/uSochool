export interface User {
    uid: string;
    email: string;
    displayName: string;
 }
export interface AllUserData {
    userId: string;
    publicData: PublicData;
    privateData?: PrivateData;
    roles?: UserRole[];
}

export interface PrivateData {
    cnp: string;
    birthday: string;
    address: string;
    phone: string;
}
export interface PublicData {
    name: string;
    email: string;
    active: boolean;
    promotionYear?: number;
}
export interface UserRole {
    roleId: string;
    roleName: string;
}
