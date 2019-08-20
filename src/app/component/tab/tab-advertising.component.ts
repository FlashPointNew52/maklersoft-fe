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
    selector: 'tab-advertising',
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
            color: #AB47BC;
            background-color: #AB47BC;
            position: relative;
            top: -2;
            width: 100vw;
            margin-bottom: 0;
        }

        .prework{
            overflow: auto;
            width: 100%;
            height: calc(100% - 117px);
        }

        .work_list, .work_list1{
            background: #f8f8f8;
            min-width: 1500px;
            min-height: 630px;
            height: 100%;
        }

        .work_list > .left_panel{
            min-width: 550px;
            width: calc(31% - 3px);
            height: 100%;
            float: left;
            overflow: hidden;
            margin-right: 3px;
            display: flex;
        }

        .work_list > .left_panel thead tr{
            color: #807982;
        }

        .work_list1 > .left_panel{
            width: 65%;
            height: 100%;
            float: left;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: space-between;
            overflow: hidden;
            background-color: #f6f8f0;
        }

        .work_list > .central_panel{
            width: calc(69% - 375px);
            max-width: calc(100% - 926px);
            min-height: 600px;
            height: 100%;
            float: left;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-content: space-between;
            margin-right: 3px;
        }

        td{
            padding: 0;
        }

        .work_list >.right_panel{
            width: 370px;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
        }

        .work_list1 >.right_panel{
            width: calc(35% - 3px);
            margin-left: 3px;
            height: 100%;
            float: left;
            overflow: hidden;
        }

        .map_container{
            width: calc(100% - 3px);
            height: calc(50% - 6px);
            max-height: calc(100% - 306px);
            display: flex;
            justify-content: space-between;
        }

        .map{
            width: calc(100% - 123px);
            position: relative;
            display: block;
            float: left;
        }

        .map_menu{
            width: 120px;
            float: left;
            background-color: #f7f7f7;
            margin-left: 3px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }
        .map_menu >div {
            height: calc(10% - 2px);
            text-align: center;
            background-color: #AB47BC;
            color: #ffffff;
            line-height: calc(10% - 2px);
            font-size: 9pt;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .map_menu >div:hover, .active_map_menu {
            background-color: rgba(18, 54, 120, 1) !important;
            color: white !important;
        }

        .work_list table, .work_list1 table{
            display: block;
            width: 100%;
            font-size: 9pt;
            border-spacing: 0;
            text-align: center;
            height: 100%;
            background-color: white;
            //min-height: 335px;
        }


        .work_list1 table{
            text-align: center;
            width: calc(100% - 6px);
            padding-left: 6px;
            height: 33%;
            font-size: 10pt;
        }

        .work_list1 .table2{
            height: calc(67% - 3px);
        }

        .work_list table tr, .work_list1 table tr{
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .work_list table tbody tr:nth-child(odd){
            background-color: #f9f9f9;
        }

        .work_list1 table tbody tr{
            color: #828282;
        }

        table tbody tr:hover{
            background-color: #f5f3f3 !important;
            cursor: hand;
        }

        .work_list1 .table1 tbody tr{
            height: 35px;
        }

        .work_list1 .table1 tbody tr:nth-child(odd){
            background-color: #f6f8f0;
        }

        .work_list1 .table2 tbody tr:nth-child(odd){
            background-color: #f3f8fd;
        }

        .work_list table tbody tr:nth-child(even), .work_list table thead tr, .work_list1 table tbody tr:nth-child(even), .work_list1 table thead tr{
            background-color: #ffffff;
        }

        .work_list table thead, .work_list1 table thead{
            display: block;
        }

        .work_list1 table thead {
            height: 17px;
            font-size: 12px;
            color: #587731;
            line-height: 17px;
        }

        .work_list1 .table2 thead {
            color: #205087;
        }

        .work_list table tbody{
            display: block;
            overflow: auto;
            height: calc(100% - 65px);
        }

        .work_list1 table tbody{
            display: block;
            overflow: auto;
            height: calc(100% - 90px);
        }

        .work_list .left_panel table .text{
            text-transform: uppercase;
            color: #4c4c4c;
            margin: 12px 0 0px 15px;
            position: relative;
            z-index: 10;
            height: 46px;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
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
                
            </div>
            <div class="inline-select">
                    
                </div>
                <div class="inline-select">
                    
                </div>
                <div class="inline-select">
                    
                </div>
                <div class="inline-select">
                    
                </div>
            </div>
        </div>
        <hr class="underline">
        <div class="prework"><div *ngIf="activeMenu == 0" class="work_list">
            <div class="left_panel">
                <table>
                    <div class="head">
                        <span class="text">Предложения</span>
                    </div>
                    <thead>
                        <tr>
                            <td style="width: 30px"></td>
                            <td style="width: 270px">Объект</td>
                            <td style="width: 65px">Интерес</td>
                            <td style="width: 55px">Заявка</td>
                            <td style="width: 55px">Показ</td>
                            <td style="width: 70px">Изменено</td>
                        </tr>
                    </thead>
                    <tbody (scroll)="scroll($event)">
                        <tr *ngFor="let offer of offers" style="height: initial;">
                            <td style="width: 30px">{{"NEW"}}</td>
                            <td>
                            </td>
                            <td style="width: 65px">4</td>
                            <td style="width: 55px">5</td>
                            <td style="width: 55px">6</td>
                            <td style="width: 70px">{{offer.changeDate | date: 'dd.MM.yy'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!------------------------------------------------------------------------------------------------------------------->
            <div class="central_panel">
                
                <div class="map_container">
                    <!--<google-map class="map"-->
                        <!--[latitude]="48.490351" [longitude]= "135.070109" [zoom]="12"-->
                    <!--&gt;-->
                    <!--</google-map>-->
                    <div class="map_menu">
                        <div [class.active_map_menu]="selectMapMenu == 1" (click)="setMenu(1)">Фото</div>
                        <div [class.active_map_menu]="selectMapMenu == 2" (click)="setMenu(2)">Карта</div>
                        <div [class.active_map_menu]="selectMapMenu == 3" (click)="setMenu(3)">Понорама</div>
                        <div [class.active_map_menu]="selectMapMenu == 4" (click)="setMenu(4)">Маршруты</div>
                        <div [class.active_map_menu]="selectMapMenu == 5" (click)="similarObjSelected()">Похожие</div>
                        <div [class.active_map_menu]="selectMapMenu == 6" (click)="requestsSelected()">Заявки</div>
                        <div [class.active_map_menu]="selectMapMenu == 7" (click)="setMenu(7)">Реклама</div>
                        <div [class.active_map_menu]="selectMapMenu == 8" (click)="setMenu(8)">Документы</div>
                        <div [class.active_map_menu]="selectMapMenu == 9" (click)="setMapQuery('Образование', 9)">Образование</div>
                        <div [class.active_map_menu]="selectMapMenu == 10" (click)="setMapQuery('магазины', 10)">Продукты</div>
                    </div>
                </div>
            </div>
            <!------------------------------------------------------------------------------------------------------------------->
            <div class="right_panel" >
                
            </div>
        </div>

<!------------------------------------------------------------------------------------------------------------------->
<!-------------------------------АНАЛИТИКА---------------------------------------------------->
<!------------------------------------------------------------------------------------------------------------------->

        <div *ngIf="activeMenu == 1" class="work_list1">
            <div class="left_panel">
                    
            </div>
            <!------------------------------------------------------------------------------------------------------------------->

            <!------------------------------------------------------------------------------------------------------------------->
            <div class="right_panel">
                <table class="table1">
                    <div style="height: 58px; display: flex; background-color: white; width: 100%; justify-content: space-between;">
                        <div style="text-transform: uppercase; color: #4c4c4c; margin: 12px 0 25px 15px; font-size: 16px;">
                            Конверсия рекламы
                        </div>
                        <div style="text-transform: uppercase;color: #008000;margin: 2px 30 20px;font-size: 20pt;">40%</div>
                    </div>
                    <thead>
                        <tr>
                            <td style="width: calc(100% - 390px)">Источник</td>
                            <td style="width: 60px">Объект</td>
                            <td style="width: 60px">Заявки</td>
                            <td style="width: 60px">Показы</td>
                            <td style="width: 60px">Цены</td>
                            <td style="width: 70px">Договора</td>
                            <td style="width: 80px">Конверсия</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let data of advArray">
                            <td style="width: calc(100% - 390px)">{{data[0]}}</td>
                            <td style="width: 60px">{{data[1]}}</td>
                            <td style="width: 60px">{{data[2]}}</td>
                            <td style="width: 60px">{{data[3]}}</td>
                            <td style="width: 60px">{{data[4]}}</td>
                            <td style="width: 70px">{{data[5]}}</td>
                            <td style="width: 80px">{{data[6] + '%'}}</td>
                        </tr>
                    </tbody>
                </table>

                <table class="table2" style="margin-top: 3px;">
                    <div style="height: 60px; display: flex; background-color: white; width: 100%; justify-content: space-between;">
                        <div style="text-transform: uppercase; color: #4c4c4c; margin: 12px 0 20px 15px; font-size: 16px;">
                            Лидеры спроса
                        </div>
                        <div style="text-transform: uppercase;color: #008000;margin: 2px 30 20px;font-size: 20pt;"></div>
                    </div>
                    <thead>
                        <tr>
                            <td style="width: 360px">Объект</td>
                            <td style="width: 65px">Интерес</td>
                            <td style="width: 55px">Заявка</td>
                            <td style="width: 70px">Показ</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let data of offers">
                            <td style="width: 360px">
                            </td>
                            <td style="width: 65px">70</td>
                            <td style="width: 55px">20</td>
                            <td style="width: 70px">150</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div *ngIf="activeMenu == 2" class="work_list1">

        </div>
        </div>
    `
})

export class TabAdvertisingComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    activeMenu: number = 0;

    chartID: string = "Chart"+Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    offers: Offer[];
    hitsCount: number = 0;
    page: number = 0;
    perPage: number = 32;
    source: OfferSource = OfferSource.LOCAL;
    filter: any = {
        stageCode: 'all',
        agentId: 'all',
        tag: 'all',
        changeDate: 90,
        offerTypeCode: 'sale',
    };

    sort: any = {};
    searchQuery: string = "";
    searchArea: any[] = [];

    advArray = [
        ['Авито', 500, 400, 329, 230, 150, 50],
        ['Фарпост', 500, 400, 329, 230, 150, -50],
        ['ВНХ', 500, 400, 329, 230, 150, -24],
        ['Из рук в руки', 500, 400, 329, 230, 150, -18],
        ['Презент', 500, 400, 329, 230, 150, 17],
        ['ЦИАН', 500, 400, 329, 230, 150, 24],
        ['Барахла', 500, 400, 329, 230, 150, -3],
        ['Авито', 500, 400, 329, 230, 150, -10]
    ];

    advArray1=[

    ]


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
        this.tab.header="РЕКЛАМА";
        this.listOffers();
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

    listOffers() {
        this._offerService.list(this.page, this.perPage, this.source, this.filter, this.sort, this.searchQuery, this.searchArea).subscribe(
            data => {

                this.hitsCount = data.hitsCount || 0;

                if (this.page == 0) {
                    this.offers = data.list;
                } else {
                    data.list.forEach(i => {
                        this.offers.push(i);
                    })
                }
            },
            err => console.log(err)
        );
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            this.page += 1;
            this.listOffers();
        }
    }

    rand(max, min){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calcHeight(){

    }

    openOffer(offer: Offer) {
        var tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('offer', {offer: offer});
    }

}
