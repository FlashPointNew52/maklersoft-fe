import {Component, ElementRef, OnInit} from "@angular/core";

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
import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";
import {Utils} from "../../class/utils";

@Component({
    selector: 'tab-list-offer',
    inputs: ['tab'],
    styles: [`
        input::placeholder, .input_line::placeholder{
            color: var(--dark-grey) !important;
        }
        .work-area {
            float: left;
            width: calc(100% - 1px);
            height: calc(100% - 122px);
            position: relative;
        }

        digest-offer{
            border-bottom: 1px solid var(--bottom-border);
            width: 100%;
            height: 122px;
            display: block;
        }

        .digest-list digest-offer:last-of-type{
            border-bottom: 1px solid var(--bottom-border);
        }

        .selected {
            background-color: var(--color-blue) !important;
        }
    `],
    template: `

        <div class="search-form" *ngIf="workAreaMode != 'advert' && workAreaMode != 'photo'">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'calc(100% - 108px)'"
                   [(ngModel)]="searchQuery" (keyup)="searchStringChanged($event)"
            ><span class="find_icon"></span>
<!--            <div class="suggestions" (document:click)="docClick()" *ngIf="sgList.length > 0">-->
<!--                <ul *ngFor="let item of sgList" >-->
<!--                    <li >-->
<!--                        <a (click)="select(item)">{{item}}</a>-->
<!--                    </li>-->
<!--                </ul>-->
<!--            </div>-->
            <div (click)="toggleDraw()" class="deactivate_draw" [class.activate_draw]="mapDrawAllowed">ОБВЕСТИ</div>
            <div class="tool-box">
                <filter-select
                    [name]="'Тип сделки'"
                    [options]="this.source == 1 ?
                        [
                            {value: 'sale', label: 'Продажа'},
                            {value: 'alternative', label: 'Альтернатива'},
                            {value: 'rent', label: 'Аренда'}
                        ] : [
                            {value: 'sale', label: 'Продажа'},
                            {value: 'rent', label: 'Аренда'}
                        ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус контакта'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: 'owner', label: 'Принципал'},
                                  {value: 'middleman', label: 'Посредник'}
                    ]"
                    [value]="{'option' : filter.isMiddleman}"
                    (newValue)="filter.isMiddleman = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус объекты'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все объекты'},
                                  {value: 'my', label: 'Мои объекты'},
                                  {value: 'our', label: 'Наша компания'}
                    ]"
                    [value]="{'option' : filter.attachment}"
                    (newValue)="filter.attachment = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Стадия объекта'" [firstAsName]="true"
                    [options]="[
                        {value: 'all', label: 'Все'},
                        {value: 'raw', label: 'Не активно'},
                        {value: 'active', label: 'Активно'},
                        {value: 'listing', label: 'Листинг'},
                        {value: 'deal', label: 'Сделка'},
                        {value: 'suspended', label: 'Приостановлено'},
                        {value: 'archive', label: 'Архив'}
                    ]"
                    [value]="{'option' : filter.stageCode}"
                    (newValue)="filter.stageCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag *ngIf="source == 1" [value]="filter?.tag" (newValue)="filter.tag = $event; searchParamChanged();"></filter-select-tag>
                <filter-select
                    [name]="'Период'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: '1', label: '1 день'},
                                  {value: '3', label: '3 дня'},
                                  {value: '7', label: 'Неделя'},
                                  {value: '14', label: '2 недели'},
                                  {value: '30', label: 'Месяц'},
                                  {value: '90', label: '3 месяца'}
                    ]"
                    [value]="{'option' : filter.addDate}"
                    (newValue)="filter.addDate = $event; searchParamChanged();"
                >
                </filter-select>
<!--                <ui-filter-select class="view-value edit-value"-->
<!--                                  [options]=" this.source == 1 ? localSort : importSort"-->
<!--                                  [value]="getSort()"-->
<!--                                  (onChange)="setSort($event.option, $event.subvalue); searchParamChanged($event);"-->
<!--                >-->
<!--                </ui-filter-select>-->
                <filter-select
                    [name]="'Сортировка'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: 'inactive', label: 'Не активно'},
                                  {value: 'active', label: 'Активно'},
                                  {value: 'listing', label: 'Листинг'},
                                  {value: 'deal', label: 'Сделка'},
                                  {value: 'suspended', label: 'Приостановлено'},
                                  {value: 'archive', label: 'Архив'}
                    ]"
                    [value]="{'option' : 'all'}"
                    (newValue)="$event; searchParamChanged();"
                >
                </filter-select>
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+offers?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>

        <div class="pane" [style.left.px]="paneHidden ?  -340 : 30 ">
            <div class = "source_menu">
                <div class="add"  (click)="addOffer(); workAreaMode = 'map'">ДОБАВИТЬ</div>
                <div (click)="toggleSource('import'); workAreaMode = 'map'" class="average" [class.active]="this.source != 1">ИМПОРТ</div>
                <div (click)="toggleSource('local'); workAreaMode = 'map'"  [class.active]="this.source == 1">ОБЩАЯ БАЗА</div>
            </div>
            <div class="fixed-button" (click)="toggleLeftPane()">
                <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
            </div>
            <div class="digest-list border" (contextmenu)="showContextMenu($event); contextCheck()" (offClick)="this._hubService.shared_var['cm_hidden'] = true">
                <digest-offer *ngFor="let offer of offers; let i = index" [offer]="offer"
                                [active]="selectedOffers.indexOf(offer) > -1"
                                [class.selected]="selectedOffers.indexOf(offer) > -1"
                                [class.alreadyAdd]="offer.offerRef && source == 0"
                                [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                                (click)="select($event, offer, i); workAreaMode = 'map'"
                                (contextmenu)="select($event, offer, i); contextCheck()"
                                (dblclick)="dblClick(offer)"

                ></digest-offer>
            </div>
        </div>
        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <yamap-view *ngSwitchCase="'map'" [drawMap] = "mapDrawAllowed"
                            [offers] = "offers"
                            [selected_offers] = "selectedOffers"
                            [same_offers] = "similarOffers"
                            [with_menu] = "true"
                            (drawFinished)="finishDraw($event)"
                            (scrollToOffer) = "scrollToOffer($event)"
                            (showSameOffers) = "showSameOffers($event)"
                >
                </yamap-view>
                <adv-view *ngSwitchCase="'advert'" [count]="selectedOffers.length"></adv-view>
                <files-view [full]="paneHidden" [files]="selectedOffers[0].photos" [type]="'photo'" [editMode]="false" *ngSwitchCase="'photo'"></files-view>
            </ng-container>
        </div>
    `
})

