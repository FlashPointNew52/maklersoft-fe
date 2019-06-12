import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {ConfigService} from './config.service';
import {GeoPoint} from "../class/geoPoint";
import {Request} from '../entity/request';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {Offer} from "../entity/offer";
import {OfferSource} from '../service/offer.service';
import {ListResult} from "../class/listResult";

@Injectable()
export class RequestService {

    RS: String = "";


    constructor(private _http: Http, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/request/';
    };

    list(page: number, perPage: number, source: OfferSource, filter: any, sort: any, searchQuery: string, searchArea: GeoPoint[]) {
        console.log('request list');

        var query = [];

        var user: User = this._sessionService.getUser();
        var source_str = 'local';
        if (source == OfferSource.IMPORT) {
            source_str = 'import';
        }

        query.push('accountId=' + user.accountId);
        query.push('userId=' + user.id);
        query.push('page=' + page);
        query.push('per_page=' + perPage);
        query.push('search_query=' + searchQuery);
        query.push('source=' + source_str);
        query.push('filter=' + JSON.stringify(filter));
        if (sort) {
            query.push('sort=' + JSON.stringify(sort));
        }
        query.push('search_area=' + JSON.stringify(searchArea));
        var _resourceUrl = this.RS + 'list?' + query.join("&");

        var ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {
                    var requests: ListResult = new ListResult();
                    requests.hitsCount = data.result.hitsCount;
                    requests.list = data.result.list;
                    ret_subj.next(requests);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );
        return ret_subj;
    }

    listForOffer(offer: Offer) {
        console.log('request list for offer');

        let page = 0;
        let perPage = 16;

        var query = [];

        var user: User = this._sessionService.getUser();

        query.push('accountId=' + user.accountId);
        query.push('page=' + page);
        query.push('per_page=' + perPage);


        var _resourceUrl = this.RS + 'list_for_offer/' + offer.id + '?' + query.join("&");

        var ret_subj = <AsyncSubject<Request[]>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {
                var requests: Request[] = data.result;

                ret_subj.next(requests);
                ret_subj.complete();
            },
            err => {
                this._sessionService.handle_errors(err);
            }
        );
        return ret_subj;
    }

    save(request: Request) {
        console.log('request save');

        var user: User = this._sessionService.getUser();
        request.accountId = user.accountId;

        var _resourceUrl = this.RS + 'save'

        delete request["selected"];
        var data_str = JSON.stringify(request);

        var ret_subj = <AsyncSubject<Request>>new AsyncSubject();

        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {

                var r: Request = data.result;

                // TODO: pass copy????
                ret_subj.next(r);
                ret_subj.complete();

            },
            err => {
                this._sessionService.handle_errors(err);
            }
        );

        return ret_subj;
    }
}
