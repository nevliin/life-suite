import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {UserDetail} from '../user-detail';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

    userDetail: UserDetail | undefined;
    roles: string[] = [];

    constructor(
        private readonly userService: UserService
    ) {
    }

    async ngOnInit() {
        this.userDetail = await this.userService.getSelfDetails();
        this.roles = await this.userService.roleIdsToRoleNames(this.userDetail.roles);
    }

}
