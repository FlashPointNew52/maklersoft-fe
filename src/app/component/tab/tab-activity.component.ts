import {Component, OnInit, AfterViewInit} from '@angular/core';

import {FormatDatePipe} from '../../pipe/format-date.pipe';

import {Tab} from '../../class/tab';
import {User} from '../../entity/user';
import {Offer} from '../../entity/offer';
import {Person} from '../../entity/person';
import {Organisation} from '../../entity/organisation';
import {Request} from '../../entity/request';
import {Task} from '../../class/task';
import {HistoryRecord} from '../../class/historyRecord';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {ConfigService} from '../../service/config.service';
import {OfferService, OfferSource} from '../../service/offer.service';
import {RequestService} from '../../service/request.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {PersonService} from '../../service/person.service';
import {OrganisationService} from '../../service/organisation.service';
import {AnalysisService} from '../../service/analysis.service';
import {SessionService} from "../../service/session.service";

@Component({
    selector: 'tab-activity',
    inputs: ['tab'],
    styles: [`

        .search-form {
            background: #fff;
            z-index: 1;
            width: 38%;
            margin-left: 610;
            margin-top: 27px;
        }

        .tool-box {
            height: 30px;
            margin: 0 12px;
        }

        .inline-select {
            display: inline-block;
            height: 20px;
            padding: 0 15px;
            font-size: 14px;
            color: #666;
        }

        .round_menu{
            width: 170px;
            height: 50px;
            position: absolute;
            left: 450;
            top: 15px;
            text-align: center;
            z-index: 10;
            line-height: 50px;
            display: flex;
            justify-content: space-around;
        }

        .search-box {
            position: relative;
            margin: 12px;
            margin-bottom: 8px;
        }

        .button {
            height: 50px;
            width: 50px;
            border-radius: 40px;
            cursor: pointer;
            font-size: 11px;
            line-height: 120px;
            background-size: cover;
            background-color: #bcbfc1;
            color: #807982;
            border: 2px solid #bcbfc1;
        }

        .button_active, .button:hover{
            border-color: #1061c4;
            background-color: #1061c4;
        }

        .underline{
            border: 2px solid;
            color: #d6543f;
            background-color: #d6543f;
            position: relative;
            top: -2;
            width: 100vw;
            margin-bottom: 0;
        }

        .work_list, .work_list1{
            width: 100%;
            height: calc(100% - 117px);
            overflow: hidden;
        }

        .work_list .left_panel{
            width: 370px;
            height: 100%;
            float: right;
        }

        .work_list .central_panel{
            width: calc(100% - 370px);
            height: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            float: left;
        }

        .work_list .central_panel > div{
            height: 100%;
            background-color: #f8f8f8;
            display: flex;
        }

        .stage{
            height: 100%;
            position: relative;
            flex: 0 0 300px;
            width: 300px;
        }

        .stage > .label{
            width: 100%;
            height: 35px;
            background-color: #4dad15;
            color: white;
            font-size: 15px;
            line-height: 35px;
            text-align: center;
            cursor: hand;
        }

        .stage > .summ{
            width: calc(100% - 6px);
            height: 60px;
            background-color: #e6e7e8;
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stage > .summ > div:first-child{
            color: #4dad15;
            margin-right: 15px;
            font-size: 29px;
        }

        .stage > .summ > div:last-child:not(:first-child){
            font-size: 20px;
        }

        .stage > .label:hover, .active .label, .stage:first-child > .label{
            background-color: #008cdb !important;
        }

        .stage:last-child > .label{
            background: #d6543f;
        }

        .stage:not(:last-child):not(:first-child):after{
            content: " ";
            width: 19px;
            height: 35px;
            background-image: url(assets/activity_arrow.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            display: block;
            position: absolute;
            right: -11px;
            top: 0;
        }

        .stage:first-child:after{
            content: " ";
            width: 8px;
            height: 35px;
            background-color: #f8f8f8;
            display: block;
            position: absolute;
            right: 0px;
            top: 0;
        }

        .stage_body{
            overflow: auto;
            height: calc(100% - 100px);
            width: calc(100% - 7px);
        }

    `],
    template: `
        <div class="header-label-abs" style="margin: 2px 0 0 30px;">{{ tab.header }}</div>
        <div class = "round_menu">
            <div (click)="toggleSource('main')"    class="button"  [class.button_active]="this.activeMenu == 0" [style.background-image]="'url(assets/main_offers.png)'">Главная</div>
            <div (click)="toggleSource('analitic')" class="button" [class.button_active]="this.activeMenu == 1" [style.background-image]="'url(assets/analitic.png)'">Отчеты</div>
            <div (click)="toggleSource('history')"  class="button" [class.button_active]="this.activeMenu == 2" [style.background-image]="'url(assets/history.png)'">История</div>
        </div>
        <div class="search-form">
            <div class="search-box">
                <input type="text" class="" placeholder="" style="height: 28px; width: 100%;
                background-color: rgb(247, 247, 247); border: 1px solid rgba(204, 204, 204, 0.47);"
                    [(ngModel)]="searchQuery" (keyup)="$event"
                >
                <span class="icon-search" style="position: absolute; right: 12px; top: 7px;"></span>
            </div>
            <div class="tool-box">


            <div class="inline-select">
                <ui-select class="view-value edit-value"
                    [options] = "[
                        {value: 'sale', label: 'Мои предложения'},
                        {value: 'rent', label: 'Не мои предложения'}
                    ]"
                    [value]="'sale'"
                    [config]="{icon: 'icon-', draw_arrow: true}"
                    (onChange)="null"
                    >
                </ui-select>
            </div>
            <div class="inline-select">
                    <ui-select class="view-value edit-value"
                        [options] = "[
                            {value: 0, label: 'Все'},
                            {value: 1, label: 'Красный', icon: 'icon-circle tag-red'},
                            {value: 2, label: 'Оранжевый', icon: 'icon-circle tag-orange'},
                            {value: 3, label: 'Желтый', icon: 'icon-circle tag-yellow'},
                            {value: 4, label: 'Зеленый', icon: 'icon-circle tag-green'},
                            {value: 5, label: 'Голубой', icon: 'icon-circle tag-blue'},
                            {value: 6, label: 'Лиловый', icon: 'icon-circle tag-violet'},
                            {value: 7, label: 'Серый', icon: 'icon-circle tag-gray'}
                        ]"
                        [value]="0"
                        [config]="{icon: 'icon-tag', draw_arrow: true}"
                        (onChange)="null"
                        >
                    </ui-select>
                </div>
                <div class="inline-select">
                    <ui-select class="view-value edit-value"
                        [options] = "[
                            {value: 1, label: '1 день'},
                            {value: 2, label: '3 дня'},
                            {value: 3, label: 'Неделя'},
                            {value: 4, label: '2 недели'},
                            {value: 5, label: 'Месяц'},
                            {value: 6, label: '3 месяца'},
                            {value: 7, label: 'Все'}
                        ]"
                        [value]="6"
                        [config]="{icon: 'icon-month', drawArrow: true}"
                        (onChange)="null"
                    >
                    </ui-select>
                </div>
                <div class="inline-select">
                    <ui-select class="view-value edit-value"
                        [options]="[
                            {value: 'all', label: 'Все'},
                            {value: 'raw', label: 'Не активен'},
                            {value: 'active', label: 'Активен'},
                            {value: 'price', label: 'Прайс'},
                            {value: 'deal', label: 'Сделка'},
                            {value: 'suspended', label: 'Приостановлен'},
                            {value: 'archive', label: 'Архив'}
                        ]"
                        [value]="filter.stage"
                        [config]="{icon: 'icon-square', drawArrow: true}"
                        (onChange)="filter.stageCode = $event.selected.value; searchParamChanged($event);"
                    >
                    </ui-select>
                </div>
                <div class="inline-select">
                    <ui-select class="view-value edit-value"
                        [options] = "[
                            {value: 'sale', label: 'Продажа'},
                            {value: 'rent', label: 'Аренда'}
                        ]"
                        [value]="'sale'"
                        [config]="{icon: 'icon-', draw_arrow: true}"
                        (onChange)="null"
                        >
                    </ui-select>
                </div>
            </div>
        </div>
        <hr class="underline">
        <div *ngIf="activeMenu == 0" class="work_list">
            <div class="central_panel">
                <div>
                    <div class='stage' [style.z-index]="101" *ngIf="!is_offer">
                        <div class='label' >{{main_stage.label}}</div>
                        <div class="summ">
                            <div *ngIf="main_stage.summ && main_stage.summ > 0">{{split_number(main_stage.summ)}}&#8381;</div>
                        </div>
                        <digest-offer-table2 *ngFor="let data of main_stage.offers"
                            style="display: block; background-color: transparent;"
                            [offer]="data"
                            [withPhoto]="false"
                            (touchstart)="tStart(data)"
                            (touchend)="tEnd(data)"
                        >
                        </digest-offer-table2>
                    </div>
                    <div class='stage' [style.z-index]="101" *ngIf="is_offer">
                        <div class='label' >{{main_stage.label}}</div>
                        <div class="summ">

                        </div>
                        <digest-offer-table2
                            style="display: block; background-color: transparent;"
                            [offer]="main_offer"
                            [withPhoto]="false"
                            (touchstart)="tStart(data)"
                            (touchend)="tEnd(data)"
                        >
                        </digest-offer-table2>
                    </div>
                    <div class='stage' *ngFor="let stage of main_stage.substage; let i=index" [class.active] = "stage.active" [style.z-index]="100-i">
                        <div class='label' (click)="set_stage(i)">{{stage.label}} ({{stage.offers?.length}})</div>
                        <div class="summ">

                        </div>
                        <div class='stage_body'>
                            <digest-offer-table2 *ngFor="let data of stage.offers"
                                    style="display: block; background-color: transparent;"
                                    [offer]="data"
                                    [withPhoto]="false"
                                    (click)="click($event, data)"
                                    (contextmenu)="click($event, data)"
                                    (dblclick)="openOffer(data)"
                                    (touchstart)="tStart(data)"
                                    (touchend)="tEnd(data)"
                            >
                            </digest-offer-table2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="left_panel">

            </div>
        </div>


    `
})

