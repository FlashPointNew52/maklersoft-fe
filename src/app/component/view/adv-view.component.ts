import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';

@Component({
    selector: 'adv-view',
    inputs: ['offer', 'editMode', 'count'],
    styles: [`
        .adv_header{
            width: calc(100vw - 370px - 30px);
            margin-left: 370px;
            display: inline-flex;
            padding: 2px 30px 0 39px;
            box-sizing: border-box;
        }

        .adv_header div{
            display: flex;
            align-items: flex-end;
            font-size: 12px;
            color: var(--color-adv-gr);
            justify-content: flex-start;
            width: calc(100% - 65px);
        }

        .adv_header div span{
            margin-left: 5px;
            color: var(--color-adv-gr);
        }

        .adv_header .edit_data{
            justify-content: flex-end;
            color: var(--color-adv-gr);
            cursor: pointer;
        }

        .adv_body{
            height: calc(100% - 117px);
            padding: 8px 30px 30px 37px;
            width: calc(100vw - 370px - 30px);
            margin-left: 370px;
        }

        .adv_body > div{
            height: 40px;
            background-color: #5fa55a;
            color: white;
            font-size: 12px;
            padding-left: 20px;
            line-height: 45px;
        }

        .button{
            width: 18px;
            height: 18px;
            margin: 10px auto;
            border: 1px solid #BAD1BC;
        }

        .edit_button {
            border: 1px solid rgba(224, 224, 224, 1);
        }

        .button > div{
            display: none;
            width: 25px;
            height: 25px;
            background-image: url(../assets/check.png);
            background-size: 100% 100%;
            position: relative;
            top: -7px;
            left: 1px;
        }
        .button > div.clicked{
            display: block;        
        }
        .name{
            font-size: 12px;
            color: var(--color-adv-gr1);
            text-align: left;
        }

        table{
            width: 100%;
            display: block;
            height: 100%; 
        }

        thead, tbody{
            display: block;
        }

        tbody tr:nth-child(odd){
            background-color: #ffffff;
        }

        tbody tr:nth-child(even){

        }

        tr{
            display: flex;
            height: 35px;
            padding: 0 10px 0 20px;
            line-height: 35px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f7f7f7;
        }

        tbody{
            overflow: auto;
            height: calc(100% - 35px);
        }

        thead tr{
            color: #516B52;
            font-size: 10px;
            background-color: #BAD1BC;
        }

        thead tr td {
            font-size: 12px;
            color: var(--color-adv-gr1);
        }

        tr td  {
            flex: 0 0 15%;
            text-align: center;
        }

        tr td:first-child {
            flex: 0 0 25%;
            text-align: left;
        }
        .change{
            width: calc(100vw - 370px - 30px);
            padding-right: 30px;
            margin-left: 370px;
            text-align: end;
            color: var(--color-adv-gr1);
            margin-bottom: 21px;
        }
        .adv-buttons-mode{
             padding: 20px 30px 5px 39px;
            display: flex;
            width: calc(100vw - 370px - 30px);
            margin-left: 370px;
        }
        .adv-button{
            flex: 0 0 33.33%;
            border: 1px solid var(--color-adv-gr);
            color: var(--color-adv-gr1); 
            height: 35px; 
            line-height: 35px;
            text-align: center;     
        }
        .adv-button.selected, .adv-button:hover{
            background-color: var(--color-adv-gr);
            color: white;
            border-right: 1px solid white !important;
        }
        .adv-button:first-child{
            border-right: 1px solid var(--color-adv-gr);
        }
        
        .adv-button:nth-child(2n){
            border-left: none;
        }
        .adv-button:last-child{
            border-left: none;
            border-right: 1px solid var(--color-adv-gr);
        }
        .block-title{
            position: absolute;
            left: calc(50% - 100px);
            top: -75px;
            display: flex;
        }
        .block-title div:first-child{
            margin-right: 15px;
        }
        .block-title div{ 
            font-size: 20px;
        }
    `],
    template: `
        <div class="block-title" >
            <div>ИМПОРТ ПРЕДЛОЖЕНИЯ В РЕКЛАМУ</div><div>({{count}})</div>  
        </div>
        <div class="adv-buttons-mode">
            <div class="adv-button" (click)="button_mode = 'adv_areas'; cur_arr = platforms" [class.selected]="button_mode == 'adv_areas'">РЕКЛАМНЫЕ ПЛОЩАДКИ</div>
            <div class="adv-button" (click)="button_mode = 'adv_social'; cur_arr = socials" [class.selected]="button_mode == 'adv_social'">СОЦИАЛЬНЫЕ СЕТИ</div>
            <div class="adv-button" (click)="button_mode = 'adv_messenger'; cur_arr = messengers" [class.selected]="button_mode == 'adv_messenger'">МЕССЕНДЖЕРЫ</div>
        </div>
        <div class="change">Изменить</div>
        <div class="adv_header">
            <div>
                Обновлено: <span>Сегодня 15:45</span>
            </div>
            <div class="edit_data">Ваш баланс <span style="margin: 0 5px">{{"2700"}}</span> Р</div>
        </div>
        <div class="adv_body">
                <table cellspacing="0">
                <thead>
                    <tr>
                        <td width = '25%'>ИСТОЧНИКИ</td>
                        <td width = '15%'>НЕДЕЛЯ</td>
                        <td width = '15%'>2 НЕДЕЛИ</td>
                        <td width = '15%'>3 НЕДЕЛИ</td>
                        <td width = '15%'>МЕСЯЦ</td>
                        <td width = '15%'>РУЧНОЙ РЕЖИМ</td>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let platform of cur_arr; let i=index">
                        <td width = '25%'>
                            <div class="name">{{platform.name}}</div>
                        </td>
                        <td width = '15%' (click)="platform.select = !platform.select">
                            <div class='button' [class.edit_button] = "editMode">
                                <div [class.clicked]="platform.select"></div>
                            </div>
                        </td>
                        <td width = '15%' (click)="platform.select2 = !platform.select2">
                            <div class='button' [class.edit_button] = "editMode">
                                <div [class.clicked]="platform.select2"></div>
                            </div>
                        </td>
                        <td width = '15%' (click)="platform.select3 = !platform.select3">
                            <div class='button' [class.edit_button] = "editMode">
                                <div [class.clicked]="platform.select3"></div>
                            </div>
                        </td>
                        <td width = '15%' (click)="platform.select4 = !platform.select4">
                            <div class='button' [class.edit_button] = "editMode">
                                <div [class.clicked]="platform.select4"></div>
                            </div>
                        </td>
                        <td width = '15%' (click)="platform.select5 = !platform.select5">
                            <div class='button' [class.edit_button] = "editMode">
                                <div [class.clicked]="platform.select5"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
})

export class AdvView implements OnInit, OnChanges {
    public offers: Array<any> = [];
    public count: number;
    public editMode: boolean = false;
    button_mode = 'adv_areas';
    cur_arr: any;
    socials: any[]=[
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Facebook'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Twitter'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'LinkedIn'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Pinterest'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Google Plus+'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Instagram'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'ВКонтакте'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Одноклассники'},
    ];
    messengers: any[]=[
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'WhatsApp'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Viber'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Telegram'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Skype'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Facebook Messenger'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Hangouts Google'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Veon'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'ICQ'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Google Talk'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Mail.Ru Агент'},
    ];
    platforms: any[]=[
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
    ];

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
    ){

    }

    ngOnInit() {
        this.cur_arr = this.platforms;
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    change_mode(){
        this.editMode = !this.editMode;
    }
}
