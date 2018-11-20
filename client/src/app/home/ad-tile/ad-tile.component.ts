import {Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, Type, ViewChild} from '@angular/core';
import {AdDirective} from "./ad.directive";

@Component({
  selector: 'ad-tile',
  templateUrl: './ad-tile.component.html',
  styleUrls: ['./ad-tile.component.css']
})
export class AdTileComponent implements OnInit {
    @Input() ad: Type<any>;
    @ViewChild(AdDirective) adHost: AdDirective;
    interval: any;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }


    loadComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.ad);

        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        viewContainerRef.createComponent(componentFactory);
    }

}
