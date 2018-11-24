import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef,
    ViewRef
} from '@angular/core';
import {AdDirective} from "./ad.directive";
import {ITileComponent} from "./itile-component";

@Component({
    selector: 'ad-tile',
    templateUrl: './ad-tile.component.html',
    styleUrls: ['./ad-tile.component.css']
})
export class AdTileComponent implements OnInit {
    @Input() ad: Type<ITileComponent>;
    @ViewChild(AdDirective) adHost: AdDirective;

    private loading: boolean = true;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    async ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.ad);

        const componentRef: ComponentRef<ITileComponent> = this.adHost.viewContainerRef.createComponent(componentFactory);
        componentRef.instance.loadingDone.subscribe((loadingDone: boolean) => {
            if(loadingDone) {
                debugger;
                this.loading = false;
            }
        });
    }

}
