import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {

    constructor(
        readonly messageService: MessageService
    ) {

    }

    public handleHTTPError(e: any) {
        this.messageService.clear();
        debugger;
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.getMessageFromHTTPError(e),
            life: 3000,
            closable: true
        });
    }

    public getMessageFromHTTPError(e: any): string {
        return (e.status === 900 || e.hasOwnProperty('error')) ? e.error.message : e.message;
    }
}
