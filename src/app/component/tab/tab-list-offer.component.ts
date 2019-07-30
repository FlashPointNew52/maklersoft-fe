 import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef
} from '@angular/core';

import {OfferService, OfferSource} from '../../service/offer.service';
import {ConfigService} from '../../service/config.service';
import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";
import {PersonService} from "../../service/person.service";
import {OrganisationService} from "../../service/organisation.service";

import {SuggestionService} from "../../service/suggestion.service";

import {Tab} from '../../class/tab';
import {GeoPoint} from "../../class/geoPoint";
import {Offer} from '../../entity/offer';

import {User} from "../../entity/user";
import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {SessionService} from "../../service/session.service";
import {Account} from "../../entity/account";
import {PhoneBlock} from "../../class/phoneBlock";

@Component({
    selector: 'tab-list-offer',
    inputs: ['tab'],
    styles: [`
      .search-form {
        position: absolute;
        width: calc(75% - 685px);
        margin-left: 570px;
        margin-top: 27px;
        z-index: 1;
      }

      .search-form.table-mode {
        border: 1px solid var(--box-backgroung);
      }

      .tool-box {
        height: 21px;
        margin: 2px 12px;
        padding-top: 1px;
      }

      .search-box {
        display: flex;
        position: relative;
        height: 30px;
        margin: 15px 12px 0px 12px;
      }

      .search-box > .deactivate_draw {
        font-size: 10pt;
        color: #fbfbfb;
        background-color: #BDBDBD;
        height: 27px;
        line-height: 27px;
        width: 87px;
        cursor: pointer;
        text-align: center;
      }

      .search-box > .deactivate_draw:hover {
        background-color: #0a145b;
      }

      .search-box > .activate_draw {
        background-color: #0a145b;
      }

      .offer-list {

      }

      .pane {
        height: 100vh;
      }

      .digest-list {
        overflow-x: scroll;
        background-color: var(--box-backgroung);
        height: calc(100% - 115px);
      }

      digest-offer:after {
          content: "";
          background-color: #f5f4f4;
          width: 100%; 
          height: 1px;
          display: block;
      }

      .work-area {
        float: left;
        height: calc(100vh - 115px);
        margin-top: 115px;
        width: calc(100vw - 30px);
      }

      .inline-select {
        display: inline-block;
        height: 20px;
        padding: 0 15px 0 0;
        font-size: 14px;
        color: #424242;
      }

      .button {
        height: 44px;
        width: 44px;
        border-radius: 40px;
        cursor: pointer;
        font-size: 11px;
        line-height: 110px;
        background-size: 39px;
        background-position: center;
        background-color: #9e9e9e;
        color: #9e9e9e;
        border: 1px solid #42424200;
        text-indent: -3px;
      }

      .button_active, .button:hover {
        background-color: #424242;
        color: #424242;
        border: 1px solid #424242;
      }

      .input_line {
        height: 23px;
        background-color: rgb(247, 247, 247);
        border: 1px solid rgba(204, 204, 204, 0.47);
      }

      .alreadyAdd:hover {
         background-color: #f6f6f6 !important;
      }

      .selected {
        background-color: var(--selected-digest) !important;
      }

      .src-sel {
        background-color: #3366cc !important;
      }

      .suggestions {
        left: 0px;
        min-width: 160px;
        margin-top: 27px;
        padding: 5px 0;
        background-color: #f7f7f7;
        border: 1px solid #e3e3e3;
        width: 88%;
        position: absolute;
        z-index: 2;
        font-size: 11pt;
      }

      .suggestions > ul {
        margin: 0 0;
        list-style: none;
        padding: 3px 20px;
      }

      .suggestions > ul:hover {
        background-color: #f3f3f3;
        cursor: default;
      }

      .suggestions > ul a {
        color: #252f32;
        text-decoration: none;
      }

      .suggestions > ul a:hover {
        color: #252f32;
        text-decoration: none;
      }

      .no-mouse-events {
        pointer-events: none;
      }

      .map_params {
        position: absolute;
        top: 150px;
        right: 50px;
        width: 45px;
      }

      .map_params div {
        width: 40px;
        height: 40px;
        margin-top: 10px;
        background-color: #ffffff;
        border-radius: 5px;
      }

      .active_param {
        background-color: #80808080 !important;
      }

      .pull-left {
        float: left;
        width: 530px;
      }

      .pull-left > span {
        float: right;
      }

      .pull-right {
        float: left;
        width: 76px;
        text-align: right;
      }

      .pull-right > a {
        color: #424242;
        text-decoration: none;
      }

      .nonactive {
        color: #9E9E9E !important;
      }
    `],
    template: `
        <digest-window *ngIf="tab.active"
            [open]="openPopup"
        ></digest-window>
        <div class = "round_menu">
            <div class="button" [style.background-image]="'url(assets/plus.png)'" (click) ="addOffer()">Добавить</div>
            <div (click)="toggleSource('import')" class="button" [class.button_active]="this.source != 1" [style.background-image]="'url(assets/base_new.png)'">Импорт</div>
            <div (click)="toggleSource('local')"  class="button" [class.button_active]="this.source == 1" [style.background-image]="'url(assets/company_new.png)'">Общая</div>
        </div>
        <div class="search-form" [class.table-mode]="tableMode">
            <div class="search-box">
                <input type="text" class="input_line" placeholder="" [style.width]="'calc(100% - 87px)'"
                    [(ngModel)]="searchQuery" (keyup)="searchStringChanged($event)"
                >
                <span class="icon-search" style= "position: absolute; top: 7px; right: 94px"></span>
                <div (click)="toggleDraw()" class="deactivate_draw" [class.activate_draw]="mapDrawAllowed">
                    Обвести
                </div>
                <div class="suggestions" (document:click)="docClick()" *ngIf="sgList.length > 0">
                    <ul *ngFor="let item of sgList" >
                        <li >
                            <a (click)="select(item)">{{item}}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="tool-box">

                <div style="width: 100%;float: left;">
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]="this.source == 1 ? offerTypeCodeOptions : offerTypeCodeOptionsImport"
                            [value]="{'option' : filter.offerTypeCode}"
                            (onChange)="filter.offerTypeCode = $event.option; searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]="[
                                {class: 'entry', value: 'all', label: 'Все'},
                                {class: 'entry', value: 'middleman', label: 'Посредники'},
                                {class: 'entry', value: 'owner', label: 'Собственники'}
                            ]"
                            [value]="{'option' : filter.isMiddleman}"
                            (onChange)="filter.isMiddleman = $event.option; searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]="[
                                {class: 'entry', value: 'all', label: 'Все'},
                                {class: 'entry', value: 'my', label: 'Мои объекты'},
                                {class: 'entry', value: 'our', label: 'Наша компания'}
                            ]"
                            [value]="{'option' : filter.attachment}"
                            (onChange)="filter.attachment = $event.option; searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source == 1">
                        <ui-filter-select class="view-value edit-value"
                            [options]="stateCodeOptions"
                            [value]="{'option' : filter.stateCode}"
                            (onChange)="filter.stateCode = $event.option; searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source == 1">
                        <ui-filter-tag-select class="view-value edit-value"
                            [value]="filter?.tag"
                            (onChange)="filter.tag = $event; searchParamChanged($event);"
                        >
                        </ui-filter-tag-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]="[
                                {class: 'entry', value: 'all', label: 'Все'},
                                {class: 'entry', value: '1', label: '1 день'},
                                {class: 'entry', value: '3', label: '3 дня'},
                                {class: 'entry', value: '7', label: 'Неделя'},
                                {class: 'entry', value: '14', label: '2 недели'},
                                {class: 'entry', value: '30', label: 'Месяц'},
                                {class: 'entry', value: '90', label: '3 месяца'}
                            ]"
                            [value]="{'option' : filter.addDate}"
                            (onChange)="filter.addDate = $event.option; searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]=" this.source == 1 ? localSort : importSort"
                            [value]="getSort()"
                            (onChange)="setSort($event.option, $event.subvalue); searchParamChanged($event);"
                        >
                        </ui-filter-select>
                    </div>
                    <div style="float: right;font-size: 12px;color: #324158;margin-top: 3px;">
                        Найдено: <span>{{hitsCount+" "}}</span>/<span>{{" "+selectedOffers.length }}</span>
                    </div>
                </div>
            </div>
        </div>

        <hr class='underline'>

        <div class="offer-list" *ngIf="!tableMode"
             [hidden]="tableMode"
             (window:resize)="onResize($event)"
        >
            <div class="pane" [style.width.px]="paneWidth">
                <div class="head"><span>{{tab.header}}</span></div>
                <div class="fixed-button" (click)="toggleLeftPane()">
                    <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
                </div>
                <div class="digest-list"
                     (scroll)="scroll($event)"
                     (contextmenu)="tableContextMenu($event)"
                >

                    <digest-offer *ngFor="let offer of offers; let i = index"
                                  [offer]="offer"
                                style="background-color: #fff"
                                [class.modified]="offer.changeDate > timestamp"
                                [class.alreadyAdd]="offer.offerRef && source == 0"
                                [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                                [class.selected]="selectedOffers.indexOf(offer) > -1"
                                (click)="click($event, offer, i)"
                                (contextmenu)="click($event, offer)"
                                (dblclick)="dblClick(offer)"
                    >
                    </digest-offer>
                    <!--<digest-offer *ngFor="let offer of offers; let i = index"
                                  [offer]="offer"
                                style="background-color: #fff"
                                [class.seen]="offer.openDate > timestamp"
                                [class.modified]="offer.changeDate > timestamp"
                                [class.selected]="selectedOffers.indexOf(offer) > -1"
                                (click)="click($event, offer, i)"
                                (contextmenu)="click($event, offer)"
                                (dblclick)="dblClick(offer)"
                    >
                    </digest-offer>-->
                </div>
            </div>
            <div class="work-area">
                <!--<gmap-view [drawMap] = "mapDrawAllowed"
                         style="width: 100%;height: 100%; display: block; position: relative;"
                        [offers] = "offers"
                        [selected_offers] = "selectedOffers"
                        [same_offers] = "similarOffers"
                        [with_menu] = "true"
                        (drawFinished)="finishDraw($event)"
                        (scrollToOffer) = "scrollToOffer($event)"
                        (showSameOffers) = "showSameOffers($event)"
                >

                </gmap-view>-->
                <ng-container [ngSwitch]="workAreaMode">
                    <yamap-view *ngSwitchCase="'map'" [drawMap] = "mapDrawAllowed"
                             style="width: 100%;height: 100%; display: block; position: relative;"
                            [offers] = "offers"
                            [selected_offers] = "selectedOffers"
                            [same_offers] = "similarOffers"
                            [with_menu] = "true"
                            (drawFinished)="finishDraw($event)"
                            (scrollToOffer) = "scrollToOffer($event)"
                            (showSameOffers) = "showSameOffers($event)"
                    >
                    </yamap-view>
                    <adv-view *ngSwitchCase="'advert'"></adv-view>
                </ng-container>
            </div>
        </div>
    `
})

