import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {Rating} from '../entity/rating';
import {AsyncSubject} from "rxjs/AsyncSubject";

import 'rxjs/add/operator/map';

@Injectable()
export class RatingService {
    RS: String = "";


    constructor(private _http: HttpClient, private _configService: ConfigService) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/rating/';
    }


      save(rating: Rating) {
        let ret_subj = <AsyncSubject<Rating>>new AsyncSubject();
        let _resourceUrl = this.RS + 'save';

        let data_str = JSON.stringify(rating);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
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

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
        map((res: Response) => res)).subscribe(
          raw => {
            let data = JSON.parse(JSON.stringify(raw));
            let rating: Rating = data.result;
            ret_subj.next(rating);
            ret_subj.complete();

          },
          err => console.log(err)
        );

        return ret_subj;
    }
}
