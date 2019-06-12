import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['options', 'config', 'value', 'levels'],
    template: `
        <div class="ui-select">
            <div class="dropdown-toggle"
                (click)="toggleHidden($event)"
                (offClick)="clickedOutside($event)"
            >
                {{ selected?.label }}
                <span class="select_arrow"></span>
            </div>
            <ul class="dropdown-menu pull-right" [hidden]="hidden">
                <li *ngFor="let opt of options"
                    [class.bold]="opt.bold == true"
                    [class.selected]="opt.value == selected?.value"
                    (click)="select(opt, $event)"
                >
                    <label>{{ opt.label }}<span *ngIf="opt?.icon" class="{{ opt?.icon }}"></span></label>
                    <ul class="dropdown-menu pull-right sublevel" [hidden]="hidden" *ngIf="opt?.submenu">
                        <li *ngFor="let sub of opt.submenu"
                            [class.selected]="sub.value == selected?.value"
                            (click)="select({main: opt, sub: sub.value}, $event)"
                        >
                            <label>{{ sub.label }}</label>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
    styles: [`

        .ui-select {
            position: relative;
            height: 100%;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            float: left;
            min-width: 160px;
            padding: 5px 0;
            margin: 2px 0 0;
            font-size: 14px;
            list-style: none;
            border: 1px solid #ccc;
            border: 1px solid rgba(0,0,0,0.15);
            background-clip: padding-box;
            background-color: #fff;
        }


        .dropdown-toggle {
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 100%;
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-align: right;
            cursor: pointer;
            font-size: 12px;
            font-style: italic;
            color: #677578; 
        }

        .select_arrow{
            background-image: url(/assets/arrow.png);
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            width: 17px;
            height: 17px;
            display: block;
            float: right;
            margin: 0 0 0 5px;
        }

        .bold>label {
            font-weight: 600 !important;
        }

        .dropdown-menu>li>label {
            display: block;
            padding: 3px 20px;
            clear: both;
            font-weight: 400;
            line-height: 1.42857143;
            color: #424242;
            white-space: nowrap;
            font-size: 12px;
        }

        .dropdown-menu>li:hover {
            background-color: rgb(238, 238, 238);
        }

        .dropdown-menu>li.selected>label {
            background-color: rgb(238, 238, 238);
        }

        .inline {
            width: 120px;
            display: inline-block;
        }

        .inline > .dropdown-toggle {
            font-weight: 200;
            font-size: 14px;
        }

        .pull-right li{
            position: relative;
        }

        .pull-right li >ul {
            left: 100%;
            top: 0;
        }

    `]
})


export class UISelect implements OnInit, OnChanges {
    public options: any[];
    public value: any;
    public levels: number = 1;

    selected: any;

    hidden: boolean = true;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    toggleHidden(e: MouseEvent) {
        e.stopPropagation();
        this.hidden = !this.hidden;
    }

    clickedOutside(event) {
        event.stopPropagation();
        this.hidden = true;
    }

    select(opt: any, event) {
        event.stopPropagation();
        this.value = opt.value;
        this.selected = opt;
        this.hidden = true;

        this.onChange.emit({selected: opt});
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let o of this.options) {
            if (this.value == o.value) {
                this.selected = o;
            }
        }
        if (this.selected == null && this.options.length > 0) {
            this.selected = this.options[0];
        }
    }

}
