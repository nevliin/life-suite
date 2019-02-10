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
        const errorMessage = this.getMessageFromHTTPError(e);
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: (errorMessage.length > 30) ? 5000 : 3000,
            closable: true
        });
        throw e;
    }

    public getMessageFromHTTPError(e: any): string {
        return (e.status === 900) ? e.error.message : e.message;
    }
}
