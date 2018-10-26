export interface IUserDetailsModel {
    id: number;
    name: string;
    createdOn: Date;
    lastLogin: Date;
    roles: number[];
    power: number;
}