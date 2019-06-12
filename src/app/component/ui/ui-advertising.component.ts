import {Component, OnInit} from '@angular/core';
import {Output,Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'ui-advertising',
  inputs: [],
  template: `
    <div class="ui-advertising">

        <table cellspacing="0" style="width: 100%; display: block;">
            <div class="head">
                <span class="text">Рекламные площадки</span>
                <span class="edit">Изменить</span>
                <!--<div class="search"></div>-->
            </div>
            <thead>
                <tr>
                    <td>Площадка</td>
                    <td>Неделя</td>
                    <td>2 Недели</td>
                    <td>Месяц</td>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let platform of platforms; let i=index">
                    <td width = '41%'>
                        <div class="name">{{platform.name}}</div>
                    </td>
                    <td width = '18%' (click)="platform.select = !platform.select">
                        <div class='button'>
                            <div *ngIf="platform.select"></div>
                        </div>
                    </td>
                    <td width = '23%' (click)="platform.select2 = !platform.select2">
                        <div class='button' >
                            <div *ngIf="platform.select2"></div>
                        </div>
                    </td>
                    <td width = '18%' (click)="platform.select3 = !platform.select3">
                        <div class='button' >
                            <div *ngIf="platform.select3"></div>
                        </div>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
  `,
  styles: [`
      .ui-advertising{
          height: 100%;
          background-color: white;
          overflow: hidden;
      }
      .ui-advertising>div{
          height: 30px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
      }

      .ui-advertising>div:nth-child(odd){

      }
      .ui-advertising>div:nth-child(even){
          background-color: #f1f3ef;
      }
      .button{
          width: 10px;
          height: 10px;
          margin: 10 auto;
          background-color: #d4d4d4;
          border: 1px solid #b2b2b2;
          border-radius: 2px;
      }
      .button > div{
          width: 15px;
          height: 15px;
          background-image: url(assets/tick1.png);
          background-size: cover;
          position: relative;
          top: -6px;
          left: 1px;
      }
      .name{
          font-size: 12px;
          color: #5f5d5d;
          text-align: left;
          padding-left: 5px;
      }

      thead, tbody{
          display: block;
      }

      tbody tr:nth-child(odd){
          background-color: #f6f8f0;
      }

      tbody tr:nth-child(even){

      }

      tr{
          width: calc(100% - 20px);
          display: flex;
          height: 35px;
          padding: 0 10px 0 10px;
          line-height: 35px;
      }

      tbody{
          overflow: auto;
          height: calc(100% - 75px);
      }

      thead tr{
          justify-content: center;
          height: 22px;
          line-height: 22px;
      }

      thead tr td {
          font-size: 12px;
          color: #74a14e;;
      }

      tr td  {
          flex: 0 0 20%;
          text-align: center;
      }
      tr td:first-child {
          flex: 0 0 38%;
      }

      .head{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
      }

      .head > span{

      }

      .search{
          width: calc(100% - 40px);
          height: 20px;
          background-color: #f7f7f7;
          margin: 22px 40 5 10px;
          border: 1px solid #e3e3e3;
      }

      .text{
          text-transform: uppercase;
          color: #4c4c4c;
          margin: 12px 0 0px 15px;
          position: relative;
          z-index: 10;
          height: 43px;
          display: flex;
          justify-content: space-between;
          font-size: 16px;
      }
      .edit{
          flex: 0 0 100px;
          font-size: 12px;
          margin: 5px 10px 5px 0;
          text-align: end;
          color: #0575b5;
      }
  `]
})

export class UIAdvertising implements OnInit{
  platforms: any[]=[
      {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
      {select: false, select2: false, select3: false, name: 'Презент'},
      {select: false, select2: false, select3: false, name: 'Авито'},
      {select: false, select2: false, select3: false, name: 'Циан'},
      {select: false, select2: false, select3: false, name: 'ВНХ'},
      {select: false, select2: false, select3: false, name: 'Фарпост'},
      {select: false, select2: false, select3: false, name: 'Домофонд'},
      {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
      {select: false, select2: false, select3: false, name: 'Презент'},
      {select: false, select2: false, select3: false, name: 'Авито'},
      {select: false, select2: false, select3: false, name: 'Циан'},
      {select: false, select2: false, select3: false, name: 'ВНХ'},
      {select: false, select2: false, select3: false, name: 'Фарпост'},
      {select: false, select2: false, select3: false, name: 'Домофонд'},
      {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
      {select: false, select2: false, select3: false, name: 'Презент'},
      {select: false, select2: false, select3: false, name: 'Авито'},
      {select: false, select2: false, select3: false, name: 'Циан'},
      {select: false, select2: false, select3: false, name: 'ВНХ'},
      {select: false, select2: false, select3: false, name: 'Фарпост'},
      {select: false, select2: false, select3: false, name: 'Домофонд'},
      {select1: false, select2: false, select3: false, name: 'Из рук в руки'},
      {select: false, select2: false, select3: false, name: 'Презент'},
      {select: false, select2: false, select3: false, name: 'Авито'},
      {select: false, select2: false, select3: false, name: 'Циан'},
      {select: false, select2: false, select3: false, name: 'ВНХ'},
      {select: false, select2: false, select3: false, name: 'Фарпост'},
      {select: false, select2: false, select3: false, name: 'Домофонд'}
  ];
  ngOnInit(){
      this.platforms = [].concat(this.platforms);
      this.platforms = [].concat(this.platforms);
      this.platforms = [].concat(this.platforms);
  }
}
