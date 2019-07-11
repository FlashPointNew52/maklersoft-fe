/**
 * Created by Aleksandr on 23.01.17.
 */
import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {AsyncSubject} from "rxjs";
import {Account} from "../entity/account";


@Injectable()
export class AccountService {

    RS: String;


    constructor(private _configService: ConfigService, private _http: HttpClient) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/account/';
    };

    list() {
        console.log('account list');

        let _resourceUrl = this.RS + 'list';

        let ret_subj = <AsyncSubject<Account[]>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let accounts: Account[] = data.result;

                ret_subj.next(accounts);
                ret_subj.complete();
            },
            err => console.log(err)
        );

        return ret_subj;
    }

    save(account: Account) {
        console.log('account save');

        let _resourceUrl = this.RS + 'save';

        let data_str = JSON.stringify(account);

        let ret_subj = <AsyncSubject<Account>>new AsyncSubject();


        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let a: Account = data.result;

                ret_subj.next(a);
                ret_subj.complete();

            },
            err => console.log(err)
        );

        return ret_subj;
    }
}
