import {Component} from '@angular/core';

@Component({
    selector: 'almanac',
    styles: [`
      .main_date{
          font-size: 20pt;
          margin: 20px 0px 0px 25px;
      }

      .main_date>span{
          color: silver;
      }

      .main_week{
          color: rgba(0, 0, 0, 0.7);
          text-transform: capitalize;
          font-size: 14pt;
          margin: 0px 0px 0px 25px;
          font-weight: lighter;
      }

      @font-face {
          font-family: MyFont;
          src: url(fonts/9652.ttf);
      }

      hr{
          margin: 15px auto 0px 0px;
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(127, 125, 125, 0.19);
      }

      .hours{
          height: calc(100% - 65px);
          overflow-y: scroll;
          background-color: white;
      }

      .hours > div{
          display: flex;
          height: 30px;
          align-items: flex-end;
          margin-left: 10px;
      }

      .hours > div >span{
          font-size: 8pt;
          color: rgba(204, 204, 204, 0.94);
          margin-left: 35px;
      }

      .hours > div >div{
          width: 280px;
          border-bottom: 1px solid rgba(185, 185, 185, 0.4);
          margin-left: 10px;
      }

      ::-webkit-scrollbar {
          width: 0px;
      }

    `],
    template: `
        <div class="main_date">{{mainDate.getDate()}} {{getNameMonth()}} <span>{{mainDate.getFullYear()}}</span> г.</div>
        <div class="main_week">{{getNameDay()}}</div>
        <hr>
        <div class="hours">
            <div *ngFor="let hour of hours">
                <span><span *ngIf="hour<10">0</span>{{hour}}:00</span><div></div>
            </div>
        </div>
    `
})

export class Almanac {
     mainDate: Date = new Date();
     hours: number[]=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
     getNameMonth(){
         switch(this.mainDate.getMonth()){
             case 0: return "Января";
             case 1: return "Февраля";
             case 2: return "Марта";
             case 3: return "Апреля";
             case 4: return "Мая";
             case 5: return "Июня";
             case 6: return "Июля";
             case 7: return "Августа";
             case 8: return "Сентября";
             case 9: return "Октября";
             case 10: return "Ноября";
             case 11: return "Декабря";
         }
     }

     getNameDay(){
         switch(this.mainDate.getDay()){

             case 1: return "понедельник";
             case 2: return "вторник";
             case 3: return "среда";
             case 4: return "четверг";
             case 5: return "пятница";
             case 6: return "суббота";
             case 0: return "воскресенье";
         }
     }
}
