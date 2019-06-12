/**
 * Created by Aleksandr on 23.01.17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {ConfigService} from './config.service';

import {Offer} from '../entity/offer';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {GeoPoint} from "../class/geoPoint";
import {Account} from "../entity/account";


@Injectable()
export class AccountService {

    RS: String;


    constructor(private _configService: ConfigService, private _http: Http) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/account/';
    };

    list() {
        console.log('account list');

        var _resourceUrl = this.RS + 'list'

        var ret_subj = <AsyncSubject<Account[]>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {
                var accounts: Account[] = data.result;

                ret_subj.next(accounts);
                ret_subj.complete();
            },
            err => console.log(err)
        );

        return ret_subj;
    }

    save(account: Account) {
        console.log('account save');

        var _resourceUrl = this.RS + 'save';

        var data_str = JSON.stringify(account);

        var ret_subj = <AsyncSubject<Account>>new AsyncSubject();


        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {

                var a: Account = data.result;

                ret_subj.next(a);
                ret_subj.complete();

            },
            err => console.log(err)
        );

        return ret_subj;
    }
}
