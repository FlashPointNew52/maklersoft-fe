import {AfterViewInit, Component} from '@angular/core';
import {Tab} from '../../class/tab';
import {SessionService} from "../../service/session.service";
import {HubService} from '../../service/hub.service';
import {Observable} from "rxjs";
import {User} from "../../entity/user";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {Utils} from "../../class/utils";
import {Chart} from 'chart.js'

@Component({
    selector: 'tab-main',
    inputs: ['tab'],
    styles: [`
        .activity-info, .tile-group, .tile-top, .tile-bot, .tile-bot.bottom, .flex-col, .tile-top.main,
        .addition-tiles, .new-tasks, .activity-head, .person-act-info, .inner-ur-act {
            display: flex;
        }

        .white-font {
            color: white !important;
        }

        .flex-col {
            flex-direction: column;
        }

        .tile-num-block {
            width: calc(50% - 1px);
            align-items: center;
            justify-content: center;
        }

        .flex-col .num {
            font-size: 24px;
        }

        .flex-col .num-title {
            font-size: 10px;
        }

        .flex-col.tile-left {
            flex: 1 1 auto;
        }

        .dif-line {
            width: 1px;
            height: 55px;
            background-color: white;
        }

        .tile-board {
            height: calc(100vh - 100px);
            overflow: scroll;
            position: relative;
            background-color: #f1f1f2;
            padding-left: 30px;
            width: 100%;
            padding-top: 30px;
        }

        .tile-group {
            width: calc(100% - 30px);
            padding-top: 20px;
            position: relative;
        }

        .tile-top {
            height: 100px;
            padding: 15px 0 0 25px;
            background-color: #4e69aa;
        }

        .tile-top.main {
            flex: 1 1 calc(20% - 30px);
            margin-right: 10px;
            padding-right: 20px;
            height: 110px;
        }

        .tile-top .num {
            font-size: 30px;
            padding-right: 30px;
            position: relative;
            top: -8px;
        }

        .tile-bot {
            height: 185px;
            flex-direction: column;
            background-color: #4e69aa;
            flex: 1 1 calc(25% - 15px);
            margin-right: 15px;
        }

        .tile-bot.bottom {
            height: 85px;
            background-color: #3b5998;
            align-items: center;
            justify-content: center;
            flex-direction: row;
        }

        .tile-top:hover, .tile-bot:hover .tile-top {
            background-color: #455f9d !important;
        }

        .tile-top:hover .tile-bot, .tile-bot:hover, .tile-bot:hover .tile-bot, .blue-tile:hover {
            background-color: #385490 !important;
        }

        .tile-top:hover .white-font, .tile-bot:hover .white-font, .blue-tile:hover .white-font {
            color: #c1bed2 !important;
        }

        .tile-top.main:last-child, .tile-bot:last-child {
            margin-right: 0;
        }

        .block-title {
            font-size: 18px;
        }

        .block-title-p {
            font-size: 12px;
            color: #72727D;
        }

        .block-title.persents {
            font-size: 24px;
        }

        .tile-group .tile-group-title {
            color: #ffffff;
            font-size: 18px;
            line-height: 20px;
            position: absolute;
            top: 10px;
            left: 0;
        }

        .user-badge {
            color: #eeeeee;
        }

        .main-head {
            background-color: white;
        }

        .tile-title {
            font-size: 16px;
        }

        .tile-description {
            font-size: 12px;
            max-width: 240px;
        }

        .activity-block {
            width: calc(100% - 30px);
            background-color: white;
            padding-top: 25px;
            margin: 40px 30px 25px 0;
        }

        .activity-block.persons {
            padding-bottom: 0;
        }

        .activity-head {
            padding-left: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #D3D5D6;
        }

        .activity-head .num {
            margin-left: 20px;
            position: relative;
            top: -8px;
        }

        .logo-title {
            font-family: SFNS, sans-serif;
            font-size: 28px;
            text-transform: none;
            font-weight: bold;
            margin: 45px 0 0 30px;
            width: 30%;
        }

        .graph-block {
            width: calc(100% - 25px);
            height: 325px; 
            /*display: flex;*/
            /*justify-content: flex-start;*/
            
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 20px;
            overflow: hidden;
        }

        .activity-info { 
            height: 100px;
        }

        .new-tasks {
            height: 90px;
            width: 100%;
            border-bottom: 1px solid #D3D5D6;
            min-height: 90px;
        }

        .new-tasks .block {
            width: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .task-num {
            font-size: 28px;
        }

        .activity-info .block {
            width: 20%;
            align-items: center;
            justify-content: center;
        }

        .block .title {
            font-size: 10px;
            color: #72727D;
        }

        .block .title-info {
            font-size: 12px;
            color: #252F32;
            font-weight: bold;
            min-width: 220px;
            width: fit-content;
            text-align: center;
            padding: 7px 0 15px;
        }

        .title.job {
            font-size: 12px !important;
        }

        .progress-bar {
            position: relative;
            width: calc(100% - 50px);
            height: 6px;
            overflow: hidden;
        }

        .progress-bar.one {
            background: #E53935;
        }

        .progress-bar.two {
            background: #5D75B3;
        }

        .progress-bar.three {
            background: #BDC0C1;
        }

        .progress-bar.four {
            background: #47AD5D;
        }

        .progress-bar.five {
            background: #677578;
        }

        .strips {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: calc(20% / 100) 100%; /* Ширина деления = 6px / 2 = 3px */
        }

        .grayback {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #EBEBEB;
        }

        .grayback.one {
            left: 34%; /* Текущее состояние */
        }

        .grayback.two {
            left: 34%; /* Текущее состояние */
        }

        .grayback.three {
            left: 70%; /* Текущее состояние */
        }

        .grayback.four {
            left: 34%; /* Текущее состояние */
        }

        .grayback.five {
            left: 10%; /* Текущее состояние */
        }

        .addition-tiles {
            width: calc(100% - 30px);
        }

        .addition-tiles .block {
            width: calc(100% / 6);
            height: 110px;
            background-color: #3B5998;
            margin-right: 7px;
            margin-top: 15px;
            padding: 10px 0 0 25px;
        }

        .addition-tiles .block:last-child {
            margin-right: 0;
        }

        .addition-title {
            font-size: 14px;
            height: 50%;
        }

        .addition-description {
            font-size: 12px;
            height: 50%;
        }

        .line-block {
            height: 50px;
            padding-left: 10px;
            border-left: 5px solid #3B5998;
        }

        .person-act-info {
            height: 80px;
            width: 100%;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #D3D5D6;
        }
        .person-act-info:hover{
            background-color: #f6f6f6;
        }
        .person-act-info.ur {
            justify-content: flex-start;
        }

        .person-act-info .block {
            width: 25%;
            display: flex;
        }

        .person-act-info .ur-block {
            width: 30%;
        }

        .block.ur {
            width: auto !important;
        }

        .block-person {
            min-width: 330px;
        }

        .block img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-right: 20px;
            margin-left: 30px;
        }

        .inner-ur-act {
            align-items: flex-end;
        }

        .inner-person-act {
            width: 70%;
            align-items: flex-end;
        }

        .inner-person-act .title, .inner-ur-act .title {
            font-size: 12px;
            margin-bottom: 10px;
            color: #72727D;
        }

        .inner-ur-act .progress-bar {
            width: 100% !important;
        }

        .inner-person-act .progress-bar {
            width: 80%;
        }

        .act-title {
            color: #72727D;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .flex-col.person {
            justify-content: center;
        }

        .user-name {
            padding: 0 !important;
            text-align: unset !important;
        }

        .persons-scroll {
            overflow-y: auto;
            height: auto;
            max-height: 400px;
        }
    `],
    template: `
        <div class="head main-head">
          <span class="logo-title">
            maklersoft
          </span>
        </div>
        <div class="tile-board" style="">

            <!--<div class="user-badge">-->
            <!--<span> {{ (user | async)?.login }} </span>  <span (click)="logout()"> выйти </span>-->
            <!--</div>-->
            <div class="block-title">ОТОБРАЖЕНИЕ ТЕКУЩИХ ЗНАЧЕНИЙ</div>
            <div class="tile-group">
                <div class="tile-top main">
                    <div class="flex-col tile-left">
                        <div class="tile-title white-font">ЗАДАЧИ НА СЕГОДНЯ</div>
                        <div class="tile-description white-font">Новые, На сегодня...</div>
                    </div>
                    <div class="num white-font">17</div>
                </div>
                <div class="tile-top main" (click)="turnTo('daily', {})">
                    <div class="flex-col tile-left">
                        <div class="tile-title white-font">ЕЖЕДНЕВНИК</div>
                        <div class="tile-description white-font">Задачи, Выполненые, Просроченые...</div>
                    </div>
                    <div class="num white-font">17</div>
                </div>
                <div class="tile-top main ">
                    <div class="flex-col tile-left">
                        <div class="tile-title white-font">СООБЩЕНИЯ</div>
                        <div class="tile-description white-font">Новые</div>
                    </div>
                    <div class="num white-font">17</div>
                </div>
                <div class="tile-top main ">
                    <div class="flex-col tile-left">
                        <div class="tile-title white-font">ЗАМЕТКИ</div>
                    </div>
                    <div class="num white-font">17</div>
                </div>
                <div class="tile-top main ">
                    <div class="flex-col tile-left">
                        <div class="tile-title white-font">ЧАТ</div>
                        <div class="tile-description white-font">Новые сообщения</div>
                    </div>
                    <div class="num white-font">17</div>
                </div>
            </div>

            <div class="tile-group">
                <div class="tile-bot">
                    <div class="tile-top" (click)="turnTo('list_offer', {})">
                        <div class="flex-col tile-left">
                            <div class="tile-title white-font">ПРЕДЛОЖЕНИЯ</div>
                            <div class="tile-description white-font">Объекты, Аренда, Продажа...</div>
                        </div>
                        <div class="num white-font">17</div>
                    </div>
                    <div class="tile-bot bottom">
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">717</div>
                            <div class="num-title white-font">ПОСТУПИЛО</div>
                        </div>
                        <div class="dif-line"></div>
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">13</div>
                            <div class="num-title white-font">В ЛИСТИНГЕ</div>
                        </div>
                    </div>
                </div>
                <div class="tile-bot">
                    <div class="tile-top" (click)="turnTo('list_request', {})">
                        <div class="flex-col tile-left">
                            <div class="tile-title white-font">ЗАЯВКИ</div>
                            <div class="tile-description white-font">Подбор недвижимости</div>
                        </div>
                        <div class="num white-font">17</div>
                    </div>
                    <div class="tile-bot bottom">
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">717</div>
                            <div class="num-title white-font">ПОСТУПИЛО</div>
                        </div>
                        <div class="dif-line"></div>
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">13</div>
                            <div class="num-title white-font">В ЛИСТИНГЕ</div>
                        </div>
                    </div>
                </div>
                <div class="tile-bot">
                    <div class="tile-top" (click)="turnTo('daily', {})">
                        <div class="flex-col tile-left">
                            <div class="tile-title white-font">СДЕЛКИ</div>
                            <div class="tile-description white-font">Организация работы, Регламенты
                                Ежедневник, Планировщик...
                            </div>
                        </div>
                        <div class="num white-font">17</div>
                    </div>
                    <div class="tile-bot bottom">
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">717</div>
                            <div class="num-title white-font">ПОСТУПИЛО</div>
                        </div>
                        <div class="dif-line"></div>
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">13</div>
                            <div class="num-title white-font">В ЛИСТИНГЕ</div>
                        </div>
                    </div>
                </div>
                <div class="tile-bot">
                    <div class="tile-top">
                        <div class="flex-col tile-left">
                            <div class="tile-title white-font">АНАЛИТИКА</div>
                            <div class="tile-description white-font">Отчеты, Графики, Объекты, Заявки,
                                Пользователи, Конверсия...
                            </div>
                        </div>
                        <div class="num white-font">17</div>
                    </div>
                    <div class="tile-bot bottom">
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">717</div>
                            <div class="num-title white-font">ПОСТУПИЛО</div>
                        </div>
                        <div class="dif-line"></div>
                        <div class="flex-col tile-num-block">
                            <div class="num white-font">13</div>
                            <div class="num-title white-font">В ЛИСТИНГЕ</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-col activity-block">
                <div class="activity-head" (click)="turnTo('list_activity', {})">
                    <div class="flex-col">
                        <div class="block-title">АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЯ</div>
                        <div class="block-title-p">{{dateGraphStart}} - {{dateGraphEnd}}</div>
                    </div>
                    <div class="num block-title percents">24%</div>
                </div> 
                <div class="graph-block">
                    <div style="    width: calc(100% + 125px);    height: 100%;">
                        <canvas baseChart style="height: 325px !important; width: 100% !important;"
                                [datasets]="lineChartData"
                                [labels]="lineChartLabels"
                                [options]="lineChartOptions"
                              
                                [legend]="lineChartLegend" 
                                [chartType]="lineChartType"
                                [plugins]="lineChartPlugins"
                        >
                        </canvas> 
                        <!--  [colors]="lineChartColors"-->
                    </div>
                </div>
                <div class="activity-info" style="border-top: 1px solid #D3D5D6;">
                    <div class="flex-col block">
                        <div class="title">ЗВОНКИ</div>
                        <div class="title-info">НОВЫХ КОНТАКТОВ 13 ( 40,7 % )</div>
                        <div class="progress-bar one">
                            <div class="grayback one" style="left: 40.7%"></div>
                            <div class="strips"></div>
                        </div>
                    </div>
                    <div class="flex-col block">
                        <div class="title">ВСТРЕЧИ</div>
                        <div class="title-info">ВСТРЕЧ 30 ( 20 )</div>
                        <div class="progress-bar two">
                            <div class="grayback two"  style="left: 20%"></div>
                            <div class="strips"></div>
                        </div>
                    </div>
                    <div class="flex-col block">
                        <div class="title">СООБЩЕНИЯ</div>
                        <div class="title-info">СООБЩЕНИЙ 150 (24,5% ) </div>
                        <div class="progress-bar three">
                            <div class="grayback three"  style="left: 24.5%"></div>
                            <div class="strips"></div>
                        </div>
                    </div>
                    <div class="flex-col block">
                        <div class="title">ДРУГОЕ</div>
                        <div class="title-info">159 (24,7% ) </div>
                        <div class="progress-bar four">
                            <div class="grayback four"  style="left: 24.7%"></div>
                            <div class="strips"></div>
                        </div>
                    </div>
                    <div class="flex-col block">
                        <div class="title">РЕЙТИНГ</div>
                        <div class="title-info">24%</div>
                        <div class="progress-bar five">
                            <div class="grayback five"  style="left: 24%"></div>
                            <div class="strips"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block-title">ДОПОЛНИТЕЛЬНО</div>
            <div class="addition-tiles">
                <div class="flex-col block blue-tile" (click)="turnTo('list_organisation', {})">
                    <div class="addition-title white-font">ОРГАНИЗАЦИИ</div>
                    <div class="addition-description white-font">Организации: Конкуренты,
                        Партнеры...
                    </div>
                </div>
                <div class="flex-col block blue-tile" (click)="turnTo('list_person', {})">
                    <div class="addition-title white-font">КОНТАКТЫ</div>
                    <div class="addition-description white-font">Физические лица:
                        Клиенты,
                        Конкуренты, Партнеры...
                    </div>
                </div>
                <div class="flex-col block blue-tile" (click)="turnTo('list_users', {})">
                    <div class="addition-title white-font">ПОЛЬЗОВАТЕЛИ</div>
                    <div class="addition-description white-font">Сотрудники  компании</div>
                </div>
                <div class="flex-col block blue-tile">
                    <div class="addition-title white-font">ДОКУМЕНТЫ</div>
                    <div class="addition-description white-font">Приказы, Соглашения
                        Договора...
                    </div>
                </div>
                <div class="flex-col block blue-tile" (click)="turnTo('config', {})">
                    <div class="addition-title white-font">НАСТРОЙКИ</div>
                </div>
                <div class="flex-col block blue-tile">
                    <div class="addition-title white-font">ОПЛАТА</div>
                </div>
            </div>
            <div class="flex-col activity-block persons">
                <div class="activity-head">
                    <div class="flex-col">
                        <div class="block-title">ОТДЕЛ ПРОДАЖ</div>
                        <div class="block-title-p">{{dateGraphStart}} - {{dateGraphEnd}}</div>
                    </div>
                    <div class="num block-title percents">35%</div>
                </div>
                <div class="activity-info new-tasks">
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ КЛИЕНТОВ</div>
                            <div class="task-num">35</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ ПРЕДЛОЖЕНИЙ</div>
                            <div class="task-num">20</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ ЗАЯВОК</div>
                            <div class="task-num">12</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ АВАНСОВ</div>
                            <div class="task-num">27</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">ЗАВЕРШЕННЫХ СДЕЛОК</div>
                            <div class="task-num">10</div>
                        </div>
                    </div>
                </div>
                <div class="persons-scroll">
                    <div class="person-act-info">
                        <div class="block block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Звонки исходящие (34%)</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Звонки входящие</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Встречи (78%)</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"  style="left: 78%;"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="person-act-info">
                        <div class="block block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Звонки 170 (34%)</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Встречи 55 (78%)</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"   style="left: 78%;"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="act-title">Сообщения 110 (34%)</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="person-act-info">
                        <div class="block block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">{{dateGraphStart}} - {{dateGraphEnd}}</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="person-act-info">
                        <div class="block">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="person-act-info">
                        <div class="block block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="person-act-info">
                        <div class="block block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar two">
                                    <div class="grayback two"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                        <div class="block">
                            <div class="flex-col inner-person-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar four">
                                    <div class="grayback four"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-col activity-block persons">
                <div class="activity-head">
                    <div class="flex-col">
                        <div class="block-title">ЮРИДИЧЕСКИЙ ОТДЕЛ</div>
                        <div class="block-title-p">20 Мая,2019 - 03 Июня,2019</div>
                    </div>
                    <div class="num block-title percents">35%</div>
                </div>
                <div class="activity-info new-tasks">
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ КЛИЕНТОВ</div>
                            <div class="task-num">35</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ ПРЕДЛОЖЕНИЙ</div>
                            <div class="task-num">20</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ ЗАЯВОК</div>
                            <div class="task-num">12</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">НОВЫХ ДОГОВОРОВ</div>
                            <div class="task-num">27</div>
                        </div>
                    </div>
                    <div class="block">
                        <div class="flex-col line-block">
                            <div class="title">СДЕЛКИ</div>
                            <div class="task-num">10</div>
                        </div>
                    </div>
                </div>
                <div class="persons-scroll">
                    <div class="person-act-info ur">
                        <div class="block ur block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="ur-block">
                            <div class="flex-col inner-ur-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="person-act-info ur">
                        <div class="block ur block-person">
                            <img src="../../../assets/photo%20(2).PNG">
                            <div class="flex-col person">
                                <div class="title-info user-name">ИВАНОВ Иван Иванович</div>
                                <div class="title job">Менеджер по продажам</div>
                            </div>
                        </div>
                        <div class="ur-block">
                            <div class="flex-col inner-ur-act">
                                <div class="title">20 Мая,2019 - 03 Июня,2019</div>
                                <div class="ur progress-bar one">
                                    <div class="grayback one"></div>
                                    <div class="strips"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--      <div class="tile-group">
                      <span class="tile-group-title">Группа1</span>
                      <div class="tile bg-darkBlue fg-white" (click)="turnTo('list_offer', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-home"></span>
                          </div>
                          <span class="tile-label">Недвижимость</span>
                      </div>
      
                      <div class="tile bg-green fg-white" (click)="turnTo('list_request', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-req-list"></span>
                          </div>
                          <span class="tile-label">Заявки</span>
                      </div>
                  </div>
                  <div class="tile-group">
                      <span class="tile-group-title">Группа2</span>
                      <div class="tile bg-amber fg-white" (click)="turnTo('daily', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-month"></span>
                          </div>
                          <span class="tile-label">Ежедневник</span>
                      </div>
      
                      <div class="tile bg-ggreen fg-white">
                          <div class="tile-content iconic">
                              <span class="icon icon-deal"></span>
                          </div>
                          <span class="tile-label">Договоры</span>
                      </div>
      
                      <div class="tile bg-indigo fg-white" (click)="turnTo('list_person', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-contact"></span>
                          </div>
                          <span class="tile-label">Контакты</span>
                      </div>
      
                      <div class="tile bg-teal fg-white" (click)="turnTo('list_organisation', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-organisation"></span>
                          </div>
                          <span class="tile-label">Контрагенты</span>
                      </div>
      
                      <div class="tile bg-teal fg-white">
                          <div class="tile-content iconic">
                              <span class="icon icon-settings"></span>
                          </div>
                          <span class="tile-label">Настройки</span>
                      </div>
      
                      <div class="tile bg-teal fg-white" (click)="turnTo('list_users', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-user"></span>
                          </div>
                          <span class="tile-label">Пользователи</span>
                      </div>
      
                      <div class="tile bg-puple fg-white" (click)="turnTo('advertising', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-adver"></span>
                          </div>
                          <span class="tile-label">Реклама</span>
                      </div>
      
                      <div class="tile bg-maroon fg-white" (click)="turnTo('list_activity', {})">
                          <div class="tile-content iconic">
                              <span class="icon icon-adver"></span>
                          </div>
                          <span class="tile-label">Активность</span>
                      </div>
      
                  </div> -->
        </div>
    `
})

