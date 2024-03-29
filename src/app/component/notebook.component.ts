import {Component, Output, OnInit, EventEmitter} from '@angular/core';

import {Utils} from '../class/utils';
import {HubService} from '../service/hub.service';
import {NotebookTask} from './notebook/notebook-task.component';
import {NotebookService} from '../service/notebook.service';
import { Subscription , Observable} from 'rxjs';
import {SessionService} from '../service/session.service';
import {User} from '../entity/user';

@Component({
    selector: 'notebook',
    styles: [`
    .notebook {
        position: absolute;
        top: 0px;
        right: 0px;
        height: 100%;
        background-color: white;
        z-index: 1000;
        box-shadow: #677578 0px 2px 10px 0px;
    }

      .head-notebook {
        width: 100%;
        height: 50px;
        display: flex;
          border-bottom: 1px solid #d3d5d6;
      }
      .head-notebook.diary{
          border: none;
      }

      .notebook > .border-stripe {
        width: 30px;
        height: 100%;
        background-color: #ccc;
        float: right;
      }

      .notebook > .main-tab {
        width: 370px;
        height: 100%;
        float: right;
      }

      .notebook > .main-tab > .main_menu {
        display: flex;
        justify-content: center;
        padding: 0;
        margin: 25px 10px 0;
        border: 1px solid #0e60c5;
      }

      .notebook > .main-tab > .main_menu > li {
        display: inline-block;
        padding: 2px 10px;
        color: rgb(14, 96, 197);
        border-left: 1px solid #0e60c5;
        flex-grow: 2;
        font-size: 12px;
        text-align: center;
      }

      .notebook > .main-tab > .main_menu > .menu_active {
        color: #fff;
        background-color: #0e60c5;
        border: 0;
      }

      .notebook > .event-tab {
        width: 370px;
        height: 100%;
        float: right;
        border-left: 1px solid #ccc;
      }

      .tab-button {
        width: 50px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
          color: #32323D;
          font-size: 12px;
          position: relative;
          right: calc(-50% + 20px);
        top: 10px;
      }

      .tab-button.diary{
          right: calc(-100% + 75px);
      }
      notebook-task {
        display: flex;
        flex-wrap: wrap;
      }

    

    .forever_menu > div {
        width: 35px;
        height: 35px;
        background-size: 70% 70%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .forever_menu > div:hover {
        background-color: #127d0a;
    }

    .forever_menu > hr {
        width: 35px;
        margin: 0;
        border-color: #4aa24a;
    }
        .curr_date{
            position: relative;
            right: -135px;
            top: 15px;
            color: #32323D;
            font-size: 12px;
            width: fit-content;
        }
         .chat-word{
            position: absolute;
            top: 14px;
            margin-left: 25px;
            font-size: 14px;   
            width: 105px;
        }
    `],
    template: ` 
        <div class="notebook" [hidden]="this.hidden" [style.width.px]="this.hidden == true ? 0 : 400">
            
            <div class="head-notebook"> 
                <div class="chat-word" *ngIf="mode == 'chat'">ЧАТ</div>
                <div class="chat-word" *ngIf="mode == 'phone'">IP-ТЕЛЕФОНИЯ</div>
                <div class="chat-word" *ngIf="mode == 'daily'">ЕЖЕДНЕВНИК</div>
                <div class="curr_date" *ngIf="mode == 'chat'" >Сегодня, {{curr_date}}</div>
                <div class="tab-button" [class.diary]="mode == 'notification' || mode == 'daily'" (click)="toggleNotebook()">Закрыть</div>
            </div>
            <chat-view *ngIf="mode == 'chat'" [mode]="hidden"></chat-view>
            <notification-view *ngIf="mode == 'notification'"></notification-view>
            <daily-planner-view *ngIf="mode == 'daily'"></daily-planner-view>
            <!--<div class="event-tab" *ngIf="show==1 || show==2">-->
                <!--<div class="head"></div>-->
                <!--<notebook-task-describe [task] = "data" [mode]="state" (update) = "update_tab_daily($event)"></notebook-task-describe>-->
            <!--</div>-->
            <!--<div class="main-tab" (click)="toggleEvent()" *ngIf="show==0 || show==2">-->
                <!--<ul class = "main_menu">-->
                  <!--<li (click) = "selectMenu(0)" [class.menu_active] = "menuNumber == 0">Задачи</li>-->
                  <!--<li (click) = "selectMenu(1)" [class.menu_active] = "menuNumber == 1">Заметки</li>-->
                  <!--<li (click) = "selectMenu(2)" [class.menu_active] = "menuNumber == 2">IP-телефония</li>-->
                  <!--<li (click) = "selectMenu(3)" [class.menu_active] = "menuNumber == 3">Чат</li>-->
                <!--</ul>-->
                <!--<notebook-task *ngIf="menuNumber == 0">  </notebook-task>-->
            <!--</div>-->
        </div>
    `
})

export class NotebookComponent implements OnInit{
    mode: string;
    hidden = true;
    eventHidden = true;
    utils = Utils;
    menuNumber: number = 0;
    type: string;
    data: any;
    state: string;
    curr_date: any;
    authorized: Observable<boolean>;

    //positionOptions = User.positionOptions;

    @Output() widthChange: EventEmitter<any> = new EventEmitter();

    constructor(private _hubService: HubService,
            private _notebookService: NotebookService,
            private _sessionService: SessionService
    ) {
        this.curr_date = Utils.getTitleDateForGraph(this.curr_date);
        this.authorized = _sessionService.authorized;
        _hubService.setProperty('notebook', this);
        this.hidden = true;
        // this._hubService.shared_var['nb_width'] = 1;
        // this.subscription = _notebookService.get().subscribe(message => {
        //     this.show = message.show;
        //     this.data = message.data;
        //     this.state = message.state;
        // });
    }

    ngOnInit(){

    }
    setMode(name, event) {
        console.log('setmode');
        this.mode = name;
    }
    setShow( value: boolean, event) {
        console.log('setshow');
        this.hidden = !value;
    }
    toggleNotebook() {
        this.hidden = !this.hidden;
        // if(this.hidden)
        //     this.show = 0;
        // else this.show = -1;
        // this.emitWidth();
    }

    toggleEvent() {
        this.eventHidden = !this.eventHidden;
        this.emitWidth();
    }

    emitWidth() {
        var w = 1;
        if (!this.hidden) {
            w += 371;
            if (!this.eventHidden) {
                w += 371;
            }
        }
        this._hubService.shared_var['nb_width'] = w;
        this.widthChange.emit({value: w});
    }

    selectMenu(num: number){
       this.menuNumber = num;
    }

    update_tab_daily(event){
        this._notebookService.update_field(event);
    }

    getLastName(){
        if(this._sessionService.getUser() && this._sessionService.getUser().name)
            this._sessionService.getUser().name.split(" ")[0];
        else return 'Неизвестно';
    }

    getFirstName(){
        if(this._sessionService.getUser() && this._sessionService.getUser().name)
            this._sessionService.getUser().name.replace(this._sessionService.getUser().name.split(" ")[0] + " ", '');
        else return 'Неизвестно';
    }

    getPosition(){
        /*if(this._sessionService.getUser() && this._sessionService.getUser().positionCode)
            return User.positionOptionsByDepart[this._sessionService.getUser().positionCode];
        else */return 'Неизвестно';
    }
}
