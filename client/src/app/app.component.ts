import {Component} from '@angular/core';
import localeDE from '@angular/common/locales/de'
import localeEN from '@angular/common/locales/en';
import {registerLocaleData} from "@angular/common";

registerLocaleData(localeDE);
registerLocaleData(localeEN);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


}
