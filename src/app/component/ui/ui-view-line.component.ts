import {Component, OnInit, OnChanges, Input} from '@angular/core';

@Component({
    selector: 'ui-view-line',
    inputs: ['placeholder', 'value'],
    template: `
        <div class="ui-view-line" [class.empty-ui]="value == ''">
            <span class="label" *ngIf="value != ''">{{placeholder}}</span>
            <span class ="value" *ngIf="value != ''">{{value}}</span>
            <span class ="emptyValue" *ngIf="value == ''">{{placeholder}}</span>
            <span class ="empty" *ngIf="value == ''">Не указан</span>
        </div>
    `,
    styles: [`

        .label{
            font-size: 8pt;
        }

        .ui-view-line {
            display: flex;
            flex-direction: column;
            width: 285;
            height: 32px;
            margin-top: -3px;
        }

        .value{
            width: 100%;
            text-align: left;
            color: #696969;
            font-size: 10pt;
            height: 19px;
        }

        .empty-ui {
            flex-direction: row;
            justify-content: space-between;
            width: 293px;
        }

        .emptyValue{
            white-space: nowrap;
            color: rgb(80, 80, 80);
            margin-top: 8px;
            font-size: 10pt;
        }
        .empty{
            white-space: nowrap;
            color: rgb(80, 80, 80);
            margin-top: 8px;
            font-size: 10pt;
            margin-right: 10px;
        }
    `]
})


export class UIViewLine implements OnInit, OnChanges{
    public placeholder: string;
    public value: string;

    opacity = 1;

    ngOnInit() {
        if(this.value)
            this.opacity = 1;
        else this.opacity = 0;
    }
    ngOnChanges() {

    }

}
