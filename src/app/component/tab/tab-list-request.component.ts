import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Tab} from '../../class/tab';
import {OfferService, OfferSource} from '../../service/offer.service';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {HubService} from "../../service/hub.service";
import {Observable} from "rxjs";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";


@Component({
    selector: 'tab-list-request',
    inputs: ['tab'],
    styles: [`
        .work-area {
            float: left;
            height: calc(100vh - 122px);
            margin-top: 122px;
            width: calc(100vw - 30px);
        }
    `],
    template: `
        <div class="search-form">
            <input type="text" class="input_line" placeholder="" [style.width]="'calc(100% - 108px)'"
                [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon"></span>
            <div (click)="toggleDraw()" class="deactivate_draw" [class.activate_draw]="mapDrawAllowed">ОБВЕСТИ</div>
            <div class="tool-box">
                <ui-filter-select class="filter"
                     [options]="[
                                  {class: 'entry', value: 'sale', label: 'Продажа'},
                                  {class: 'entry', value: 'rent', label: 'Аренда'}
                     ]"
                     [value]="{'option' : filter.offerTypeCode}"
                     (onChange)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </ui-filter-select>
                <ui-filter-select class="filter"
                            [options]="stateCodeOptions"
                            [value]="{'option' : filter.stateCode}"
                            (onChange)="filter.stateCode = $event.option; searchParamChanged();"
                >
                </ui-filter-select>
                <ui-filter-tag-select class="filter"
                            [value]="filter?.tag"
                            (onChange)="filter.tag = $event; searchParamChanged();"
                >
                </ui-filter-tag-select>
                <ui-filter-select class="filter"
                            [options]="[
                                {class: 'entry', value: '1', label: '1 день'},
                                {class: 'entry', value: '3', label: '3 дня'},
                                {class: 'entry', value: '7', label: 'Неделя'},
                                {class: 'entry', value: '17', label: '2 недели'},
                                {class: 'entry', value: '30', label: 'Месяц'},
                                {class: 'entry', value: '90', label: '3 месяца'},
                                {class: 'entry', value: 'all', label: 'Все'}
                            ]"
                            [value]="{'option' : filter.changeDate}"
                            (onChange)="filter.changeDate = $event.option; searchParamChanged();"
                >
                </ui-filter-select>
                <ui-filter-tag-select class="filter"
                                              [value]="filter?.tag"
                                              (onChange)="filter.tag = $event; searchParamChanged();"
                >
                </ui-filter-tag-select>
                <ui-filter-select class="filter"
                            [options]="[
                                {class:'submenu', value: 'addDate', label: 'Дате добавления', items:  [
                                    {class: 'entry', value: 'ASC', label: 'По возрастанию'},
                                    {class: 'entry', value: 'DESC', label: 'По убыванию'}
                                ]},
                                {class:'submenu', value: 'changeDate', label: 'Дате изменения' , items: [
                                    {class: 'entry', value: 'ASC', label: 'По возрастанию'},
                                    {class: 'entry', value: 'DESC', label: 'По убыванию'}
                                ]},
                                {class:'submenu', value: 'assignDate', label: 'Дате назначения' , items: [
                                    {class: 'entry', value: 'ASC', label: 'По возрастанию'},
                                    {class: 'entry', value: 'DESC', label: 'По убыванию'}
                                ]},
                                {class:'submenu', value: 'budget', label: 'Бюджету', items: [
                                    {class: 'entry', value: 'ASC', label: 'По возрастанию'},
                                    {class: 'entry', value: 'DESC', label: 'По убыванию'}
                                ]}
                            ]"
                            [value]="getSort()"
                            (onChange)="setSort($event.option, $event.subvalue); searchParamChanged();"
                >
                </ui-filter-select>
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+requests?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>
        <div class="pane" [style.width.px]="paneWidth">
               <div class = "source_menu">
                   <div (click)="addRequest()">Добавить</div>
                   <div (click)="toggleSource('import')" [class.active]="this.source != 1">Общая</div>
                   <div (click)="toggleSource('local')"  [class.active]="this.source == 1">Компания</div>
               </div>
                
                <div class="fixed-button" (click)="toggleLeftPane()">
                    <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
                </div>
                <div class="digest-list">
                    <digest-request *ngFor="let r of requests" [request]="r">
                    </digest-request>
                </div>
        </div>
         <div class="work-area">
                <div style="width: 100px; height: 100px;position: absolute; bottom: 0; left: 50%;" (click)="addRequest()"></div>
         </div>
    `
})

