import {
  Component,
  Renderer,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'ui-bar-chart',
  inputs: ['title', 'data'],
  template: `
    <div class="ui-bar-chart">
    </div>
  `,
  styles: [`
    .class {

    }
  `]
})

export class UIBarChart {
  public title: string;
  public data: any[];
  container: any;
  constructor(private _elem: ElementRef, renderer: Renderer) {
    this.data = [];
    //renderer.setElementClass(elem, 'wtf-class', true);
  }

  ngOnChanges() {
    if (!this.container) {
      this.container = this._elem.nativeElement.querySelector('.ui-bar-chart');
    }
    this.draw();
  }

  draw() {

    // Create the data table.
    //var data = google.visualization.arrayToDataTable(this.data);

    var options = {
      legend: { position: "none" },
      height: 272,
      hAxis: {
        format: '#'
      }
    };

    //var chart = new google.visualization.BarChart(this.container);



    //chart.draw(data, options);

  }

}
