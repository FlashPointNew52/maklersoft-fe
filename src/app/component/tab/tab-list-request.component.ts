import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Tab} from '../../class/tab';
import {Utils} from "../../class/utils";
import {OfferSource} from '../../service/offer.service';
import {Request} from '../../entity/request';
import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";
import {PersonService} from "../../service/person.service";
import {OrganisationService} from "../../service/organisation.service";
import {Offer} from "../../entity/offer";


@Component({
    selector: 'tab-list-request',
    inputs: ['tab'],
    styles: [`
        .work-area {
            float: left;
            width: calc(100% - 1px);
            height: calc(100% - 122px);
            position: relative;
        }

        digest-request{
            border-bottom: 1px solid var(--bottom-border);
            width: 100%;
            height: 122px;
            display: block;
        }

        .digest-list digest-request:last-of-type{
            border-bottom: 1px solid var(--bottom-border);
        }

        .selected {
          background-color: var(--color-blue) !important;
        }
    `],
    template: `
        <div class="search-form" *ngIf="workAreaMode == 'map'">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'100%'"
                [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon_right"></span>
            <div class="tool-box">
                <filter-select
                     [name]="'Тип сделки'"
                     [options]="[
                                  {value: 'sale', label: 'Покупка'},
                                  {value: 'alternative', label: 'Альтернатива'},
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
                    [name]="'Статус заявки'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все заявки'},
                                  {value: 'my', label: 'Мои заявки'}
                    ]"
                    [value]="{'option' : filter.attachment}"
                    (newValue)="filter.attachment = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Стадия заявки'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: 'inactive', label: 'Не активно'},
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
                <filter-select-tag [value]="filter?.tag" (newValue)="filter.tag = $event; searchParamChanged();"></filter-select-tag>
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
                <filter-select
                        [name]="'Сортировка'" [firstAsName]="false"
                        [options]="[
                                  {value: 'recomended', label: 'Рекомендованные'},
                                  {value: 'addDate', label: 'По новизне'},
                                  {value: 'ownerPriceASC', label: 'Цена: от низкой к высокой'},
                                  {value: 'ownerPriceDESC', label: 'Цена: от высокой к низклй'}
                    ]"
                        [value]="{'option' : sort}"
                        (newValue)="sort = $event; searchParamChanged();"
                >
                </filter-select>
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+requests?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>
        <div class="pane" [style.left.px]="paneHidden ? 30 : -340">
               <div class = "source_menu">
                   <div class="add"  (click)="addRequest()">ДОБАВИТЬ</div>
                   <div (click)="toggleSource(0, 'all')" class="average" [class.active]="this.source != 1">ОБЩАЯ</div>
                   <div (click)="toggleSource(1, 'our')"  [class.active]="this.source == 1">КОМПАНИЯ</div>
               </div>

                <div class="fixed-button" (click)="toggleLeftPane()">
                    <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
                </div>
                <div class="digest-list border" (contextmenu)="contextMenu($event)" (scroll)="scroll($event)" (offClick)="this._hubService.shared_var['cm_hidden'] = true" >
                    <digest-request *ngFor="let req of requests; let i = index" [request]="req"
                            [class.selected]="selectedRequests.indexOf(req) > -1"
                            (click)="select($event, req, i)"
                            (contextmenu)="select($event, req, i)"
                            (dblclick)="openRequest(req)"
                            [active]="selectedRequests.indexOf(req) > -1"
                    >
                    </digest-request>
                </div>
        </div>
        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <yamap-view *ngSwitchCase="'map'">
    
                </yamap-view>
                <adv-view *ngSwitchCase="'advert'" [request]="selectedRequests[0]" [mode]="'request'"></adv-view>
                <files-view [full]="paneHidden" [files]="selectedRequests[0].photos" [type]="'photo'" [editMode]="false" *ngSwitchCase="'photo'"></files-view>
                <files-view [full]="paneHidden" [files]="selectedRequests[0].documents" [type]="'doc'" [editMode]="false" *ngSwitchCase="'doc'"></files-view>
            </ng-container>
        </div>
    `
})

export class TabListRequestComponent implements OnInit {
    public tab: Tab;
    source: OfferSource = OfferSource.LOCAL;
    searchQuery: string = "";
    offerTypeCode: string = 'sale';
    requests: Request[] = [];
    selectedRequests: Request[] = [];
    hitsCount: number = 0;
    page: number = 0;
    perPage: number = 32;
    paneHidden: boolean = true;
    workAreaMode: string = 'map';
    filter: any = {
        offerTypeCode: 'sale',
        isMiddleman: 'all',
        attachment: 'all',
        stageCode: 'all',
        addDate: 'all',
        tag: 'all',
        source: "our"

    };

    sort: any = 'addDate';

    lastClckIdx: number = 0;
    utilsObj = null;
    constructor(private _configService: ConfigService,
                private _hubService: HubService,
                private _requestService: RequestService,
                private _userService: UserService,
                private _sessionService: SessionService,
                private _personService: PersonService,
                private _organisationService: OrganisationService
    ) {
        this.utilsObj = new Utils(_sessionService, _personService, _organisationService);
        setTimeout(() => {
            this.tab.header = 'Заявки';
        });
    }

    ngOnInit() {
        this.tab.refreshRq.subscribe(
            sender => {
                this.listRequests();
            }
        );

        this.listRequests();
    }

    toggleSource(val, source) {
        this.source = val;
        this.filter.source = source;
        this.page = 0;
        this.listRequests();
    }


    listRequests() {
        this._requestService.list(this.page, this.perPage, this.filter, Offer.sort[this.sort], this.searchQuery, []).subscribe(
            data => {
                this.requests = data.list;
                this.hitsCount = data.hitsCount;
            },
            err => console.log(err)
        );
    }

