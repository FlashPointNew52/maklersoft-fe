import {Component, AfterContentInit} from '@angular/core';

import {Tab} from '../class/tab';
import {HubService} from "../service/hub.service";
import {Observable} from "rxjs";
import {User} from "../entity/user";
import {SessionService} from "../service/session.service";



@Component({
    selector: 'tab-system',
    styleUrls: ['./tab-system.component.css'],
    template: `
    <div class="tab-list">

        <div class="tab home" [class.selected]="tabs[0].active" (click)="selectTab(tabs[0])"></div>

        <div class="tab" *ngFor="let tab of tabs; let i = index" [class.selected]="tab.active" (click)="selectTab(tab)">
            <ng-container *ngIf="i > 0">
                <div class="tab-button close-button" (click)="closeTab(tab)"><span class="icon-cancel"></span></div>
                <div class="vertical-text-container" [style.height]="vtHeight+'px'">
                    <div class="vertical-text">{{ tab.header }}</div>
                </div>
            </ng-container>
        </div>
    </div>
    <div class="tab-content">
        <div class='const_menu'>
            <div class="button" style="background-image: url(/assets/call.png)"><span></span></div>
            <div class="button" style="background-image: url(/assets/notebook_icon/chat.png)"><span></span></div>
            <div class="button" style="background-image: url(/assets/notebook_icon/task.png)"><span></span></div>
            <div class="button" style="background-image: url(/assets/notebook_icon/note.png)"><span></span></div>
            <div class="user_menu">
                <div class="user_photo" [style.background-image]="'url('+( user | async).photoMini+')'"></div>
            </div>
        </div>
        <ng-container *ngFor="let tab of tabs; let i = index">
            <tab-root
                [hidden]="!tab.active"
                [tab]="tab">
            </tab-root>
        </ng-container>
    </div>
    `
})

export class TabSystemComponent implements AfterContentInit{
    public tabs: Tab[] = [];
    public tabHeight = 0;
    public vtHeight = 0;

    user: Observable<User>;

    to: any;

    constructor(private _hubService: HubService,
                private _sessionService: SessionService)
    {
        _hubService.setProperty('tab_sys', this);
        this.user = _sessionService.user;
    }

    ngAfterContentInit() {
        this.addTab('main', {});
    }

    calcTabHeight() {
        let nominalHeight = 160;
        let minimalHeight = 60;
        let h = document.body.clientHeight - (31 * 2);  // - 2 buttons
        this.tabHeight = (h - this.tabs.length) / this.tabs.length;

        if (this.tabHeight > nominalHeight) this.tabHeight = nominalHeight;
        if (this.tabHeight < minimalHeight) this.tabHeight = minimalHeight;

        this.vtHeight = this.tabHeight - 60;
    }

    selectTab(tab: Tab) {
        this.clearActive();
        tab.active = true;
        tab.refresh("tabSys");
    }

    addTab(type, args) {
        if (this.tabs.length < 10) {
            let newTab = new Tab(this, type, args);
            this.tabs.push(newTab);

            this.calcTabHeight();
            this.clearActive();
            newTab.active = true;
        }
    }

    clearActive() {
        this.tabs.forEach(t => {
            t.active = false;
        });
    }

    closeTab(tab: Tab) {
        let idx = this.tabs.indexOf(tab);
        this.tabs.splice(idx, 1);

        if (this.tabs.length == 0) {
            this.addTab('main', {});
        } else {
            if(tab.active) {
                let t = this.tabs[idx ? (idx - 1) : 0];
                t.active = true;
                t.refresh("tabSys");
            }
        }

        clearTimeout(this.to);
        this.to = setTimeout(() => {
            this.calcTabHeight();
        }, 500);

    }
}
