import {
    Component,
    ElementRef, OnInit, OnChanges, SimpleChanges,ChangeDetectionStrategy
} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

import {HubService} from '../service/hub.service'
import {OfferService, OfferSource} from '../service/offer.service';
import {Offer} from '../entity/offer';

import * as moment from 'moment/moment';
import {UserService} from "../service/user.service";
import {SessionService} from "../service/session.service";
import {User} from "../entity/user";
import {Person} from "../entity/person";
import {PhoneBlock} from "../class/phoneBlock";


@Component({
    selector: 'offer-table',
    inputs: ['offers', 'source', 'canLoad', 'page'],
    styles: [`
        .offer-table-wrapper {
            padding-top: 115px;
            width: 100%;
        }

        .scroll-wrapper {
            overflow: auto;
            height: calc(100vh - 145px);
        }

        .table {
            width: 100%;
            font-size: 10pt;
            border-collapse: collapse;
        }

        .theader{
            width: 100%;
            height: 30px;
            display: inline-flex;
            font-size: 10pt;
            color: black;
            font-weight: 600;
            overflow-x: hidden;
        }

        .theader > div {
            flex-grow: 0;
            flex-shrink: 0;
            text-align: center;
        }

        digest-offer-row {
            display: block;
            width: max-content;
        }

        digest-offer-row:nth-child(odd) {
            background-color: rgb(249,249,249);
        }

        digest-offer-row.selected{
            background-color: rgb(224,224,224);
            color: rgb(155,160,151);
        }

        digest-offer-row:hover {
            background-color: #f5f3f3;
            cursor: hand;
        }

        .table > tbody > tr.selected > td {
            color: #fff;
            background-color: #3366cc !important;
        }

        .table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td {
            padding: 5px;
            font-weight: 200;
            text-align: left;
            vertical-align: middle;
            //border-top: 1px solid #ddd;
        }

        .table>thead>tr>th, .table>thead>tr>td {
            font-weight: 400;
            border-bottom: 1px solid #ddd;
            white-space: nowrap;

            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            cursor: pointer;
        }


        .seen > td {
            background-color: #f1f6f8 !important;
        }

        .modified > td {
            background-color: #f5f9ef !important;
        }

        .loader_back{
            position: absolute;
            top: 0;
            right: 0;
            z-index: 999;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .loading{
            height: 50px;
            width: 50px;
            background-image: url(http://modernbazaar.co.in/assets/images/icons/locate-loader.gif);
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }
    `],
    template: `
        <div class="offer-table-wrapper" (window:resize)="onResize($event)">
            <div class="theader" (contextmenu)="theaderContextMenu($event, false)">
                    <div *ngFor="let f of fields"
                        [hidden]="!f.visible"
                        [style.flex-basis]="f.width"
                        (click)="toggleSort(f)"
                    >
                        {{ f.label }}
                        <!--<span *ngIf="f.sort==0" class="icon-none"></span>-->
                        <span *ngIf="f.sort==1" class="icon-chevron-up"></span>
                        <span *ngIf="f.sort==2" class="icon-chevron-down"></span>
                    </div>
            </div>
            <div class="scroll-wrapper" [style.height]="contentHeight" (scroll)="scroll($event)" (contextmenu)="tableContextMenu($event)">

                        <digest-offer-row
                            *ngFor="let o of offers; let i = index;"
                            [offer] = "o"
                            [fields] = "fields"
                            [class.seen]="o.openDate > timestamp"
                            [class.modified]="o.changeDate > timestamp"
                            [class.selected]="selectedOffers.indexOf(o) > -1"
                            (mouseup)="click2($event, o, i)"
                            (contextmenu)="click($event, o)"
                            (dblclick)="dblClick(o)"
                            (mousemove) = "click1($event, o, i)"
                            (mousedown) = "click($event, o, i)"
                        >
                        </digest-offer-row>
            </div>
            <div *ngIf="canLoad == 1" class="loader_back"><div class="loading"></div></div>
        </div>
    `
})

export class OfferTableComponent implements OnInit, OnChanges {
    public offers: Offer[];
    public source: OfferSource;
    public canLoad: number;
    public page: number;
    selectedOffers: Offer[] = [];
    contentHeight: number = 600;
    to: any;
    lastClckIdx: number = 0;

    timestamp: number = (Date.now() / 1000) - 1000;


