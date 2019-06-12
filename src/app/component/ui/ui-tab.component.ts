import {Component, SimpleChange} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';


@Component({
    selector: 'ui-tab',
    inputs: [
        'title',
        'active'
    ],
    styles: [``],
    template: `
        <ng-container *ngIf="active">
            <ng-content></ng-content>
        </ng-container>
    `
})

export class UITab {
    title: string;
    active: boolean = false;

    @Output() tabSelect: EventEmitter<any> = new EventEmitter();

    selectTab() {
        this.tabSelect.emit({bla: "bla"});
        this.active = true;
    }
}
