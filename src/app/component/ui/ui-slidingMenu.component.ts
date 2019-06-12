import {Component, OnInit, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-slidingMenu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['options', 'value', 'toggle_style'],
    template: `
        <div (click)="hidden=!hidden">
            <span>{{ options[value]?.label }}</span>
        </div>
        <div [hidden]="hidden">
            <div *ngFor="let opt of objectKeys(options)" [class.selected]="opt == value" (click)="select(opt)"> {{ options[opt]?.label }}</div>
        </div>
    `,
    styles: [`
        .dropdown-toggle {
            white-space: nowrap;
            overflow: hidden;
            text-align: right;
            cursor: pointer;
            display: inline-flex;
            width: 100%;
            justify-content: flex-end;
            align-items: center;
            padding-right: 55px;
            box-sizing: border-box;
        }
        .label{
            width: 143px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .dropdown-menu {
            list-style: none;
            padding: 0;
            line-height: normal;
            margin: 10px 0;
        }

        .dropdown-menu  label {
            padding: 0 0 0 75px;
            font-weight: 400;
            color: #424242;
            white-space: nowrap;
            height: 25px;
            display: block;
            line-height: 25px;
            /* font-style: italic; */
        }

        .dropdown-menu>li:hover {
            background-color: #efefef;
        }

        .dropdown-menu>li.selected>label {
            background-color: #efefef;
        }

    `]
})


export class UISlidingMenuComponent {
    public options: any[];
    public value: any;
    public toggle_style: any;

    objectKeys = Object.keys;
    hidden: boolean = true;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    select(opt: any) {
        this.hidden = true;
        //this.onChange.emit(options[opt]);
    }


}
