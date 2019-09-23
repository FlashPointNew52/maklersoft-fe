import {Component, OnInit} from "@angular/core";

import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";
import {OrganisationService} from "../../service/organisation.service";
import {SessionService} from "../../service/session.service";

import {PhoneBlock} from "../../class/phoneBlock";
import {EmailBlock} from "../../class/emailBlock";
import {AddressBlock} from "../../class/addressBlock";
import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {User} from "../../entity/user";
import {Utils} from "../../class/utils";
import {Contact} from "../../entity/contact";

@Component({
    selector: "digest-person",
    inputs: ["person", "dateType", "dataType", "selected"],
    styles: [`
        .billet {
            height: 45px;
            width: 100%;
            display: flex;
            font-size: 12px;
        }

        .billet > div {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        ui-tag {
            width: 100%;
            height: 100%;
        }

        .name {
            font-weight: bold;
            color: #252F32;
        }

        .name > span {
            text-transform: uppercase;
        }

        .date {
            color: #252F32;
        }

        .rate {

        }

        .type {
            text-align: left;
        }

        .mail {
            text-align: left;
        }

        .user {
            color: #4B5456;
            text-align: left;
        }

        .phone {
            display: block;
            color: #252F32;
        }

        .city {
            font-size: 10px;
            height: 10px;
            line-height: 10px;
            color: #677578;
        }

        .organisation {

        } 
        .name.selected, .name.selected > span, .date.selected, .city.selected, .rate.selected, .type.selected, .link.selected, .user.selected, .phone.selected, .organisation.selected {
            color: white !important;
        }
    `],
    template: `
        <div style="min-width: 4px; margin-right: 11px;    height: calc(100% + 6px);
    position: relative;
    top: -6px;">
            <ui-tag [value]="person.tag"></ui-tag>
        </div>
        <div class="billet">
            <div style="width: 350px">
                <div
                    class="date" [class.selected]="selected">{{dateType == 'addDate' ? "Добавлено: " : dateType == 'changeDate' ? "Изменено: " : "Назначено: "}}
                    {{ utils.getDateInCalendar(person[dateType] || person.changeDate || person.addDate) }}</div>
                <div class="name" [class.selected]="selected">
                    <span>{{utils.getSurname(person.name) || "Неизвестно"}}</span> {{utils.getFirstName(person.name) }}
                </div>
                <div class="city" [class.selected]="selected">{{getAddress()}}</div>
            </div>
            <div style="width: 35px; margin-right: 35px;">
                <span class="rate" [class.selected]="selected">{{(person?.rate || '0') | number: '1.0-1' }}</span>
            </div>
            <div *ngIf="dataType == 'person'" style="width: 90px; margin-right: 35px;">
                <span class="type" [class.selected]="selected">{{person.isMiddleman ? "Посредник" : "Принципал"}}</span>
            </div>
            <div style="width: 118px; margin-right: 35px;">
              <span
                  class="type" [class.selected]="selected">{{dataType == 'user' && person?.accountId == _sessionService.getUser().accountId ? 'Наша компания' :
                  (conClass.typeCodeOptions[person?.typeCode]?.label || 'Неизвестно')}}</span>
            </div>
            <div style="width: 200px">
                <span class="type" [class.selected]="selected">{{conClass.stageCodeOptions[person?.stageCode]?.label || 'Неизвестно'}}</span>
            </div>
            <div style="width: 185px; margin-right: 15px;">
                <span class="mail link" [class.selected]="selected">{{getMail(0) || ""}}</span>
                <span class="mail link" [class.selected]="selected">{{getMail(1) || ""}}</span>
            </div>
            <div style="width: 240px; margin-right: 15px;">
                <div *ngIf="person.agentId" class="user">
                    <span class="link" [class.selected]="selected" (click)="openUser()">{{person?.agent?.name}}</span>
                </div>
                <div class="phones" *ngIf="!person.agentId" class="user">
                    <span
                        class="phone" [class.selected]="selected">{{phones[0] ? ("+7" + phones[0].phone | mask: "+0 (000) 000-00-00") : ""}}</span>
                    <span
                        class="phone" [class.selected]="selected">{{phones[1] ? ("+7" + phones[1].phone | mask: "+0 (000) 000-00-00") : ""}}</span>
                </div>
            </div>
            <div style="width: 255px;">
                <span class="organisation" [class.link]="person.organisationId" [class.selected]="selected"
                      (click)="openOrganisation()">{{person.organisation?.name || (person.isMiddleman ? 'Не известно' : " ")}}</span>
            </div>
        </div>
    `
})

export class DigestPersonComponent implements OnInit {
    public person: Person;
    public selected: boolean;
    public dateType: string = "addDate";
    public dataType: string = "local";
    organisation: Organisation = new Organisation();
    agent: User = new User();
    conClass = Contact;
    utils = Utils;
    to: any;

    phones: any[] = [];

    constructor(private _hubService: HubService,
                private _userService: UserService,
                private _organisationService: OrganisationService,
                private _sessionService: SessionService
    ) {
    }

    ngOnInit() {
        this.phones.push(this.getPhone(0));
        this.phones.push(this.getPhone(1));
    }

    getPhone(i) {
        return PhoneBlock.get(this.person.phoneBlock, i);
    }

    getMail(i) {
        let mails = [];
        if (this.person.agentId == this._sessionService.getUser().id || !this.person.agentId)
            mails = EmailBlock.getAsArray(this.person.emailBlock);
        else if(this.person.agent && this.person.agent.emailBlock)
            mails = EmailBlock.getAsArray(this.person.agent.emailBlock);
        return mails[i] || "";
    }

    openUser() {
        if (this.person.agent.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("user", {user: this.person.agent});
        }
    }

    openOrganisation() {
        if (this.person.organisation.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("organisation", {organisation: this.person.organisation});
        }
    }

    getAddress() {
        return AddressBlock.getAsString(this.person.addressBlock);
    }
}
