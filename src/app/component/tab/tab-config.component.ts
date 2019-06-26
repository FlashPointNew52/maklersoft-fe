import {AfterViewInit, Component} from '@angular/core';
import {Tab} from '../../class/tab';
import {SessionService} from "../../service/session.service";
import {HubService} from '../../service/hub.service';
import {Observable} from "rxjs";
import {User} from "../../entity/user";
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {Utils} from "../../class/utils";

@Component({
    selector: 'tab-config',
    inputs: ['tab'],
    styles: [`
        .flex-col{
        display: flex;
        flex-direction: column;
        }
        .menu-block{
        width: 370px;
        padding-top: 20px;
        height: 100%;
        }
        .main-config{
            display: flex;
            width: 100%;
            height: calc(100vh - 122px);
        }
        .menu-item, .sub-menu-item{
            color: #32323D;
            font-size: 12px;
            display: flex;
            align-items: center;
            width: 100%;
            border-right: 1px solid #d3d5d6;
            padding-left: 20px;
        }
        .menu-item{      
            height: 25px;
            transition: height 0.03s, background-color 0.03s;
            font-weight: bold;
        }
         .menu-item.clicked{
            background-color: #D3D5D6;
            height: 35px;
         }
         .sub-menu-item{
             height: 25px;
         }
         .sub-menu-item:last-child{
            margin-bottom: 15px;
         }
         .sub-menu-item.clicked{
         background-color: #F2F3F4;
         }
        `],
    template: `
        <hr class='underline'>
        <div class="head"><span>НАСТРОЙКИ</span></div>
        <div class="main-config">
            <div class="flex-col menu-block">
                <div class="menu-item" (click)="clicked_item = 'smart'" [class.clicked]="clicked_item == 'smart' || clicked_item == 'management' || clicked_item == 'sale'|| clicked_item == 'evaluation' || clicked_item == 'advertising' || clicked_item == 'marketing'|| clicked_item == 'legal'|| clicked_item == 'mortgage'|| clicked_item == 'hr'">
                    СМАРТ ЗАДАЧИ
                </div>
                <div *ngFor="let item of departments" class="sub-menu-item" (click)="clicked_item = item.value" [class.clicked]="clicked_item == item.value">
                   {{item.label}}
                </div>
                <div  *ngFor="let item of menu" class="menu-item" (click)="clicked_item = item.value" [class.clicked]="clicked_item == item.value">
                   {{item.label}}
                </div>
            </div>   
        </div>
        `
})

export class TabConfigComponent implements AfterViewInit {
    public tab: Tab;
    user: Observable<User>;
    clicked_item: any;
    departments = User.departmentOptions;
    menu = [
        {value: 'offer', label: 'ПРЕДЛОЖЕНИЯ'},
        {value: 'applications', label: 'ЗАЯВКИ'},
        {value: 'contacts', label: 'КОНТАКТЫ'},
        {value: 'organisations', label: 'ОРГАНИЗАЦИИ'},
        {value: 'users', label: 'ПОЛЬЗОВАТЕЛИ'},
        {value: 'diary', label: 'ЕЖЕДНЕВНИК'}
    ];
    constructor(private _sessionService: SessionService,
                private _hubService: HubService
    ) {
        setTimeout(() => {
            this.tab.header = 'new tab';
        });
        this.user = _sessionService.user;
    }

    ngAfterViewInit(): void {
    }
}
