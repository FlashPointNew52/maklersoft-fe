import {Component,  OnInit, Output, EventEmitter, OnChanges} from '@angular/core';
import {Almanac} from "./almanac.component";
import {UserService} from '../../service/user.service';
import {Task} from '../../class/task';
import {User} from '../../entity/user';
import {NotebookService} from '../../service/notebook.service';

import * as moment from 'moment/moment';
import 'moment/locale/ru.js';

@Component({
    inputs: ['task', 'mode'],
    selector: 'notebook-task-describe',
    styles: [`
        .edit_button{
            width: calc(100% - 20px);
            margin-right: 20px;
            text-align: right;
            margin-top: 15px;
            font-size: 14px;
            color: #12195C;
            cursor: hand;
        }

        .text-value {
            height: 3rem;
            border: 1px solid #E5E5E5 !important;
        }

        .edit_mode > .view-group, .view_mode > .view-group {
            //height: 30px;
        }

        .view_mode{
            width: calc(100% - 35px);
            margin: 100px 20px 0 15px;
        }

        .view-group {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;
            height: 20px;
            line-height: 20px;
        }

        .view-label {
            white-space: nowrap;
            color: rgb(160, 158, 158);
            font-size: 14px;
            margin-right: 5px;
        }

        .view-value {
            width: 100%;
            text-align: right;
            color: #212121;
            font-size: 10pt;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .edit_mode{
            width: calc(100% - 35px);
            margin: 50px 20px 0 15px;
            height: calc(100% - 50px);
        }

        .edit-value {
            width: 100%;
            text-align: right;
            color: #696969;
            font-size: 10pt;
            height: 19px; /* костыль */
            border: none !important;
            overflow: visible;
        }

        .edit_mode >hr, .view_mode >hr{
            margin: 25px 0;
            border: 1px solid rgba(138, 136, 136, 0.68);
        }
    `],
    template: `
        <div>
            <div *ngIf="mode == 'new'" (click) = "save(); mode = 'old'" class="edit_button">Готово</div>
            <div *ngIf="mode == 'old'" (click) = "mode = 'new'" class="edit_button">Изменить</div>
            <div class="edit_mode" *ngIf="mode == 'new'">
                <div class="view-group">
                    <span class="view-label">Ответственный:</span>
                   
                </div>
                <div class="view-group">
                    <span class="view-label pull-left">Приоритет:</span>
                    
                </div>
                <div class="view-group">
                    <span class="view-label pull-left">Действие:</span>
                    
                </div>
                <div class="view-group" style='display: block;'>
                    <ui-input-line [placeholder] = "'Заголовок задачи: '" [value] = "task.title"
                        [width] = "'225px'" (onChange)= "task.title = $event"
                        [input_style]="{'background-color':'transparent'}"
                        [label_style]="{'height':'10px', 'line-height':'16px'}"
                    >
                    </ui-input-line>
                </div>
                <div class="view-group" style="height: 10px;"></div>
                <div class='view_icon' [style.background-image]="'url(assets/user_icon/user.png)'"></div>
                <div class="view-group" style='display: block;'>
                    
                </div>
                <div class="view-group" style="height: 10px;"></div>
                <div class="view-group">
                    <span class="view-label pull-left">Маршрут:</span>
                    
                </div>
                <div class="view-group" style='display: block; height: 323px;margin-top: 20px;'>
                    <!--<dp-day-calendar
                        name="daytimePicker"
                        [(ngModel)]="date_start"
                        (ngModelChange)="new_date($event)"
                        [config]="datePickerConfig"
                        [theme]="'dp-main_calendar'">
                    </dp-day-calendar>-->
                    <div class="view-label pull-left" style="width: 50%;text-align: center;margin: 10px 0 -5px 0;">Начало выполнения:</div>
                    <div class="view-label pull-left" style="width: 50%;text-align: center;margin: 10px 0 -5px 0;">Конец выполнения:</div>
                    <!--<dp-time-select style="display: block;float: left;width: 50%;"
                        name="daytimePicker"
                        [(ngModel)]="date_start"
                        (ngModelChange)="new_date($event)"
                        [config]="datePickerConfig" 
                        [theme]="'dp-main_calendar'">
                    </dp-time-select>
                    <dp-time-select style="display: block;float: left;width: 50%;"
                        name="daytimePicker"
                        [(ngModel)]="date_start"
                        (ngModelChange)="new_date($event)"
                        [config]="datePickerConfig"
                        [theme]="'dp-main_calendar'">
                    </dp-time-select>-->
                </div>
            </div>
            <div class="view_mode" *ngIf="mode == 'old'">
                <div class="view-group">
                    <span class="view-label">Ответственный:</span>
                    <span class="view-value" > {{ superior.name || 'Не указан'}}</span>
                </div>
                <div class="view-group">
                    <span class="view-label pull-left">Приоритет:</span>
                </div>
                <div class="view-group">
                    <span class="view-label pull-left">Действие:</span>
                </div>

                <div class="view-group">
                    <span class="view-label">Заголовок задачи:</span>
                    <span class="view-value"> {{ task.title || 'Не указан'}}</span>
                </div>
                <div class="view-group" style="height: 10px;"></div>
                <div class="view-group" style="height: initial;display: block;">
                    <span class="view-label" style="line-height: 14px;display: block;float: left;">Описание задачи:</span>
                    <span class="view-value" style="white-space: normal; line-height: 15px; display: block; text-align: justify;"> {{ task.discride || 'Не указан'}}</span>
                </div>
                <div class="view-group" style="height: 10px;"></div>
                <div class="view-group">
                    <span class="view-label pull-left">Маршрут:</span>
                </div>
                <div class="view-group">
                    <span class="view-label">Приступить:</span>
                    <span class="view-value">{{date_start.calendar()}}</span>
                </div>
                <div class="view-group">
                    <span class="view-label">Начало выполнения:</span>
                    <span class="view-value">{{date_start.format("kk:mm")}}</span>
                </div>
                <div class="view-group">
                    <span class="view-label">Конец выполнения:</span>
                    <span class="view-value">{{task.duration}}</span>
                </div>
                <hr>
                <div class="view-group">
                    <span class="view-label">Задача перенесена:</span>
                </div>
                <div class="view-group">
                    <span class="view-value" style ="text-align: justify;">{{date_start.calendar()}}</span>
                </div>
            </div>
        </div>
    `
})

