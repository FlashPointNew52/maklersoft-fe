import {Component} from '@angular/core';
import {Tab} from '../../class/tab';


@Component({
    selector: 'tab-root',
    inputs: ['tab'],
    template: `
        <ng-container [ngSwitch]="tab.type">
            <tab-main [tab]="tab" *ngSwitchCase="'main'"></tab-main>
            <tab-list-offer [tab]="tab" *ngSwitchCase="'list_offer'"></tab-list-offer>
            <tab-offer [tab]="tab" *ngSwitchCase="'offer'"></tab-offer>
            <tab-list-person [tab]="tab" *ngSwitchCase="'list_person'"></tab-list-person>
            <tab-person [tab]="tab" *ngSwitchCase="'person'"></tab-person>
            <tab-list-organisation [tab]="tab" *ngSwitchCase="'list_organisation'"></tab-list-organisation>
            <tab-organisation [tab]="tab" *ngSwitchCase="'organisation'"></tab-organisation>
            <tab-list-request [tab]="tab" *ngSwitchCase="'list_request'"></tab-list-request>
            <tab-request [tab]="tab" *ngSwitchCase="'request'"></tab-request>
            <tab-advertising [tab]="tab" *ngSwitchCase="'advertising'"></tab-advertising>
            <tab-list-user [tab]="tab" *ngSwitchCase="'list_users'"></tab-list-user>
            <tab-user [tab]="tab" *ngSwitchCase="'user'"></tab-user>
            <tab-list-activity [tab]="tab" *ngSwitchCase="'list_activity'"></tab-list-activity>
            <tab-activity [tab]="tab" *ngSwitchCase="'activity'"></tab-activity>
            <tab-daily [tab]="tab" *ngSwitchCase="'daily'"></tab-daily>
            <tab-config [tab]="tab" *ngSwitchCase="'config'"></tab-config>
            <div *ngSwitchDefault>tab.type == {{ tab.type }}</div>
        </ng-container>
    `
})

export class TabRootComponent {
    public tab: Tab;

}
