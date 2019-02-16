import {Component, OnInit} from '@angular/core';
import {FinService} from '../../fin.service';
import {FinTemplate} from '../../fin-template';

@Component({
    selector: 'app-template-carousel',
    templateUrl: './template-carousel.component.html',
    styleUrls: ['./template-carousel.component.scss']
})
export class TemplateCarouselComponent implements OnInit {

    templates: FinTemplate[] = [];

    constructor(
        private readonly finService: FinService
    ) {
    }

    async ngOnInit() {
        this.templates = await this.finService.getTemplates({orderField: 'created_on', orderDirection: 'DESC', limit: 10});
    }

}
