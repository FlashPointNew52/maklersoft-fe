import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'filter-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['name', 'options', 'value', 'firstAsName'],
    template: `
        {{alterName}}
        <div class="filter">
            <div *ngFor="let opt of options; first as isFirst" (click)="choose(opt, isFirst)" [class.selected]="opt?.value == selected?.value">
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


    `]
})


export class FilterSelectComponent implements OnInit, OnChanges {
    public name: string = "";
    public options: any[]=[];
    public value: any;
    public firstAsName: boolean = false;

    selected: any;
    alterName: string = "";

    @Output() newValue: EventEmitter<any> = new EventEmitter();

    public ngOnInit(): void {
        this.alterName = "" + this.name;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.name && changes.name.currentValue){
            this.alterName = "" + this.name;
        }
        if(changes.options && changes.options.currentValue){
            for(let opt of changes.options.currentValue){
                //console.log(opt.value, this.value);
                if(opt && opt.value && opt.value == this.value.option)
                    this.selected = opt;
            }
        }

    }

    public choose(opt: any, isFirst: boolean) {
        if(isFirst && this.firstAsName){
            this.alterName = this.name;
        } else{
            this.alterName = opt.label;
        }
        this.selected = opt;
        this.newValue.emit(opt.value);
    }
}
