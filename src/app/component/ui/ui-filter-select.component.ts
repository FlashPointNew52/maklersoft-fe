import {Component, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-filter-select',
    inputs: ['options', 'value'],
    template: `
        <div (click)="show()" class="show_text" (offClick)="clickedOutside($event)">{{options[index]?.label || "Сортировать по ..."}}</div>
        <div class="context-menu-wrapper" [hidden]="hidden"

        >
            <div
                *ngFor="let i of options"
                [ngSwitch]="i.class"
                (click)="select($event,i)"
                class="filter"
                [class.selected] = "i == options[index]"
            >
                <div *ngSwitchCase="'submenu'" class="entry submenu-sc" style="position: relative;">
                    {{ i.label }}
                    <div class="submenu-wrapper" [class.flip]="flip">
                        <div
                            *ngFor="let si of i.items; let i1=index"
                            [ngSwitch]="si.class"
                            (click)="select($event, i, si.value)"
                            [class.selected] = "getSelect(si, i1)"
                        >
                            <div *ngSwitchCase="'submenu'" class="entry submenu-sc" style="position: relative;">
                                {{ si.label }}
                                <div class="submenu-wrapper" [class.flip]="flip">
                                    <div
                                        *ngFor="let sii of si.items; let i2=index"
                                        [ngSwitch]="sii.class"
                                        (click)="select($event, i, i1, sii.value)"
                                        [class.selected] = "getSelect(sii, i2)"
                                    >
                                        <div *ngSwitchCase="'entry'" class="entry" >{{ sii.label }}</div>
                                        <div *ngSwitchDefault class="entry">{{ sii.label }}</div>
                                    </div>
                                </div>
                            </div>
                            <div *ngSwitchCase="'entry'" class="entry" >{{ si.label }}</div>
                            <div *ngSwitchDefault class="entry">{{ si.label }}</div>
                        </div>
                    </div>
                </div>
                <div *ngSwitchCase="'entry'" class="entry">{{ i.label }}</div>
                <div *ngSwitchDefault class="entry">{{ i.label }}</div>
            </div>
        </div>
    `,
    styles: [`
        .show_text{
            overflow: hidden;
            cursor: pointer;
            font-size: 12px;
        }

        .context-menu-wrapper {
            position: absolute;
            z-index: 1000;
            float: left;
            min-width: 160px;
            padding: 10px 0;
            margin: 2px 0 0;
            font-size: 12px;
            list-style: none;
            border: 0 solid;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 0;
            box-shadow: 0 1px 6px 0 rgba(189,192,193,1);
            background-clip: padding-box;
        }

        .context-menu-scrollable {
            overflow-y: auto;
        }

        .submenu-wrapper {
            display: none;
            position: absolute;
            top: 0px;
            left: 100%;
            padding: 5px 0;
            border: 0px solid;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 0;
            box-shadow: 0px 1px 6px 0px rgba(189,192,193,1);
        }

        .submenu-sc:hover:not(.disabled) > .submenu-wrapper {
            display: block;
        }

        .submenu-sc:after {
            display: block;
            float: right;
            width: 0;
            height: 0;
            margin-top: 9px;
            margin-right: -10px;
            border-color: transparent;
            border-left-color: #666;
            border-style: solid;
            border-width: 5px 0 5px 5px;
            content: " ";
        }

        .entry {
            padding: 0px 20px;
            font-weight: normal;
            line-height: 25px;
            height: 25px;
            color: #424242;
            white-space: nowrap;
            min-width: 120px;
            cursor: pointer;

            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .entry_line {
            padding: 3px 20px;
            font-weight: normal;
            line-height: 20px;
            height: 40px;
            color: #333;
            white-space: nowrap;
            min-width: 120px;
        }

        .entry:hover {
            background-color: #eee;
        }

        .entry.disabled {
            background-color: #fff;
            color: #aaa;
            cursor: not-allowed;
        }

        .flip {
            left: -101%;
        }

        .selected{
            background-color:rgb(238, 238, 238);
        }

    `]
})


export class UIFilterSelect implements OnInit, OnChanges {
    public options: Array<any>;
    public value: any;

    selected: any;
    index: number = 0;
    hidden: boolean = true;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        for (let o of this.options) {
            if (this.value && this.value.option == o.value) {
                this.index = this.options.indexOf(o);
                this.selected = o;
                this.selected = {option: o.value};
                if(o.items)
                    this.selected["subvalue"] = this.value.subvalue;
            }
        }
        if (this.selected == null && this.options.length > 0) {
            this.selected = {option: this.options[0].value};
            if(this.options[0].items)
                this.selected["subvalue"] = this.options[0].items[0].value;
        }
    }

    toggleHidden(e: MouseEvent) {
        this.hidden = !this.hidden;
    }

    clickedOutside() {
        if(!this.hidden)
            this.hidden = true;
    }

    select(event, val1, val2?, val3?) {
        event.stopPropagation();
        if(val3){
            this.selected = {option: val1.value, subvalue: val2, subsubvalue: val3};
            this.hidden = true;
            this.onChange.emit(this.selected);
        } else if(val2){
            this.selected = {option: val1.value, subvalue:val2};
            this.hidden = true;
            this.onChange.emit(this.selected);
        } else if(val1){
            this.selected = {option: val1.value};
            this.hidden = true;
            this.onChange.emit(this.selected);
        }
    }

    show(){
        this.hidden = !this.hidden;
    }

    getSelect(si, i1){
        if (si == this.options[this.index].items[i1] && si.value == this.selected.subvalue){

            return true;
        } else return false;
    }
}
