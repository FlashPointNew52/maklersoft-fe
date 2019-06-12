import { Component, ContentChildren, QueryList} from '@angular/core';

//import {UITab} from './ui-tab.component';

@Component({
    selector: 'ui-header',
    inputs: [],
    template: `
        <ng-content></ng-content>
    `,
    styles: [`
        ui-header{
            height: 122px;
            width: 100%;
            display: block;
        }
    `]
})

export class UIHeaderComponent  {
    //@ContentChildren(UITab) tabs: QueryList<UITab>;

    constructor() {
    }
}
