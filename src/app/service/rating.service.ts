import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {ConfigService} from './config.service';

import {Rating} from '../entity/rating';
import {AsyncSubject} from "rxjs/AsyncSubject";

import 'rxjs/add/operator/map';
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {Comment} from "../entity/comment";



@Injectable()
export class RatingService {
    RS: String = "";


    constructor(private _http: Http, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/rating/';
    }


      save(rating: Rating) {
        let ret_subj = <AsyncSubject<Rating>>new AsyncSubject();
        let _resourceUrl = this.RS + 'save';

        let data_str = JSON.stringify(rating);

        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
            data => {
                let p: Rating = data.result;

                ret_subj.next(p);
                ret_subj.complete();
            },
            err => console.log(err)
        );

        return ret_subj;
    }

    get(id: number, type: string) {
        let ret_subj = <AsyncSubject<Rating>>new AsyncSubject();
        let query = [];

        query.push("objType=" + type);
        query.push("objId=" + id);

        let _resourceUrl = this.RS + 'get?' + query.join("&");

        this._http.get(_resourceUrl, { withCredentials: true })
        .map(res => res.json()).subscribe(
          data => {

            let rating: Rating = data.result;
            ret_subj.next(rating);
            ret_subj.complete();

          },
          err => console.log(err)
        );

        return ret_subj;
    }
}
