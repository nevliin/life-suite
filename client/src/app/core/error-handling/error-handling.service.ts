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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (e.status === 900) ? e.error.message : e.message, life: 3000, closable: true});
    }
}