export class TabListOfferComponent {
    public tab: Tab;
    public tableMode: boolean = false;
    source: OfferSource = OfferSource.LOCAL;
    searchQuery: string = "";
    searchArea: GeoPoint[] = [];
    workAreaMode: string = 'map';
    sgList: string[] = [];
    filter: any = {
        isMiddleman: 'all',
        attachment: 'all',
        stateCode: 'all',
        contactType: 'all',
        addDate: '30',
        offerTypeCode: 'sale',
        tag: null,
    };

    sort: any = {"addDate" : "DESC"};

    agentOpts = [
        {class: 'entry', value: 'all', label: 'Все', bold: true},
        {class: 'entry', value: 'neutral', label: 'Нейтрально', bold: true},
        {class: 'entry', value: 'loyally', label: 'Лояльно', bold: true},
        {class: 'entry', value: 'client', label: 'Клиент', bold: true},
        {class: 'entry', value: 'partner', label: 'Партнер', bold: true}
    ];


    stateCodeOptions = Offer.stateCodeOptions;
    importSort = Offer.importSort;
    localSort = Offer.localSort;
    offerTypeCodeOptionsImport = Offer.offerTypeCodeOptionsImport;
    offerTypeCodeOptions = Offer.offerTypeCodeOptions;
    paneWidth: number;
    mapWidth: number;
    paneHidden: boolean = false;