export class NotebookTaskDescribe implements OnInit, OnChanges{
    date_start: any;
    scr_top: number;
    task: Task;
    mode: string = 'new';
    agentOpts: any[] = [];
    superior: User = new User();
    @Output() update: EventEmitter<any> = new EventEmitter();
    date: any;
    material: boolean = false;
    required: boolean = false;
    disabled: boolean = false;
    datePickerConfig : any = {
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
    constructor(
        private _userService: UserService,
        private _notebookService: NotebookService
    ) {
        _userService.list(0, 10, {}, {},null).subscribe(agents => {
            for (let i = 0; i < agents.length; i++) {
                var a = agents[i];
                this.agentOpts.push({
                    value: a.id,
                    label: a.name
                });
            }
        });
    }

    ngOnInit(){
        this.date_start = this.task.date.clone();
        this.scr_top = this.task.scr_top;
    }

    ngOnChanges(){
        this.ngOnInit();
    }


    set_duration(event){
        let endDay = moment(this.task.date).hour(24).minute(0);
        let diff = endDay.diff(this.task.date, 'minute');
        if(parseInt(event) > diff)
            return diff;
        else return parseInt(event);
    }

    new_date(ev){
        if(this.date_start.format('DD.MM.YYYY kk:mm') != this.task.date.format('DD.MM.YYYY kk:mm')){
            let new_date = moment(ev, 'DD.MM.YYYY kk:mm');
            let old_date = this.task.date.clone();
            let day_diff = new_date.dayOfYear() - this.task.date.dayOfYear();
            if(day_diff != 0) {
                this.task.date.add(day_diff, 'day')
                this.task.scr_left += 221*day_diff;
            }
            let diff = new_date.diff(this.task.date, 'minute')
                if(diff != 0)
                    this.task.scr_top += 56/60*diff;
            this.task.date =  new_date;
            this.update.emit({task: this.task, old: old_date});
            this.date_start = this.task.date.clone();
        }
    }

    agentChanged(e) {
        this.task.user = e.selected.value;
        this._userService.get(this.task.user).subscribe(agent => {
            this.superior = agent;
        });
    }

    open(event){
        let target = <HTMLElement>event.currentTarget.parentElement;
        if(!target.style.height)
            target.style.height = "350px";
        else target.style.height = "";
    }

    save(){

    }

    close(){
        this._notebookService.set({show: null});
    }

}
