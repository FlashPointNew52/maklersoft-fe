import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {Comment} from '../entity/comment';
import {AsyncSubject} from "rxjs/AsyncSubject";

import 'rxjs/add/operator/map';
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {ListResult} from "../class/listResult";



@Injectable()
export class CommentService {
    RS: String = "";


    constructor(private _http: HttpClient, private _configService: ConfigService, private _sessionService: SessionService) {
      this.RS = this._configService.getConfig().RESTServer + '/api/v1/comment/';
    };

    list(personId: number, type: string) {
        let ret_subj = <AsyncSubject<ListResult>>new AsyncSubject();
        let query = [];

        query.push("objId=" + personId.toString());
        query.push("type=" + type);

        let _resourceUrl = this.RS + 'list?' + query.join("&");

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
          map((res: Response) => res)).subscribe(
          raw => {
            let data = JSON.parse(JSON.stringify(raw));
            let obj: ListResult = new ListResult();
            if(data.result){
              obj.hitsCount = data.result.hitsCount;
              obj.list = data.result.list;

              ret_subj.next(obj);
              ret_subj.complete();
            }

          },
          err => console.log(err)
        );

        return ret_subj;
    }

    save(comment: Comment) {
        let user: User = this._sessionService.getUser();
        let ret_subj = <AsyncSubject<Comment>>new AsyncSubject();
        let _resourceUrl = this.RS + 'save';

        let data_str = JSON.stringify(comment);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let p: Comment = data.result;

                ret_subj.next(p);
                ret_subj.complete();
            },
            err => console.log(err)
        );


        return ret_subj;
    }

    delete(comment: Comment) {
        let user: User = this._sessionService.getUser();
        let ret_subj = <AsyncSubject<String>>new AsyncSubject();
        let _resourceUrl = this.RS + 'delete/' + comment.id;

        let data_str = JSON.stringify({accountId: user.accountId, user: user.id});

        console.log(data_str);
        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
              let p: String = data.result;

              ret_subj.next(p);
              ret_subj.complete();
            },
            err => console.log(err)
        );


      return ret_subj;
    }

    get(id: number) {
        let user: User = this._sessionService.getUser();
        let ret_subj = <AsyncSubject<Comment>>new AsyncSubject();
        let _resourceUrl = this.RS + 'get/' + id;

        let data_str = JSON.stringify({accountId: user.accountId, user: user.id});

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
        map((res: Response) => res)).subscribe(
          raw => {
            let data = JSON.parse(JSON.stringify(raw));
            let p: Comment = data.result;

            ret_subj.next(p);
            ret_subj.complete();
          },
          err => console.log(err)
        );


        return ret_subj;
    }

    estimate(comment: Comment, like) {
        let user: User = this._sessionService.getUser();
        let ret_subj = <AsyncSubject<boolean>>new AsyncSubject();
        let _resourceUrl = this.RS + 'estimate';
        let data_send = {
            estimate: like,
            user_id: user.id,
            comment_id: comment.id
        };
        let data_str = JSON.stringify(data_send);

        console.log(data_str);
        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
          map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
              let p: boolean = data.result;

              ret_subj.next(p);
              ret_subj.complete();
            },
            err => console.log(err)
        );
        return ret_subj;
    }
}
