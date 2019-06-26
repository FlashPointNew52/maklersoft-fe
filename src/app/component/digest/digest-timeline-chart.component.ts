import {
  Component,
  OnInit,
  OnChanges,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';

import {HubService} from '../../service/hub.service';

declare let google:any;

@Component({
    selector: 'digest-timeline-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: [],
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

        .graf_header{
            height: 50px;
            display: block;
            flex-direction: column;
            width: 100%;
            padding-top: 20px;
            box-sizing: border-box;
            position: relative;
            margin-bottom: 15px;
        }

        .graf_header > span {
            margin: 0 20px 0 30px;
            font-size: 18px;
            color: #3b4345;
            height: 17px;
            line-height: 19px;
            float: left;
            width: 82px;
        }

        .table{
            height: calc(100% - 60px);
            width: calc(100% - 60px);
            margin-left: 30px;
        }

        .chart{
            width: 100%;
            height: 100%;
        }

    `],
    template: `
        <div class="container" (window:resize)="update()">
            <div class="graf_header">
                <span>ЗАНЯТОСТЬ</span>
            </div>
            <div class="table">
                
                <div class="chart"
                    [attr.id] = "chartID"
                    [data]="chartData"
                    [chartOptions] = "chartOptions"
                    chartType="Timeline" GoogleChart
                >
                </div>
            </div>
        </div>
    `
})

export class DigestTimelineChartComponent implements OnInit, AfterViewInit {
    @ViewChild('graf', { static: true }) graf: ElementRef;
    chartID: string = "Chart"+Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    hard_data: boolean = false;
    chartData =  new google.visualization.DataTable();
    data: any[]= [];

    chartOptions: any = {
        width: 340,
        timeline: {
          showRowLabels: true ,
          rowLabelStyle: { color: '#252f32',fontName: 'Open Sans', fontSize: 12}
        },
        hAxis: {format: 'MM/dd/yy'}
    };

    constructor(private _hubService: HubService,
                private cdRef:ChangeDetectorRef
    ) {
    }

    update(){
        this.cdRef.markForCheck();
    }

    ngOnInit() {
        this.chartData.addColumn({ type: 'string', id: 'Компания' });
        this.chartData.addColumn({ type: 'date', id: 'Start' });
        this.chartData.addColumn({ type: 'date', id: 'End' });
        this.chartData.addRows([
          [ 'Рога и копаты', new Date(2018, 1, 4), new Date(2018, 2, 4) ],
          [ 'Авангард',      new Date(2018, 2, 4),  new Date(2018, 3, 4) ],
          [ 'Ракета',       new Date(2018, 3, 4),  new Date(2018, 4, 4) ]]);

    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }

}
