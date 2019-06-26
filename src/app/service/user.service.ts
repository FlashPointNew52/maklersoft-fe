import {Injectable} from '@angular/core';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {map} from 'rxjs/operators';
import {ConfigService} from './config.service';
import {SessionService} from "./session.service";
import {OrganisationService} from "./organisation.service";
import {User} from '../entity/user';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class UserService {

    RS: String = "";

    cache: any = {};

    public cacheOrgAndUser: any = [];
    public cacheUsers: any = [];
    public cacheOrgs: any = [];

    constructor(private _http: HttpClient, private _configService: ConfigService,
                private _sessionService: SessionService,
                private _organisationService: OrganisationService
    ) {
        this.RS = this._configService.getConfig().RESTServer + '/api/v1/user/';
    }

    cacheUserAndOrg(){
        this.cacheOrgAndUser = [];
        this.cacheUsers = [];
        this.cacheOrgs = [];
        this._organisationService.list(0, 100, "local", {"ourCompany":1},{"addDate":"DESC"}, "").subscribe(orgs => {
            //this.cache[data.id] = {org_name: data.name, items: []};
            for(let org of orgs){
                this.list(0, 100, {"organisationId": org.id},{"addDate":"DESC"}, null).subscribe(users =>{
                    let items = [];
                    for(let usr of users){
                        items.push({class: 'entry', value: usr.id, label: usr.name});
                    }
                    this.cacheOrgAndUser.push({class:'submenu', value: org.id, label: org.name, items: items});
                    this.cacheOrgs.push({class: 'entry', value: org.id, label: org.name});
                });
            }
        });

        this.list(0, 300, {"cashed": true},{"changeDate":"DESC"}, "").subscribe(users =>{
            for(let usr of users){
                this.cacheUsers.push({class:'entry', value: usr.id, label: usr.name});
            }
        });
    }

    listCached(role: string, superiorId: number, searchQuery: string) {
        return this.cache[role + superiorId + searchQuery];
    }

    list(page: number, per_page: number, filter: any, sort: any, searchQuery: string) {

        let query = [];
        query.push("page=" + page);
        query.push("per_page=" + per_page);
        if(searchQuery != null)
            query.push("searchQuery=" + searchQuery);
        query.push("filter=" + JSON.stringify(filter));
        query.push("sort=" + JSON.stringify(sort));

        let ret_subj = <AsyncSubject<User[]>>new AsyncSubject();
        let _resourceUrl = this.RS + 'list?' + query.join("&");


        this._http.get(_resourceUrl, {withCredentials: true}).pipe(
        map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let users: User[] = data.result;
                ret_subj.next(users);
                ret_subj.complete();
            },
            err => {
                this._sessionService.handle_errors(err);
            }
         );

        return ret_subj;
    }

    listX(accountId: number, role: string, superiorId: number, searchQuery: string) {

        let query = [];


        if (accountId) {
            query.push("accountId=" + accountId);
        }
        if (role) {
            query.push("role=" + role);
        }
        if (superiorId) {
            query.push("superiorId=" + superiorId.toString());
        }
        if (searchQuery) {
            query.push("searchQuery=" + searchQuery);
        }


        let _resourceUrl = this.RS + 'list?' + query.join("&");

        let ret_subj = <AsyncSubject<User[]>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
                raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let users: User[] = data.result;

                    ret_subj.next(users);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    get(userId: number) {

        let _resourceUrl = this.RS + 'get/' + userId;

        let ret_subj = <AsyncSubject<User>>new AsyncSubject();

        this._http.get(_resourceUrl, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
                raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let u: User = data.result;

                    ret_subj.next(u);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    save(user: User) {

        let _user: User = this._sessionService.getUser();
        user.accountId = _user.accountId;


        let _resourceUrl = this.RS + 'save';

        let ret_subj = <AsyncSubject<User>>new AsyncSubject();

        let data_str = JSON.stringify(user);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
                raw => {
                  let data = JSON.parse(JSON.stringify(raw));
                    let u: User = data.result;

                    // TODO: pass copy????
                    ret_subj.next(u);
                    ret_subj.complete();
                },
                err => {
                    this._sessionService.handle_errors(err);
                }
            );

        return ret_subj;
    }

    saveX(user: User) {

        let _resourceUrl = this.RS + 'save';

        let ret_subj = <AsyncSubject<User>>new AsyncSubject();

        let data_str = JSON.stringify(user);

        this._http.post(_resourceUrl, data_str, { withCredentials: true }).pipe(
            map((res: Response) => res)).subscribe(
            raw => {
              let data = JSON.parse(JSON.stringify(raw));
                let u: User = data.result;

                // TODO: pass copy????
                ret_subj.next(u);
                ret_subj.complete();
            },
            err => {
                this._sessionService.handle_errors(err);
            }
        );

        return ret_subj;
    }
}
