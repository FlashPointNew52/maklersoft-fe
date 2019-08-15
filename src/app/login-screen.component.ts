import {Component, OnInit} from "@angular/core";
import {ConfigService} from "./service/config.service";
import {SessionService} from "./service/session.service";
import {UserService} from "./service/user.service";
import {Observable} from "rxjs";
import {HubService} from "./service/hub.service";


@Component({
    selector: "login-screen",
    styles: [`
        :host {
            position: absolute;
            z-index: 9998;
        }

        .log_screen {
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            position: fixed;
            background-color: #f7f7f7;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .log_screen[hidden] {
            display: none;
        }

        .log_screen > .label {
            color: #252F32;
            font-size: 28px;
            position: absolute;
            top: 50px;
            left: 60px;
            font-family: SFNS;
            font-weight: bold;
        }

        .log_screen > hr {
            margin: 0;
            padding: 0;
            top: 100px;
            left: 60px;
            width: calc(100% - 120px);
            position: absolute;
            border-top: 1px solid #bdc0c1;
        }

        .main_form {
            width: 400px;
            max-height: 500px;
            min-height: 410px;
            background-color: #fff;
            border: 1px solid rgba(211, 213, 214, 1);
            border-radius: 0;
            box-shadow: 0 1px 50px 2px rgba(211, 213, 214, 0.6);
        }

        .motto {
            display: flex;
            flex-direction: column;
            width: 190px;
            height: 35px;
            margin: 28px 0 0 31px;
        }

        .motto span:first-child {
            color: #252F32;
            font-size: 12px;
        }

        .motto span:last-child {
            font-size: 10px;
            color: #677578;
            text-align: end;
            font-style: italic;
        }

        .motto span:last-child:before {
            content: "";
            border-bottom: 1px solid;
            width: 35px;
            display: inline-block;
            margin: 0 6px 2px 0;
        }

        .select_type {
            margin-top: 39px;
            text-align: center;
            color: #ced0d1;
            font-size: 16px;
        }

        .select_type span {
            cursor: pointer;
        }

        .select_type .selected, .select_type span:hover {
            color: #252F32;
        }

        .main_form .fields {
            width: 100%;
            padding: 20px 50px 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }

        .main_form .fields input {
            border: 1px solid #ced0d1;
            color: #252F32;
            font-size: 12px;
            height: 26px;
            padding-left: 17px;
            margin-bottom: 17px;
            width: 100%;
        }

        .main_form .fields > div {
            width: 100%;
            height: 30px;
            display: inline-flex;
        }

        .main_form .fields > span {
            width: 50%;
            height: 30px;
            line-height: 30px;
            color: #252F32;
            font-size: 10px;
            display: inline-flex;
            align-items: center;
            margin-bottom: 20px;
            justify-content: center;
        }

        .main_form .fields > span input {
            margin: 0 0 0 15px;
            width: 20px;
        }

        .main_form .fields > .link_button {
            margin-top: -10px;
            height: 16px;
            color: #677578;
            font-size: 12px;
            display: inline-flex;
            justify-content: flex-end;
            margin-bottom: 15px;
            cursor: pointer;
        }

        .main_form .fields > div input {
            margin: 0 30px 0 0;
            width: 15px;
            height: 15px;
            background-color: #fff;
            border-radius: 0;
            flex: 0 0 15px;
        }

        .main_form .fields > div span {
            color: #677578;
            font-size: 12px;
            line-height: 14px;
        }

        .main_form .fields > div div {
            color: #677578;
            font-size: 12px;
            line-height: 14px;
        }

        .main_form .fields .submit {
            width: 290px;
            height: 35px;
            margin: 22px auto 34px;
            background-color: #11131f;
            cursor: pointer;
            font-size: 12px;
            color: #fff;
        }

        .main_form .fields .submit:hover {
            background-color: #2b2d44;
        }

    `],
    template: `
        <div [hidden]="authorized | async" class="log_screen">
            <span class="label">maklersoft</span>
            <hr>
            <div class="main_form">
                <div class="motto">
                    <span>Одна страна - одна система</span>
                    <span>  Команда MaklerSoft</span>
                </div>
                <div class="select_type" *ngIf="typeWindow != 2">
                    <span (click)="typeWindow = 0" [class.selected]="typeWindow == 0">РЕГИСТРАЦИЯ</span>
                    |
                    <span (click)="typeWindow = 1" [class.selected]="typeWindow == 1">ВХОД В СИСТЕМУ</span></div>
                <div class="select_type" *ngIf="typeWindow == 2"><span class="selected">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</span>
                </div>
                <div class="fields" *ngIf="typeWindow == 0">
                    <input [(ngModel)]="org_name" placeholder="НАЗВАНИЕ ОРГАНИЗАЦИИ">
                    <input [(ngModel)]="user_name" placeholder="ФИО">
                    <input [(ngModel)]="phone" placeholder="ТЕЛЕФОН">
                    <input [(ngModel)]="mail" placeholder="E-MAIL">
                    <div>
                        <input [(ngModel)]="agreement" type="checkbox">
                        <span>Я согласен с условиями использования и политикой конфиденциальности</span>
                    </div>
                    <input class="submit" type="submit" value="ЗАРЕГИСТРИРОВАТЬСЯ" (click)="registr()">
                </div>
                <div class="fields" *ngIf="typeWindow == 1">
                    <input [(ngModel)]="phone" mask="+0 (000) 000-00-00" placeholder="НОМЕР ТЕЛЕФОНА">
                    <input [(ngModel)]="password" placeholder="ПАРОЛЬ">
                    <div class="link_button" (click)="typeWindow = 2">Забыли пароль?</div>
                    <input class="submit" type="submit" value="ВОЙТИ В СИСТЕМУ" (click)="_login()"
                           style="margin-top: 35px">
                </div>
                <div class="fields" *ngIf="typeWindow == 2">
                    <input [(ngModel)]="phone" mask="+0 (000) 000-00-00" [attr.placeholder]="'НОМЕР ТЕЛЕФОНА'"
                           [attr.disabled]="isFindPhone ? '' : null">
                    <input [(ngModel)]="temp_code" placeholder="КОД ВОССТАНОВЛЕНИЯ" *ngIf="isFindPhone">
                    <input [(ngModel)]="password" type="password" placeholder="НОВЫЙ ПАРОЛЬ" *ngIf="isFindPhone">
                    <input [(ngModel)]="confirm_password" type="password" placeholder="ПОДТВЕРДИТЬ ПАРОЛЬ"
                           *ngIf="isFindPhone">
                    <div class="link_button" (click)="cancel()">Отменить</div>
                    <input class="submit" type="submit" value="ПРОВЕРИТЬ" (click)="get_code()" *ngIf="!isFindPhone"
                           style="margin-top: 5px">
                    <input class="submit" type="submit" value="ИЗМЕНИТЬ ПАРОЛЬ" (click)="check_code()"
                           *ngIf="isFindPhone" style="margin-top: 5px">
                </div>
            </div>
            <hr style="bottom: 100px; top: auto;">
            <span class="footer_text"></span>
        </div>
    `
})

