import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service'

import {Offer} from '../../entity/offer';



@Component({
    selector: 'digest-offer-line',
    inputs: ['offer', 'base'],
    styles: [`
        .line-tile{
            margin-bottom: 15px;
            height: 40px;
        }
        .date{
            width: calc(100% - 300px);
            float: left;
            font-size: 14px;
            color: #9e9e9e;
        }

        .date > span{
            color: #6f6c6c;
        }

        .agent{
            font-size: 13px;
            color: #6f6c6c;
            width: 300px;
            float: right;
        }

        .base{
            width: 140px;
            font-size: 14px;
            color: #5f5f5f;
            float: left;
            height: 20px;
        }

        .description{
            width: calc(100% - 300px);
            font-size: 14px;
            margin: 0 0 0 auto;
            color: #d0d0d0;
            text-align: right;
            float: right;
            cursor: hand;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .description:hover{
            text-decoration: underline;
        }


    `],
    template: `
        <div class="line-tile" data-id="r{{offer._id}}" id="r{{offer.id}}">
            <div style='width: 100%;height: 20px;'>
                <div class="date"> {{ ((offer.addDate * 1000) | date:'dd.MM.yy') + ' г. '}} <span>{{ (offer.addDate * 1000) | date :'hh:mm' }}</span></div>
                <div class="agent">Ответственный: {{offer.agent?.name}} </div>
            </div>
            <div style='width: 100%;height: 20px;'>
                <div class="base">{{base == 0 ? 'База компании' : 'Общая база'}}</div>
                <div class="base">{{' '}}</div>
                <div class="description" (click)="open()">
                            {{ typeCodeOptions[offer.typeCode].split(" ")[0] }}
                            {{ offer.fullAddress.city === undefined ? " " : " " + offer.fullAddress.city }}
                            {{ offer.fullAddress.street === undefined ? "" : offer.fullAddress.street }}
                            {{ offer.fullAddress.house === undefined ? "" : (", " + offer.fullAddress.house) }}
                            {{ offer.roomsCount  === undefined ? "" : ", "+ offer.roomsCount+"ком."}}
                            {{ offer.squareTotal  === undefined ? "" : ", "+ offer.squareTotal+"м." }}
                            {{ offer.floor  === undefined ? "" : ", "+ offer.floor+"/"}}
                            {{ offer.floorsCount  === undefined ? "" : ""+ offer.floorsCount}}{{' этаж'}}
                            {{ offer.ownerPrice }} тыс. руб.
                </div>
            </div>
        </div>
    `
})

export class DigestOfferLineComponent {

    public offer: Offer;
    public compact: boolean = false;

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

    compactHeight(){
        if(this.compact)
            return '68px';
        else return '85px';
    }

}
