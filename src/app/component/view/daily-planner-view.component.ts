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
            padding: 0 20px;
        }
        .event{
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #EAEBEC;
        }
    `],
    template: `
        <div class="flex-col" (mousewheel)="_hubService.shared_var['cm_hidden'] = true">
            <div class="back" *ngIf="mode == 'edit'">Назад</div>
            <div class="flex-col">
                <div class="cur_date">
                    <div class="flex-col form_date">
                        <div>СЕГОДНЯ,</div>
                        <div>{{cur_date}}</div>
                    </div>
                    <div id="cur_time">{{cur_time}}</div>
                </div>
                <div class="calendar flex-col">
                    <div></div>
                </div>
                <div class="buttons">
                    <div class="flex-center" [class.active] = "button_mode == 'done'" (click)="button_mode = 'done'">Выполненные</div>
                    <div class="flex-center center" [class.active] = "button_mode == 'undone'" (click)="button_mode = 'undone'">Не выполненные</div>
                    <div class="flex-center" [class.active] = "button_mode == 'all'" (click)="button_mode = 'all'">Все</div>
                </div>
                <div class="events">
                    <div *ngFor="let ev of events" class="event">

                    </div>
                </div>
               
            </div>
        </div>
    `
})

export class DailyPlannerViewComponent implements OnInit, AfterViewInit, OnChanges{
    mode = 'view';
    button_mode = 'done';
    date = new Date();
    cur_time = Utils.getFullCurrentTime(this.date.getTime());
    month_count:any;
    events = [];
    cur_date = moment(this.date.getTime()).format("D") + " " + Utils.getMonth(this.date.getTime());
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    constructor(private _hubService: HubService) {

    }
    ngOnInit() {
        this.month_count = moment(this.date.getTime()).daysInMonth();
        for(let i = 0; i < this.month_count; i++) {
            this.events.push({day: i+1, time: 0, event: ""})
        }
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
