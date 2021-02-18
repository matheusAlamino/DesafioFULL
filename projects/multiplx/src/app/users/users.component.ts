import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

    user: User[] = []

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        //
    }

    loadUsers(): void {
        //
    }
}
