import {Injectable} from "@angular/core";
import {AsyncSubject, Observable, BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {map} from "rxjs/operators";
import {Account} from "../entity/account";
import {User} from "../entity/user";
import {HubService} from "./hub.service";


@Injectable()
export class SessionService {

    RS: string;

    authorized: Observable<boolean>;
    msg: Observable<string>;
    user: Observable<User>;
    account: Observable<Account>;

    _authorized: BehaviorSubject<boolean>;
    _msg: BehaviorSubject<string>;
    _user: BehaviorSubject<User>;

    private dataStore = {
        authorized: false,
        msg: "",
        user: null,
        account: null
    };

    constructor(private _configService: ConfigService,
                private _http: HttpClient,
                private _hubService: HubService
    ) {
        this.RS = this._configService.getConfig().RESTServer + "/session/";

        this.dataStore.authorized = false;
        this.dataStore.user = null;
        this.dataStore.account = null;

        this._authorized = new BehaviorSubject(false) as BehaviorSubject<boolean>;
        this.authorized = this._authorized.asObservable();

        this._msg = new BehaviorSubject("") as BehaviorSubject<string>;
        this.msg = this._msg.asObservable();

        this._user = new BehaviorSubject(null) as BehaviorSubject<User>;
        this.user = this._user.asObservable();

    }

    getUser() {
        return this.dataStore.user;
    }

    getAccount() {
        return this.dataStore.account;
    }

    login(phone: string, password: string) {
        let _endpointUrl = this.RS + "login";

        let data_str = JSON.stringify({
            phone,
            password
        });
        let ret_subj = new AsyncSubject() as AsyncSubject<string>;
        this._http.post(_endpointUrl, data_str, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(raw => {
            let data = JSON.parse(JSON.stringify(raw));
            if (data.result == "OK") {
                this.dataStore.authorized = true;
                this._authorized.next(this.dataStore.authorized);

                this.dataStore.msg = "logged in";
                ret_subj.next("OK");

                this.dataStore.user = data.user;
                this._user.next(this.dataStore.user);
            } else {
                this.dataStore.authorized = false;
                this._authorized.next(this.dataStore.authorized);

                this.dataStore.msg = data.msg;
                if (data.msg == "302:Wrong password")
                    this._hubService.getProperty("modal-window").showMessage("Не правильный пароль",  null);
                else if (data.msg == "301:User not found")
                    this._hubService.getProperty("modal-window").showMessage("Пользователь не найден",  null);
                else if (data.msg == "000:User is lock")
                    this._hubService.getProperty("modal-window").showMessage("Пользователь заблокирован, обратитесь к своему руководителю",  null);
                else this._hubService.getProperty("modal-window").showMessage("Ошибка. Обратитесь в службу поддержки MaklerSoft",  null);
            }
            ret_subj.complete();
        }, err => this.handle_errors(err));
        return ret_subj;
    }

    get_code(phone) {

        let _resourceUrl = this.RS + "check_phone";
        let ret_subj = new AsyncSubject() as AsyncSubject<boolean>;
        let data_str = JSON.stringify({
            phone
        });

        this._http.post(_resourceUrl, data_str, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(raw => {
            let data = JSON.parse(JSON.stringify(raw));
            if (data.result == "OK"){
                this._hubService.getProperty("modal-window").showMessage("На ваш номер телефон выслан код",  null);
                ret_subj.next(true);
            }else if (data.result == "FAIL" && data.msg == "301:User not found")
                this._hubService.getProperty("modal-window").showMessage("Пользователь с таким номером не найден",  null);
            else if (data.result == "FAIL" && data.msg == "000:Send sms error")
                this._hubService.getProperty("modal-window").showMessage("Ошибка при отправке sms. Повторите позднее",  null);
            else
                this._hubService.getProperty("modal-window").showMessage("Системная ошибка! Обратитесь в службу поддержки",  null);
            ret_subj.complete();
        }, err => this.handle_errors(err));

        return ret_subj;
    }

    check_code(phone, temp_code, password) {
        let _resourceUrl = this.RS + "change_pass";
        let ret_subj = new AsyncSubject() as AsyncSubject<boolean>;
        let data_str = JSON.stringify({
            phone,
            temp_code,
            password
        });

        this._http.post(_resourceUrl, data_str, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(raw => {
                let data = JSON.parse(JSON.stringify(raw));
                if (data.result == "OK"){
                    ret_subj.next(true);
                }else if (data.result == "FAIL" && data.msg == "301:User not found")
                    this._hubService.getProperty("modal-window").showMessage("Пользователь с таким телефоном не найлен",  null);
                else if (data.result == "FAIL" && data.msg == "000:Send sms error")
                    this._hubService.getProperty("modal-window").showMessage("Ошибка отправки SMS",  null);
                else if (data.result == "FAIL" && data.msg == "000:Temp code wrong")
                    this._hubService.getProperty("modal-window").showMessage("Неверный код восстановления",  null);
                else if (data.result == "FAIL" && data.msg == "000:Temp code not valid")
                    this._hubService.getProperty("modal-window").showMessage("У кода восстановления истекло время жизни. Вам отправлен новый код",  null);
                else if (data.result == "FAIL")
                    this._hubService.getProperty("modal-window").showMessage("Системная ошибка! Обратитесь в службу поддержки",  null);
                ret_subj.complete();
            }, err => this.handle_errors(err)
        );

        return ret_subj;
    }

    registrate(org_name, user_name, mail, phone) {
        let _resourceUrl = this.RS + "registrate";
        let ret_subj = new AsyncSubject() as AsyncSubject<boolean>;
        let data_str = JSON.stringify({
            org_name,
            user_name,
            mail,
            phone
        });

        this._http.post(_resourceUrl, data_str, {withCredentials: true}).pipe(map((res: Response) => res)).subscribe(
            raw => {
                let data = JSON.parse(JSON.stringify(raw));
                if (data.result == "OK"){
                    ret_subj.next(true);
                } else {
                    this.handle_errors(data.msg);
                }/*if (data.result == "FAIL" && data.msg == "001:Wrong format phone")
                    this._hubService.getProperty("modal-window").showMessage("Неверный формат телефона",  null);
                else if (data.result == "FAIL" && data.msg == "200:No phones or emails")
                    this._hubService.getProperty("modal-window").showMessage("Не указаны телефон или емайл",  null);
                else if (data.result == "FAIL" && data.msg == "300:User with such email or phone already exists")
                    this._hubService.getProperty("modal-window").showMessage("Пользователь с таким телефоном или адресом уже существует. Воспользуйтесь восстановленим пароля",  null);
                else
                    this._hubService.getProperty("modal-window").showMessage("Системная ошибка! Обратитесь в службу поддержки",  null);*/
                ret_subj.complete();
            },
            err => this.handle_errors(err)
        );

        return ret_subj;
    }

    logout() {
        let _endpointUrl = this.RS + "logout";

        this._http.post(_endpointUrl, "", {withCredentials: true}).pipe(
            map((res: Response) => res))
            .subscribe(
                () => {
                    this.dataStore.authorized = false;
                    this._authorized.next(this.dataStore.authorized);

                    this.dataStore.msg = "logged out";
                    this._msg.next(this.dataStore.msg);
                },
                err => this.handle_errors(err)
            );

    }

    check() {
        let ret_subj = new AsyncSubject() as AsyncSubject<boolean>;
        let _endpointUrl = this.RS + "check";

        this._http.get(_endpointUrl, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                let data = JSON.parse(JSON.stringify(raw));
                if (data.result == "OK") {
                    this.dataStore.authorized = true;
                    this._authorized.next(this.dataStore.authorized);

                    this.dataStore.msg = "logged in";
                    this._msg.next(this.dataStore.msg);

                    this.dataStore.user = data.user;
                    this._user.next(this.dataStore.user);
                    ret_subj.next(true);
                } else {
                    ret_subj.next(false);
                    this.dataStore.authorized = false;
                    this._authorized.next(this.dataStore.authorized);

                }
                ret_subj.complete();
            },
            err => console.log(err)
        );
        return ret_subj;
    }

    handle_errors(err) {
        let needSupport = false;
        let errMsg = "Ошибка " + err.status + ": " + err.statusText + "\n";
        if (err.status == 401 && err.statusText == "Unauthorized") {
            this.dataStore.authorized = false;
            this._authorized.next(this.dataStore.authorized);
            this.dataStore.msg = "logged out";
            errMsg = err.error;
        } else if(err.status == 0){
            errMsg = "Сервер временно не доступен, попробуйте позже";
        } else{
            try {
                let data = JSON.parse(err.error);
                errMsg += data.message;
                err.message = data.message;
                err.error = data.error;
                needSupport = data.type == 0;
            } catch (e) {
                if(typeof err.error == 'object'){
                    errMsg += err.error.message;
                    err.message = err.error.message;
                    err.error = err.error.error;
                    needSupport = err.error.type == 0;
                } else{
                    errMsg += err.error;
                    err.message = err.error;
                    err.error = "";
                    needSupport = true;
                }

            }
        }

        this._hubService.getProperty("modal-window").showMessage(errMsg, needSupport ? err : null);
    }

    sendMsg(err) {
        let data_str = JSON.stringify(err);

        let ret_subj = new AsyncSubject() as AsyncSubject<any>;

        this._http.post(this._configService.getConfig().RESTServer + "/service/v1/report/err", data_str, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                let data = JSON.parse(JSON.stringify(raw));
                ret_subj.next(data.result);
                ret_subj.complete();
            },
            error => {
                this.handle_errors(error);
            }
        );

        return ret_subj;
    }
}
