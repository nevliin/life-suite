import {Component, OnInit, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.css']
})
export class DialogWrapperComponent implements OnInit {

  constructor(
      readonly viewContainterRef: ViewContainerRef
  ) { }

  ngOnInit() {
  }

}
