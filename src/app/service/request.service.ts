import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {GeoPoint} from "../class/geoPoint";
import {Request} from '../entity/request';
import {AsyncSubject} from "rxjs";
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {Offer} from "../entity/offer";
import {OfferSource} from './offer.service';
import {ListResult} from "../class/listResult";
import {map} from 'rxjs/operators';

@Injectable()
export class RequestService {

    RS: String = "";


    constructor(private _http: HttpClient, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/request/';
    };

    list(page: number, perPage: number, filter: any, sort: any, searchQuery: string, searchArea: GeoPoint[]) {
        console.log('request list');

        let query = [];

        query.push('page=' + page);
        query.push('per_page=' + perPage);
        query.push('search_query=' + searchQuery);
        query.push('filter=' + JSON.stringify(filter));
        if (sort) {
            query.push('sort=' + JSON.stringify(sort));
        }
        query.push('search_area=' + JSON.stringify(searchArea));
        let _resourceUrl = this.RS + 'list?' + query.join("&");

        let ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
                raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let requests: ListResult = new ListResult();
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

        let query = [];

        let user: User = this._sessionService.getUser();

        query.push('accountId=' + user.accountId);
        query.push('page=' + page);
        query.push('per_page=' + perPage);


        let _resourceUrl = this.RS + 'list_for_offer/' + offer.id + '?' + query.join("&");

        let ret_subj = <AsyncSubject<Request[]>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let requests: Request[] = data.result;

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

        let user: User = this._sessionService.getUser();
        request.accountId = user.accountId;

        let _resourceUrl = this.RS + 'save';

        delete request["selected"];
        let data_str = JSON.stringify(request);
        let ret_subj = <AsyncSubject<Request>>new AsyncSubject();

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let r: Request = data.result;

                ret_subj.next(r);
                ret_subj.complete();

            },
            err => {
                this._sessionService.handle_errors(err);
            }
        );
        return ret_subj;
    }

    delete(request: Request) {
        let ret_res = new AsyncSubject() as AsyncSubject<any>;

        this._http.get(this.RS + "delete/" + request.id, {withCredentials: true}).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
                let data = JSON.parse(JSON.stringify(raw));
                ret_res.next(data);
                ret_res.complete();
            },
            err => this._sessionService.handle_errors(err)
        );

        return ret_res;
    }
}