    @Output() onSort: EventEmitter<any> = new EventEmitter();
    @Output() onListEnd: EventEmitter<any> = new EventEmitter();
    @Output() onListStart: EventEmitter<any> = new EventEmitter();
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() clickMenu: EventEmitter<any> = new EventEmitter();

    stageCodeOptions = [
        {value: 'raw', label: 'Не активен'},
        {value: 'active', label: 'Активен'},
        {value: 'price', label: 'Прайс'},
        {value: 'deal', label: 'Сделка'},
        {value: 'suspended', label: 'Приостановлен'},
        {value: 'archive', label: 'Архив'}
    ];

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

    apSchemaOptions = {
        0: '-',
        1: 'Индивидуальная',
        2: 'Новая',
        3: 'Общежитие',
        4: 'Сталинка',
        5: 'Улучшенная',
        6: 'Хрущевка'
    };

    roomSchemeOptions = {
        0: '-',
        1: 'Икарус',
        2: 'Кухня-гостинная',
        3: 'Раздельные',
        4: 'Смежно-раздельные',
        5: 'Смежные',
        6: 'Студия'
    };

    houseTypeOptions = {
        0: '-',
        1: 'Кирпичный',
        2: 'Монолитный',
        3: 'Панельный',
        4: 'Деревянный',
        5: 'Брус',
        6: 'Каркасно-засыпной',
        7: 'Монолитно-кирпичный',
        8: 'Шлакобетон'

    };

    conditionOptions = {
        0: '-',
        1: 'социальный ремонт',
        2: 'сделан ремонт',
        3: 'дизайнерский ремонт',
        4: 'требуется ремонт',
        5: 'требуется косм. ремонт',
        6: 'после строителей',
        7: 'евроремонт',
        8: 'удовлетворительное',
        9: 'нормальное'
    };

    balconyOptions = {
        0: '-',
        1: 'без балкона',
        2: 'балкон',
        3: 'лоджия',
        4: '2 балкона',
        5: '2 лоджии',
        6: 'балкон и лоджия',
        7: 'балкон застеклен',
        8: 'лоджия застеклена'
    };

    bathroomOptions = {
        0: '-',
        1: 'без удобств',
        2: 'туалет',
        3: 'с удобствами',
        4: 'душ и туалет',
        5: '2 смежных санузла',
        6: '2 раздельных санузла',
        7: 'санузел совмещенный'
    };

    personType = {
        client: 'Клиент',
        realtor: 'Конкурент',
        company: 'Наша компания',
        partner: 'Партнер',
        owner: 'Собственник'
    }
    isDrag : boolean = false;

