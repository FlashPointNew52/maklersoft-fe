import {Component, OnInit, OnChanges} from '@angular/core';

import {HubService} from '../../service/hub.service';



@Component({
    selector: 'digest-pie-chart',
    inputs: ['data', 'header', 'hard_data' , 'height', 'width', 'result'],
    styles: [`
        .container {
            background-color: white;
            font-size: 16px;
            position: relative;
            display: inline-block;
            min-height: 159px;
            height: 100%;
            width: 100%;
            overflow: hidden;
            min-width: 285px;
        }
        .head{
            text-transform: uppercase;
            color: #4c4c4c;
            margin: 12px 0 0px 15px;
            position: relative;
            z-index: 10;
            height: 48px;
            display: flex;
            justify-content: space-between;
        }

        .total{
            font-size: 20pt;
            color: rgba(0, 0, 0, 0.67);
            display: flex;
            align-items: center;
            height: 15px;
            margin-right: 10px;
        }

        .total>div:nth-child(1){
            float: left;
            margin-right: 6px;
        }

        .total>div:nth-child(2){
            font-size: 10pt;
            height: 16px;
            line-height: 25px;
        }

        .total>div:nth-child(2):after{
            font-size: 10pt;
            position: relative;
            top: 0px;
        }

        .table{
            height: calc(100% - 72px);
            display: flex;
            flex-direction: row;
            width: calc(100% - 20px);
            margin-left: 10px;
            justify-content: space-between;
        }

        .table > .dates{
            width: 50%;
            height: 100%;
            float: right;
        }

        .dates > div {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .dates > div > div{
            font-size: 12px;
            color: rgba(101, 101, 101, 0.81);
            height: 17px;
            line-height: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .chart{
            width: 50%;
            display: flex;
            justify-content: flex-end;
        }

        .red{
            color: red !important;
        }
        .green{
            color: green !important;
        }

    `],
    template: `
        <div class="container" (window:resize)="resize()">
            <div class="head">{{header}}
                <div class="total" *ngIf="result">
                    <div>{{result[0]}}</div>
                    <div *ngIf="hard_data"
                        [class.green]="result[1] > 0" [class.icon_plus]="result[1] > 0" [class.icon_arrow_up]="result[1] > 0"
                        [class.red]="result[1] < 0"  [class.icon_minus]="result[1] < 0" [class.icon_arrow_bottom]="result[1] < 0"
                    >{{abs(result[1])}}</div>
                </div>
            </div>
            <div class="table">
                <div class="dates">
                    <div *ngFor="let dat of data">
                        <div style="flex: 0 2 100%;">{{dat[0]}}</div>
                        <div [style.width]="'25%'">{{dat[1]}}</div>
                        <div *ngIf="dat[2]" [style.width]="'35%'"
                            [class.green]="dat[2] > 0" [class.icon_plus]="dat[2] > 0" [class.icon_arrow_up]="dat[2] > 0"
                            [class.red]="dat[2] < 0"  [class.icon_minus]="dat[2] < 0" [class.icon_arrow_bottom]="dat[2] < 0"
                        >
                            {{abs(dat[2])}}
                        </div>
                    </div>
                </div>
                <div class="chart"
                    id={{chartID}}
                    [data]="pie_ChartData"
                    [chartOptions] = "pie_ChartOptions"
                    chartType="PieChart" GoogleChart
                >
                </div>
            </div>
        </div>
    `
})

export class DigestPieChartComponent implements OnInit, OnChanges {
    chartID: string = "Chart"+Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    hard_data: boolean = false;
    pie_ChartData: any[] =[];
    data: any[]= [];
    height = "160px";
    width = "300px";
    chartSize = 136;

    pie_ChartOptions: any;
    constructor(private _hubService: HubService) {
    };

    ngOnInit() {

        if(!this.data){
            this.pie_ChartData.push(['Данных нет', 1]);
        }else if(!this.hard_data)
            this.pie_ChartData = [].concat(this.data);
        else{
            for(let i of this.data)
                this.pie_ChartData.push([i[0], i[1]]);
        }
        this.pie_ChartData.unshift(['', '']);
        setTimeout(() => {
            this.resize();
        }, 1);

    }

    ngOnChanges(){}

    abs(num: number){
        return Math.abs(num);
    }

    resize(){
        this.pie_ChartOptions  = {
            width: this.getSize(),
            height: this.getSize(),
            pieHole: 0.53,
            legend: 'none',
            chartArea: {left:'auto', top: 0, width: this.getSize(), height: this.getSize()},
            pieSliceText: 'none',
            slices: [
                {color: '#AB47BC'},
                {color: '#FF7043'},
                {color: '#42A5F5'},
                {color: '#EF5350'},
                {color: '#5C6BC0'}


            ]
        };
    }

    getSize(){
        let chart_area = document.getElementById(this.chartID);
        if(chart_area){
            let containerHeight = chart_area.clientHeight;
            let containerWidth = chart_area.clientWidth;
            if(containerWidth > containerHeight)
                return Math.round(containerHeight);
            else return Math.round(containerWidth);
        }
        else return 136;

    }

}
