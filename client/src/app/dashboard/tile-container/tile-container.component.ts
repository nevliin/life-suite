import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    OnInit,
    Type,
    ViewChild
} from '@angular/core';
import {TileDirective} from "./tile.directive";
import {OnTileLoadingDone} from "./on-tile-loading-done";

@Component({
    selector: 'tile-container',
    templateUrl: './tile-container.component.html',
    styleUrls: ['./tile-container.component.css']
})
export class TileContainerComponent implements OnInit {
    @Input() tile: Type<OnTileLoadingDone>;
    @ViewChild(TileDirective) adHost: TileDirective;

    loading: boolean = true;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    async ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tile);

        const componentRef: ComponentRef<OnTileLoadingDone> = this.adHost.viewContainerRef.createComponent(componentFactory);
        componentRef.instance.loadingDone.subscribe((loadingDone: boolean) => {
            if(loadingDone) {
                this.loading = false;
            }
        });
    }

}