export class TabActivityComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    activeMenu: number = 0;
    source: OfferSource = OfferSource.LOCAL;
    filter: any = {
        stageCode: 'all',
        agentId: 'all',
        tag: 'all',
        changeDate: 90,
        offerTypeCode: 'sale',
    };
    main_offer: any
    main_stage: any;
    is_offer: boolean;

    constructor(private _hubService: HubService,
                private _userService: UserService,
                private _configService: ConfigService,
                private _offerService: OfferService,
                private _analysisService: AnalysisService,
                private _historyService: HistoryService,
                private _sessionService: SessionService
    ) {

    }

    ngOnInit() {
        this.tab.header="Активность стадии";
        console.log(this.tab);
        this.is_offer = this.tab.args.offer ? true : false;
        this.main_stage = this.tab.args.stage;
        if(this.is_offer)
            this.main_offer = this.tab.args.offer;
        for (let i = 0; i<this.main_stage.substage.length; ++i){
            this.listOffers(i);
        }
    }

    ngAfterViewInit() {

    }

    toggleSource(s: string) {
        if (s == 'main') {
            this.activeMenu = 0;
        } else if(s == 'analitic') {
            this.activeMenu = 1;
        }else {
            this.activeMenu = 2;
        }
    }

    set_stage(i:number){
        this.main_stage.substage.forEach(stage => {
            stage.active = false;
        })
        this.main_stage.substage[i].active = true;
    }

    listOffers(i: number) {
        this._offerService.list(
            this.main_stage.substage[i].page,
            10,
            this.source,
            {   stageCode: this.main_stage.substage[i].value,
                agentId: this._sessionService.getUser().id,
                tag: 'all',
                changeDate: 90,
                offerTypeCode: 'sale',
            },
            {},
            "",
            []
        ).subscribe(
            data => {
                if (this.main_stage.substage[i].page == 0) {
                    this.main_stage.substage[i].offers = data.list;
                } else {
                    data.list.forEach(i => {
                        this.main_stage.substage[i].offers.push(i);
                    })
                }
            },
            err => console.log(err)
        );
    }

    split_number(n): string {
        n += "";
        n = new Array(4 - n.length % 3).join("U") + n;
        return n.replace(/([0-9U]{3})/g, "$1 ").replace(/U/g, "");
    }

}
