import {Injectable} from '@angular/core';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {Account} from "../entity/account";
import {User} from "../entity/user";
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SessionService {

    RS: String;

    authorized: Observable<boolean>;
    msg: Observable<string>;
    user: Observable<User>;
    account: Observable<Account>;

    _authorized: BehaviorSubject<boolean>;
    _msg: BehaviorSubject<string>;
    _user: BehaviorSubject<User>;
    _account: BehaviorSubject<Account>;

    private dataStore = {
        authorized: false,
        msg: "",
        user: null,
        account: null
    };

    constructor(private _configService: ConfigService, private _http: HttpClient
    ) {
        this.RS = this._configService.getConfig().RESTServer + '/session/';

        this.dataStore.authorized = false;
        this.dataStore.user = null;
        this.dataStore.account = null;

        this._authorized = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this.authorized = this._authorized.asObservable();

        this._msg = <BehaviorSubject<string>>new BehaviorSubject("");
        this.msg = this._msg.asObservable();

        this._user = <BehaviorSubject<User>>new BehaviorSubject(null);
        this.user = this._user.asObservable();

        this._account = <BehaviorSubject<Account>>new BehaviorSubject(null);
        this.account = this._account.asObservable();

    }

    getUser() {
        return this.dataStore.user;
    }

    isAuthorized() {
        this._authorized.next(this.dataStore.authorized);
        return this._authorized.asObservable();
    }

    getAccount() {
        return this.dataStore.account;
    }

    login(phone: string, password: string) {
        let _endpointUrl = this.RS + 'login';

        let data_str = JSON.stringify({
            phone: phone,
            password: password
        });
        let ret_subj = <AsyncSubject<string>>new AsyncSubject();
        this._http.post(_endpointUrl, data_str, { withCredentials: true }).pipe(
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
                if(data.msg == "302:Wrong password")
                    ret_subj.next("Не правильный пароль");
                else if(data.msg == "301:User not found")
                    ret_subj.next("Пользователь не найден");
                else if(data.msg == "000:User is lock")
                    ret_subj.next("Пользователь заблокирован, обратитесь к своему руководителю");
                else ret_subj.next("Ошибка. Обратитесь в службу поддержки MaklerSoft");
            }
            ret_subj.complete();
        }, err => {
            if(err.status == 500){
                ret_subj.next("Системная ошибка. Обратитесь в службу поддержки");
                ret_subj.complete();
            } else if(err.status == 504){
                ret_subj.next("Сервер временно не доступ, попробуйте повторить позже");
                ret_subj.complete();
            }
        });
        return ret_subj;
    }

    get_code(phone) {

      let _resourceUrl = this.RS + 'check_phone';

      let ret_subj = <AsyncSubject<string>>new AsyncSubject();

      let data_str = JSON.stringify({
          phone: phone
      });

      this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(raw => {
          let msg: string;
        let data = JSON.parse(JSON.stringify(raw));
          if(data.result == "OK")
              msg = null;
          else if(data.result == "FAIL" && data.msg == "301:User not found")
              msg = "Пользователь с таким номером не найден";
          else if(data.result == "FAIL" && data.msg == "000:Send sms error")
              msg = "Ошибка при отправке sms. Повторите позднее";
          else
              msg = "Системная ошибка! Обратитесь в службу поддержки";
          ret_subj.next(msg);
          ret_subj.complete();
      },err => {
          if(err.status == 500){
              ret_subj.next("Системная ошибка. Обратитесь в службу поддержки");
              ret_subj.complete();
          } else if(err.status == 504){
              ret_subj.next("Сервер временно не доступ, попробуйте повторить позже");
              ret_subj.complete();
          }
          console.log(err);
      });

      return ret_subj;
    }

    check_code(phone, temp_code, password) {
      let _resourceUrl = this.RS + 'change_pass';
      let ret_subj = <AsyncSubject<string>>new AsyncSubject();
      let data_str = JSON.stringify({
          phone: phone,
          temp_code: temp_code,
          password: password
      });

      this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
      map((res: Response) => res)).subscribe(raw => {
          let msg: string;
        let data = JSON.parse(JSON.stringify(raw));
          if(data.result == "OK")
                msg = null;
          else if(data.result == "FAIL" && data.msg == "301:User not found")
                msg = "Пользователь с таким телефоном не найлен";
          else if(data.result == "FAIL" && data.msg == "000:Send sms error")
                msg = "Ошибка отправки SMS";
          else if(data.result == "FAIL" && data.msg == "000:Temp code wrong")
                msg = "Неверный код восстановления";
          else if(data.result == "FAIL" && data.msg == "000:Temp code not valid" )
                msg = "У кода восстановления истекло время жизни. Вам отправлен новый код";
          else if(data.result == "FAIL")
                msg = "Системная ошибка! Обратитесь в службу поддержки";
              ret_subj.next(msg);
              ret_subj.complete();
       },err => {
            if(err.status == 500){
                ret_subj.next("Системная ошибка. Обратитесь в службу поддержки");
                ret_subj.complete();
            } else if(err.status == 504){
                ret_subj.next("Сервер временно не доступ, попробуйте повторить позже");
                ret_subj.complete();
            }
       });

        return ret_subj;
    }

    registrate(org_name, user_name, mail, phone) {
        let _resourceUrl = this.RS + 'registrate';
        let ret_subj = <AsyncSubject<string>>new AsyncSubject();
        let data_str = JSON.stringify({
            org_name: org_name,
            user_name: user_name,
            mail: mail,
            phone: phone
        });

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(map((res: Response) => res)).subscribe(
            raw => {
                let msg: string;
              let data = JSON.parse(JSON.stringify(raw));
                if(data.result == "OK")
                    msg = null;
                else if(data.result == "FAIL" && data.msg == "001:Wrong format phone")
                    msg = "Неверный формат телефона";
                else if(data.result == "FAIL" && data.msg == "200:No phones or emails")
                    msg = "Не указаны телефон или емайл";
                else if(data.result == "FAIL" && data.msg == "300:User with such email or phone already exists")
                    msg = "Пользователь с таким телефоном или адресом уже существует. Воспользуйтесь восстановленим пароля";
                else
                    msg = "Системная ошибка! Обратитесь в службу поддержки";
                ret_subj.next(msg);
                ret_subj.complete();
            },
            err => {
                if(err.status == 500){
                    ret_subj.next("Системная ошибка. Обратитесь в службу поддержки");
                    ret_subj.complete();
                } else if(err.status == 504){
                    ret_subj.next("Сервер временно не доступ, попробуйте повторить позже");
                    ret_subj.complete();
                }
            }
        );

        return ret_subj;
    }

    logout() {
        console.log('logout');

        let _endpointUrl = this.RS + 'logout';

        this._http.post(_endpointUrl, "", { withCredentials: true }).pipe(
            map((res: Response) => res))
            .subscribe(
              () => {
                    this.dataStore.authorized = false;
                    this._authorized.next(this.dataStore.authorized);

                    this.dataStore.msg = "logged out";
                    this._msg.next(this.dataStore.msg);
                }
            );

    }

    check() {
        let ret_subj = <AsyncSubject<boolean>>new AsyncSubject();
        let _endpointUrl = this.RS + 'check';

        this._http.get(_endpointUrl, { withCredentials: true }).pipe(
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

    handle_errors(err){
        if(err.status == 401 && err.statusText == "Unauthorized"){
            this.dataStore.authorized = false;
            this._authorized.next(this.dataStore.authorized);
            this.dataStore.msg = "logged out";
        }
    }
}