export class TabListOfferComponent implements OnInit{
    public tab: Tab;
    public tableMode: boolean = false;
    source: OfferSource = OfferSource.LOCAL;
    searchQuery: string = "";
    searchArea: GeoPoint[] = [];
    workAreaMode: string = 'map';
    cur_id: any;
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

    sort: any = {addDate: "DESC"};

    importSort = Offer.importSort;
    localSort = Offer.localSort;

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

    openPopup: any = {visible: false};
    canLoad: number = 0;
    utilsObj = null;
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
        this.utilsObj = new Utils(_sessionService, _personService, _organisationService);
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
    }
    contextCheck() {
        if (this.workAreaMode != 'map') {
            this.workAreaMode = 'map';
        }
    }
    listOffers(down: number, event: any = null) {
            this.canLoad = down;
            this._offerService.list(this.page, this.perPage, this.source, this.filter, this.sort, this.searchQuery, this.searchArea).subscribe(
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
        this.listOffers(1);
    }


    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
    }

    showContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        //let users: User[] = this._userService.listCached("", 0, "");
        let uOpt = [{class:'entry', label: "На себя", disabled: false, callback: () => {
            this.clickContextMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
          }}];
        for (let op of this._userService.cacheUsers){
          op.callback = () => {
            this.clickContextMenu({event: "set_agent", agentId: op.value});
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
                {class: "entry", disabled: false, label: s.label, callback() {
                    c.selectedOffers.forEach(o => {
                        o.stageCode = s.value;
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
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: 'Проверить', callback: () => {
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
                    let tab_sys = this._hubService.getProperty('tab_sys');
                    this.selectedOffers.forEach(o => {
                        let canEditable = this.source == OfferSource.IMPORT ? false : (this._sessionService.getUser().accountId == o.accountId);
                        tab_sys.addTab('offer', {offer: o, canEditable});
                    });
                }},
                {class: "entry", sub_class: 'del', disabled: !(this.source == OfferSource.LOCAL && this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
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
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Показать фото",
                    callback: () => {
                        this.cur_id = this.selectedOffers[0].id;
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Перейти на карту",
                    callback: () => {
                        this.cur_id = this.selectedOffers[0].id;
                        this.workAreaMode = 'map';
                        let off = this.selectedOffers[0];
                        this.selectedOffers = [];
                        setTimeout(() => {
                            this.selectedOffers = [off]
                        }, 100);
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                    {class: "entry", disabled: this.source == OfferSource.LOCAL, label: "Как Предложение",
                        callback: () => {
                            this.clickContextMenu({event: "add_to_local"});
                        }
                    },
                    {class: "entry", disabled: false, label: "Как Контакт",
                        callback: () => {
                            this.clickContextMenu({event: "add_to_person"});
                        }
                    },
                    {class: "entry", disabled: false, label: "Как Контрагент",
                        callback: () => {
                            this.clickContextMenu({event: "add_to_company"});
                        }
                    },
                ]},
                {class: "submenu", disabled: !(this.source == OfferSource.LOCAL && this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: "Назначить", items: [
                    {class: "entry", disabled: false, label: "Не назначено",
                      callback: () => {
                        this.clickContextMenu({event: "del_agent", agent: null});
                      }
                    }
                ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("diary", event);
                        block.setShow(true, event);
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("notes", event);
                        block.setShow(true, event);
                    }
                },
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
                    {class: "entry", disabled: false, label: "Номер1", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("chat", event);
                            block.setShow(true, event);
                        }
                    },
                    {class: "entry", disabled: false, label: "Номер2", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("chat", event);
                            block.setShow(true, event);
                        }
                    },
                    {class: "entry", disabled: false, label: "Номер3", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("chat", event);
                            block.setShow(true, event);
                        }
                    },
                ]},
                {class: "submenu", disabled: false, icon: "", label: "Позвонить",  items: [
                    {class: "entry", disabled: false, label: "Номер1", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("phone", event);
                            block.setShow(true, event);
                        }
                    },
                    {class: "entry", disabled: false, label: "Номер2", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("phone", event);
                            block.setShow(true, event);
                        }
                    },
                    {class: "entry", disabled: false, label: "Номер3", callback: (event) => {
                            let block = this._hubService.getProperty('notebook');

                            block.setMode("phone", event);
                            block.setShow(true, event);
                        }
                    },
                ]},
                {class: "submenu", disabled: false, icon: "", label: "Написать в чат",  callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("chat", event);
                        block.setShow(true, event);
                    }},
                {class: "delimiter"},
                {class: "submenu", disabled: !(this.source == OfferSource.LOCAL && this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: "Назначить тег", items: [
                    {class: "tag", icon: "", label: "", offer: this.selectedOffers.length == 1 ? this.selectedOffers[0] : null, tag,
                        callback: (new_tag) => {
                          this.clickContextMenu({event: "set_tag", tag: new_tag});
                    }}
                ]}

            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    select(event: MouseEvent, offer: Offer, i: number) {

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
        let canEditable = this.source == OfferSource.IMPORT ? false : (this._sessionService.getUser().accountId == offer.accountId);
        let tab = tab_sys.addTab('offer', {offer, canEditable });
        this.eventTabs(tab);
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

    searchStringChanged(e) {
        let c = this;
        clearTimeout(this.suggestionTo);
        this.suggestionTo = setTimeout(() => {
            c.searchParamChanged();
        }, 500);
    }

    searchParamChanged() {
        if (this.searchQuery.length > 0) {
            let sq = this.searchQuery.split(" ");
            let lp = sq.pop()
            let q = sq.join(" ");
            this.sgList = [];
            if (lp.length > 0) {
                // запросить варианты
                this._suggestionService.listKeywords(this.searchQuery).subscribe(sgs => {
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
        let tab = tab_sys.addTab('offer', {offer: new Offer(), canEditable: true});
        this.eventTabs(tab);
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

    clickContextMenu(evt: any){
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
                    this._personService.save(pers).subscribe(
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
                    this._personService.save(pers).subscribe(
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

                    this._organisationService.save(org).subscribe(
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
                this._offerService.save(o).subscribe(offer =>{
                    this.offers[this.offers.indexOf(o)] = offer;
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });

            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._offerService.save(o).subscribe(offer =>{
                    this.offers[this.offers.indexOf(o)] = offer;
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });
            } else if(evt.event == "del_obj"){
                this._offerService.delete(o).subscribe(
                    data => {
                            this.selectedOffers.splice(this.selectedOffers.indexOf(o), 1);
                            this.offers.splice(this.offers.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){
                  this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "photo"){
                  this.openPopup = {visible: true, task: "photo", offer: o, value: this.source};
            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._offerService.save(o).subscribe(offer =>{
                    this.offers[this.offers.indexOf(o)] = offer;
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });
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
        let offer_tag: HTMLElement = document.getElementsByTagName('digest-offer').item(event) as HTMLElement;
        let list: HTMLElement = document.getElementsByClassName('digest-list').item(0) as HTMLElement;
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
            return {option: k , subvalue: this.sort[k]};
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
                },
                err => console.log(err)
            );
    }

    private eventTabs(tab: any) {
        tab.getEvent().subscribe(event =>{
            if(event.type == "update"){
                for(let i = 0; i < this.offers.length; ++i){
                    if(this.offers[i].id == event.value.id){
                        this.selectedOffers[this.selectedOffers.indexOf(this.offers[i])] = event.value;
                        this.offers[i] = event.value;
                        break;
                    }
                }
            } else if(event.type == "delete"){
                for(let i = 0; i < this.offers.length; ++i){
                    if(this.offers[i].id == event.value){
                        this.selectedOffers.splice(this.selectedOffers.indexOf(this.offers[i]), 1);
                        this.offers.splice(i, 1);
                        break;
                    }
                }
            }
        });
    }
}
