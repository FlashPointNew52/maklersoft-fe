import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';

@Component({
    selector: 'adv-view',
    inputs: ['offer', 'editMode'],
    styles: [`
        .adv_header{
            width: 100%;
            height: 55px;
            display: inline-flex;
            background-color: #fafafa;
            padding: 0 15px 15px;
            box-sizing: border-box;
        }

        .adv_header div{
            display: flex;
            align-items: flex-end;
            font-size: 12px;
            color: #757575;
            justify-content: flex-start;
            width: calc(100% - 65px);
        }

        .adv_header div span{
            margin-left: 5px;
            font-weight: 800;
        }

        .adv_header .edit_data{
            justify-content: flex-end;
            width: 65px;
            color: #5D75B3;
            cursor: pointer;
        }

        .adv_body{
            background-color: whitesmoke;
            height: calc(100% - 167px);
            padding-top: 6px;
        }

        .adv_body > div{
            height: 45px;
            background-color: #5fa55a;
            color: white;
            font-size: 14px;
            padding-left: 20px;
            line-height: 45px;
        }

        .button{
            width: 20px;
            height: 20px;
            margin: 10px auto;
        }

        .edit_button {
            border: 1px solid rgba(224, 224, 224, 1);
        }

        .button > div{
            width: 25px;
            height: 25px;
            background-image: url(assets/tick1.png);
            background-size: cover;
            position: relative;
            top: -6px;
            left: 1px;
        }

        .name{
            font-size: 14px;
            color: #757575;
            text-align: left;
        }

        table{
            width: 100%;
            display: block;
            height: calc(100% - 45px);
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
            height: 43px;
            padding: 0 10px 0 20px;
            line-height: 43px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f7f7f7;
        }

        tbody{
            overflow: auto;
            height: calc(100% - 43px);
        }

        thead tr{
            color: #516B52;
            font-size: 10px;
            background-color: #e6ede6;
        }

        thead tr td {
            font-size: 12px;
            color: #74a14e;;
        }

        tr td  {
            flex: 0 0 20%;
            text-align: center;
        }

        tr td:first-child {
            flex: 0 0 38%;
            text-align: left;
        }

    `],
    template: `
        <div class="adv_header">
            <div>
                Обновлено: <span>Сегодня 15:45</span>
            </div>
            <div class="edit_data">{{"Баланс"}}</div>
        </div>
        <div class="adv_body">
            <div>РЕКЛАМНЫЕ ИСТОЧНИКИ</div>
            <table cellspacing="0">
                <thead>
                    <tr>
                        <td width = '41%'>ИСТОЧНИКИ</td>
                        <td width = '18%'>НЕДЕЛЯ</td>
                        <td width = '23%'>2 НЕДЕЛИ</td>
                        <td width = '18%'>МЕСЯЦ</td>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let platform of platforms; let i=index">
                        <td width = '41%'>
                            <div class="name">{{platform.name}}</div>
                        </td>
                        <td width = '18%' (click)="platform.select = !platform.select">
                            <div class='button' [class.edit_button] = "editMode">
                                <div *ngIf="platform.select"></div>
                            </div>
                        </td>
                        <td width = '23%' (click)="platform.select2 = !platform.select2">
                            <div class='button' [class.edit_button] = "editMode">
                                <div *ngIf="platform.select2"></div>
                            </div>
                        </td>
                        <td width = '18%' (click)="platform.select3 = !platform.select3">
                            <div class='button' [class.edit_button] = "editMode">
                                <div *ngIf="platform.select3"></div>
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

    public editMode: boolean = false;
    platforms: any[]=[
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'},
        {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
        {select: false, select2: false, select3: false, name: 'Презент'},
        {select: false, select2: false, select3: false, name: 'Авито'},
        {select: false, select2: false, select3: false, name: 'Циан'},
        {select: false, select2: false, select3: false, name: 'ВНХ'},
        {select: false, select2: false, select3: false, name: 'Фарпост'},
        {select: false, select2: false, select3: false, name: 'Домофонд'}
    ];

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
    ){

    }

    ngOnInit(){

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    change_mode(){
        this.editMode = !this.editMode;
    }
}
