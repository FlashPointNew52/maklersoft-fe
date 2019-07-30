import {Injectable} from '@angular/core';
import {AsyncSubject} from "rxjs";
import {ListResult} from "../class/listResult";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {SessionService} from "./session.service";
import {Request} from "../entity/request";

@Injectable()
export class HubService {

    public shared_var = {};

    private stash = {
        some_prop: 'some_val',
        seenOffers: [],
        modifiedOffers: []
    };


    getProperty(name: string) {
        return this.stash[name];
    }

    setProperty(name: string, val: any) {
        this.stash[name] = val;
    }
}