    mapDrawAllowed = false;

    offers: Offer[] = [];
    hitsCount: number = 0;
    page: number = 0;
    perPage: number = 100;

    suggestionTo: any;
    to: any;
    list: HTMLElement;

    selectedOffers: Offer[] = [];
    similarOffers: Offer[] = [];
    lastClckIdx: number = 0;

    timestamp: number = (Date.now() / 1000) - 1000;
    openPopup: any = {visible: false};
    canLoad: number = 0;
    subscription_offer: any;
    subscription_user: any;
    subscription_refreshRq: any;
    subscription_suggestion: any;
    subscription_person: any;
    subscription_organisation: any;

    constructor(private _elem: ElementRef,
                private _hubService: HubService,
                private _offerService: OfferService,
                private _userService: UserService,
                private _configService: ConfigService,
                private _suggestionService: SuggestionService,
                private _sessionService: SessionService,
                private _personService: PersonService,
                private _organisationService: OrganisationService
            ) {
        setTimeout(() => {
            this.tab.header = 'Предложения';
        });
    }

    ngOnInit() {

        if (this.tab.args.query) {
            this.searchQuery = this.tab.args.query|| "";
        }
        for (let i = 0; i < localStorage.length; i++) {
            let name: string = localStorage.key(i);
            if(name.indexOf('offer_page') > -1)
                localStorage.removeItem(name);
        }
        /*this.subscription_refreshRq = this.tab.refreshRq.subscribe(
            sender => {
                //this.listOffers(1);
            }
        )*/

        //this.list = this._elem.nativeElement.querySelector('.digest-list');

        this.page = 0;
        this.listOffers(1);
        this.calcSize();
    }