    private fields = [
        {
            id: 'stageCode', label: 'Стадия', visible: true, displayFor: OfferSource.LOCAL, width: "110px", sort: 0, val: (ofr: Offer) => {
            return ofr.stageCode;
        }
        },
        {
            id: 'photo', label: 'Фото', visible: true, displayFor: "", width: "35px", sort: -1, val: (ofr: Offer) => {
            //return ofr.main_photo_thumbnail;
            return '';
        }
        },
        {
            id: 'typeCode', label: 'Тип', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return this.typeCodeOptions[ofr.typeCode];
        }
        },
        {
            id: 'locality', label: 'Нас. пункт', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return ofr.addressBlock.city;
        }
        },
        {
            id: 'district', label: 'Район', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return ofr.district;
        }
        },
        {
            id: 'poi', label: 'Ориентир', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return ofr.poi;
        }
        },
        {
            id: 'address', label: 'Адрес', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return ofr.addressBlock.street;
        }
        },
        {
            id: 'roomsCount', label: 'Комнаты', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            var res = '';
            if (ofr.roomsOfferCount) {
                res = ''+ofr.roomsOfferCount;
            }
            if (ofr.roomsCount) {
                if (res != '') res += '/'
                res += ofr.roomsCount;
            }
            return res;
        }
        },
        {
            id: 'apScheme', label: 'Планировка', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return "";//this.apSchemaOptions[ofr.apSchemeId];
        }
        },
        {
            id: 'houseType', label: 'Материал', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return this.houseTypeOptions[ofr.houseType];
        }
        },
        {
            id: 'floor', label: 'Этаж', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            var res = '';
            if (ofr.floor) {
                res += ofr.floor;
            }
            if (ofr.floorsCount) {
                if (res) res += '/'
                res += ofr.floorsCount;
            }
            return res;
        }
        },
        {
            id: 'squareTotal', label: 'Площадь', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                return ofr.squareTotal;
            }
        },
        {
            id: 'ownerPrice', label: 'Цена', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                return ofr.ownerPrice;
            }
        },
        {
            id: 'priceSq', label: 'Цена м2', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.ownerPrice && ofr.squareTotal)
                    return (ofr.ownerPrice / ofr.squareTotal).toFixed(2);
                else return '';
            }
        },
        {
            id: 'mls', label: 'MLS', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                return '';
            }
        },
        {
            id: 'sourceMedia', label: 'Источник', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                return {media: ofr.sourceMedia, url: ofr.sourceUrl};
        }
        },
        {
            id: 'mediator', label: 'Предложение', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.person && ofr.person.organisation)
                    return {type: "company", obj: ofr.person.organisation};
                else if (ofr.company)
                    return {type: "company", obj: ofr.company};
                /*else if (ofr.media_info_saller)
                    return ofr.media_info_saller;*/
                else
                    return "Собственник";
            }
        },
        {
            id: 'personName', label: 'Контакт', visible: true, displayFor: "", sort: 0, width: "120px", val: (ofr: Offer) => {
                if (ofr.person)
                    return {type: "person", obj: ofr.person};
                else if(ofr.company)
                    return  {type: "array", obj: PhoneBlock.getAsArray(ofr.company.phoneBlock)};
                /*else if(ofr.phones_import && ofr.phones_import.length > 0)
                    return {type: "array", obj: PhoneBlock.formatNumberArray(ofr.phones_import)};
                */else return {type: "array", obj: []};
            }
        },
        {
            id: 'personType', label: 'Тип контакта', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.person) return this.personType[ofr.person.typeCode];
                else return '';
            }
        },
        {
            id: 'agentName', label: 'Ответственный', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.agent) return ofr.agent;
                else return '';
            }
        },
        {
            id: 'manager', label: 'Менеджер', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return '~';
        }
        },

        {
            id: 'reqests', label: 'Заявки', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return '10';
        }
        },
        {
            id: 'click_count', label: 'Кол-во кликов', visible: false, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            return '100';
        }
        },
        {
            id: 'progress', label: 'Прогресс', visible: false, displayFor: OfferSource.LOCAL, width: "110px", sort: 0, val: (ofr: Offer) => {
            return '50%';
        }
        },

        {
            id: 'addDate', label: 'Добавлено', visible: true, displayFor: "", width: "110px", sort: 0, val: (ofr: Offer) => {
            if (ofr.addDate) return moment(ofr.addDate * 1000).format('DD.MM.YY HH:mm');
            return "";
        }
        },
        {
            id: 'assignDate', label: 'Назначено', visible: false, displayFor: OfferSource.LOCAL, width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.assignDate) return moment(ofr.assignDate * 1000).format('DD.MM.YY HH:mm');
                else return "";
            }
        },
        {
            id: 'changeDate', label: 'Изменено', visible: false, displayFor: OfferSource.LOCAL, width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.changeDate) return moment(ofr.changeDate * 1000).format('DD.MM.YY HH:mm');
                else return "";
            }
        },
        {
            id: 'lastSeenDate', label: 'Актуально', visible: true, displayFor: OfferSource.LOCAL, width: "110px", sort: 0, val: (ofr: Offer) => {
                if (ofr.lastSeenDate) return moment(ofr.lastSeenDate * 1000).format('DD.MM.YY HH:mm');
                else return "";
            }
        }
    ];

    constructor(
        private _elem: ElementRef,
        private _hubService: HubService,
        private _offerService: OfferService,
        private _userService: UserService,
        private _sessionService: SessionService
    ) {
    };

    ngOnInit() {
        this.calcSize();

        let tfStr = localStorage.getItem('tableFields'+this.source);
        if (tfStr) {
            let tf = JSON.parse(tfStr);

            for (var fid in tf) {
                this.fields.forEach(f => {
                    if (f.id == fid) {
                        f.visible = tf[fid].v;
                        f.sort = tf[fid].s;
                    }
                });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {

        this.theaderContextMenu(new Event('build'), true);
        this.ngOnInit();
        // You can also use categoryId.previousValue and
        // categoryId.firstChange for comparing old and new values

    }

    onResize(e) {
        this.calcSize();
    }

    scroll(e) {
        if(document.getElementsByClassName("theader").item(0).scrollLeft != e.target.scrollLeft)
            document.getElementsByClassName("theader").item(0).scrollLeft = e.target.scrollLeft;
        if(this.canLoad == 0){
            if (e.currentTarget.scrollTop + this.contentHeight >= e.currentTarget.scrollHeight) {
                this.onListEnd.emit({event: e});
            }
        } else{
            //e.preventDefault();
            //return false;
        }
    }

    openOffer(offer: Offer) {
        var tab_sys = this._hubService.getProperty('tab_sys');
        offer.openDate = Math.round((Date.now() / 1000));
        tab_sys.addTab('offer', {offer: offer});
    }

    click(event: MouseEvent, offer: Offer, i: number) {
        if (event.button == 2) {    // right click
            if (this.selectedOffers.indexOf(offer) == -1) { // if not over selected items
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        } else if (event.button == 0) {
            this.isDrag = true;
            if (event.ctrlKey) {
                // add to selection
                this.lastClckIdx = i;
                this.selectedOffers.push(offer);
            } else if (event.shiftKey) {
                this.selectedOffers = [];
                var idx = i;
                var idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    var oi = this.offers[idx++];
                    this.selectedOffers.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        }
        this.onSelect.emit(this.selectedOffers);
    }

    click1(event: MouseEvent, offer: Offer, i: number) {
        if (event.button == 0 && this.lastClckIdx != i && this.isDrag) {
            this.selectedOffers = [];
            var idx = i;
            var idx_e = this.lastClckIdx;
            if (i > this.lastClckIdx) {
                idx = this.lastClckIdx;
                idx_e = i;
            }
            while (idx <= idx_e) {
                var oi = this.offers[idx++];
                this.selectedOffers.push(oi);
            }
            this.onSelect.emit(this.selectedOffers);
        }
    }

    click2(event: MouseEvent, offer: Offer, i: number) {
        if (event.button == 0) {
            this.isDrag = false;
        }
    }


    dblClick(offer: Offer) {
        this.openOffer(offer);
    }

    tStart(offer: Offer) {
        this.to = setTimeout(() => {
            this.openOffer(offer);
            clearTimeout(this.to);
        }, 1000);
    }

    tEnd(offer: Offer) {
        clearTimeout(this.to);
    }

    tableContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        var c = this;
        var users: User[] = this._userService.listCached("", 0, "");
        var uOpt = [];
        /*uOpt.push(
            {class: "entry", disabled: false, label: "Не задано", callback: function() {
                c.selectedOffers.forEach(o => {
                    o.agentId = null;
                    o.agent = null;
                    c._offerService.save(o);
                })
            }},
        );*/
        users.forEach(u => {
            if(u.id != this._sessionService.getUser().id)
            uOpt.push(
                {class: "entry", disabled: false, label: u.name, callback: () => {
                    this.clickMenu.emit({event: "add_to_local", agent: u});
                }},
            )
        });

        var stageOpt = [];

        this.stageCodeOptions.forEach(s => {
            stageOpt.push(
                {
                    class: "entry", disabled: false, label: s.label, callback: function () {
                    c.selectedOffers.forEach(o => {
                        o.stageCode = s.value;
                        c._offerService.save(o);
                    });
                    /*)
                    setTimeout(function () {
                        c.listOffers();
                    }, 1200);
                    */
                }
                }
            )
        });

        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedOffers.length == 1 ? false : true, icon: "dcheck", label: 'Проверить', callback: () => {

                    this.clickMenu.emit({event: "check"});
                    /*var tab_sys = this._hubService.getProperty('tab_sys');
                    var rq = [];
                    this.selectedOffers.forEach(o => {
                        if (o.person.phoneBlock) {
                            rq.push(PhoneBlock.getAsString(o.person.phoneBlock));
                        }
                    });
                    tab_sys.addTab('list_offer', {query: rq.join(" ")});*/
                }},
                {class: "entry", disabled: false, icon: "document", label: 'Открыть', callback: () => {
                    var tab_sys = this._hubService.getProperty('tab_sys');
                    this.selectedOffers.forEach(o => {
                        tab_sys.addTab('offer', {offer: o});
                    })
                }},
                {class: "entry", disabled: this.source == OfferSource.LOCAL? false : true, icon: "trash", label: 'Удалить',
                    callback: () => {
                        this.clickMenu.emit({event: "del_obj"});
                    /*this.selectedOffers.forEach(o => {
                        o.stageCode = 'archive';
                        c._offerService.save(o);
                    });
                    setTimeout(function () {
                        c.listOffers(1);
                    }, 1200);*/
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length == 1 ? false : true, icon: "edit", label: "Показать фото", callback: () => {
                    this.clickMenu.emit({event: "photo"});
                }},
                {class: "entry", disabled: false, icon: "edit", label: "Показать на карте",
                    callback: () => {
                        this.clickMenu.emit({event: "map"});
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "edit", label: "Изменить стадию", items: stageOpt},
                {class: "submenu", disabled: false, icon: "person", label: "Добавить", items: [
                    {class: "entry", disabled: this.source == OfferSource.LOCAL? true : false, label: "В базу компании",
                        callback: () => {
                            this.clickMenu.emit({event: "add_to_local"});
                        }
                    },
                    {class: "entry", disabled: false, label: "В контакты",
                        callback: () => {
                            this.clickMenu.emit({event: "add_to_person"});
                        }
                    },
                    {class: "entry", disabled: false, label: "В контрагенты",
                        callback: () => {
                            this.clickMenu.emit({event: "add_to_company"});
                        }
                    },
                    {class: "delimiter"}
                ]},
                {class: "submenu", disabled: false, icon: "person", label: "Назначить", items: [
                    {class: "entry", disabled: this.source == OfferSource.LOCAL? false : true, label: "Не назначено",
                        callback: () => {
                            this.clickMenu.emit({event: "del_agent", agent: null});
                        }
                    },
                    {class: "entry", disabled: false, label: "На себя",
                        callback: () => {
                            this.clickMenu.emit({event: "add_to_local", agent: this._sessionService.getUser()});
                        }
                    },
                    {class: "delimiter"}
                ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "task", label: "Добавить задачу", items: [
                    //{class: "entry", disabled: false, label: "пункт x1", callback: function() {alert('yay s1!')}},
                    //{class: "entry", disabled: false, label: "пункт x2", callback: function() {alert('yay s2!')}},
                ]},
                {class: "submenu", disabled: false, icon: "edit", label: "Отправить сообщение", items: [
                    {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "Шаблон 1", callback: function() {alert('yay s2!')}},
                    {class: "entry", disabled: false, label: "Шаблон 2", callback: function() {alert('yay s2!')}},
                    {class: "entry", disabled: false, label: "Шаблон 3", callback: function() {alert('yay s2!')}},
                ]},
                {class: "entry", disabled: false, icon: "edit", label: "Экспорт в источники", callback: () => {

                }},
                {class: "submenu", disabled: false, icon: "task", label: "Позвонить",  items: [
                    {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!')}},
                    {class: "delimiter"},
                    {class: "entry", disabled: false, label: "На основной", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "На рабочий", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "На мобильный", callback: function() {alert('yay s2!')}},
                ]},

                /*{class: "submenu", disabled: true, icon: "advert", label: "Реклама", items: [
                    {class: "entry", disabled: false, label: "пункт x1", callback: function() {alert('yay s1!')}},
                    {class: "entry", disabled: false, label: "пункт x2", callback: function() {alert('yay s2!')}},
                ]},*/
                {class: "delimiter"},
                {class: "tag", icon: "tag", label: "Добавить тег:", items: [
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

    theaderContextMenu(e, hide) {
        e.preventDefault();
        e.stopPropagation();

        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: true,
            items: []
        };

        this.fields.forEach(f => {
            if( f.displayFor == "" || this.source == f.displayFor){
                menu.items.push(
                    {
                        class: "entry_cb", disabled: false, value: f.visible, label: f.label, callback: () => {
                            this.toggleVisibility(f.id);
                        }
                    }
                );
            } else {
                f.visible = false;
            }
        })

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = hide;
    }

    toggleVisibility(field_id: string) {
        let flds = {};
        this.fields.forEach(f => {
            if (f.id == field_id) {
                f.visible = !f.visible;
            }
            flds[f.id] = {v: f.visible, s: f.sort};
        });
        localStorage.setItem('tableFields'+this.source, JSON.stringify(flds));
        var temp = this.fields;
        this.fields = [];
        setTimeout(() => {
            this.fields = temp;
        },100);
        //*/
    }

    calcSize() {
        this.contentHeight = document.body.clientHeight - 115;
    }

    toggleSort(f) {
        if(f.sort >=0){
            f.sort++;
            if (f.sort > 2)
                f.sort = 0;
            this.onSort.emit({field: f.id, order: f.sort});
            this.toggleVisibility(null);
        }
    }
}
