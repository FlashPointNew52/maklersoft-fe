import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PhoneBlock} from "../../class/phoneBlock";
import {HubService} from '../../service/hub.service'
import {SessionService} from '../../service/session.service'
import {Utils} from '../../class/utils';
import {Offer} from '../../entity/offer';
import {Person} from "../../entity/person";



@Component({
    selector: 'digest-offer',
    inputs: ['offer', 'dateType', 'active'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .billet {
            background-color: white;
            font-size: 12px;
            position: relative;
            padding: 16px 20px 13px 30px; 
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: start;
            height: 121px;
        }

        .billet:hover {
            background-color: var(--billet-hover);
            cursor: pointer;
        }

        .timestamp {
            flex-grow: 1;
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
            line-height: 13px;
            min-height: 13px;
        }
        .row1.active, .row2.active, .row3.active, .row4.active, .row5.active,.row1.active > .timestamp, .row1.active > a, .row1.active > span, .row5.active > .price > span:first-child{
            color: white !important;
        }
        .row2, .row3, .row4 {
            display: block;
        }

        .row1{
            color: #0E3E9B;
                padding-bottom: 10px;
                min-height: 25px;
        }

        .row1 > span{
            color: #0E3E9B;
            width: 114px;
            text-align: end;
        }

        .row1 > a{
            color: #0E3E9B;
            width: 114px;
            text-align: end;
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
                padding-bottom: 3px;
            min-height: 16px;
            text-transform: uppercase;
        }

        .row3{
           color:#72727D;
        }

        .row4{
            color:#72727D;
            padding-bottom: 8px;
            min-height: 21px;
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
                width: 100%;
                justify-content: flex-end;
        }

        .row5 > .price{
            font-size: 8px;
                padding-top: 3px;
        }

        .row5 > .price > span:first-child{
            font-size: 14px;
        }
      
    `],
    template: `
        <div class="billet" id="r{{offer.id}}">
            <ui-tag [value]="offer.tag"> </ui-tag>
            <div class="row1" [class.active]="active">
                <div class="timestamp" > {{ utils.getDateInCalendar(offer[dateType] || offer.changeDate || offer.addDate) }} </div>
                <a *ngIf="offer.agentId || offer.personId || offer.companyId" (click)="openContact()">
                    {{utils.trancateFio(offer.agent?.name || offer.person?.name || offer.company?.name) ||
                    ((pb.getNotNullData(offer.phoneBlock) | mask: '+0 (000) 000-00-00') || "") }}
                </a>

                <span *ngIf="!(offer.agentId || offer.personId || offer.companyId)">
                    {{ pb.getNotNullData(offer?.phoneBlock) || "" | mask: '+0 (000) 000-00-00'}}
                </span>

            </div>
            <div class="row2" [class.active]="active">
                    {{ (typeCodeOptionsHash[offer.typeCode] || "")
                    + (offer.roomsCount ? ", "+ offer.roomsCount+" комн." : "")
                    + (offer.floor  === undefined ? ", ?/" : ", "+ offer.floor+"/")
                    + (offer.floorsCount  === undefined ? "? эт., " : ""+ offer.floorsCount +" эт., ")
                    + (offer.squareTotal  === undefined ? "?/" : ""+ offer.squareTotal +"/")
                    + (offer.squareLiving  === undefined ? "?/" : ""+ offer.squareLiving +"/")
                    + (offer.squareKitchen  === undefined ? "?" : ""+ offer.squareKitchen) }}
            </div>
            <div class="row3" [class.active]="active">
                    {{ offer.addressBlock.street === undefined ? "" : offer.addressBlock.street }}
                    {{ offer.addressBlock.building === undefined ? "" : (" " + offer.addressBlock.building) }}
                    {{ offer.addressBlock.city === undefined ? " " : ", " + offer.addressBlock.city }}
            </div> 
            <div class="row4" [class.active]="active">
                    {{ offer.addressBlock.admArea === undefined ? "" : offer.addressBlock.admArea }}
                    {{ offer.addressBlock.area === undefined ? "" : ", " + offer.addressBlock.area }}
                    {{ offer.addressBlock?.busStop === undefined ? "" : ", " + offer.addressBlock.busStop }}
            </div>
            <div class="row5" *ngIf="offer.offerTypeCode == 'sale'" [class.active]="active">
                <div class="price" >
                    <span>{{utils.getNumWithDellimet((offer.ownerPrice || 0) * 1000)}} P</span>
                </div>
            </div>
            <div class="row5" *ngIf="offer.offerTypeCode == 'rent'" [class.active]="active">
                <div class="price">
                    <span>{{utils.getNumWithDellimet((offer.ownerPrice || 0) * 1000)}} P</span>
                </div>
            </div>
        </div>
    `
})

export class DigestOfferComponent implements OnInit{
    public active: boolean;
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

}
