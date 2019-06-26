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

@Component({
    selector: 'digest-request',
    inputs: ['request'],
    styles: [`
        .billet{
            overflow: hidden;
            padding: 20px;
            height: 100%;
            position: relative;
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
        
        .main_row > span:first-child{
            width: 115px;
        }

        .main_row > span:nth-child(2){
            width: 100px;
        }
        
        .row{
            margin-bottom: 5px;
        }

        .row > span:first-child{
            width: 100px;
            float: left;
        }
        
        .bold{
            font-weight: bold;
        }

        ui-tag{
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }
        
    `],
    template: `
        <div class="billet"
             (click)="select()"
             (dblclick)="open()"
             (touchstart)="tStart()"
             (touchend)="tEnd()"
        >
            <ui-tag [value]="request?.tag"></ui-tag>
            <div class="main_row">
                <span>{{utils.getDateInCalendar(request.addDate)}}</span>
                <span>{{request?.person?.isMiddleman || request?.company?.isMiddleman ? 'Посредник' : 'Принципал'}}</span>
                <span class="link">{{utils.trancateFio(request?.person?.name || request?.company?.name) }}</span>
            </div>
            <div class="row bold">
                <span>Тип объекта</span>
                <span>
                    <ng-container *ngFor="let val of request.typeCodes; let i = index">
                        {{offClass.typeCodeOptionsHash[val]}}{{i < request.typeCodes.length-1 ? ", " : ""}}
                    </ng-container>
                    <ng-container *ngIf="request.newBuilding">(Новостройка)</ng-container>
                </span>
            </div>
            <div class="row">
                <span>Тип сделки</span>
                <span>{{reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
            </div>
            <div class="row">
                <span>Договор</span>
                <span>{{block.getAsArray(request.contractBlock)?.length > 0 ? 'Да' : 'Нет'}}</span>
            </div>
            <div class="row">
                <span class="title">Бюджет</span><span class="value">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}} руб.</span>
            </div>
        </div>
        

    `
})

export class DigestRequestComponent implements OnInit {

    public request: Request;
    utils = Utils;
    offClass = Offer;
    reqClass = Request;
    valRange = ValueRange;
    block = ObjectBlock;
    person: Person = new Person();
    agent: User = new User();


    constructor(private _hubService: HubService, private _userService: UserService, private _personService: PersonService) { };

    ngOnInit() {

    }

    select() {
        //this.selected = !this.selected;
    }

    open() {
        /*this.selected = true;*/
        let tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('request', {request: this.request});
    }

    tStart() {

    }

    tEnd() {

    }

}
