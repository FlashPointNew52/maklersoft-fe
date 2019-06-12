import {Component} from '@angular/core';
import {Almanac} from "./almanac.component"

@Component({
    selector: 'notebook-task',
    styles: [`
      .calendar{
          width: calc(100%);
          height: calc(70% - 50px);
      }

      .premap{
          width: calc(100%);
          height: calc(30% - 5px);
          background-color: #f7f7f7;
          padding: 0 10 0 10px;
          border-top: 1px solid #e1e1e1;
      }
      hr{
          margin: 0px 0px 9px 10px;
          width: 100%;
          position: relative;
          bottom: -19;
          border-color: rgb(222, 221, 221);
      }

      .map{

      }

    `],
    template: `
        <div class="calendar">
            <almanac> </almanac>
        </div>

        <div class="premap"><div class="map">
          <!--<google-map-->
            <!--[latitude]="48.479257"-->
            <!--[longitude]="135.063030"-->
            <!--[zoom]="18"-->
            <!--&gt;-->
            <!--</google-map>-->
        </div></div>
    `
})

export class NotebookTask {

}
