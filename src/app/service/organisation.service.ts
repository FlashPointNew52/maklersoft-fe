import {Injectable} from '@angular/core';

import {AsyncSubject} from "rxjs";
import {map} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {SessionService} from "./session.service";
import {HttpClient} from '@angular/common/http';
import {User} from "../entity/user";
import {Organisation} from '../entity/organisation';
import {PhoneBlock} from "../class/phoneBlock";



@Injectable()
export class OrganisationService {

    RS: String = "";

    constructor(private _configService: ConfigService, private _http: HttpClient, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/organisation/';
    };


    list(page: number, per_page: number, source: string, filter: any, sort: any, searchQuery: string) {
        let ret_subj = <AsyncSubject<Organisation[]>>new AsyncSubject();

        let query = [];
        query.push("source=" + source);
        query.push("page=" + page);
        query.push("per_page=" + per_page);
        query.push("searchQuery=" + searchQuery);
        query.push("filter=" + JSON.stringify(filter));
        query.push("sort=" + JSON.stringify(sort));

        let _resourceUrl = this.RS + 'list?' + query.join("&");

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let organisations: Organisation[] = data.result;

                    ret_subj.next(organisations);
                    ret_subj.complete();

                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    get(organisationId: number) {
        console.log('org get');

        let _resourceUrl = this.RS + 'get/' + organisationId;

        let ret_subj = <AsyncSubject<Organisation>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let o: Organisation = data.result;

                    ret_subj.next(o);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }


    save(org: Organisation) {
        console.log('org save');

        let _user: User = this._sessionService.getUser();
        org.accountId = _user.accountId;

        let _resourceUrl = this.RS + 'save';

        let ret_subj = <AsyncSubject<Organisation>>new AsyncSubject();

        let data_str = JSON.stringify(org);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let o: Organisation = data.result;

                    ret_subj.next(o);
                    ret_subj.complete();

                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    findByPhone(phones: PhoneBlock) {
        let ret_subj = <AsyncSubject<Organisation>>new AsyncSubject();
        let _resourceUrl = this.RS + 'findByPhone';

        let data_str = JSON.stringify(phones);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
        map((res: Response) => res)).subscribe(
            raw => {
          let data = JSON.parse(JSON.stringify(raw));
            let p: Organisation = data.result;
            ret_subj.next(p);
            ret_subj.complete();
        }, err => {
            this._sessionService.handle_errors(err);
        });

        return ret_subj;
    }
}
