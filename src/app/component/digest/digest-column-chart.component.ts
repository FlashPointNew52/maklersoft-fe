import {Component, OnInit, OnChanges} from '@angular/core';

import {HubService} from '../../service/hub.service';



@Component({
    selector: 'digest-column-chart',
    inputs: ['data', 'header', 'hard_data' , 'height', 'result', 'width'],
    styles: [`
        .container {
            background-color: white;
            font-size: 16px;
            position: relative;
            display: inline-block;
            min-height: 150px;
            width: 100%;
            height: 100%;
            overflow: hidden;
            min-width: 285px;
        }
        .head{
            text-transform: uppercase;
            color: #4c4c4c;
            margin: 12px 0 0 15px;
            height: 48px;
            position: relative;
            z-index: 10;
        }

        .total{
            font-size: 20pt;
            color: rgba(0, 0, 0, 0.67);
            margin-left: 10px;
            margin-top: 5px;
            height: 30px;
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            right: 5;
        }

        .total>div:nth-child(1){
            float: left;
            margin-right: 10px;
        }

        .total>div:nth-child(2){
            font-size: 16pt;
        }

        .total>div:nth-child(2):after{
            font-size: 14pt;
            position: relative;
            top: -2px;
        }

        .red{
            color: red;
        }
        .green{
            color: green;
        }

        .table{
            height: calc(100% - 72px);
            display: flex;
            flex-direction: column;
            width: calc(100% - 20px);
            margin-left: 10px;
            justify-content: space-between;
        }

        .row{
            width: 100%;
            display: flex;
            align-items: center;
            height: 100%;
            margin-bottom: 3px;
        }

        .label{
            font-size: 12px;
            color: rgba(101, 101, 101, 0.81);
            width: 40%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .column{
            background-color: #AB47BC;
            align-items: center;
            display: flex;
            width: 60%;
            height: 100%;
        }

        .column>div{
            background-color: #EDE7F6;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
        }

    `],
    template: `
        <div class="container">
            <div class="head">{{header}}</div>
            <div class="table">
                    <div *ngFor="let dt of data" class="row" [style.height]>
                        <div class="label"> {{dt[0]}} </div>
                        <div class="column">
                            <span style="position: absolute;font-size: 10px;color: black;margin-left: 5px;z-index: 3;" *ngIf="dt[1] >= 13">{{dt[1] + '%'}}</span>
                            <div  [style.width]="dt[1]+'%'">
                                <div style="color: white;font-size: 10px;position: absolute;right: -23px;" *ngIf="dt[1] <= 87">{{(100-dt[1]) + '%'}}</div>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="total" *ngIf="result">
                <div>{{result[0]}}</div>
                <div *ngIf="hard_data"
                    [class.green]="result[1] > 0" [class.icon_plus]="result[1] > 0" [class.icon_arrow_up]="result[1] > 0"
                    [class.red]="result[1] < 0"  [class.icon_minus]="result[1] < 0" [class.icon_arrow_bottom]="result[1] < 0"
                >{{result[1]}}</div>
            </div>
        </div>
    `
})

export class DigestColumnChartComponent implements OnInit, OnChanges {
    hard_data: boolean = false;
    data: any[]= [];
    height: string = "160px";
    width: string = "300px";

    constructor(private _hubService: HubService) {
    };

    ngOnInit() {

    }

    ngOnChanges(){

    }

    abs(num: number){
        return Math.abs(num);
    }

}