export class TabMainComponent  implements AfterViewInit {
    public tab: Tab;
    user: Observable<User>;
    date: any;
    dateGraphStart: any;
    dateGraphEnd: any;
    public lineChartData: ChartDataSets[] = [
        {   data: [65, 59, 80, 81, 56, 55, 35, 55, 56, 81, 80, 59, 65, 60, 50],
            label: 'Series A' ,

            borderColor: '#568CB3',
            backgroundColor: '#568CB3',
            fill: false,
            borderWidth: 2,
            pointBackgroundColor: '#568CB3',
            pointBorderColor: '#568CB3'
        },
        {   data: [45, 70, 50, 45, 56, 65, 60, 45, 60, 50, 70, 90, 80, 40, 50],
            label: 'Series B' ,

            borderColor: '#BDC0C1',
            backgroundColor: '#BDC0C1',
            fill: false,
            borderWidth: 2,
            pointBackgroundColor: '#BDC0C1',
            pointBorderColor: '#BDC0C1'},
    ];

    public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            // labels: {
            //     boxWidth: 10
            // }

            // position: 'left'
        }
    };
    public lineChartColors: Color[] = [
        {
            borderColor: '#568CB3',backgroundColor: '#568CB3'
            // backgroundColor: 'rgba(86,140,179,0.1)',
        },
        {
            borderColor: '#BDC0C1', backgroundColor: '#BDC0C1'
            // backgroundColor: 'rgba(189,192,193,0.1)',
        }
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [];

    constructor(private _sessionService: SessionService,
                private _hubService: HubService
    ) {

        setTimeout(() => {
            this.tab.header = 'new tab';
        });
        this.user = _sessionService.user;
        this.lineChartLabels = [];
        this.date = new Date();
        this.dateGraphEnd = Utils.getTitleDateForGraph(this.date);
        this.dateGraphStart = Utils.getTitleDateForGraph(this.date - 13*1000*60*60*24);
        for (let i = 0; i < 14; i++) {
            this.lineChartLabels[13 - i] = Utils.getDateForGraph(this.date - i*1000*60*60*24);
        }
        this.lineChartLabels[14] = Utils.getDateForGraph(this.date - 13*1000*60*60*24);
    }

ngAfterViewInit(): void {
    this.lineChartData = this.lineChartData.slice();
}

    turnTo(tabType: string, arg: any) {
        let tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab(tabType, arg);
        //this.tab.reborn(tabType, arg);
    }


    logout() {
        this._sessionService.logout();
    }
}
