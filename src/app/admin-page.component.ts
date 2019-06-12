import {Component, AfterViewInit, OnInit} from '@angular/core';
import {ConfigService} from "./service/config.service";
import {AccountService} from "./service/account.service";
import {UserService} from "./service/user.service";
import {Account} from "./entity/account";
import {User} from "./entity/user";

@Component({
    selector: 'admin-page',
    styles: [`
        .admin-page {
            position: absolute;
            top: 0px;
            left: 0px;

            width: 100%;
            height: 100%;

            background-color: #fff;

            padding: 15px;
        }

        .account-list {
            height: 50%;
            width: 50%;
            overflow-y: scroll;
            display: inline-block;
        }

        .account {
            cursor: pointer;
        }

        .account.selected {
            background-color: #bbbbbb;
        }

        .user {
            cursor: pointer;
        }

        .user.selected {
            background-color: #bbbbbb;
        }

        .user-list {
            height: 50%;
            width: 49.5%;
            overflow-y: scroll;
            display: inline-block;
        }

        .properties {
            height: 50%;
        }

        .account-properties {
            width: 49.5%;
            display: inline-block;
        }

        .user-properties {
            width: 49.5%;
            display: inline-block;
        }

        .header-1 {
            font-size: 19px;
            font-weight: 400;
        }

        .butt {
            border: 1px solid;
            display: table;
            margin: 15px;
            text-align: center;
            min-width: 20px;
            cursor: hand;
        }
    `],
    template: `
        <div class="admin-page">
            <div class="">
                <div class="account-list">
                    <div *ngFor="let acc of accounts" (click)="selectAccount(acc)">
                        <div class="account" [ngClass]="{selected: acc == selectedAcc}">
                            <span class="header-1"> Account {{acc.id}} </span> (<span> {{acc.name}}</span>, <span> {{acc.location}}</span>)<br>
                        </div>
                    </div>
                    <div class="butt" (click)="addAccount()">
                        +
                    </div>
                </div>
                <div class="user-list">
                    <div *ngFor="let user of users" (click)="selectUser(user)">
                        <div class="user" [ngClass]="{selected: user == selectedUser}">
                            <span class="header-1"> User {{user.id}} </span> (<span> {{user.login}}</span>, <span> {{user.position}}</span>)<br>
                        </div>
                    </div>
                    <div class="butt" (click)="addUser()">
                        +
                    </div>
                </div>
            </div>
            <div class="properties">
                <div class="account-properties">
                    <div>Имя: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedAcc.name"><br>
                    <div>Город: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedAcc.location">
                    <div class="butt" (click)="saveAccount()">СОХРАНИТЬ</div>
                </div>
                <div class="user-properties">
                    <div>Имя: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedUser.name">
                    <div>Роль: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedUser.position">
                    <div>Логин: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedUser.login">
                    <!--<div>Пароль: </div><input type="text" class="view-value edit-value" [(ngModel)]="selectedUser.password">-->
                    <div class="butt" (click)="saveUser()">СОХРАНИТЬ</div>
                </div>
            </div>
        </div>
    `
})

export class AdminPageComponent implements OnInit{


    accounts: Account[];
    selectedAcc: Account = new Account();

    users: User[];
    selectedUser: User = new User();

    constructor(private _configService: ConfigService, private _accountService: AccountService, private _userService: UserService) {
    }

    ngOnInit() {
        this.listAccounts();
    }

    selectAccount(acc: Account) {
        this.selectedAcc = acc;

        this.listUsers();
    }

    selectUser(user: User) {
        this.selectedUser = user;
    }

    listAccounts() {
        this._accountService.list().subscribe(accs => {
           this.accounts = accs;
        });
    }

    listUsers() {
        this._userService.listX(this.selectedAcc.id, null, null, null).subscribe(users => {
            this.users = users;
        });
    }

    addAccount() {
        let acc: Account = new Account();

        acc.name = "account_" + this.makeId();
        acc.location = "msk";

        this._accountService.save(acc);
        this.listAccounts();
    }

    addUser() {
        let usr: User = new User();

        usr.name = "НОВЫЙ ПОЛЬЗОВАТЕЛЬ";
        usr.position = "realtor";
        //usr.login = "user_" + this.makeId();
        // usr.password = "12345";
        usr.accountId = this.selectedAcc.id;

        this._userService.saveX(usr);

        this.listUsers();
    }

    saveAccount() {
        this._accountService.save(this.selectedAcc);
    }

    saveUser() {
        this._userService.saveX(this.selectedUser);
    }

    makeId()
    {
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(let i=0; i < 5; i++)
            id += possible.charAt(Math.floor(Math.random() * possible.length));

        return id;
    }
}
