import {Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'selects',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['options', 'value', 'disabled'],
    template: `
        <div class="value link" (click)="toggleHidden($event)" [class.inactive]="disabled">{{selected?.label}}</div>
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
            background-color: var(--box-backgroung);
            border-radius: 0;
            line-height: 25px;
            box-shadow: var(--box-shadow);
            background-clip: padding-box;
        }

        .hidden_menu div{
            padding: 0px 20px;
        }

        .selected, .hidden_menu div:hover{
            background-color: var(--hover-menu);
        }
    `]
})


export class SelectsComponent implements OnInit, OnChanges {
    public options: any[]=[];
    public value: any;
    public disabled: boolean = false;

    selected: any;

    hidden: boolean = true;

    @Output() newValue: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    toggleHidden(e: MouseEvent) {
        e.stopPropagation();
        if(!this.disabled)
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
