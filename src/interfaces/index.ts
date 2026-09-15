export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    isActive:true;
    role:"customer"|"admin"
}