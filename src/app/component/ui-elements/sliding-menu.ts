import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'sliding-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['name','options', 'value', 'class', 'disabled'],
    template: `
        <div (click)="hidden=!hidden" [ngClass]="class" class="menu_header" [class.active]="!hidden && !disabled" [class.inactive]="disabled">
            <span [class.inactive]="disabled">{{ name }}</span>
            <span [class.inactive]="disabled">{{ options[value]?.label }}</span>
        </div>
        <div [hidden]="hidden" class="hidden_menu">
            <div *ngFor="let opt of objectKeys(options)" [class.selected]="(opt == 'null' ? null : opt) == value"
                 (click)="select(opt)"
            >{{ options[opt]?.label }}</div>
        </div>
    `,
    styles: [`
        .menu_header{
            width: 100%;
            padding: 0 30px;
            display: inline-flex;
            justify-content: space-between;
            cursor: pointer;
        }

        .active {
            background-color: var(--color-blue);
        }
        .active > span{
            color: white;
        }
        .hidden_menu{
            line-height: 30px;
            width: 100%;
            cursor: pointer;
        }

        .hidden_menu div{
            padding: 0 40px 0 50px;
            line-height: 30px;
        }

        .hidden_menu .selected, .hidden_menu div:hover{
            background-color: var(--bottom-border);
        }

    `]
})


export class SlidingMenuComponent implements OnInit{
    public options: any = {};
    public name: string = "";
    public value: any;
    public class: any;
    public disabled: boolean = false;

    objectKeys = Object.keys;
    hidden: boolean = true;

    ngOnInit(): void {

    }

    @Output() result: EventEmitter<any> = new EventEmitter();

    select(opt: any) {
        this.hidden = true;
        this.result.emit(opt);
    }
}
