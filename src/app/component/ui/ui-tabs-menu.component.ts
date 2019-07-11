import {
  Component, ContentChildren, QueryList, AfterViewInit, AfterContentChecked,
  AfterContentInit
} from '@angular/core';

import {UITab} from './ui-tab.component';

@Component({
    selector: 'ui-tabs-menu',
    inputs: [],
    template: `
        <div class="tabs">
            <div *ngFor="let tab of tabs; let i = index;" class="tab-header"
                    (click)="selectTab(tab)" [class.active]="tab.active"
            > {{tab.title}}
            </div>
            <ng-content select="[more]"></ng-content>
        </div>
        <ng-content></ng-content>
    `,
    styles: [`
        .tabs{
            width: 100%;
            /*height: 43px;*/
            display: inline-flex;
            font-size: 12px;
            justify-content: left;
            padding: 18px 25px 0 25px;
            box-sizing: border-box;
            border-bottom: 1px solid #3b5998;
            margin-bottom: 8px;
        }
        
        .tab-header{
            cursor: pointer;
            margin-right: 15px;
            padding-bottom: 7px;
        }
        
        .tabs_header > .tabs{
            display: inline-flex;
            font-size: 12px;
            justify-content: space-between;
            width: calc(100% - 30px);
            margin: 54px 15px 10px;
            border-bottom: 1px solid #bbbbbb;
        }

        .tabs_header > .tabs > .tab-header{
            padding: 10px 5px 10px;
            cursor: pointer;
        }

        .active, .tab-header:hover{
            border-bottom: 5px solid #3b5998;
            font-weight: bold;
        }
  `]
})

export class UITabsMenu implements  AfterContentInit  {
    @ContentChildren(UITab) tabs: QueryList<UITab>;

    constructor() {}

    ngAfterContentInit() {
        if (!_hasActiveTab(this.tabs)) {
            this.selectTab(this.tabs.first);
        }

        function _hasActiveTab(tabs: QueryList<UITab>) {
            let activeTabs = tabs.filter((tab) => tab.active);
            return Boolean(activeTabs.length);
        }
    }

    selectTab(tab: UITab) {
        this._deactivateAllTabs(this.tabs.toArray());
        tab.selectTab();
    }

    _deactivateAllTabs(tabs: UITab[]) {
        tabs.forEach((tab) => tab.active = false);
    }
}
