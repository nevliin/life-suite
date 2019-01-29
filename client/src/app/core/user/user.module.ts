import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDetailsComponent} from './user-details/user-details.component';
import {MatComponentCollectorModule} from '../mat-component-collector.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        MatComponentCollectorModule,
        HttpClientModule
    ],
    declarations: [UserDetailsComponent],
    exports: [UserDetailsComponent]
})
export class UserModule {
}
