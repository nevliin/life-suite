import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Pipe, PipeTransform} from "@angular/core";

/**
 *
 */
@Pipe({name: 'abs'})
export class AbsPipe implements PipeTransform {
  /**
   *
   * @param value
   * @returns {number}
   */
  transform(value: number): number {
    return Math.abs(value);
  }
}


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AbsPipe
  ],
  exports: [
    AbsPipe
  ]
})
export class PipesModule { }
