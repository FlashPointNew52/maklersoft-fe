import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {SessionService} from '../../service/session.service';
import {Organisation} from '../../entity/organisation';
import {Utils} from '../../class/utils';
import {PhoneBlock} from '../../class/phoneBlock';
import {AddressBlock} from '../../class/addressBlock';
import {SiteBlock} from '../../class/siteBlock';
import {Contact} from "../../entity/contact";

@Component({
    selector: 'digest-organisation',
    inputs: ['organisation', 'dateType', "selected"],
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
            text-transform: uppercase;
            text-overflow: ellipsis;
            word-break: break-all;
            overflow: hidden;
            white-space: nowrap;
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
            text-overflow: ellipsis;
            word-break: break-all;
            overflow: hidden;
            white-space: nowrap;
        }

        .phone{
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
        .name.selected, .name.selected > span, .date.selected, .city.selected, .rate.selected, .type.selected, .link.selected, .user.selected, .phone.selected, .organisation.selected {
            color: white !important;
        }
    `],
    template: `
        <div style= "min-width: 4px; margin-right: 11px;    height: calc(100% + 6px);
    position: relative;
    top: -6px;">
            <ui-tag [value]="organisation.tag"></ui-tag>
        </div>
        <div class="billet">

            <div style= "width: 285px; min-width: 285px; margin-right: 35px;">
                <div class="date"  [class.selected]="selected">{{dateType == 'addDate' ? "Добавлено: " : dateType == 'changeDate' ? "Изменено: " : "Назначено: "}}
                {{ utils.getDateInCalendar(organisation[dateType] || organisation.changeDate || organisation.addDate) }}</div>
                <div class="name" [class.selected]="selected">{{organisation.name || "Неизвестно"}}</div>
                <div class="city" [class.selected]="selected">{{getAddress()}}</div>
            </div>
            <div style= "width: 35px; margin-right: 35px;">
                <span class="rate" [class.selected]="selected">{{(organisation.rate || '0') | number: '1.0-1' }}</span>
            </div>
            <div style= "width: 90px; margin-right: 35px;">
              <span class="type" [class.selected]="selected">{{organisation.isMiddleman ? "Посредник" : "Принципал"}}</span>
            </div>
            <div style= "width: 140px; margin-right: 35px;">
              <span class="type" [class.selected]="selected">{{organisation.ourCompany && organisation.accountId == _sessionService.getUser().accountId ? "Наша компания"
                  : (conClass.typeCodeOptions[organisation.typeCode]?.label || 'Неизвестно')}}</span>
            </div>
            <div style= "width: 116px; margin-right: 35px;">
              <span class="type" [class.selected]="selected">{{conClass.stageCodeOptions[organisation.stageCode]?.label || 'Неизвестно'}}</span>
            </div>
            <div style= "width: 180px;margin-right: 35px;">
                <span class="type" [class.selected]="selected">{{orgClass.goverTypeOptions[organisation.goverType]?.label || 'Неизвестно'}}</span>
            </div>
            <div style= "width: 185px; margin-right: 15px;">
                <span class="mail link" [class.selected]="selected">{{getSite(0) || ""}}</span>
                <span class="mail link" [class.selected]="selected">{{getSite(1) || ""}}</span>
            </div>
            <div style= "width: 250px;">
                <div *ngIf="organisation.contactId || organisation.agentId" class="user link"  [class.selected]="selected" (click)="openUser()">
                      {{organisation.contact?.name || organisation.agent?.name}}
                </div>
                <div class="phones" *ngIf="!(organisation.contactId || organisation.agentId)" class="user">
                  <span class="phone" [class.selected]="selected">{{phones[0] ? ("+7" + phones[0].phone | mask: "+0 (000) 000-00-00") : ""}}</span><br>
                  <span class="phone" [class.selected]="selected">{{phones[1] ? ("+7" + phones[1].phone | mask: "+0 (000) 000-00-00") : ""}}</span>
                </div>
            </div>
        </div>
    `
})

export class DigestOrganisationComponent implements OnInit {
    public organisation: Organisation;
    public dateType: string = "addDate";
    public selected: boolean;
    orgClass = Organisation;
    conClass = Contact;
    utils = Utils;
    phones: any[] = [];
    constructor(private _hubService: HubService,
                private _sessionService: SessionService
    ) {}

    ngOnInit() {
        this.phones.push(this.getPhone(0));
        this.phones.push(this.getPhone(1));
    }

    getPhone(i){
        return PhoneBlock.get(this.organisation.phoneBlock, i);
    }

    getSite(i){
        let sites =  SiteBlock.getAsArray(this.organisation.siteBlock);
        return sites[i] || "";
    }

    openUser() {
        if(this.organisation.contact.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('person', {user: this.organisation.contact});
        }
    }

    getAddress(){
        return AddressBlock.getAsString(this.organisation.addressBlock);
    }
}
