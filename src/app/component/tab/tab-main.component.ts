import {Component} from '@angular/core';
import {Tab} from '../../class/tab';
import {ConfigService} from "../../service/config.service";
import {Http} from "@angular/http";
import {SessionService} from "../../service/session.service";
import {HubService} from '../../service/hub.service';
import {Observable} from "rxjs";
import {User} from "../../entity/user";


@Component({
    selector: 'tab-main',
    inputs: ['tab'],
    styles: [`
        .tile-board {
            height: 100vh;
            position: relative;
            overflow: hidden;
            background-color: #062141;
        }

        .tile-group {
            margin-left: 80px;
            min-width: 80px;
            max-width: 640px;
            width: auto;
            float: left;
            display: block;
            padding-top: 40px;
            position: relative;
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
    `],
    template: `
        <div class="tile-board" style="">

            <div class="user-badge">
                <span> {{ (user | async)?.login }} </span>  <span (click)="logout()"> выйти </span>
            </div>

            <div class="tile-group">
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
                    <span class="tile-label">Очень важные контакты</span>
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

            </div>
        </div>
    `
})

// TODO: запилить что-то типа authService и убрать туда всю фигню из логин скрина и отсюда
export class TabMainComponent {
    public tab: Tab;
    user: Observable<User>;

    constructor(private _sessionService: SessionService,
                private _hubService: HubService
    ) {
        setTimeout(() => { this.tab.header = 'new tab'; });
        this.user = _sessionService.user;
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
