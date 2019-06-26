import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Tags} from "../../class/tags";

@Component({
    selector: 'sliding-tag',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['value'],
    template: `
        <div (click)="hidden=!hidden" [ngClass]="class" class="menu_header" [class.active]="!hidden ">
            <span>Тэги</span>
            <span>{{ tags[value]?.label }}</span>
        </div>
        <div [hidden]="hidden" class="hidden_menu">
            <div *ngFor="let tag of tags" (click)="select(tag)" [class.selected]=" tag == value">
                <div [style.background-color]="tag.color" class="tag"></div>
                <span>{{tag.label}}</span>
            </div>
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

        .hidden_menu > div{
            padding: 0 40px 0 50px;
            line-height: 25px;
        }

        .hidden_menu .selected, .hidden_menu > div:hover{
            background-color: #f7f7f8;
        }
        
        .tag{
            width: 30px;
            height: 13px;
            float: left;
            margin: 6px 15px 6px 0;
        }

    `]
})


export class SlidingTagComponent {
    tags = Tags.tagArray;
    public value: any;
    public class: any;

    hidden: boolean = true;

    @Output() newValue: EventEmitter<any> = new EventEmitter();

    select(tag) {
        this.newValue.emit(tag.id);
    }
}
