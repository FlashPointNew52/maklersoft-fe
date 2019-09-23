import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    OnChanges, OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import {HubService} from "../../service/hub.service";
import * as moment from 'moment/moment';
import { Utils} from "../../class/utils";

@Component({
    selector: 'daily-planner-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        *{
            cursor: default;
        }
        .flex-center{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .flex-col {
            display: flex;
            flex-direction: column;
        }
        
        .back {
            position: absolute;
            top: -2px;
            align-items: center;
            display: flex;
            padding-left: 20px;
            height: 50px;
            width: 130px;
            background-color: white;
        }      
        .cur_date{
            height: 46px;
            width: 100%;
            padding: 0 20px;
            background-color: var(--selected-digest);
            display: flex;
            align-items: center;
        }
        .form_date{
            flex-grow: 1;
            align-items: flex-start;
            justify-content: center;
            height: 100%;
            line-height: 14px;
        }
        .cur_date > div{
            color: #32323D;
        }
        .cur_date > div:last-child{
            font-size: 20px;
            line-height: 20px;
        }
        .form_date > div:first-child{
            font-weight: bold;
        }
        .calendar{
            height: 90px;
            background-color: #363D55;
            justify-content: center;
        }
        .buttons{
            display: flex;
            height: 30px;
        }
        .buttons > .active{
            background-color: white;
            color: #32323D;
        }
        .buttons > div{
            background-color: #74788A;
            color: white;
            width: calc(100% / 3);
        }
        .buttons > .center{
            border-left: 1px solid white; 
            border-right: 1px solid white;
        }
        .events{
            height: calc(100vh - 216px);
            overflow-y: auto;
            width: 100%;
            padding: 0 20px 20px 20px;
        }
        .days-container{
            height: 46px;
            width: 322px;
            overflow: hidden;
            position: relative;
        }
        .days-container ul{
            list-style: none;
            padding: 0;
            margin: 0;
            height: 100%;
            width: 99999px;
            transition: margin-left 250ms;
        }
        .days-container ul li{
            width: 46px;
            height: 34px;
            float: left;
            cursor: pointer;
            box-sizing: content-box;
        }
        .days-container ul li > .flex-col{
            align-items: center; 
        }
        .days-container ul li.cur_day > .flex-col > div{
            color: #eaebec;
        }
        .days-container ul li.cur_day > .flex-col > .day{
            line-height: 18px;
            font-size: 18px;
            color: white;
        }
        .day{
            color: #9598A6;
        }
        .week_day{
            color: #74788A;
            text-transform: capitalize;
        }
        .cur_month{
            height: 40px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #DBDCE1;
            text-transform: capitalize;
            position: relative;
            top: -2px;
        }
        .but{
            width: 30px;
            height: 30px;
        }
        
        .but > div{
            width: 17px;
            height: 1px;
            background-color: #555A6F;
        }
        .but.left > div:first-child{
            transform: rotate(-50deg) translate(-1px, 11px);
        }
        .but.left > div:last-child{ 
            transform: rotate(50deg) translate(20px, 7px);
        }
        .but.right > div:first-child{
            transform: rotate(50deg) translate(10px, 0px);
        }
        .but.right > div:last-child{
            transform: rotate(-50deg) translate(-11px, 17px);
        }
        .calendar:hover .line{
            background-color: #D3D5D6;
        } 
        .event-block{
            width: 295px;
            min-height: 60px;
            background-color: #DFE2E6;
            padding: 10px 15px 0;
        }
        .event-block:hover{ 
            background-color: #D3D5D6;
        }
        .event-block.active{
            background-color: #363D55;
        }
        .event-block .date{
            color: #9598A6; 
        }
        .event-block .describe{
            color: #363D55;
        }
        .event-block.selected{
            background-color: #363D55;
        }
        .event-block.selected > div{
            color: #DBDCE1;
        }
        .more-button { 
            display: none;
            width: 20px;
            align-items: center;
            height: 15px;
            justify-content: flex-end;
            position: relative;
            margin-bottom: -15px;
            right: calc(-100% + 15px);
        } 
        .point {
            width: 3px;
            height: 3px;
            background-color: #9598A6;
            border-radius: 50%;
            margin-right: 3px;
        }

        .point:last-child {
            margin-left: 0;
        }
        .event-block:hover > .more-button{
            display: flex;
        }
        .hour{
            width: 46px;
            display: flex;
            height: 60px;
            align-items: flex-end;
            justify-content: center;
        }
        .ev-block{
            min-height: 60px;
            display: flex;
            align-items: flex-end;
            color: #363D55;
        }
        .event{
            width: calc(100% - 46px);
            min-height: 60px;
            border-bottom: 1px solid #EAEBEC;
            align-items: flex-end;
        }
    `],
    template: `
        <div class="flex-col" (mousewheel)="_hubService.shared_var['cm_hidden'] = true">
            <div class="back" *ngIf="mode == 'edit'" (click)="mode = 'view'">Назад</div> 
            <div class="flex-col" *ngIf="mode == 'view'">
                <div class="cur_date">
                    <div class="flex-col form_date">
                        <div>СЕГОДНЯ,</div>
                        <div>{{cur_date}}</div>
                    </div>
                    <div id="cur_time">{{cur_time}}</div>
                </div>
                <div class="calendar flex-col">
                    <div class="cur_month">{{cur_month}}</div>
                    <div style="display: flex;    justify-content: center;"> 
                        <div class="but left" (click)="prev()">
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>   
                        <div class="days-container">
                            <ul id="carousel-ul">
                                <li *ngFor="let day of days; let i = index" class="carousel-li" (click)="turn_day(day)" [class.cur_day]="day.ind == cur_day">
                                    <div class="flex-col"  >
                                        <div class="day">{{day.day}}</div>
                                        <div class="week_day">{{day.week_day}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="but right"  (click)="next()">
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                    </div>
                   
                </div>
                <div class="buttons">
                    <div class="flex-center" [class.active] = "button_mode == 'done'" (click)="button_mode = 'done'">Выполненные</div>
                    <div class="flex-center center" [class.active] = "button_mode == 'undone'" (click)="button_mode = 'undone'">Не выполненные</div>
                    <div class="flex-center" [class.active] = "button_mode == 'all'" (click)="button_mode = 'all'">Все</div>
                </div>
                <div class="events">
                    <div class="ev-block" *ngFor="let hour of hours, let j = index" (dblclick)="mode = 'edit'">
                        <div class="hour"><span *ngIf="hour < 10">0</span>{{hour}} - 00</div>
                        <div class="event flex-col">
                            <ng-container *ngFor="let ev of new_ev_array; let i = index">
                                <div class="event-block flex-col" [class.selected]="selectedEvent.indexOf(ev) > -1" id="{{ev.date}}"
                                     *ngIf="ev.day_of_year == cur_day && ev.hour == j && ((button_mode == 'done' && ev.status == 'done') || (button_mode == 'undone' && ev.status == 'undone') || (button_mode == 'all'))" (click)="select(ev)">
                                    <div class="more-button list" (offClick)="_hubService.shared_var['cm_hidden'] = true" (click)="eventContextMenu($event)">
                                        <div class="point"></div>
                                        <div class="point"></div>
                                        <div class="point"></div>
                                    </div>
                                    <div class="date">{{ev.time}}</div>
                                    <div class="describe">{{ev.describe}}</div>

                                </div>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class DailyPlannerViewComponent implements OnInit, AfterViewInit, OnChanges{
    mode = 'view';
    button_mode = 'done';
    selectedEvent = [];
    date = new Date();
    cur_time = Utils.getFullCurrentTime(this.date.getTime());
    month_count:any;
    new_ev_array = [];
    events = [
        {status: 'undone',date: 1567062850000, describe: 'Звонок. Договориться о встрече'},
        {status: 'undone', date: 1567048790000, describe: 'Звонок. Договориться о встрече'},
        {status: 'undone',date: 1567091750000, describe: 'Звонок. Договориться о встрече'},
        {status: 'undone',date: 1567068950000, describe: 'Звонок. Договориться о встрече'},
        {status: 'done',date: 1567009190000, describe: 'Звонок. Договориться о встрече'},
        {status: 'undone',date: 1567124390000, describe: 'Звонок. Договориться о встрече'},
        {status: 'done',date: 1567132250000, describe: 'Звонок. Договориться о встрече'},
        {status: 'done',date: 1567152050000, describe: 'Звонок. Договориться о встрече'},
        {status: 'done',date: 1567152050000, describe: 'Звонок. Договориться о встрече'}
        ];
    cur_date = moment(this.date.getTime()).format("D") + " " + Utils.getMonth(this.date.getTime());
    cur_month:any;
    count_days: any;
    unix_date: any;
    cur_day: any;
    days: any[];
    week_day: any;
    widthReview = 46;
    hours = [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,23];
    count = 1;
    position = 0;
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    constructor(private _hubService: HubService) {

    }
    ngOnInit() {
        this.month_count = moment(this.date.getTime()).daysInMonth();
        for(let i = 0; i < this.events.length; i++) {
            this.new_ev_array.push({ status: this.events[i].status, date: this.events[i].date, day_of_year: moment(this.events[i].date).dayOfYear(), time: moment(this.events[i].date).format('HH:mm'), hour: moment(this.events[i].date).format('H'),  describe: this.events[i].describe});
        }
        console.log(this.new_ev_array);
        this.new_ev_array.sort( (a, b) => {
            return a.date == b.date ? 0 : +(a.date > b.date) || -1;
        });
        console.log(this.new_ev_array);
        this.unix_date = new Date();
        this.calculateDate(this.unix_date.getTime());
        console.log(this.cur_day);
    }
    select(event){
        this.selectedEvent = [];
        this.selectedEvent.push(event);
    }
    turn_day(obj: any) {
        if (obj.ind > this.cur_day) {
            for (let i = 0; i <= obj.ind - this.cur_day; i++)
                this.next()
        }
        if (obj.ind < this.cur_day) {
            for (let i = 0; i <= this.cur_day - obj.ind; i++)
                this.prev()
        }
    }
    calculateDate(date_temp){
        this.days = [{}];
        this.cur_month = moment(date_temp).format("MMMM") + ", " +  moment(date_temp).format("Y");
        this.count_days = moment(date_temp / 1000).daysInMonth();
        this.cur_day = moment(date_temp).dayOfYear();
        let first_day = moment(date_temp).subtract(3, 'days');
        // let first_day = moment().startOf('year');
        // moment.duration({years: 1}).asDays()
        for (let i = 0; i < 7; i++) {
            let dt = moment(first_day).add(i, 'days');
            this.days.push({ind: moment(dt).dayOfYear(), day: moment(dt).format("D"), dateCon: dt.format("dddd, MMMM Do YYYY"),  date: dt,  week_day: moment(first_day).add(i, 'days').format("dd")});
        }
        console.log(this.days);
        this.days.splice(0,1);
        // setTimeout( () => {
        //    if (this.cur_day > 5) {
        //        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        //        const list = document.getElementById('carousel-ul') as HTMLElement;
        //        console.log(this.cur_day);
        //        this.position = Math.max(this.position - this.widthReview * (this.cur_day), -this.widthReview * (listElems.length - ( 360)));
        //        list.style.setProperty('margin-left', this.position + 'px');
        //    }
        // }, 300);
    }
    prev() {
        this.unix_date = moment(this.unix_date).subtract(1, 'days');
        let temp_date = moment(this.days[0].date).subtract(1, 'days');
        this.cur_month = moment(this.unix_date).format("MMMM") + ", " +  moment(this.unix_date).format("Y");
        this.cur_day = this.cur_day - 1;
        this.days.splice(6,1);
        this.days.unshift({ind: moment(temp_date).dayOfYear(), day: moment(temp_date).format("D"), dateCon: moment(temp_date).format("dddd, MMMM Do YYYY"),  date: moment(temp_date),  week_day: moment(temp_date).format("dd")});

        // const list = document.getElementById('carousel-ul') as HTMLElement;
        // this.position = Math.min(this.position + this.widthReview * this.count, 0);
        // list.style.setProperty('margin-left', this.position + 'px');
    }
    next() {
        this.unix_date = moment(this.unix_date).add(1, 'days');
        let temp_date = moment(this.days[6].date).add(1, 'days');
        this.cur_month = moment(this.unix_date).format("MMMM") + ", " +  moment(this.unix_date).format("Y");
        this.cur_day = this.cur_day + 1;
        this.days.splice(0,1);
        this.days.push({ind: moment(temp_date).dayOfYear(), day: moment(temp_date).format("D"), dateCon: moment(temp_date).format("dddd, MMMM Do YYYY"),  date: moment(temp_date),  week_day: moment(temp_date).format("dd")});

        // const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        // const list = document.getElementById('carousel-ul') as HTMLElement;
        // this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count));
        // list.style.setProperty('margin-left', this.position + 'px');
    }
    ngOnChanges(): void {

    }

    ngAfterViewInit() {

        setInterval(() => {
            this.date = new Date();
            this.cur_time = Utils.getFullCurrentTime(this.date.getTime());
            document.getElementById('cur_time').innerText = this.cur_time;
        }, 100);
    }
    eventContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this._hubService.shared_var['cm'] = {
            pX: event.pageX,
            pY: event.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: '', callback: () => {
                    }
                }
            ]
        };
        this._hubService.shared_var['cm_hidden'] = false;
    }
    tableContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this._hubService.shared_var['cm'] = {
            pX: event.pageX,
            pY: event.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: 'Инфо', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Добавить заметку', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Добавить задачу', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'IP-телефония', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Назначить на...', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Добавить в чат', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Добавить в контакты', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Добавить в организации', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Создать заявку', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Создать предложение', callback: () => {
                    }
                },
                {
                    class: "entry", sub_class: 'del', disabled: false, icon: "", label: 'Удалить', callback: () => {
                    }
                },
            ]
        };
        this._hubService.shared_var['cm_hidden'] = false;
    }

}
