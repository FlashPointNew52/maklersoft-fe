import {Injectable} from '@angular/core';
import {AsyncSubject} from "rxjs";
import {SessionService} from "./session.service";
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';

@Injectable()
export class UploadService {

    RS: string = "";

    constructor(private _configService: ConfigService,
                private _http: HttpClient,
                private _sessionService: SessionService
    ){
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/upload/';
    }

    uploadFiles(files: File[]){
        let ret_subj = new AsyncSubject() as AsyncSubject<any>;
        let formData = new FormData();
        let _resourceUrl = this.RS + 'file';
        for(let x = 0; x < files.length; x++) { 
            formData.append('files[]', files[x]);
        }

        this._http.post(_resourceUrl, formData, { withCredentials: true, reportProgress: true,  observe: 'events'}).pipe(
            map((res: any) => res)).subscribe(
            data => {
                    let res: any = {};
                    if(data.type == 1 && data.loaded && data.total){
                        ret_subj.next({progress: Math.floor(data.loaded / data.total*100)});
                    }
                    else if(data.body){
                        console.log(data.body.files);
                        ret_subj.next({files: data.body.files});
                        ret_subj.complete();
                    }
                //let data = JSON.parse(JSON.stringify(raw));
                //let url: string = data.result;


            },
            err => this._sessionService.handle_errors(err)
        );

        return ret_subj;
    }


    delete(fileName: string) {
        let ret_subj = <AsyncSubject<string>>new AsyncSubject();
        let _resourceUrl = this.RS + 'delete';
        let data_str = JSON.stringify({fileName: fileName});
        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
                raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let p: string = data.result;

                    ret_subj.next(p);
                    ret_subj.complete();
                },
                err => console.log(err)
        );


        return ret_subj;
    }

}