export class TabListRequestComponent implements OnInit {
    public tab: Tab;
    isImport: boolean = false;
    source: OfferSource = OfferSource.LOCAL;
    searchQuery: string = "";
    offerTypeCode: string = 'sale';
    requests: Request[] = [];
    hitsCount: number = 0;
    page: number = 0;
    perPage: number = 32;
    main_menu: boolean = true;
    paneHidden: boolean = false;
    paneWidth: number;
    mapDrawAllowed = false;
    searchArea: any[] = [];
    filter: any = {
        agentId: 'all',
        stateCode: 'all',
        tag: 'all',
        offerTypeCode: 'sale',
    };

    stateCodeOptions = [{value: 'all', label: 'Все'}];

    stageCodeOptions = [
        {value: 'all', label: 'Все'},
        {value: 'raw', label: 'Не активен'},
        {value: 'active', label: 'Активен'},
        {value: 'listing', label: 'Листинг'},
        {value: 'deal', label: 'Сделка'},
        {value: 'suspended', label: 'Приостановлен'},
        {value: 'archive', label: 'Архив'}
    ];

    sort: any = {};

    agentOpts = [
        {class: 'entry', value: 'all', label: 'Все заявки', bold: true},
        {class: 'entry', value: 'realtor', label: 'Конкуренты', bold: true},
        {class: 'entry', value: 'partner', label: 'Партнеры', bold: true},
        {class: 'entry', value: 'owner', label: 'Частные лица', bold: true},
        {class: 'entry', value: 'client', label: 'Клиенты', bold: true},
        {class: 'entry', value: 'my', label: 'Мои заявки', bold: true}
    ];

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
        )

        this._userService.list(0, 10, {}, {}, null).subscribe(agents => {
            for (let i = 0; i < agents.length; i++) {
                var a = agents[i];
                this.agentOpts.push({
                    class: 'entry',
                    value: '' + a.id,
                    label: a.name,
                    bold: false
                });
            }
        });

        this.listRequests();
    }

    toggleSource(s: string) {
        if (s == 'local')
            this.source = OfferSource.LOCAL;
        else
            this.source = OfferSource.IMPORT;

        this.page = 0;
        this.listRequests();
    }

    toggleDraw() {
        this.mapDrawAllowed = !this.mapDrawAllowed;
        if (!this.mapDrawAllowed) {
            this.page = 0;
            this.requests = [];
            this.searchArea = [];
        }
    }

    finishDraw(e) {
        this.page = 0;
        this.requests = [];
        this.searchArea = e.coords;
        this.listRequests();
    }

    listRequests() {
        this._requestService.list(this.page, this.perPage, this.source, this.filter, this.sort, this.searchQuery, this.searchArea).subscribe(
            data => {
                this.requests = data.list;
                this.hitsCount = data.hitsCount;
            },
            err => console.log(err)
        );
    }

    addRequest() {
        var tab_sys = this._hubService.getProperty('tab_sys');
        var r = new Request();
        r.offerTypeCode = this.filter.offerTypeCode;
        tab_sys.addTab('request', {request: r});
    }

    searchParamChanged() {
        this.page = 0;
        this.listRequests();
    }

    getSort(){
        for (var k in this.sort) {
            return {"option" : k , "subvalue": this.sort[k]};
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
        this.calcSize();
    }

    calcSize() {
        if (this.paneHidden)
            this.paneWidth = 0;
        else
            this.paneWidth = 370;
    }
}