    listOffers(down: number, event: any = null) {
            this.canLoad = down;
            this.subscription_offer = this._offerService.list(this.page, this.perPage, this.source, this.filter, this.sort, this.searchQuery, this.searchArea).subscribe(
                data => setTimeout(() => {
                    this.hitsCount = data.hitsCount || (this.hitsCount > 0 ? this.hitsCount : 0);
                    if (this.page == 0 && down == 1) {
                        this.offers = data.list;
                    } else {
                        if(down == 1){
                            data.list.forEach(i => {
                                this.offers.push(i);
                            });
                            if(~~(this.hitsCount/this.perPage) != this.page+1 && data.list.length < this.perPage){
                                this.hitsCount -= (this.perPage - data.list.length);
                            }

                        }
                    }
                    this.canLoad = 0;
                }),
                err => {
                    console.log(err);
                    this.canLoad = 0;
                }
            );
    }

    onResize(e) {
        this.calcSize();
    }

    toggleMode() {
        this.tableMode = !this.tableMode;
    }

    toggleDraw() {
        this.mapDrawAllowed = !this.mapDrawAllowed;
        if (!this.mapDrawAllowed) {
            this.page = 0;
            this.offers = [];
            this.searchArea = [];
            //this.listOffers(1);
        }
    }

    finishDraw(e) {
        this.page = 0;
        this.offers = [];
        this.searchArea = e.coords;
        this.selectedOffers = [];
        //this.perPage = 100 + 50*e.zoom;
        this.listOffers(1);
    }

