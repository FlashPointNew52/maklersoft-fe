import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service'

import {Offer} from '../../entity/offer';



@Component({
    selector: 'digest-offer-table',
    inputs: ['offer' , 'withPhoto'],
    styles: [`
        .billet {
            text-align: left;
            color: #696969;
            font-weight: 200;
            font-size: 14px;
            height: 50px;
            position: relative;
            margin: 3px 0;
            padding: 5px 0;
        }

        .billet.selected {
            background-color: #157ad3;
            color: #fff !important;
        }

        .billet > div {
            width: 100%;
        }

        .describe{
            color: black;
            font-size: 13px;
        }

        .healthbar {
            height: 1px;
            width: 95%;
            margin: 5px 0 0 5px;
            background: #ccc;
            position: relative;
        }

        .healthbar > .health {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0%;
            background-color: red;
        }

        .timestamp {
            position: absolute;
            top: 6px; right: 9px;
            font-size: 11px;
            color: #bbb;
        }

        .compact_owner {
            color: #bfbcbb !important;
        }

        .tag-mark {
            position: absolute;
            right: 10px;
            top: 40%;
        }

        .compact{
            height: 68px;
            background-color: inherit;
        }

        .agent{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            display: block;
            height: 17px;
            font-size: 9pt;
            color: #807982;
            float: left;
            margin-right: 5px;
        }

        .withPh{
            max-width: calc(100% - 90px) !important;
        }
    `],
    template: `
        <div class="billet" data-id="r{{offer.id}}" id="r{{offer.id}}">
            <div>
                <img *ngIf="withPhoto" src="{{ offer.photoUrl?offer.photoUrl[0]:'assets/no_photo.png' }}" style="height: 50px;width: 74px;float: left;margin: 0 8px;">
                <div class="describe" style=" margin-left: 10px;">
                    <span style="font-style: italic;  font-size: 9pt; color: #002E5D;"
                        *ngIf ="offer.typeCode"
                    >{{ typeCodeOptions[offer.typeCode].split(" ")[0] }}
                    </span>
                    {{ offer.fullAddress.city === undefined ? " " : ", " + offer.fullAddress.city }}<br>
                    <div style="width: 100%; height: 17px; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;
                            float: left; line-height: 17px;" [class.withPh]= "withPhoto">
                            {{ offer.fullAddress.street  === undefined ? "" : offer.fullAddress.street }}
                            {{ offer.fullAddress.house === undefined ? "" : (", " + offer.fullAddress.house) }}
                            {{ offer.squareTotal  === undefined ? "" : ", "+ offer.squareTotal+"м." }}
                            {{ offer.floor  === undefined ? "" : ", "+ offer.floor+"/"}}
                            {{ offer.floorsCount  === undefined ? "" : ""+ offer.floorsCount}}</div>

                    <div class="text-primary" style = "color: #8B0000; position: absolute; top: 5px;right: 0;">{{ offer.ownerPrice }}т.р.</div>
                    <span class="agent" [class.withPh]= "withPhoto">
                        Ответственный: {{offer.agent?.name}}
                    </span>
                </div>
            </div>
        </div>
    `
})

export class DigestOfferTableComponent {

    public offer: Offer;
    public withPhoto: boolean = false;

    private to: any;

    typeCodeOptions = {
        room: 'Комната',
        apartment: 'Квартира',
        apartment_small: 'Малосемейка',
        apartment_new: 'Новостройка',

        house: 'Дом',
        dacha: 'Дача',
        cottage: 'Коттедж',

        townhouse: 'Таунхаус',

        other: 'Другое',
        land: 'Земля',

        building: 'здание',
        office_place: 'офис',
        office: 'офис',
        market_place: 'торговая площадь',
        production_place: 'производственное помещение',
        gpurpose_place: 'помещение общего назначения',
        autoservice_place: 'автосервис',
        service_place: 'помещение под сферу услуг',
        warehouse_place: 'склад база',
        garage: 'гараж'

    };

    constructor(private _hubService: HubService) { };


    open() {
        var tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('offer', {offer: this.offer});
    }

}
