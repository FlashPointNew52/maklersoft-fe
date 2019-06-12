import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {OrganisationService} from '../../service/organisation.service';
import {TaskService} from '../../service/task.service';
import {SessionService} from '../../service/session.service';

import {PhoneBlock} from '../../class/phoneBlock';
import {EmailBlock} from '../../class/emailBlock';
import {AddressBlock} from '../../class/addressBlock';
import {Person} from '../../entity/person';
import {Organisation} from '../../entity/organisation';
import {User} from '../../entity/user';
import {Task} from '../../class/task';
import {Utils} from '../../class/utils';

@Component({
    selector: 'digest-person',
    inputs: ['person', 'dateType', 'dataType'],
    styles: [`
        .billet {
            height: 45px;
            width: 100%;
            display: flex;
            font-size: 12px;
        }

        .billet > div{
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        ui-tag{
            width: 100%;
            height: 100%;
        }

        .name{
            font-weight: bold;
            color: #252F32;
        }

        .name > span{
            text-transform: uppercase;
        }

        .date{
            color: #252F32;
        }

        .rate{

        }

        .type{
            text-align: left;
        }

        .mail{
            text-align: left;
        }

        .user{
            color: #4B5456;
            text-align: left;
        }

        .phone{
            display: block;
            color:#252F32;
        }

        .city{
            font-size: 10px;
            height: 10px;
            line-height: 10px;
            color: #677578;
        }

        .organisation{

        }

    `],
    template: `
        <div class="billet">
            <div style= "width: 4px; margin-right: 11px;">
                <ui-tag [value]="person.tag"></ui-tag>
            </div>
            <div style= "width: 350px">
                <div class="date">{{dateType == 'addDate' ? "Добавлено: " : dateType == 'changeDate' ? "Изменено: " : "Назначено: "}}
                    {{ utils.getDateInCalendar(person[dateType] || person.changeDate || person.addDate) }}</div>
                <div class="name"><span>{{utils.getSurname(person.name) || "Неизвестно"}}</span> {{utils.getFirstName(person.name) }}</div>
                <div class="city">{{getAddress()}}</div>
            </div>
            <div style= "width: 35px; margin-right: 35px;">
                <span class="rate">{{person.rate  | number: '1.0-1' || '0'}}</span>
            </div>
            <div *ngIf="dataType == 'person'" style= "width: 90px; margin-right: 35px;">
              <span class="type">{{person.isMiddleman ? "Посредник" : "Принципал"}}</span>
            </div>
            <div style= "width: 118px; margin-right: 35px;">
              <span class="type">{{dataType == 'user' && person.accountId == _sessionService.getUser().accountId ? 'Наша компания' :
                (personTypeCode[person.typeCode] || 'Неизвестно')}}</span>
            </div>
            <div style= "width: 200px">
              <span class="type">{{personStateCode[person.stateCode] || 'Неизвестно'}}</span>
            </div>
            <div style= "width: 185px; margin-right: 15px;">
                    <span class="mail link">{{getMail(0) || ""}}</span>
                    <span class="mail link">{{getMail(1) || ""}}</span>
            </div>
            <div style= "width: 240px; margin-right: 15px;">
                <div *ngIf="person.agentId" class="user">
                    <span class="link" (click)="openUser()">{{person.agent?.name}}</span>
                </div>
                <div class="phones" *ngIf="!person.agentId" class="user">
                    <span class="phone">{{phones[0] ? (phones[0].phone | mask: "+0 "+phones[0].mask) : ""}}</span>
                    <span class="phone">{{phones[1] ? (phones[1].phone | mask: "+0 "+phones[1].mask) : ""}}</span>
                </div>
            </div>
            <div style="width: 255px;">
                <span class="organisation" [class.link] = "person.organisationId" (click)="openOrganisation()">{{person.organisation?.name || (person.isMiddleman ? 'Не известно' : " ")}}</span>
            </div>
        </div>
    `
})

export class DigestPersonComponent implements OnInit {
    public person: Person;
    public dateType: string = "addDate";
    public dataType: string = "local";
    organisation: Organisation = new Organisation();
    agent: User = new User();
    personStateCode ;//= Person.stateCodeOptionsHash;
    personTypeCode;// = Person.typeCodeOptionsHash;
    resultText: string;
    utils = Utils;
    task: Task;
    to: any;

    phones: any[] = [];

    constructor(private _hubService: HubService,
        private _userService: UserService,
        private _organisationService: OrganisationService,
        private _taskService: TaskService,
        private _sessionService: SessionService
    ) { }

    ngOnInit() {
        this.phones.push(this.getPhone(0));
        this.phones.push(this.getPhone(1));
        this.task = this._taskService.getRandomTask();
        this.resultText = this.getResultText();
    }

    getResultText() {
        return Task.getResultText(this.task);
    }

    getPhone(i){
      return PhoneBlock.get(this.person.phoneBlock, i);
    }

    getMail(i){
        let mails;
        if(this.person.agentId == this._sessionService.getUser().id || !this.person.agentId)
            mails =  EmailBlock.getAsArray(this.person.emailBlock);
        else
            mails =  EmailBlock.getAsArray(this.person.agent.emailBlock);
        return mails[i] || "";
    }

    openUser() {
        if(this.person.agent.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.person.agent});
        }
    }

    openOrganisation(){
        if(this.person.organisation.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('organisation', {organisation: this.person.organisation});
        }
    }

    getAddress(){
        return AddressBlock.getAsString(this.person.addressBlock);
    }
}