    calcSize() {
        if (this.paneHidden)
            this.paneWidth = 0;
        else
            this.paneWidth = 370;
    }

    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
        this.calcSize();
    }

    tableContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        //let users: User[] = this._userService.listCached("", 0, "");
        let uOpt = [{class:'entry', label: "На себя", disabled: false, callback: () => {
            this.clickMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
          }}];
        for (let op of this._userService.cacheUsers){
          op.callback = () => {
            this.clickMenu({event: "set_agent", agentId: op.value});
          };
          uOpt.push(op);
        }
        /*uOpt.push(
            {class: "entry", disabled: false, label: "Не задано", callback: function() {
                c.selectedOffers.forEach(o => {
                    o.agentId = null;
                    o.agent = null;
                    c._offerService.save(o);
                })
            }},
        )*/
        /*users.forEach(u => {
            if(u.id != this._sessionService.getUser().id)
            uOpt.push(
                {class: "entry", disabled: false, label: u.name, callback: () => {
                    this.clickMenu({event: "add_to_local", agent: u});
                }},
            );
        });*/

        let stateOpt = [];
        let states = [
            {value: 'raw', label: 'Не активен'},
            {value: 'active', label: 'Активен'},
            {value: 'work', label: 'В работе'},
            {value: 'suspended', label: 'Приостановлен'},
            {value: 'archive', label: 'Архив'}
        ];
        //let stageOpt = [];
        /*let stages = [
            {value: 'contact', label: 'Первичный контакт'},
            {value: 'pre_deal', label: 'Заключение договора'},
            {value: 'show', label: 'Показ'},
            {value: 'prep_deal', label: 'Подготовка договора'},
            {value: 'decision', label: 'Принятие решения'},
            {value: 'negs', label: 'Переговоры'},
            {value: 'deal', label: 'Сделка'}
        ];*/
        states.forEach(s => {
            stateOpt.push(
                {class: "entry", disabled: false, label: s.label, callback: function() {
                    c.selectedOffers.forEach(o => {
                        o.stateCode = s.value;
                        c._offerService.save(o);
                    });
                }}
            );
        });
        /*stages.forEach(s => {
            stageOpt.push(
                {class: "entry", disabled: false, label: s.label, callback: function() {
                    c.selectedOffers.forEach(o => {
                        o.stageCode = s.value;
                        c._offerService.save(o);
                    });
                            setTimeout(function () {
                                c.listOffers(1);
                            }, 1200);
                }}
            );
        });*/
        let tag = this.selectedOffers[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedOffers.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {
                    this.openPopup = {visible: true, task: "check"};
                    /*var tab_sys = this._hubService.getProperty('tab_sys');
                    var rq = [];
                    this.selectedOffers.forEach(o => {
                        if (o.person.phoneBlock) {
                            rq.push(PhoneBlock.getAsString(o.person.phoneBlock));
                        }
                    });
                    tab_sys.addTab('list_offer', {query: rq.join(" ")});*/
                }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                    var tab_sys = this._hubService.getProperty('tab_sys');
                    this.selectedOffers.forEach(o => {
                        let canEditable = this.source == OfferSource.IMPORT ? false : true && (this._sessionService.getAccount().id == o.accountId);
                        tab_sys.addTab('offer', {offer: o, canEditable: canEditable});
                    })
                }},
                {class: "entry", disabled: this.source == OfferSource.LOCAL && this.canImpact() ? false : true, icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickMenu({event: "del_obj"});
                    }
                },
                {class: "delimiter"},
                {class: "entry", disabled: false, icon: "", label: 'Перейти в источник',
                    callback: () => {
                        this.selectedOffers.forEach(o => {
                            if(o.sourceUrl)
                                window.open(o.sourceUrl, '_blank');
                        });
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length == 1 ? false : true, icon: "", label: "Показать фото",
                    callback: () => {
                        this.clickMenu({event: "photo"});
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                    {class: "entry", disabled: this.source == OfferSource.LOCAL ? true : false, label: "Как Предложение",
                        callback: () => {
                            this.clickMenu({event: "add_to_local"});
                        }
                    },
                    {class: "entry", disabled: false, label: "Как Контакт",
                        callback: () => {
                            this.clickMenu({event: "add_to_person"});
                        }
                    },
                    {class: "entry", disabled: false, label: "Как Контрагент",
                        callback: () => {
                            this.clickMenu({event: "add_to_company"});
                        }
                    },
                ]},
                {class: "submenu", disabled: this.source == OfferSource.LOCAL && this.canImpact() ? false : true, icon: "", label: "Назначить", items: [
                    {class: "entry", disabled: false, label: "Не назначено",
                      callback: () => {
                        this.clickMenu({event: "del_agent", agent: null});
                      }
                    }
                ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: [

                ]},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: [

                ]},
                {class: "entry", disabled: false, icon: "", label: "Добавить в рекламу", callback: () => {
                    this.workAreaMode = 'advert';
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
                    {class: "entry", disabled: false, label: "Email1"},
                    {class: "entry", disabled: false, label: "Email2"},
                    {class: "entry", disabled: false, label: "Email3"},
                ]},
                {class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                    {class: "entry", disabled: false, label: "Номер1"},
                    {class: "entry", disabled: false, label: "Номер2"},
                    {class: "entry", disabled: false, label: "Номер3"},
                ]},
                {class: "submenu", disabled: false, icon: "", label: "Позвонить",  items: [
                    {class: "entry", disabled: false, label: "Номер1"},
                    {class: "entry", disabled: false, label: "Номер2"},
                    {class: "entry", disabled: false, label: "Номер3"},
                ]},
                {class: "submenu", disabled: false, icon: "", label: "Написать в чат", items: [

                ]},
                {class: "delimiter"},
                {class: "submenu", disabled: this.source == OfferSource.LOCAL && this.canImpact() ? false : true, icon: "", label: "Назначить тег", items: [
                    {class: "tag", icon: "", label: "", offer: this.selectedOffers.length == 1 ? this.selectedOffers[0] : null, tag: tag,
                        callback: (new_tag) => {
                          console.log(new_tag);
                          this.clickMenu({event: "set_tag", tag: new_tag});
                    }}
                ]}

            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    click(event: MouseEvent, offer: Offer, i: number) {

        if (event.button == 2) {    // right click
            if (this.selectedOffers.indexOf(offer) == -1) { // if not over selected items
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedOffers.push(offer);
                this.selectedOffers = [].concat(this.selectedOffers);
            } else if (event.shiftKey) {
                this.selectedOffers = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.offers[idx++];
                    this.selectedOffers.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        }
    }

    offerSelected(offer: Offer) {

    }

    dblClick(offer: Offer) {
        this.openOffer(offer);
    }

    tStart(event, offer: Offer) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        clearTimeout(this.to);
        this.to = setTimeout(() => {
            this.openOffer(offer);
        }, 1000);
    }

    tEnd(event, offer: Offer) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        clearTimeout(this.to);
    }

    openOffer(offer: Offer) {
        let tab_sys = this._hubService.getProperty('tab_sys');
        let canEditable = this.source == OfferSource.IMPORT ? false : true
          && (this._sessionService.getUser().accountId == offer.accountId);
        tab_sys.addTab('offer', {offer: offer, canEditable: canEditable });
    }

    scroll(e) {
        if(this.canLoad == 0 && ~~(this.hitsCount/this.perPage)+1 != this.page){
            if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight ) {
                    this.page += 1;
                    this.listOffers(1, e);
            }
        }
    }

    listEndOrStart(pageAdd: number, toDown: number, event: Event){
        if(this.canLoad == 0 && ~~(this.hitsCount/this.perPage)+1 != this.page){
            this.page = this.page + pageAdd;
            if(this.page < 0) this.page = 0;
            this.listOffers(toDown, event);
        }
    }

    docClick() {
        this.sgList = [];
    }

    select(itm) {
        this.searchQuery = itm;
        this.sgList = [];
        this.searchParamChanged(null);
    }

    searchStringChanged(e) {
        let c = this;
        clearTimeout(this.suggestionTo);
        this.suggestionTo = setTimeout(function() {
            c.searchParamChanged(e);
        }, 500);
    }

    searchParamChanged(e) {
        if (this.searchQuery.length > 0) {
            let sq = this.searchQuery.split(" ");
            let lp = sq.pop()
            let q = sq.join(" ");
            this.sgList = [];
            if (lp.length > 0) {
                // запросить варианты
                this.subscription_suggestion = this._suggestionService.listKeywords(this.searchQuery).subscribe(sgs => {
                    sgs.forEach(ev => {
                        this.sgList.push(ev);
                    });
                });
            }
        }
        this.page = 0;
        /*for (var i = 0; i < localStorage.length; i++) {
            let name : string = localStorage.key(i);
            if(name.indexOf('offer_page') > -1)
                localStorage.removeItem(name);
        }*/
        this.offers=[];
        this.listOffers(1);
    }

    sortChanged(e) {
        if (e.order == 0) {
            delete this.sort[e.field];
        } else {
            if (e.order == 1) {
                this.sort[e.field] = "ASC";
            } else {
                this.sort[e.field] = "DESC";
            }
        }
        /*for (var i = 0; i < localStorage.length; i++) {
            let name : string = localStorage.key(i);
            if(name.indexOf('offer_page') > -1)
                localStorage.removeItem(name);
        }*/
        this.page = 0;
        this.listOffers(1);
    }

    setSort(val1, val2){
        this.sort = {};
        this.sort[val1] = val2;
    }

    markerClick(o: Offer) {
        //r.selected = !r.selected;
        // scroll to object !?
        // lets get dirty!
        //if (r.selected) {
        let e: HTMLElement = <HTMLElement>this.list.querySelector('#r' + o.id);
        this.selectedOffers = [o];
        this.list.scrollTop = e.offsetTop - e.clientHeight;
        //}
    }

    addOffer() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('offer', {offer: new Offer(), canEditable: true});
    }

    toggleSource(s: string) {
        if (s == 'local') {
            this.source = OfferSource.LOCAL;
        } else {
            this.source = OfferSource.IMPORT;
        }
        this.offers = [];
        //this.searchArea = [];
        this.selectedOffers = [];
        this.page = 0;
        /*this.sort={};
        let tfStr = localStorage.getItem('tableFields'+this.source);
        if (tfStr) {
            let tf = JSON.parse(tfStr);

            for (var fid in tf) {
                if(tf[fid].s != 0){
                    if (tf[fid].s == 1) {
                        this.sort[fid] = "ASC";
                    } else {
                        this.sort[fid] = "DESC";
                    }
                }
                /*this.fields.forEach(f => {
                    if (f.id == fid) {
                        f.visible = tf[fid].v;
                        f.sort = tf[fid].s;
                    }
                });*/
        /*    }
        }*/

        this.listOffers(1);
    }

    getInputWidth(){
        if(this.tableMode)
            return '100%';
        else return '90%';
    }

    getSearchPosition(){
        if(this.tableMode)
            return '10px';
        else return '85px';
    }

    clickMenu(evt: any){
        this.selectedOffers.forEach(o => {
            if(evt.event == "add_to_local"){
                if(this.source == OfferSource.LOCAL){
                    o.changeDate = Math.round((Date.now() / 1000));
                } else{
                    o.addDate = null;
                }
                o.stageCode = 'raw';
                if(evt.agent){
                    o.agentId = evt.agent.id;
                    o.agent = evt.agent;
                } else {
                    o.agentId = null;
                    o.agent = null;
                }
                if(!o.person && !o.company && o.phoneBlock.main){
                    let pers: Person = new Person();
                    pers.phoneBlock =  PhoneBlock.toFormat(o.phoneBlock);
                    if(evt.agent) {
                        pers.agent = evt.agent;
                        pers.agentId = evt.agent.id;
                    }
                    this.subscription_person = this._personService.save(pers).subscribe(
                        data => {
                            o.person = data;
                            o.personId = data.id;
                            this._offerService.save(o);
                        }
                    );
                } else{
                    o.person != null ? o.personId = o.person.id : o.companyId = o.company.id;
                    this._offerService.save(o);
                    o.offerRef = 1;
                }
            } else if(evt.event == "add_to_person"){
                if(!o.person  && o.phoneBlock.main){
                    let pers: Person = new Person();
                    pers.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);
                    this.subscription_person = this._personService.save(pers).subscribe(
                        data => {
                            o.person = data;
                            o.personId = data.id;
                            /*this.offers.forEach(t => {
                                if(t.phones_import)
                            });*/
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('person', {person: o.person, canEditable: true});
                        }
                    );
                }
            }
            else if(evt.event == "add_to_company"){
                if(!o.person && !o.company && o.phoneBlock.main){
                    let org: Organisation = new Organisation();
                    org.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);

                    this.subscription_organisation = this._organisationService.save(org).subscribe(
                        data => {
                            o.company = data;
                            o.companyId = data.id;
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('organisation', {organisation: o.company, canEditable: true});
                        }
                    );
                }
            } else if(evt.event == "set_agent"){
                o.agentId = evt.agentId;
                o.agent = null;
                this._offerService.save(o);
            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._offerService.save(o);
            } else if(evt.event == "del_obj"){
                this.subscription_offer = this._offerService.delete(o).subscribe(
                    data => {
                            this.selectedOffers.splice(this.selectedOffers.indexOf(o), 1);
                            this.offers.splice(this.offers.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){
                  this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "photo"){
                  this.openPopup = {visible: true, task: "photo", offer: o, value: this.source};
            } else if(evt.event = "set_tag"){
                o.tag = evt.tag;
                this._offerService.save(o);
            } else {
                this._offerService.save(o);
            }
        });
        if(evt.event == "map"){
            this.openPopup = {visible: true, task: "map", offers: this.selectedOffers, value: this.source,
                map: {}
            };
        }
    }

    scrollToOffer(event){
        this.selectedOffers=[this.offers[event]];
        let offer_tag: HTMLElement = <HTMLElement>document.getElementsByTagName('digest-offer').item(event);
        let list: HTMLElement = <HTMLElement>document.getElementsByClassName('digest-list').item(0);
        let to = offer_tag.offsetTop - list.offsetHeight/2 - 75;
        /*let finale_step = 10;
        let start_pos = list.scrollTop;
        let step = start_pos > to ? -10 : 10;
        var timer = setInterval(()=>{
            if(list.scrollTop +20 <= start_pos || list.scrollTop - 20 >= start_pos){
                start_pos += step;*/
                list.scrollTo(0,to);
        /*    }
    }, 10)*/

    }
    getSort(){
        for (let k in this.sort) {
            return {"option" : k , "subvalue": this.sort[k]};
        }
    }

    showSameOffers(event){
        if(event.show && this.selectedOffers.length > 0 && this.source == OfferSource.LOCAL){
            this.getSimilarOffers(0, 50);
        } else {
            this.similarOffers = [];
        }
    }

    getSimilarOffers(page, per_page) {
            this._offerService.getSimilar(this.selectedOffers[0], page, per_page).subscribe(
                data => {
                    this.similarOffers = data.list;
                    console.log(data);
                },
                err => console.log(err)
            );
    }

    canImpact() {
        for (let ofr of this.selectedOffers) {
           if(ofr.accountId != this._sessionService.getUser().accountId)
              return false
        }
        return true;
    }
}
