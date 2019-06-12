import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from "../../service/user.service";
import {OfferService, OfferSource} from '../../service/offer.service';

import {Offer} from '../../entity/offer';
import {User} from "../../entity/user";
import {PhoneBlock} from "../../class/phoneBlock";



@Component({
    selector: 'digest-offer-table2',
    inputs: ['offer' , 'withPhoto'],
    styles: [`
        .billet {
            text-align: left;
            color: #696969;
            font-weight: 200;
            font-size: 14px;
            height: 80px;
            position: relative;
            margin: 5px 0;
            cursor: hand;
            background-color: white;
        }

        .billet:hover {
            background-color: #f5f3f3;
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
            font-size: 12px;
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
          font-size: 9px;
          color: #707070;
          width: 98%;
          height: 14px;
          text-align: end;
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
          height: 15px;
          font-size: 11px;
          color: #707070;
          float: left;
          margin-right: 5px;
        }

        .withPh{
            max-width: calc(100% - 90px) !important;
        }

        .menu{
            position: absolute;
            width: 20px;
            height: 12px;
            font-size: 20px;
            line-height: 2px;
            color: silver;
            top: 5;
            right: 5;
        }

        .menu:hover{
            color: #1061c4;
        }
    `],
    template: `
        <div class="billet" data-id="r{{offer._id}}" id="r{{offer.id}}">
            <div>
                <div class="describe" style=" margin-left: 10px;">
                    <span style="font-size: 12px;"
                        *ngIf ="offer.typeCode"
                    >{{ typeCodeOptions[offer.typeCode].split(" ")[0] }},
                        {{ offer.roomsCount  === undefined ? "" : offer.roomsCount + 'комн., ' }}
                        {{ offer.floor  === undefined ? "?" :  offer.floor}}/{{ offer.floorsCount  === undefined ? "?" : offer.floorsCount}}
                        {{ offer.squareTotal  === undefined ? "?" : offer.squareTotal }}/{{ offer.squareLiving  === undefined ? "?" : offer.squareLiving }}/{{ offer.squareKitchen  === undefined ? "?" : offer.squareKitchen }}
                    </span>
                    <br>
                    <div style="width: 100%; height: 17px; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;
                            float: left; line-height: 14px;" [class.withPh]= "withPhoto">
                            {{ offer.fullAddress.city === undefined ? " " : "" + offer.fullAddress.city }}
                            {{ offer.fullAddress.street === undefined ? "" : (", " + offer.fullAddress.street) }}
                            {{ offer.fullAddress.house === undefined ? "" : (", " + offer.fullAddress.house) }}
                    </div>
                    <span class="agent" [class.withPh]= "withPhoto">Задача: Непонятно какая задача и нужно наверное для нее отдельное поле</span>
                    <span class="agent" [class.withPh]= "withPhoto">Отв.: {{offer.agent?.name}}</span>
                    <div class="timestamp" *ngIf="offer.changeDate"> {{ (offer.changeDate | formatDate).toString().split(" ")[0] }} </div>
                    <div class="menu" (click)="tableContextMenu($event)">...</div>
                </div>
            </div>
        </div>
    `
})

export class DigestOfferTable2Component {

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

    constructor(private _hubService: HubService,
                private _offerService: OfferService,
                private _userService: UserService
    ) {

    };


    open() {
        var tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('offer', {offer: this.offer});
    }

    openUser(){
        if(this.offer.agent.id){
            var tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.offer.agent});
        }
    }

    tableContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        var c = this;
        var users: User[] = this._userService.listCached("", 0, "");
        var uOpt = [];
        uOpt.push(
            {class: "entry", disabled: false, label: "Не задано", callback: function() {
                c.offer.agentId = null;
                c._offerService.save(c.offer);
            }},
        )
        if (users)
        users.forEach(u => {
            uOpt.push(
                {class: "entry", disabled: false, label: u.name, callback: function() {
                    c.offer.agentId = u.id;
                    c._offerService.save(c.offer);
                }},
            )
        });

        var stateOpt = [];
        var states = [
            {value: 'raw', label: 'Не активен'},
            {value: 'active', label: 'Активен'},
            {value: 'work', label: 'В работе'},
            {value: 'suspended', label: 'Приостановлен'},
            {value: 'archive', label: 'Архив'}
        ];
        var stageOpt = [];
        var stages = [
            {value: 'contact', label: 'Первичный контакт'},
            {value: 'pre_deal', label: 'Заключение договора'},
            {value: 'show', label: 'Показ'},
            {value: 'prep_deal', label: 'Подготовка договора'},
            {value: 'decision', label: 'Принятие решения'},
            {value: 'negs', label: 'Переговоры'},
            {value: 'deal', label: 'Сделка'}
        ];
        states.forEach(s => {
            stateOpt.push(
                {class: "entry", disabled: false, label: s.label, callback: function() {
                    c.offer.stateCode = s.value;
                    c._offerService.save(c.offer);
                }}
            )
        });
        stages.forEach(s => {
            stageOpt.push(
                {class: "entry", disabled: false, label: s.label, callback: function() {
                        c.offer.stageCode = s.value;
                        c._offerService.save(c.offer);
                }}
            )
        });

        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: false, icon: "dcheck", label: 'Проверить', callback: () => {
                    var tab_sys = this._hubService.getProperty('tab_sys');
                    var rq = [];
                    rq.push(PhoneBlock.getAsString(this.offer.person.phoneBlock));
                    tab_sys.addTab('list_offer', {query: rq.join(" ")});
                }},
                {class: "entry", disabled: false, icon: "document", label: 'Открыть', callback: () => {
                    var tab_sys = this._hubService.getProperty('tab_sys');
                    tab_sys.addTab('offer', {offer: this.offer});
                }},
                {class: "entry", disabled: false, icon: "trash", label: 'Удалить', callback: () => {
                    this.offer.stageCode = 'archive';
                    c._offerService.save(this.offer);
                }},
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "edit", label: "Стадия", items: stageOpt},
                {class: "submenu", disabled: false, icon: "person", label: "Назначить", items: uOpt},
                {class: "submenu", disabled: true, icon: "task", label: "Задача", items: [
                    {class: "entry", disabled: false, label: "пункт x1", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "пункт x2", callback: function() {alert('yay s2!')}},
                ]},
                {class: "submenu", disabled: true, icon: "advert", label: "Реклама", items: [
                    {class: "entry", disabled: false, label: "пункт x1", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "пункт x2", callback: function() {alert('yay s2!')}},
                ]},
                {class: "delimiter"},
                {class: "tag", icon: "tag", label: "Теги:", items: [
                    {disabled: false, icon: '', callback: function() {}},
                    {disabled: false, icon: 'circle tag-red' , callback: function() {}},
                    {disabled: false, icon: 'circle tag-orange' , callback: function() {}},
                    {disabled: false, icon: 'circle tag-yellow' , callback: function() {}},
                    {disabled: false, icon: 'circle tag-green' , callback: function() {}},
                    {disabled: false, icon: 'circle tag-blue' , callback: function() {}},
                    {disabled: false, icon: 'circle tag-violet' ,callback: function() {}},
                    {disabled: false, icon: 'circle tag-gray' , callback: function() {}},

                ]}
            ]
        };
        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

}
