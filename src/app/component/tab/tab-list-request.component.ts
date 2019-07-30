import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Tab} from '../../class/tab';
import {Utils} from "../../class/utils";
import {OfferService, OfferSource} from '../../service/offer.service';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";
import {Person} from "../../entity/person";
import {PhoneBlock} from "../../class/phoneBlock";
import {Organisation} from "../../entity/organisation";


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

        digest-list digest-request:last-of-type{
            border-bottom: 1px solid var(--bottom-border);
        }

        .selected { 
          background-color: var(--selected-digest) !important;
        }
    `],
    template: `
        <div class="search-form">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'100%'"
                [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon_right"></span>
            <div class="tool-box">
                <filter-select
                     [name]="'Тип сделки'"
                     [options]="[
                                  {value: 'sale', label: 'Покупка'},
                                  {value: 'alternative', label: 'Альтернатива'},
                                  {value: 'exchange', label: 'Мена'},
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
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+requests?.length }}</div>
            </div>
        </div> 

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>
        <div class="pane" [style.width.px]="paneHidden ? 0 : 370">
               <div class = "source_menu">
                   <div (click)="addRequest()">ДОБАВИТЬ</div>
                   <div (click)="toggleSource(0, 'all')" [class.active]="this.source != 1">ОБЩАЯ</div>
                   <div (click)="toggleSource(1, 'our')"  [class.active]="this.source == 1">КОМПАНИЯ</div>
               </div>

                <div class="fixed-button" (click)="toggleLeftPane()">
                    <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
                </div>
                <div class="digest-list" (contextmenu)="showContextMenu($event)">
                    <digest-request *ngFor="let req of requests; let i = index" [request]="req"
                            [class.selected]="selectedRequests.indexOf(req) > -1"
                            (click)="select($event, req, i)"
                            (contextmenu)="select($event, req, i)"
                            (dblclick)="dblClick(req)"
                    >
                    </digest-request>
                </div>
        </div>
        <div class="work-area">
            <yamap-view>

            </yamap-view>
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
    paneHidden: boolean = false;

    filter: any = {
        offerTypeCode: 'sale',
        isMiddleman: 'all',
        attachment: 'all',
        stageCode: 'all',
        addDate: 'all',
        tag: 'all',
        source: "our"

    };

    stateCodeOptions = [{value: 'all', label: 'Все'}];

    sort: any = {};

    lastClckIdx: number = 0;

    constructor(private _configService: ConfigService,
                private _hubService: HubService,
                private _requestService: RequestService,
                private _userService: UserService,
                private _sessionService: SessionService,
    ) {
        setTimeout(() => {
            this.tab.header = 'Заявки';
        });
    }

    ngOnInit() {
        this.stateCodeOptions = this.stateCodeOptions.concat(Offer.stateCodeOptions);
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
        this._requestService.list(this.page, this.perPage, this.filter, this.sort, this.searchQuery, []).subscribe(
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

    getSort(){
        for(let k in this.sort) {
            if (this.sort.hasOwnProperty(k))
                return {option: k , subvalue: this.sort[k]};
        }
    }

    setSort(val1, val2){
        this.sort = {};
        this.sort[val1] = val2;
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            this.listRequests();
        }
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
                this.clickMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
            }}];
        for (let op of this._userService.cacheUsers){
            op.callback = () => {
                this.clickMenu({event: "set_agent", agentId: op.value});
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
                            tab_sys.addTab('offer', {offer: o, canEditable: canEditable});
                        });
                    }},
                {class: "entry", disabled:  Utils.canImpact(this.selectedRequests, this._sessionService.getUser().accountId) ? false : true, icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickMenu({event: "del_obj"});
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                        {class: "entry", disabled: false, label: "Как Контакт",
                            callback: () => {
                                this.clickMenu({event: "add_to_person"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Как Организацию",
                            callback: () => {
                                this.clickMenu({event: "add_to_company"});
                            }
                        },
                    ]},
                {class: "submenu", disabled: Utils.canImpact(this.selectedRequests, this._sessionService.getUser().accountId) ? false : true, icon: "", label: "Назначить", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: [

                    ]},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('notes', event);
                        block.setShow(true, event);
                    }},
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
                {class: "submenu", disabled: false, icon: "", label: "Написать в чат", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('chat', event);
                        block.setShow(true, event);
                    }},
                {class: "delimiter"},
                {class: "submenu", disabled:  Utils.canImpact(this.selectedRequests, this._sessionService.getUser().accountId) ? false : true, icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedRequests.length == 1 ? this.selectedRequests[0] : null, tag: tag,
                            callback: (new_tag) => {
                                this.clickMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]}

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

    clickMenu(evt: any){
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
                this._requestService.save(o).subscribe(data => {

                    this.requests[this.requests.indexOf(o)] = data;
                    o = data;
                });
                o.agent = temp_ag;

            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._requestService.save(o);
            } else if(evt.event == "del_obj"){
                /*this.subscription_offer = this._requestService.delete(o).subscribe(
                    data => {
                        this.selectedRequests.splice(this.selectedRequests.indexOf(o), 1);
                        this.requests.splice(this.requests.indexOf(o), 1);
                    }
                );*/
            } else if(evt.event == "check"){
                //this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._requestService.save(o);
            } else {
                this._requestService.save(o);
            }
        });
    }

    public dblClick(req: Request) {
        let tabSys = this._hubService.getProperty('tab_sys');
        let canEditable = this._sessionService.getUser().accountId == req.accountId;
        tabSys.addTab('request', {request: req, canEditable });
    }
}
