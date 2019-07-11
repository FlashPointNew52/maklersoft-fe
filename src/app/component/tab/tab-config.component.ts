import {AfterViewInit, Component} from '@angular/core';
import {Tab} from '../../class/tab';
import {SessionService} from "../../service/session.service";
import {HubService} from '../../service/hub.service';
import {Observable} from "rxjs";
import {User} from "../../entity/user";
import {Utils} from "../../class/utils";
import {Task} from "../../class/task";

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
        height: calc(100vh - 122px);
        border-right: 1px solid #d3d5d6;
        overflow-y: auto;
        }
        .menu-block.right{
            width: calc(100% - 370px*2);
            padding: 0 20px;
        }
        .menu-block:last-child{
        border-right: none;
        }
        .menu-block.contacts{
            padding-top: 0 !important;
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
        .buttons-block{
            display: flex;
            height: 74px;
            min-height: 74px;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #D3D5D6;
            position: sticky;
            top: 0;
            background-color: white;
        }
        .contact-button{
            border: 1px solid #3B5998;
            height: 35px;
            width: 165px;
            color: #3B5998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .contact-block img{
            width: 50px;
            height: 50px;
            border-radius: 25px;
        }
        .contact-button:last-child{
            border-left: none;
        }
        .contact-button.active{
            background-color: #3B5998;
            color: white;
        }
        .contact-block{
            height: 80px;
            min-height: 80px;
            padding-left: 35px;
            border-bottom: 1px solid #D3D5D6;
            display: flex;
            align-items: center;
        }
        .contact-block:hover{
            background-color: #f6f6f6;
        }
        .name {      
            color: #252F32;
            font-weight: bold;
        }
        .job, .date{
            color: #677578;
        }
        .flex-col.person{
            padding-left: 20px;
        }
        .block-title {
            display: flex;
            padding: 20px 0 15px;
            border-bottom: 1px solid #D3D5D6;
        }
        .block-title .title, .block-title .date{
            font-size: 18px;
        }
        .title{
            flex-grow: 1;
        }
        .calendar-block{
            height: 245px;
        }
        .calendar-block, .kpi-title, .kpi-str{
            display: flex;
        }
        .kpi-title{
            background-color: #d3d5d6;
            height: 30px;
        }
        .col1, .col2, .col3, .col4, .col5{
            font-size: 12px;
            font-weight: bold;
            color: #252F32;
            display: flex;
            align-items: center;
            padding-left: 20px;
        }
        .col1{
            flex: 0 0 calc(30% - 20px);
            display: flex;
            margin-left: 5px;
        }
        .red-circle{
            background-color: #BD0000;
            height: 18px;
            width: 18px;
            border-radius: 9px;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .line-in-circle{
            display: none;
            height: 2px;
            width: 10px;
            background-color: white;
        }
        .red-circle:hover .line-in-circle{
            display: block;
        }
        .col2, .col3, .col4, .col5{
            flex: 0 0 calc(70%/4);
            display: flex;
            justify-content: center;
        }
        .kpi-str{
            height: 30px;
        }
        .kpi-str .col1,.kpi-str .col2,.kpi-str .col3,.kpi-str .col4,.kpi-str .col5{
            color: #252F32;
            font-weight: normal;
        }
        .kpi-str .col1{
            flex: 0 0 calc(30% - 5px);
            padding-left: 0;
        }
        .kpi-str .col2,.kpi-str .col3,.kpi-str .col4,.kpi-str .col5{
            flex: 0 0 calc(70%/4);
            display: flex;
            justify-content: center;
            padding: 0;
        }
        .kpi-str:nth-child(2n+1){
            background-color: #f2f3f4;
        }
        .minimal {
            background-color: #bd0000;
            color: white !important;
        }
        .add-row{
            padding-left: 43px;
            color: #008000;
            height: 30px;
        }
        .flex-col.result{
            margin-top: 10px;
        }
        .result-title{
            background-color: #f2f3f4;
            height: 30px;
            display: flex;
        }
        .result-title .left{
            flex: 0 0 82.5%;
            padding-left: 20px;
            justify-content: center;
        }
        .result-title .right{
            flex: 0 0 17.5%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .add-button{
            width: 230px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #008000;
            color: white;
            margin-top: 40px;
        }
        .right-cal-block{
            width: 180px;
            height: 100%;
        }
        .cal-num{
            align-items: center;
            justify-content: center;
            height: calc(100% - 80px);
        }
        .cal-num .num{
            font-size: 36px;
        }
        .cal-title{
            height: 40px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .cal-title .button:first-child{
            color: #BD0000;
        }
        .cal-title .button:last-child{
            color: #3B5998;
            margin-left: 20px;
        }
        `],
    template: `
        <hr class='underline'>
        <div class="head"><span>НАСТРОЙКИ</span></div>
        <div class="main-config">
            <div class="flex-col menu-block">
                <div class="menu-item" (click)="clicked_item = 'smart'" [class.clicked]="clicked_item == 'smart'">
                    СМАРТ ЗАДАЧИ
                </div> 
                 <div *ngIf="clicked_item == 'smart'">
                    <div *ngFor="let item of departments" class="sub-menu-item" (click)="sub_clicked_item = item.value" [class.clicked]="sub_clicked_item == item.value">
                       {{item.label}}
                    </div>
                </div>
                             
                <div  *ngFor="let item of menu" class="menu-item" (click)="clicked_item = item.value" [class.clicked]="clicked_item == item.value">
                   {{item.label}}
                </div>
            </div>  
            <div class="flex-col menu-block contacts">
                <div class="buttons-block">
                   <div class="contact-button" (click)="contacts_mode = 'job'" [class.active]="contacts_mode == 'job'">Должность</div> 
                   <div class="contact-button" (click)="contacts_mode = 'users'" [class.active]="contacts_mode == 'users'">Пользователи</div> 
                </div>
                <div *ngFor="let contact of contacts" class="contact-block">
                    <img [src]="contact.pic" alt="изображение контакта">
                    <div class="flex-col person">
                         <div class="name">{{contact.name}}</div>
                         <div class="job">{{contact.job}}</div>
                     </div>
                </div>
            </div>
            <div class="flex-col menu-block right">
                <div class="block-title">
                    <div class="title">УВЕЛИЧЕНИЕ МАРЖИНАЛЬНОСТИ</div>
                    <div class="date">{{dateGraphStart}} - {{dateGraphEnd}}</div>
                </div>
                <div class="calendar-block">
                    <div style="width: calc(100% - 180px)">
                        <dp-day-calendar
                            name="daytimePicker"
                            [config]="datePickerConfig"
                            [theme]="'dp-material'">
                        </dp-day-calendar>
                    </div>
                    <div class="flex-col right-cal-block">
                        <div class="cal-title"><div class="button">Удалить</div><div class="button">Готово</div></div>
                        <div class="flex-col cal-num">
                            <div class="num">113,7%</div>
                            <div>Текущее значение</div>
                        </div>
                    </div>
                </div>
                
                <div class="flexcol">
                    <div class="kpi-title">
                        <div class="col1">КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ</div>
                        <div class="col2">ВЕС KPI</div>
                        <div class="col3">ЦЕЛЬ (%)</div>
                        <div class="col4">ФАКТ (%)</div>
                        <div class="col5">ИНДЕКС KPI</div>
                    </div>
                    <div *ngFor="let item of kpi_arr" class="kpi-str">
                        <div class="col1"><div class="red-circle"><div class="line-in-circle"></div></div>{{item.title}}</div>
                        <div class="col2">{{item.kpi}}</div>
                        <div class="col3">{{item.goal}}</div>
                        <div class="col4">{{item.fact}}</div>
                        <div class="col5" [class.minimal]="item.index < 0.3">{{item.index}}%</div>
                    </div>
                    <div class="add-row">Добавить строку</div>
                </div>
                <div class="flex-col result">
                    <div class="result-title"><div class="left col1">КОЭФФИЦИЕНТ РЕЗУЛЬТАТИВНОСТИ</div><div class="right">1,137</div></div>
                </div>
                <div style="display: flex; justify-content: flex-end"><div class="add-button">Добавить раздел KPI</div></div>
            </div> 
        </div>
        `
})

export class TabConfigComponent implements AfterViewInit {
    public tab: Tab;
    task: Task;
    user: Observable<User>;
    clicked_item: any;
    sub_clicked_item: any;
    contacts_mode = 'users';
    date: any;
    dateGraphStart: any;
    kpi_arr = [
        {
            title: 'Звонки',
            kpi: 0.5,
            goal: 20,
            fact: 22,
            index: 0.550
        },
        {
            title: 'Встречи',
            kpi: 0.25,
            goal: 20,
            fact: 17,
            index: 0.212
        },
        {
            title: 'Заключенные договора',
            kpi: 0.25,
            goal: 20,
            fact: 30,
            index: 0.375
        }
    ];
    dateGraphEnd: any;
    departments = User.departmentOptions;
    datePickerConfig : any = {
        mode: 'date',
        firstDayOfWeek: 'mo',
        monthFormat: 'MMMM, YYYY',
        disableKeypress: false,
        allowMultiSelect: false,
        closeOnSelect: undefined,
        closeOnSelectDelay: 100,
        onOpenDelay: 0,
        weekDayFormat: 'ddd',
        appendTo: document.body,
        drops: 'down',
        opens: 'right',
        showNearMonthDays: true,
        showWeekNumbers: false,
        enableMonthSelector: true,
        yearFormat: 'YYYY',
        showGoToCurrent: true,
        dayBtnFormat: 'DD',
        monthBtnFormat: 'MMM',
        hours12Format: 'hh',
        hours24Format: 'HH',
        meridiemFormat: 'A',
        minutesFormat: 'mm',
        minutesInterval: 1,
        secondsFormat: 'ss',
        secondsInterval: 1,
        showSeconds: false,
        showTwentyFourHours: true,
        timeSeparator: ':',
        multipleYearsNavigateBy: 10,
        showMultipleYearsNavigation: false,
        locale: 'ru',
    };
    menu = [
        {value: 'offer', label: 'ПРЕДЛОЖЕНИЯ'},
        {value: 'applications', label: 'ЗАЯВКИ'},
        {value: 'contacts', label: 'КОНТАКТЫ'},
        {value: 'organisations', label: 'ОРГАНИЗАЦИИ'},
        {value: 'users', label: 'ПОЛЬЗОВАТЕЛИ'},
        {value: 'diary', label: 'ЕЖЕДНЕВНИК'}
    ];
    contacts = [
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG'}
    ];
    constructor(private _sessionService: SessionService,
                private _hubService: HubService
    ) {
        setTimeout(() => {
            this.tab.header = 'new tab';
        });
        this.user = _sessionService.user;
        this.date = new Date();
        this.dateGraphEnd = Utils.getTitleDateForGraph(this.date);
        this.dateGraphStart = Utils.getTitleDateForGraph(this.date - 13*1000*60*60*24);
    }

    ngAfterViewInit(): void {
    }
}
