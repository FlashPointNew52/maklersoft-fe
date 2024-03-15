import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {ConfigService} from "./config.service";
import {HttpClient} from "@angular/common/http";
import {Offer} from "../entity/offer";
import {AsyncSubject} from "rxjs";
import {GeoPoint} from "../class/geoPoint";
import {User} from "../entity/user";
import {SessionService} from "./session.service";
import {ListResult} from "../class/listResult";


@Injectable()
export class SocialService {

    RS: String = "";


    constructor(private _http: HttpClient, private _configService: ConfigService, private _sessionService: SessionService) {
        this.RS = this._configService.getConfig().RESTServer + "/social/";
    }

    publish(photo, url, index) {
        const body = {url: url, photo: photo, index: index};
        let _resourceUrl =  this.RS + 'publish';

        let ret_subj = <AsyncSubject<any>>new AsyncSubject();

        this._http.post(_resourceUrl, JSON.stringify(body)).pipe(
            map((res: Response) => res)).subscribe(

            data => {
                ret_subj.next(data);
                ret_subj.complete();
            },
            err => console.log(err)
        );
        console.log(ret_subj);
        return ret_subj;
    }
}
