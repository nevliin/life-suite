import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieService {

    constructor() {
    }

    /**
     * Read cookie with the given name and return its value
     * @param name
     */
    readCookie(name: string): string {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}
