import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'selects',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['options', 'value'],
    template: `
        <div class="value link" (click)="toggleHidden($event)">{{selected?.label}}</div>
        <div (offClick)="clickedOutside($event)" *ngIf="!hidden" class="hidden_menu">
            <ng-container *ngFor="let opt of options">
                <div (click)="select(opt)" [class.selected]="selected?.value == opt.value">{{opt?.label}}</div>
            </ng-container>
        </div>
    `,
    styles: [`
        .hidden_menu{
            position: absolute;
            top: 21px;
            left: -21px;
            z-index: 10;
            padding: 10px 0;
            background-color: #ffffff;
            border-radius: 0;
            line-height: 25px;
            box-shadow: 0 1px 6px 0 #bdc0c1;
            background-clip: padding-box;
        }

        .hidden_menu div{
            padding: 0px 20px;
        }

        .selected, .hidden_menu div:hover{
            background-color: #f7f7f8
        }
    `]
})


export class SelectsComponent implements OnInit, OnChanges {
    public options: any[]=[];
    public value: any;

    selected: any;

    hidden: boolean = true;

    @Output() newValue: EventEmitter<any> = new EventEmitter();

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

    select(opt) {
        event.stopPropagation();
        this.selected = opt;
        this.hidden = true;
        this.newValue.emit(opt.value);
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.value && changes.options.currentValue){
            this.selected = this.options.filter(val => val.value == this.value)[0];
        }
    }

}
