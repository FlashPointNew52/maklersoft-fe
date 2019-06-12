import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {ConfigService} from './config.service';

import {Person} from '../entity/person';
import {AsyncSubject} from "rxjs/AsyncSubject";

import 'rxjs/add/operator/map';
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {PhoneBlock} from "../class/phoneBlock";



@Injectable()
export class PersonService {
    RS: String = "";

    constructor(private _http: Http, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/person/';
    }

    list(page: number, per_page: number, source: string, filter: any, sort: any, searchQuery: string) {

        let ret_subj = <AsyncSubject<Person[]>>new AsyncSubject();
        let query = [];
        query.push("source=" + source);
        query.push("page=" + page);
        query.push("per_page=" + per_page);
        if(searchQuery != null)
            query.push("searchQuery=" + searchQuery);
        query.push("filter=" + JSON.stringify(filter));
        query.push("sort=" + JSON.stringify(sort));

        let _resourceUrl = this.RS + 'list?' + query.join("&");

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {

                    let persons: Person[] = data.result;
                    ret_subj.next(persons);
                    ret_subj.complete();

                },
                err => {
                    this._sessionService.handle_errors(err);
                }
        );

        return ret_subj;
    }

    get(personId: number) {
        console.log('person get');

        let ret_subj = <AsyncSubject<Person>>new AsyncSubject();

        let _resourceUrl = this.RS + 'get/' + personId;
        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {

                    let notFound = true;

                    var p: Person = data.result;

                    // TODO: pass copy????
                    ret_subj.next(p);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
        );

        return ret_subj;
    }

    save(person: Person) {
        let ret_subj = <AsyncSubject<Person>>new AsyncSubject();
        let _resourceUrl = this.RS + 'save'

        delete person["selected"];
        let data_str = JSON.stringify(person);

        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {
                    let notFound = true;
                    let p: Person;
                    if(data.code){
                        p = data.obj;
                    } else
                        p = data.result;
                    // TODO: pass copy????
                    ret_subj.next(p);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
        );

        return ret_subj;
    }

    findByPhone(phones: PhoneBlock) {
        let ret_subj = <AsyncSubject<Person>>new AsyncSubject();
        let _resourceUrl = this.RS + 'findByPhone'

        let data_str = JSON.stringify(phones);

        this._http.post(_resourceUrl, data_str, { withCredentials: true })
        .map(res => res.json()).subscribe(data => {
            let notFound = true;
            let p: Person = data.result;
            // TODO: pass copy????
            ret_subj.next(p);
            ret_subj.complete();
        }, err => {
            this._sessionService.handle_errors(err);
        });

        return ret_subj;
    }
}
