/**
 * Created by Aleksandr on 23.11.16.
 */

import {Component, OnInit, OnChanges} from '@angular/core';

@Component({
    selector: 'ui-view-value',
    inputs: ['options', 'value', 'Style'],
    template: `
        <div class="ui-view-value" [ngStyle]="Style">
                {{ selected?.label }}
        </div>
    `,
    styles: [`
        .ui-view-value{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            height: 100%;
        }
    `]
})


export class UIViewValue implements OnInit {
    public options: any[] = [];
    public value: any;
    public Style: any;

    selected: any = {
        value: null,
        label: "Неизвестно"
    };

    ngOnInit() {
        for (let o of this.options) {
            if (this.value == o.value) {
                this.selected = o;
            }
        }
    }

    ngOnChanges() {
        this.ngOnInit();
    }

    getStyle(){
        if(this.Style)
            return this.Style;
        else return "";
    }
}
