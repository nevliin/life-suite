import {Component, OnInit} from '@angular/core';
import {FinService} from '../fin.service';
import {ErrorHandlingService} from '../../core/error-handling/error-handling.service';
import {MatDialog} from '@angular/material';
import {FinTemplate} from '../fin-template';
import {FinTemplateEditComponent} from './fin-template-edit/fin-template-edit.component';

@Component({
    selector: 'app-fin-manage-templates',
    templateUrl: './fin-manage-templates.component.html',
    styleUrls: ['./fin-manage-templates.component.css']
})
export class FinManageTemplatesComponent implements OnInit {

    templates: FinTemplateDisplay[] = [];

    constructor(
        readonly finService: FinService,
        readonly errorHandlingService: ErrorHandlingService,
        private readonly dialog: MatDialog
    ) {
    }

    async ngOnInit() {
        await this.fetchTemplates();
    }

    async fetchTemplates() {
        const tempArray: FinTemplate[] = await this.finService.getTemplates();
        this.templates = await Promise.all(tempArray.map(async template => new FinTemplateDisplay(
            template,
            (await this.finService.getAccountById(template.account)).name,
            (await this.finService.getAccountById(template.contra_account)).name)
        ));

        this.templates
            .sort((a: FinTemplateDisplay, b: FinTemplateDisplay) => b.created_on.getTime() - a.created_on.getTime());
    }

    async deleteTemplate(id: number) {
        try {
            await this.finService.deleteTemplate(id);
            const index: number = this.templates.findIndex((value: FinTemplateDisplay) => value.id === id);
            if (index !== -1) {
                this.templates.splice(index, 1);
            }
        } catch (e) {
            this.errorHandlingService.handleHTTPError(e);
        }
    }

    async editTemplate(template: FinTemplate) {
        if (await this.dialog.open(FinTemplateEditComponent, {
            data: {template: template},
            panelClass: 'mat-card-dialog-container'
        }).afterClosed().toPromise()) {
            await this.fetchTemplates();
        }
    }

    async createTemplate() {
        if (await this.dialog.open(FinTemplateEditComponent, {
            panelClass: 'mat-card-dialog-container'
        }).afterClosed().toPromise()) {
            await this.fetchTemplates();
        }
    }

}

class FinTemplateDisplay extends FinTemplate {
    accountName: string;
    contraAccountName: string;

    constructor(template: FinTemplate, accountName: string, contraAccountName: string) {
        super();
        this.note = template.note;
        this.created_on = template.created_on;
        this.amount = template.amount;
        this.contra_account = template.contra_account;
        this.account = template.account;
        this.id = template.id;
        this.name = template.name;
        this.accountName = accountName;
        this.contraAccountName = contraAccountName;
    }
}
