import {Component, OnInit} from '@angular/core';

import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Tab} from '../../class/tab';
import {OfferService, OfferSource} from '../../service/offer.service';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {HubService} from "../../service/hub.service";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";


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
            border-bottom: 1px solid #d3d5d6;
            width: 100%;
            height: 130px;
            display: block;
        }

        digest-list digest-request:last-of-type{
            border-bottom: 1px solid #d3d5d6;
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
                     (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус контакта'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: 'owner', label: 'Принципал'},
                                  {value: 'middleman', label: 'Посредник'}
                    ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус заявки'" [firstAsName]="true"
                    [options]="[
                                  {value: 'all', label: 'Все объекты'},
                                  {value: 'my', label: 'Мои объекты'},
                                  {value: 'our', label: 'Наша компания'}
                    ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
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
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag [value]="filter?.tag" (newValue)="filter.tag = $event;"></filter-select-tag>
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
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
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
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
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
    hitsCount: number = 0;
    page: number = 0;
    perPage: number = 32;
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

    sort: any = {};

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
        let tab_sys = this._hubService.getProperty('tab_sys');
        let r = new Request();
        //r.offerTypeCode = this.filter.offerTypeCode;
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
