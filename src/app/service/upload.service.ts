import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {SessionService} from "./session.service";
import {ConfigService} from './config.service';

import 'rxjs/add/operator/map';
import {Photo} from '../class/photo';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class UploadService {

    RS: String = "";

    constructor(private _configService: ConfigService,
        private _http: Http,
        private _sessionService: SessionService
    ) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/upload/';
    };

    uploadPhoto(postData: any, files: File[], type: string, id: number, name: string) {
        let headers = new Headers();
        var ret_subj = <AsyncSubject<string>>new AsyncSubject();
        let ext = name.split(".").pop();
        let name_obj = name.replace('.'+ext, "");
        name_obj = name_obj.replace(' ', "_");

        var _resourceUrl = this.RS + 'photo';
        var data_str = JSON.stringify({
            data: files[0],
            userId: this._sessionService.getUser().id,
            accountId: this._sessionService.getUser().accountId,
            objId: id,
            type: type,
            ext: ext,
            file_name: name_obj
        });

        /*this.http.withUploadProgressListener(progress =>
            { console.log(`Uploading ${progress.percentage}%`);
        }).post(_resourceUrl, data_str, {withCredentials: true})
            .map(res => {
                return res.json();
            })
            .subscribe(data => {
                var url: string = data.result;
                ret_subj.next(url);
                ret_subj.complete();
        });*/
        this._http.post(_resourceUrl, data_str, { withCredentials: true})
            .map(res => {
                return res.json();
            }).subscribe(
                data => {

                    var url: string = data.result;
                    ret_subj.next(url);
                    ret_subj.complete();

                },
                err => console.log(err)
        );

        return ret_subj;
    }

    uploadDoc(postData: any, files: File[], type: string, id: number, name: string) {
        let headers = new Headers();
        let ret_subj = <AsyncSubject<string>>new AsyncSubject();
        let _resourceUrl = this.RS + 'doc';
        let ext = name.split(".").pop();
        let name_obj = name.replace('.'+ext, "");
        name_obj = name_obj.replace(' ', "_");
        var data_str = JSON.stringify({
            data: files[0],
            userId: this._sessionService.getUser().id,
            accountId: this._sessionService.getUser().accountId,
            objId: id,
            ext: ext,
            type: type,
            file_name: name_obj
        });

        this._http.post(_resourceUrl, data_str, { withCredentials: true})
            .map(res => {
                return res.json();
            }).subscribe(
                data => {
                    var url: string = data.result;
                    ret_subj.next(url);
                    ret_subj.complete();
                },
                err => console.log(err)
        );
        return ret_subj;
    }

    delete(fileName: string) {
        var ret_subj = <AsyncSubject<string>>new AsyncSubject();
        var _resourceUrl = this.RS + 'delete'
        var data_str = JSON.stringify({fileName: fileName});
        this._http.post(_resourceUrl, data_str, { withCredentials: true })
            .map(res => res.json()).subscribe(
                data => {

                    let notFound = true;
                    var p: string = data.result;

                    // TODO: pass copy????
                    ret_subj.next(p);
                    ret_subj.complete();
                },
                err => console.log(err)
        );


        return ret_subj;
    }

}