export class LoginScreenComponent implements OnInit {

    public authorized: Observable<boolean>;

    public password: string;
    public temp_code: string;
    public confirm_password: string;

    org_name: string = "";
    user_name: string = "";
    phone: string = "7";
    mail: string = "";
    agreement: boolean = false;
    isFindPhone: boolean = false;
    message: string = "";
    typeWindow: number = 1; //0 - регистрация, 1 - вход

    constructor(private _sessionService: SessionService,
                private _configService: ConfigService,
                private _userService: UserService,
                private _hubService: HubService
    ) {
        this.authorized = _sessionService.authorized;
        this.phone = "7";
        this.password = "";
    }


    ngOnInit() {
        let cuStr = localStorage.getItem("currentUser");
        if (cuStr) {
            let cu = JSON.parse(cuStr);
            this.phone = cu.phone;
        }
        this.checkSession();
    }

    _login() {
        localStorage.setItem("currentUser", JSON.stringify({phone: this.phone}));
        this._sessionService.login(this.phone, this.password).subscribe(result => {
            if (result == "OK")
                this._userService.cacheUserAndOrg();
        });
    }

    _logout() {
        this._sessionService.logout();
    }

    checkSession() {
        this._sessionService.check().subscribe(res => {
            if (res)
                this._userService.cacheUserAndOrg();
        });
    }

    get_code() {
        this._sessionService.get_code(this.phone).subscribe(result => {
            if (result == null) {
                this.isFindPhone = true;
                this.password = "";
            }
        });
    }

    cancel() {
        this.typeWindow = 1;
        this.isFindPhone = false;
    }

    check_code() {
        if (!this.temp_code || this.temp_code.length < 1) {
            this._hubService.getProperty("modal-window").showMessage("Не указан код восстановления", null);
            return;
        }
        if (!this.password || this.password.length < 6) {
            this._hubService.getProperty("modal-window").showMessage("Длина пароля должна быть не менее 6 символов", null);
            return;
        }
        if (this.password != this.confirm_password) {
            this._hubService.getProperty("modal-window").showMessage("Пароли не совпадают", null);
            return;
        }
        this._sessionService.check_code(this.phone, this.temp_code, this.password).subscribe(result => {
            if (result == null) {
                this._hubService.getProperty("modal-window").showMessage("Пароль успешно изменен", null);
                this.temp_code = "";
                this.confirm_password = "";
                this.typeWindow = 1;
                this.isFindPhone = false;
                this.password = "";
            }
        });

    }

    registr() {
        if (!this.org_name || !this.user_name || !this.mail || !this.phone || this.org_name.length < 1 || this.user_name.length < 1 ||
            this.mail.length < 5 || this.phone.length < 10) {
            this._hubService.getProperty("modal-window").showMessage("Не все поля заполнены", null);
            return;
        }

        if (this.user_name.split(" ").length < 3) {
            this._hubService.getProperty("modal-window").showMessage("Не указано Фамилия, Имя или Отчество", null);
            return;
        }

        if (!this.agreement) {
            this._hubService.getProperty("modal-window").showMessage("Необходимо принять соглашение", null);
            return;
        }
        this._sessionService.registrate(this.org_name, this.user_name, this.mail, this.phone).subscribe(res => {
            if (res == null) {
                this._hubService.getProperty("modal-window").showMessage("Регистрация прошла успешно! Для входа используйте пароль, отправленный Вам в SMS и на почтовый адрес.", null);
                this.typeWindow = 1;
            }
        });
    }
}
