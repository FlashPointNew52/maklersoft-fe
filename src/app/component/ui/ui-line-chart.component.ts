import {
  Component,
  ElementRef,
} from '@angular/core';
//import {google} from "./chart/ui-chart";

@Component({
  selector: 'ui-line-chart',
  inputs: ['title', 'data'],
  template: `
    <div class="ui-line-chart">
    </div>
  `,
  styles: [`
    .class {

    }
  `]
})

export class UILineChart {
    public title: string;
    public data: any[];
    container: any;
    google: any;

    constructor(private _elem: ElementRef) {
        this.data = [];
    }

    ngOnChanges() {
      if (!this.container) {
        this.container = this._elem.nativeElement.querySelector('.ui-line-chart');
      }
      this.draw();
    }

    draw() {

        // Create the data table.
        //var data = google.visualization.arrayToDataTable(this.data);

        // Set chart options
        var options = {
            title: this.title,
            //curveType: 'function',
            legend: { position: 'none' },
            height: 272,
            hAxis: {
              baseline: 0,
              format: '#'
            },
            vAxis: {
              baseline: 0,
              format: '#'
            }
        };

        //var chart = new google.visualization.LineChart(this.container);
        //chart.draw(data, options);

    }

}
