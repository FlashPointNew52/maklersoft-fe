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
    inputs: ['organisation', 'dateType'],
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
    `],
    template: `
        <div class="billet">
            <div style= "width: 4px; margin-right: 11px;">
                <ui-tag [value]="organisation.tag"></ui-tag>
            </div>
            <div style= "width: 285px; min-width: 285px; margin-right: 35px;">
                <div class="date">{{dateType == 'addDate' ? "Добавлено: " : dateType == 'changeDate' ? "Изменено: " : "Назначено: "}}
                {{ utils.getDateInCalendar(organisation[dateType] || organisation.changeDate || organisation.addDate) }}</div>
                <div class="name">{{organisation.name || "Неизвестно"}}</div>
                <div class="city">{{getAddress()}}</div>
            </div>
            <div style= "width: 35px; margin-right: 35px;">
                <span class="rate">{{(organisation.rate || '0') | number: '1.0-1' }}</span>
            </div>
            <div style= "width: 90px; margin-right: 35px;">
              <span class="type">{{organisation.isMiddleman ? "Посредник" : "Принципал"}}</span>
            </div>
            <div style= "width: 140px; margin-right: 35px;">
              <span class="type">{{organisation.ourCompany && organisation.accountId == _sessionService.getUser().accountId ? "Наша компания" 
                  : (conClass.typeCodeOptions[organisation.typeCode]?.label || 'Неизвестно')}}</span>
            </div>
            <div style= "width: 116px; margin-right: 35px;">
              <span class="type">{{conClass.stageCodeOptions[organisation.stageCode]?.label || 'Неизвестно'}}</span>
            </div>
            <div style= "width: 180px;margin-right: 35px;">
                <span class="type">{{orgClass.goverTypeOptions[organisation.goverType]?.label || 'Неизвестно'}}</span>
            </div>
            <div style= "width: 185px; margin-right: 15px;">
                <span class="mail link">{{getSite(0) || ""}}</span>
                <span class="mail link">{{getSite(1) || ""}}</span>
            </div>
            <div style= "width: 250px;">
                <div *ngIf="organisation.contactId || organisation.agentId" class="user link" (click)="openUser()">
                      {{organisation.contact?.name || organisation.agent?.name}}
                </div>
                <div class="phones" *ngIf="!(organisation.contactId || organisation.agentId)" class="user">
                  <span class="phone">{{phones[0] ? (phones[0].phone | mask: "+0 "+phones[0].mask) : ""}}</span><br>
                  <span class="phone">{{phones[1] ? (phones[1].phone | mask: "+0 "+phones[1].mask) : ""}}</span>
                </div>
            </div>
        </div>
    `
})

export class DigestOrganisationComponent implements OnInit {
    public organisation: Organisation;
    public dateType: string = "addDate";

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
