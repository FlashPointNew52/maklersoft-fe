import {Component, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Tags} from '../../class/tags';

@Component({
    selector: 'ui-filter-tag-select',
    inputs: ['value'],
    template: `
        <div (click)="show()" class="show_text" (offClick)="clickedOutside($event)">{{ getTagName(selected) || "Тэги"}}</div>
        <div class="context-menu-wrapper" [hidden]="hidden"

        >
            <div
                *ngFor="let i of tags"
                [ngSwitch]="i.class"
                (click)="select(i)"
                class="filter"
                [class.selected] = "i.id == value"
            >
                <div [style.background-color]="i.color" class="tag"></div>
                <span>{{i.label}}</span>
            </div>
        </div>
    `,
    styles: [`
        .show_text{
            overflow: hidden;
            cursor: pointer;
            font-size: 11px;
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
            border: 0px solid;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 0;
            box-shadow: 0px 1px 6px 0px rgba(189,192,193,1);
            background-clip: padding-box;
        }

        .filter{
            height: 25px;
            line-height: 25px;
            cursor: pointer;
        }

        .selected, .filter:hover{
            background-color:rgb(238, 238, 238);
        }

        .tag{
            width: 25px;
            height: 12px;
            float: left;
            margin: 6px 10px 6px 20px;
        }

    `]
})


export class UIFilterTagSelect implements OnInit, OnChanges {
    public options: Array<any>;
    public value: any;

    selected: any = Tags.tagArray[0];
    index: number = 0;
    hidden: boolean = true;

    tags: any[] = Tags.tagArray;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {

    }

    ngOnChanges() {
        for (let i = 0; i < this.tags.length; ++i) {
            if (this.value == this.tags[i].id) {
                this.index = i;
                this.selected = this.tags;
            }
        }
    }

    toggleHidden(e: MouseEvent) {
        this.hidden = !this.hidden;
    }

    clickedOutside() {
        if(!this.hidden)
            this.hidden = true;
    }

    select(tag) {
        this.onChange.emit(tag.id);
        this.hidden = true;
        this.selected = tag.id;

    }

    show(){
        this.hidden = !this.hidden;
    }

    getSelect(si, i1){
        //console.log(this.selected.subvalue);
        //console.log(si, this.options[this.index].items[i1]);
        if (si == this.options[this.index].items[i1] && si.value == this.selected.subvalue){

            return true;
        } else return false;
    }

    getTagName(value){
        if(value.id)
            return Tags.getLabel(value.id);
        else return null;
    }
}
