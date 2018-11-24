import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[tile-host]',
})
export class TileDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}