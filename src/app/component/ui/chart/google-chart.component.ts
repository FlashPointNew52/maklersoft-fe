import {Directive,ElementRef,Input,OnInit, OnChanges} from '@angular/core';

declare var google:any;
declare var googleLoaded:any;

@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartComponent implements OnInit, OnChanges {
  public _element:any;
  @Input('chartType') public chartType:string;
  @Input('chartOptions') public chartOptions: Object;
  chartData: Object;
  @Input()
  set data(c: any[]) {
    this.chartData = c;
    this.drawGraph(this.chartOptions,this.chartType,this.chartData,this._element);
  }
  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  ngOnInit() {
    setTimeout(() =>{
      google.charts.load('current', {'packages':['corechart']});
        setTimeout(() =>{
          this.drawGraph(this.chartOptions,this.chartType,this.chartData,this._element)
        },10);
      },10
    );
  }

  ngOnChanges(){
       this.drawGraph(this.chartOptions,this.chartType,this.chartData,this._element);
  }

  drawGraph (chartOptions,chartType,chartData,ele) {
    setTimeout(() =>{
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var wrapper;
            wrapper = new google.visualization.ChartWrapper({
                chartType: chartType,
                dataTable:chartData ,
                options:chartOptions || {},
                containerId: ele.id
            });
            wrapper.draw();
        }
    },10)
  }
}
