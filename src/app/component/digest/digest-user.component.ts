import {Component, OnInit} from "@angular/core";

import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";

import {User} from "../../entity/user";
import {Utils} from "../../class/utils";
import {EmailBlock} from "../../class/emailBlock";
import {AddressBlock} from "../../class/addressBlock";
import {PhoneBlock} from "../../class/phoneBlock";

@Component({
    selector: "digest-user",
    inputs: ["user", "dateType", "selected"],
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
        }

        ui-tag {
            width: 100%;
            height: 100%;
        }

        .name {
            font-weight: bold;
            color: #252F32;
            line-height: 17px;
        }

        .name > span {
            text-transform: uppercase;
        }

        .date {
            color: #252F32;
            line-height: 16px;
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
        <div style="width: 4px; margin-right: 11px;    height: calc(100% + 6px);
    position: relative;
    top: -6px;">
            <ui-tag [value]="user.tag"></ui-tag>
        </div>
        <div class="billet">
            <!--            <div style= "width: 4px; margin-right: 11px;">-->
            <!--                <ui-tag [value]="user.tag"></ui-tag>-->
            <!--            </div>-->
            <div style="width: 300px">
                <div class="date"
                     [class.selected]="selected">{{dateType == 'addDate' ? "Добавлено: " : dateType == 'changeDate' ? "Изменено: " : "Назначено: "}}
                    {{ utils.getDateInCalendar(user[dateType] || user.changeDate || user.addDate) }}</div>
                <div class="name" [class.selected]="selected">
                    <span>{{utils.getSurname(user.name) || "Неизвестно"}}</span> {{utils.getFirstName(user.name) }}
                </div>
                <div class="city" [class.selected]="selected">{{getAddress()}}</div>
            </div>
            <div style="width: 35px; margin-right: 35px;">
                <span class="rate" [class.selected]="selected">{{user.rate | number: '1.0-1' || '0'}}</span>
            </div>
            <div style="width: 195px;  margin-right: 35px;">
                <span class="type" [class.selected]="selected">{{positionOptions[user.position] || 'Неизвестно'}}</span>
            </div>
            <div style="width: 185px; margin-right: 15px;">
                <span class="mail link" [class.selected]="selected">{{getMail(0) || ""}}</span>
                <span class="mail link" [class.selected]="selected">{{getMail(1) || ""}}</span>
            </div>
            <div style="width: 200px; margin-right: 15px;">
                <div class="phones" class="user">
                    <span class="phone"
                          [class.selected]="selected">{{phones[0] ? ("+7" + phones[0].phone | mask: "+0 (000) 000-00-00") : ""}}</span>
                    <span class="phone"
                          [class.selected]="selected">{{phones[1] ? ("+7" + phones[1].phone | mask: "+0 (000) 000-00-00") : ""}}</span>
                </div>
            </div>
            <div style="width: 255px;">
                <span class="organisation link" [class.selected]="selected"
                      (click)="openOrganisation()">{{user.organisation?.name || ' '}}</span>
            </div>
        </div>
    `
})

export class DigestUserComponent implements OnInit {
    public user: User;
    public dateType: string = "addDate";
    public selected: boolean;
    positionOptions = User.positionOptionsHash;
    utils = Utils;
    phones: any[] = [];

    constructor(private _hubService: HubService, private _userService: UserService) {
    }

    ngOnInit() {
        this.phones.push(this.getPhone(0));
        this.phones.push(this.getPhone(1));
    }

    getPhone(i) {
        return PhoneBlock.get(this.user.phoneBlock, i);
    }

    getMail(i) {
        let mails = EmailBlock.getAsArray(this.user.emailBlock);
        return mails[i] || "";
    }

    openOrganisation() {
        if (this.user.organisation.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("organisation", {organisation: this.user.organisation});
        }
    }

    getAddress() {
        return AddressBlock.getAsString(this.user.addressBlock);
    }
}
