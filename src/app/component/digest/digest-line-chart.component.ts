
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
    selector: 'digest-line-chart',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['title','variant'],
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
            width: calc(100% - 50px);
        }

        .table{
          height: calc(100% - 85px);
          width: calc(100% - 45px);
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
                <span>{{title}}</span>
            </div>
            <div class="table">
                
                <div class="chart" 
                    [attr.id] = "chartID"
                    [data]="chartData"
                    [chartOptions] = "chartOptions"
                    chartType="LineChart" GoogleChart
                >
                </div>
            </div>
        </div>
    `
})

export class DigestLineChartComponent implements OnInit, AfterViewInit {
    @ViewChild('graf', { static: true }) graf: ElementRef;
    chartID: string = "Chart"+Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    hard_data: boolean = false;
    public variant: number = 0;
    chartData = new google.visualization.DataTable();
    public title =  '';
    data: any[]= [];

    chartOptions: any = {};

    constructor(private _hubService: HubService,
                private cdRef:ChangeDetectorRef
    ) {
    }

    update(event){
        this.cdRef.markForCheck();
      if(this.variant == 0){
        this.chartOptions = {
          minValue: 0,
          legend: {
            position: 'top',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: "Open Sans"
            }
          },
          hAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          vAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          chartArea:{left: 30,top: 20,width:'88%',height:'70%'},
          colors: ['#00897b', '#3F51B5', '#677578'],
          axisTitlesPosition: 'none',
        };
      } else{
        this.chartOptions = {
          minValue: 0,
          maxValue: 5,
          legend: {
            position: 'none',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: "Open Sans"
            }
          },
          hAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          vAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          chartArea:{left:25,top:5,width:'89%',height:'85%'},
          colors: ['#E53935']
        };
      }
    }

    ngOnInit() {

      if(this.variant == 0){
          this.chartData.addColumn('number', 'Дни');
          this.chartData.addColumn('number', 'Встречи');
          this.chartData.addColumn('number', 'Звонки');
          this.chartData.addColumn('number', 'Сделки');

          this.chartData.addRows([
              [1,  40, 90, 145],
              [2,  20, 40, 60],
              [3,  25,   65, 100],
              [4,  35, 75, 115],
              [5,  15,  35,  55]
            ]);
            this.chartOptions = {
                minValue: 0,
               legend: {
                 position: 'top',
                 textStyle: {
                   color: '#232f32',
                   fontSize: 12,
                   fontName: "Open Sans"
                 }
               },
               hAxis: {
                 title: '',
                 textStyle: {
                   color: '#232f32',
                   fontSize: 12,
                   fontName: 'Open Sans',
                   bold: false,
                   italic: false
                 },
               },
               vAxis: {
                 title: '',
                 textStyle: {
                   color: '#232f32',
                   fontSize: 12,
                   fontName: 'Open Sans',
                   bold: false,
                   italic: false
                 },
               },
               chartArea:{left: 30,top: 20,width:'88%',height:'70%'},
              colors: ['#00897b', '#3F51B5', '#677578'],
              axisTitlesPosition: 'none',
            };
      } else{
          this.chartData.addColumn('number', 'Дни');
          this.chartData.addColumn('number', 'Рейтинг');
          this.chartData.addRows([
            [1,  0],
            [2,  5],
            [3,  3],
            [4,  2],
            [5,  4],
            [6,  5],
            [7,  5],
            [8,  5],
            [9,  4.5],
            [10,  3],
            [11,  3],
            [12,  4.8]
          ]);
        this.chartOptions = {
          minValue: 0,
          maxValue: 5,
          legend: {
            position: 'none',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: "Open Sans"
            }
          },
          hAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          vAxis: {
            title: '',
            textStyle: {
              color: '#232f32',
              fontSize: 12,
              fontName: 'Open Sans',
              bold: false,
              italic: false
            },
          },
          chartArea:{left:25,top:5,width:'89%',height:'85%'},
          colors: ['#E53935']
        };
      }
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }

}
