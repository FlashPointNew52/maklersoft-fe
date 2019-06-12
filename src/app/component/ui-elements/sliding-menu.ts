import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'sliding-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['name','options', 'value', 'class'],
    template: `
        <div (click)="hidden=!hidden" [ngClass]="class" class="menu_header" [class.active]="!hidden">
            <span>{{name}}</span>
            <span>{{ options[value]?.label }}</span>
        </div>
        <div [hidden]="hidden" class="hidden_menu">
            <div *ngFor="let opt of objectKeys(options)" [class.selected]="opt == value"
                 (click)="select(opt)"
            >{{ options[opt]?.label }}</div>
        </div>
    `,
    styles: [`
        .menu_header{
            width: 100%;
            padding: 0 40px 0 25px;
            display: inline-flex;
            justify-content: space-between;
            cursor: pointer;
        }

        .active {
            background-color: #D3D5D6;
        }

        .hidden_menu{
            line-height: 25px;
            width: 100%;
            cursor: pointer;
        }

        .hidden_menu div{
            padding: 0 40px 0 50px;
            line-height: 25px;
        }

        .hidden_menu .selected, .hidden_menu div:hover{
            background-color: #f7f7f8;
        }

    `]
})


export class SlidingMenuComponent {
    public options: any = {};
    public name: string = "";
    public value: any;
    public class: any;

    objectKeys = Object.keys;
    hidden: boolean = true;

    @Output() result: EventEmitter<any> = new EventEmitter();

    select(opt: any) {
        this.hidden = true;
        this.result.emit(opt);
    }
}
