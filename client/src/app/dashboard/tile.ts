import {Type} from "@angular/core";

export class Tile {
    title: string;
    link: string[];
    component: Type<any>;
    rowspan: number;
    permittedRoles?: string[];
    requiredPower?: number;
}