    addRequest() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('request', {request: new Request(), canEditable: true});
    }

    searchParamChanged() {
        this.page = 0;
        this.listRequests();
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            this.listRequests();
        }
    }

    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
    }

    contextMenu(e) {
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

        let stateOpt = [];
        let states = [
            {value: 'raw', label: 'Не активен'},
            {value: 'active', label: 'Активен'},
            {value: 'work', label: 'В работе'},
            {value: 'suspended', label: 'Приостановлен'},
            {value: 'archive', label: 'Архив'}
        ];

        states.forEach(s => {
            stateOpt.push(
                {class: "entry", disabled: false, label: s.label, callback: () => {
                        c.selectedRequests.forEach(o => {
                            o.stageCode = s.value;
                            c._requestService.save(o);
                        });
                    }
                }
            );
        });
        let tag = this.selectedRequests[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedRequests.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {

                    }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                        let tab_sys = this._hubService.getProperty('tab_sys');
                        this.selectedRequests.forEach(o => {
                            let canEditable =  this._sessionService.getAccount().id == o.accountId;
                            tab_sys.addTab('offer', {offer: o, canEditable});
                        });
                    }},
                {class: "delimiter"},
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать фото",
                    callback: () => {
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry", icon: "", label: "Перейти на карту",
                    callback: () => {
                        this.workAreaMode = 'map';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать документы",
                    callback: () => {
                        this.workAreaMode = 'doc';
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Экспорт заявки в...", callback: () => {
                        this.workAreaMode = 'advert';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Заявка на ипотеку",
                    callback: () => {
                        this.workAreaMode = 'mortgage';
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить как...", items: [
                        {class: "entry", disabled: false, label: "Контакт",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_person"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Организацию",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_company"});
                            }
                        },
                    ]},
                {class: "submenu", disabled: !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить на...", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickContextMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('notes', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('diary', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Написать в чат", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('chat', event);
                        block.setShow(true, event);
                    }},
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
                // {class: "delimiter"},
                // {class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
                //         {class: "entry", disabled: false, label: "Email1"},
                //         {class: "entry", disabled: false, label: "Email2"},
                //         {class: "entry", disabled: false, label: "Email3"},
                //     ]},
                // {class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                //         {class: "entry", disabled: false, label: "Номер1"},
                //         {class: "entry", disabled: false, label: "Номер2"},
                //         {class: "entry", disabled: false, label: "Номер3"},
                //     ]},


                {class: "delimiter"},
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Сводка",
                    callback: () => {
                        this.workAreaMode = 'svodka';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Отчет",
                    callback: () => {
                        this.workAreaMode = 'report';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "История",
                    callback: () => {
                        this.workAreaMode = 'history';
                    }
                },
                {class: "submenu", disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedRequests.length == 1 ? this.selectedRequests[0] : null, tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]},
                {class: "delimiter"},
                {class: "entry", sub_class: 'del', disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                }
            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    select(event: MouseEvent, request: Request, i: number) {

        if (event.button == 2) {    // right click
            if (this.selectedRequests.indexOf(request) == -1) { // if not over selected items
                this.lastClckIdx = i;
                this.selectedRequests = [request];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedRequests.push(request);
                this.selectedRequests = [].concat(this.selectedRequests);
            } else if (event.shiftKey) {
                this.selectedRequests = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.requests[idx++];
                    this.selectedRequests.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedRequests = [request];
            }
        }
    }

    clickContextMenu(evt: any){
        this.selectedRequests.forEach(o => {
            if(evt.event == "add_to_person"){
                if(!o.person){
                   /* let pers: Person = new Person();
                    pers.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);
                    this.subscription_person = this._personService.save(pers).subscribe(
                        data => {
                            o.person = data;
                            o.personId = data.id;
                            /*this.offers.forEach(t => {
                                if(t.phones_import)
                            });
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('person', {person: o.person, canEditable: true});
                        }
                    );*/
                }
            }
            else if(evt.event == "add_to_company"){
                /*if(!o.person && !o.company && o.phoneBlock.main){
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
                }*/
            } else if(evt.event == "set_agent"){
                o.agentId = evt.agentId;
                let temp_ag = o.agent;
                o.agent = null;
                this._requestService.save(o).subscribe(request => {
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
                o.agent = temp_ag;

            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._requestService.save(o).subscribe(request =>{
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
            } else if(evt.event == "del_obj"){
                this._requestService.delete(o).subscribe(
                    data => {
                            this.selectedRequests.splice(this.selectedRequests.indexOf(o), 1);
                            this.requests.splice(this.requests.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){
                //this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._requestService.save(o).subscribe(request =>{
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
            }
        });
    }

    public openRequest(req: Request) {
        let tabSys = this._hubService.getProperty('tab_sys');
        let canEditable = this._sessionService.getUser().accountId == req.accountId;
        let tab = tabSys.addTab('request', {request: req, canEditable });
        this.eventTabs(tab);
    }

    private eventTabs(tab: any) {
        tab.getEvent().subscribe(event =>{
            if(event.type == "new"){

            } else if(event.type == "update"){
                for(let i = 0; i < this.requests.length; ++i){
                    if(this.requests[i].id == event.value.id){
                        this.selectedRequests[this.selectedRequests.indexOf(this.requests[i])] = event.value;
                        this.requests[i] = event.value;
                        break;
                    }
                }
            } else if(event.type == "delete"){
                for(let i = 0; i < this.requests.length; ++i){
                    if(this.requests[i].id == event.value){
                        this.selectedRequests.splice(this.selectedRequests.indexOf(this.requests[i]), 1);
                        this.requests.splice(i, 1);
                        break;
                    }
                }
            }
        });
    }
}
