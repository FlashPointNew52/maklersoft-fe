import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {ConfigService} from './config.service';

import {Offer} from '../entity/offer';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {GeoPoint} from "../class/geoPoint";
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {ListResult} from "../class/listResult";


export enum OfferSource {
    LOCAL = 1,
    IMPORT = 0,
}

@Injectable()
export class OfferService {

    RS: String = "";


    constructor(private _http: Http, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/offer/';
    }

    list(page: number, perPage: number, source: OfferSource, filter: any, sort: any, searchQuery: string, searchArea: GeoPoint[]) {
        let query = [];

        let user: User = this._sessionService.getUser();


        let source_str = 'local';
        if (source == OfferSource.IMPORT) {
            source_str = 'import';
        }

        query.push('accountId=' + user.accountId);
        query.push('page=' + page);
        query.push('per_page=' + perPage);
        query.push('source=' + source_str);
        query.push('filter=' + JSON.stringify(filter));
        if (sort) {
            query.push('sort=' + JSON.stringify(sort));
        }
        query.push('search_query=' + searchQuery);
        query.push('search_area=' + JSON.stringify(searchArea));

        let _resourceUrl = this.RS + 'list?' + query.join("&");

        let ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {
                    let obj: ListResult = new ListResult();
                    if(data.result){
                        obj.hitsCount = data.result.hitsCount;
                        obj.list = data.result.list;

                        ret_subj.next(obj);
                        ret_subj.complete();
                    }
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );
        return ret_subj;
    }

    save(offer: Offer) {

        let user: User = this._sessionService.getUser();
        offer.accountId = user.accountId;

        let _resourceUrl = this.RS + 'save';

        let data_str = JSON.stringify(offer, function(key, value) {
            if (typeof value === 'string' && value.length == 0) {
                return undefined;
            }
            return value;
        });

        let ret_subj = <AsyncSubject<Offer>>new AsyncSubject();


        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {

                    let o: Offer = data.result;

                    // TODO: pass copy????
                    ret_subj.next(o);
                    ret_subj.complete();

                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    delete(offer: Offer) {

        let user: User = this._sessionService.getUser();
        offer.accountId = user.accountId;

        let _resourceUrl = this.RS + 'delete/'+offer.id;

        let data_str = JSON.stringify({accountId: user.accountId, user: user.id});
        /*offer, function(key, value) {
            if (typeof value === 'string' && value.length == 0) {
                return undefined;
            }
            return value;
        });*/

        let ret_res = <AsyncSubject<String>>new AsyncSubject();


        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {
                    let o: String = data.result;
                    ret_res.next(o);
                    ret_res.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_res;
    }

    getSimilar(offer: Offer, page: number, perPage: number) {

        let query = [];

        let user: User = this._sessionService.getUser();


        let source_str = 'local';

        query.push('accountId=' + user.accountId);
        query.push('page=' + page);
        query.push('per_page=' + perPage);

        let _resourceUrl = this.RS + 'list_similar/' + offer.id + '?' + query.join("&");

        let ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {
                let obj: ListResult = new ListResult();

                obj.hitsCount = data.result.hitsCount;
                obj.list = data.result.list;

                ret_subj.next(obj);
                ret_subj.complete();
            },
            err => {
                this._sessionService.handle_errors(err);
            }
        );

        return ret_subj;
    }
}
