import {Component, OnInit, OnChanges} from '@angular/core';

@Component({
    selector: 'ui-multi-view',
    inputs: ['values', 'viewCount', 'options'],
    template: `
        <div class="ui-multi-view">
            <div class="total" *ngFor="let val of values">
                <span class="type" *ngIf="val.value">{{ val?.type }}</span>
                <span class="value">{{ val.value }}</span>
            </div>
            <span class="view_empty" *ngIf="values.length == 0">Неизвестно</span>
        </div>
    `,
    styles: [`
        .ui-multi-view{
            display: flex;
        }
        .total{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            line-height: normal;
            margin-right: 10px;
        }

        .total:last-child{
            margin-right: 0;
        }

        .total .value{
            font-size: 12px;
        }

        .total .type{
            font-size: 9px;
            color: #c0c0c0;
        }

        .view_empty{

        }
    `]
})


export class UIMultiView implements OnInit {
    public values: any[] = [];
    type: string;

    ngOnInit() { }

    ngOnChanges(){
        let temp=[];
        for(let val of this.values){
            if(val.value)
                temp.push(val);
        }
        this.values = temp;
    }
}
