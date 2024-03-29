import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {PersonService} from '../../service/person.service';

import {Request, ValueRange} from "../../entity/request";
import {Person} from '../../entity/person';
import {User} from "../../entity/user";
import {UserService} from "../../service/user.service";
import {Utils} from "../../class/utils";
import {Offer} from "../../entity/offer";
import {ObjectBlock} from "../../class/objectBlock";
import {SessionService} from "../../service/session.service";

@Component({
    selector: 'digest-request',
    inputs: ['request', 'active'],
    styles: [`
        .billet{
            overflow: hidden; 
            padding: 16px 20px 13px 20px;
            height: 100%;
            position: relative;
        }

        .billet:hover {
            background-color: var(--bottom-border);
            cursor: pointer;
        }

        span{
            line-height: 12px;
            height: 12px;
            display: block;
        }

        .main_row{
            display: flex;
            line-height: 12px;
            height: 12px;
            margin-bottom: 14px;
        }
        .main_row.active > span, .row.active > span{
            color: white !important;
        }
        .main_row > span:first-child{
            width: 115px;
            flex-grow: 1;
        }
        .main_row >span:last-child{
            text-align: end;
        }

        .main_row > span:nth-child(2){
            width: 100px;
        }

        .row{
            margin-bottom: 3px;
        }

        .row > span:first-child{
            width: 100px;
            float: left;
        }

        .bold{
            font-weight: bold;
            text-transform: uppercase;
        }

        ui-tag{
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }
        .row > .gray-font {
           color: #72727D;
        }

    `],
    template: `
        <div class="billet"
        >
            <ui-tag [value]="request?.tag"></ui-tag>
            <div class="main_row" [class.active]="active">
                <span>{{utils.getDateInCalendar(request?.addDate)}}</span>
<!--                <span>{{request?.person?.isMiddleman || request?.company?.isMiddleman ? 'Посредник' : 'Принципал'}}</span>-->
                <span class="link" (click)="openContact()">{{utils.trancateFio(request?.agent?.name || request?.person?.name || request?.company?.name) }}</span>
            </div>
            <div class="row bold" [class.active]="active">
                <span>Тип объекта</span>
                <span>
                    <ng-container *ngFor="let val of request?.typeCodes; let i = index">
                        {{offClass.typeCodeOptionsHash[val]}}{{i < request?.typeCodes?.length-1 ? ", " : ""}}
                    </ng-container>
                    <ng-container *ngIf="request?.newBuilding">(Новостройка)</ng-container>
                </span>
            </div>
            <div class="row" [class.active]="active">
                <span class="gray-font">Тип сделки</span>
                <span class="gray-font">{{reqClass.offerTypeCodeOptions[request?.offerTypeCode]?.label}}</span>
            </div>
            <div class="row" [class.active]="active">
                <span class="gray-font">Договор</span> 
                <span class="gray-font">{{block.getAsArray(request?.contractBlock)?.length > 0 ? 'Да' : 'Нет'}}</span>
            </div>
            <div class="row" [class.active]="active">
                <span class="title gray-font">Бюджет</span><span class="price">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}} Р.</span>
            </div>
        </div>


    `
})

export class DigestRequestComponent implements OnInit {
    public active: boolean;
    public request: Request;
    utils = Utils;
    offClass = Offer;
    reqClass = Request;
    valRange = ValueRange;
    block = ObjectBlock;
    person: Person = new Person();
    agent: User = new User();


    constructor(private _hubService: HubService, private _userService: UserService, private _personService: PersonService, private _sessionService: SessionService) { }

    ngOnInit() {

    }
    openContact(){

        let tab_sys = this._hubService.getProperty('tab_sys');
        if(this.request.agent)
            tab_sys.addTab('user', {user: this.request.agent});
        else if(this.request.person){
            let canEditable = this._sessionService.getUser().accountId == this.request.person.accountId;
            tab_sys.addTab('person', {person: this.request.person, canEditable});
        } else{
            let canEditable = this._sessionService.getUser().accountId == this.request.company.accountId;
            tab_sys.addTab('organisation', {organisation: this.request.company, canEditable});
        }
    }


}
