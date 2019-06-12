import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PhoneBlock} from "../../class/phoneBlock";
import {HubService} from '../../service/hub.service'
import {SessionService} from '../../service/session.service'
import {Utils} from '../../class/utils';
import {Offer} from '../../entity/offer';
import {Person} from "../../entity/person";



@Component({
    selector: 'digest-offer',
    inputs: ['offer', 'dateType'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .billet {
            background-color: white;
            font-size: 12px;
            height: 130px;
            position: relative;
            padding: 18px 20px 15px 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: start;
            color: #252F32;
        }

        .billet:hover {
            background-color: #f6f6f6;
            cursor: pointer;
        }

        .timestamp {
            width: 90px;
            font-size: 12px;
            color: #677578;
            text-align: left;
            margin-right: 10px;
        }

        ui-tag {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 5px;
        }

        .row1, .row2, .row3, .row4, .row5{
            display: flex;
            font-size: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            height: 13px;
            line-height: 12px;
        }

        .row2, .row3, .row4 {
            display: block;
        }

        .row1{
            color: #0E3E9B;
            margin-bottom: 7px;
        }

        .row1 > span{
            color: #0E3E9B;
            width: 114px;
        }

        .row1 > a{
            color: #0E3E9B;
            width: 114px;
        }

        .row1 > span:not(:last-of-type),  .row1 > span:not(:last-of-type) + span{
            color: #252F32;
        }

        .row1 > .type{
            width: 95px;
            margin-right: 10px;
            text-align: center;
        }

        .row2{
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .row3{
            margin-bottom: 3px;
        }

        .row4{
            margin-bottom: 5px;
        }

        .row5{
            display: inline-flex;
            font-size: 10px;
            height: 25px;
            width: 100%;
            justify-content: space-between;
        }

        .row5 > div{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
        }

        .row5 > .price{
            font-size: 8px;
            margin-top: 4px;
        }

        .row5 > .price > span:first-child{
            font-size: 14px;
            font-weight: bold;
        }

        /*.row4 > a, .row5 > a{
            color: #5D75B3;
            cursor: pointer;
        }*/

    `],
    template: `
        <div class="billet" id="r{{offer.id}}">
            <ui-tag [value]="offer.tag"> </ui-tag>
            <div class="row1">
                <div class="timestamp"> {{ utils.getDateInCalendar(offer[dateType] || offer.changeDate || offer.addDate) }} </div>
                <span class="type">{{(offer.person?.isMiddleman || offer.company?.isMiddleman ||
                (!offer.person && !offer.company && offer.mediatorCompany)) ? 'Посредник' : 'Собственник'}}</span>
                <a *ngIf="offer.agentId || offer.personId || offer.companyId" (click)="openContact()">
                    {{offer.agent?.name || offer.person?.name || offer.company?.name ||
                    ((pb.getNotNullData(offer.phoneBlock) | mask: '+0 (000) 000-00-00') || "") }}
                </a>

                <span *ngIf="!(offer.agentId || offer.personId || offer.companyId)">
                    {{ pb.getNotNullData(offer?.phoneBlock) || "" | mask: '+0 (000) 000-00-00'}}
                </span>

            </div>
            <div class="row2" >
                    {{ (typeCodeOptionsHash[offer.typeCode] || "")
                    + (offer.roomsCount ? ", "+ offer.roomsCount+" комн." : "")
                    + (offer.floor  === undefined ? ", ?/" : ", "+ offer.floor+"/")
                    + (offer.floorsCount  === undefined ? "? эт., " : ""+ offer.floorsCount +" эт., ")
                    + (offer.squareTotal  === undefined ? "?/" : ""+ offer.squareTotal +"/")
                    + (offer.squareLiving  === undefined ? "?/" : ""+ offer.squareLiving +"/")
                    + (offer.squareKitchen  === undefined ? "?" : ""+ offer.squareKitchen) }}
            </div>
            <div class="row3">
                    {{ offer.addressBlock.street === undefined ? "" : offer.addressBlock.street }}
                    {{ offer.addressBlock.house === undefined ? "" : (" " + offer.addressBlock.house) }}
                    {{ offer.addressBlock.city === undefined ? " " : ", " + offer.addressBlock.city }}
            </div>
            <div class="row4">
                    {{ offer.addressBlock.admArea === undefined ? "" : offer.addressBlock.admArea }}
                    {{ offer.addressBlock.area === undefined ? "" : ", " + offer.addressBlock.area }}
                    {{ offer.addressBlock?.bus_stop === undefined ? "" : ", " + offer.addressBlock.bus_stop }}
            </div>
            <div class="row5" *ngIf="offer.offerTypeCode == 'sale'">
                <div>
                    <span>Ипотека</span>
                    <span>{{ offer.mortgages ? "ДА" : "НЕТ"}}</span>
                </div>
                <div>
                    <span>MLS</span>
                    <span>{{ (offer.mlsPrice || 0) + " руб "}}</span>
                </div>
                <div>
                    <span>Просмотры</span>
                    <span>{{"0"}}</span>
                </div>
                <div class="price">
                    <span>{{utils.getNumWithDellimet((offer.ownerPrice || 0) * 1000)}}</span>
                    <span>{{offer.ownerPrice > 999999 ? "ТЫСЯЧ РУБЛЕЙ" : "РУБЛЕЙ"}}</span>
                </div>
            </div>
            <div class="row5" *ngIf="offer.offerTypeCode == 'rent'">
                <div>
                    <span>Мебель</span>
                    <span>{{getFurniture()}}</span>
                </div>
                <div>
                    <span>Бытовая техника</span>
                    <span>{{getAppliances()}}</span>
                </div>
                <div>
                    <span>Депозит</span>
                    <span>{{offer.prepayment ? "ДА" : "НЕТ"}}</span>
                </div>
                <div class="price">
                    <span>{{utils.getNumWithDellimet((offer.ownerPrice || 0) * 1000)}}</span>
                    <span>{{offer.rentType == "short" ? "РУБЛЕЙ / СУТКИ" : "РУБЛЕЙ / МЕСЯЦ"}}</span>
                </div>
            </div>
        </div>
    `
})

export class DigestOfferComponent implements OnInit{

    public offer: Offer;
    public dateType: string = "addDate";

    private to: any;
    mediator: any;
    type: string = 'agent';
    contact: string = "";
    typeCodeOptionsHash = Offer.typeCodeOptionsHash;
    contactTypes = Person.middlemanOptions;
    utils = Utils;
    pb = PhoneBlock;
    constructor(private _hubService: HubService,
                private _sessionService: SessionService
    ) { }

    ngOnInit(){
        //this.getContact();
    }

    open() {
        let tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('offer', {offer: this.offer});
    }

    compactHeight(){
        /*if(this.compact)
            return '68px';
        else return '85px';*/
    }

    /*getMediator(ofr: Offer){
        let ret_val: any;
        if (ofr.person && ofr.person.organisation)
            ret_val = {type: "company", obj: ofr.person.organisation};
        else if (ofr.company)
            ret_val = {type: "company", obj: ofr.company};
        else if (ofr.media_info_saller)
            ret_val = {type: "none", obj: ofr.media_info_saller};
        else
            ret_val = {type: "none", obj: "Собственник"};
        this.mediator = ret_val.obj;
        return ret_val.type;
    }*/

    getContact(){
        if(this.offer.agentId) {
            this.offer.accountId == this._sessionService.getUser().accountId ? this.type = 'company' : this.type = 'user';
            this.contact = this.offer.agent.name;
        } else if(this.offer.personId){
            this.type = this.offer.person.typeCode;
            this.contact = this.offer.person.name;
        } else if(this.offer.companyId){
            this.type = this.offer.company.typeCode;
            this.contact = this.offer.company.name;
        } else if(this.offer.mediatorCompany) {
            this.type = 'agency';
            this.contact = this.offer.mediatorCompany;
        } else{
            this.type = 'owner_raw';
            this.contact = null; }
    }

    getPnone(ph_bl){
        return PhoneBlock.getNotNullData(ph_bl);
    }

    round(val: any){
        return Math.round(val);
    }

    openContact(){

        let tab_sys = this._hubService.getProperty('tab_sys');
        if(this.offer.agent)
            tab_sys.addTab('user', {user: this.offer.agent});
        else if(this.offer.person){
            let canEditable = this._sessionService.getUser().accountId == this.offer.person.accountId;
            tab_sys.addTab('person', {person: this.offer.person, canEditable: canEditable});
        } else{
            let canEditable = this._sessionService.getUser().accountId == this.offer.company.accountId;
            tab_sys.addTab('organisation', {organisation: this.offer.company, canEditable: canEditable});
        }
    }

    getDop(){
        let ret: string = "";

        if(this.offer.living_room_furniture) ret += "Гостинная мебель, ";
        if(this.offer.kitchen_furniture) ret += "Кухонная мебель, ";
        if(this.offer.couchette) ret += "Спальное место, ";
        if(this.offer.bedding) ret += "Постель, ";
        if(this.offer.dishes) ret += "Посуда, ";
        if(this.offer.refrigerator) ret += "Холодильник, ";
        if(this.offer.washer) ret += "Стиральная машина, ";
        if(this.offer.microwave_oven) ret += "СВЧ, ";
        if(this.offer.air_conditioning) ret += "СВЧ печь, ";
        if(this.offer.dishwasher) ret += "Посудомойка, ";
        if(this.offer.tv) ret += "ТВ, ";

        return ret;
    }

    getFurniture() {
        if(this.offer.complete || (this.offer.living_room_furniture && this.offer.kitchen_furniture
          && this.offer.couchette && this.offer.bedding))
            return "ПОЛНОСТЬЮ";
        else if(this.offer.living_room_furniture || this.offer.kitchen_furniture || this.offer.couchette || this.offer.bedding)
            return "ЧАСТИЧНО";
        else return "НЕТ";
    }

    getAppliances() {
      if(this.offer.refrigerator && this.offer.washer && this.offer.microwave_oven && this.offer.air_conditioning
          && this.offer.dishwasher && this.offer.tv)
          return "ПОЛНОСТЬЮ";
      else if(this.offer.refrigerator || this.offer.washer || this.offer.microwave_oven || this.offer.air_conditioning
          || this.offer.dishwasher || this.offer.tv)
          return "ЧАСТИЧНО";
      else
        return "НЕТ";
    }
}
