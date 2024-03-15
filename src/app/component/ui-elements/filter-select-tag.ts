import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Tags} from "../../class/tags";

@Component({
    selector: 'filter-select-tag',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['value'],
    template: `
        Тег <span *ngIf="selected?.color && selected?.color != 'transparent'" [style.background-color]="selected?.color"></span>
        <div class="filter">
            <div *ngFor="let opt of options" (click)="choose(opt)" [class.selected]="opt?.id == selected?.id">
                <span [style.background-color]="opt?.color"></span>
                {{opt?.label}}
            </div>
        </div>

    `,
    styles: [`
        :host{
            position: relative;
            min-width: 20px;
            margin-right: 15px;
            cursor: pointer;
            z-index: 999;
        }

        :host > span{
            width: 26px;
            height: 8px;
            display: block;
            float: right;
            margin: 3px 0 0 10px;
        }

        .filter{
            display: none;
            background-color: var(--box-backgroung);
            position: absolute;
            box-shadow: var(--box-shadow);
            background-clip: padding-box;
            line-height: 25px;
            z-index: 10;
            text-align: left;
            padding: 8px 0;
            top: 10px;
            width: max-content;
        }

        :host:hover > .filter{
            display: block;
        }

        .filter > div{
            line-height: 25px;
            padding: 0 20px;
        }

        .filter > div:hover, .filter > div.selected{
            background-color: var(--box-hover-element);
        }

        .filter > div > span{
            width: 26px;
            height: 10px;
            display: block;
            float: left;
            margin: 8px 10px 0 0;
        }
    `]
})


export class FilterSelectTagComponent implements OnInit, OnChanges {
    public value: any;

    options: any[] = Tags.tagArray;
    selected: any;

    @Output() newValue: EventEmitter<any> = new EventEmitter();

    public ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.options && changes.options.currentValue){

        }
    }

    public choose(opt: any) {
        this.selected = opt;
        this.newValue.emit(opt.id);
    }
}
