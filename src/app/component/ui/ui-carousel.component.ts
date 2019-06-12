import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Photo} from '../../class/photo';
import {Output,Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'ui-carousel',
  inputs: ['photos', 'setIndex', 'showToolbox'],
  template: `
    <!--<div class="ui-carousel">
      <a class="slide-left" style="color: white; display: block;" href="#" (click)="slideRight()"><span class="icon-arrow-left"></span></a>
      <div class="ribbon" [style.left]="slider_pos" [style.transition-duration]="tr_duration">
        <div *ngFor="let photo of photosConf" class="img-wrap pull-left image_cont" style="margin-left: 10px;">
          <div class="selected_photo" *ngIf="position == photo.pos"> </div>
          <div class="toolbox" *ngIf="showToolbox">
                <div [style.background-image]="'url(assets/arrow.png)'" style="transform: rotate(90deg);"></div>
                <div [style.background-image]="'url(assets/arrow.png)'" style="transform: rotate(-90deg);"></div>
                <div [style.background-image]="'url(assets/delete_Icon.png)'" (click)="deleteFile(photo)"></div>
          </div>
          <div class="img-overlay" style="position: relative; display: inline-block;">
            <img class="carousel-img" [attr.src]="photo.url" style="height: 165px; width: 225px;" (click)="emitEvent($event, photo.pos)">
          </div>
          <hr style="margin: 0;">
        </div>
      </div>
     <a class="slide-right" style="color: white; display: block;" href="#" (click)="slideLeft()"><span class="icon-arrow-right"></span></a>

    </div>-->

    <div class="ui-carousel">
        <ul class="ribbon" [style.marginLeft]="slider_pos" [style.transition-duration]="tr_duration">
            <li *ngFor="let photo of photos; let i = index" class="img-wrap pull-left image_cont">
                <div class="selected_photo" *ngIf="position == i"> </div>
                <div class="toolbox" *ngIf="showToolbox">
                    <div [style.background-image]="'url(assets/arrow.png)'" style="transform: rotate(90deg);" (click)="move_left(i)"></div>
                    <div [style.background-image]="'url(assets/arrow.png)'" style="transform: rotate(-90deg);" (click)="move_right(i)"></div>
                    <div [style.background-image]="'url(assets/delete_Icon.png)'" (click)="deleteFile(photo)"></div>
                </div>
                <div class="img-overlay" style="position: relative; display: inline-block;">
                    <img class="carousel-img" [attr.src]="photo" style="height: 165px; width: 225px;" (click)="emitEvent($event, i)">
                </div>
            </li>
        </ul>
    </div>
  `,
  styles: [`
    .class {
      position: relative;
    }

    .ui-carousel {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    .ribbon {
      height: 100%;
      width: 9999px;
      padding: 0;
      margin: 0;
      list-style: none;
      transition: margin-left 250ms;
    }

    .slide-left, .slide-right {
      display: block;
      position: absolute;
      outline: 0;
      cursor: pointer;
      text-decoration: none;
      width: 75px;
      height: 165px;
      line-height: 165px;
      background: #000;
      opacity: 0.0;
      text-align: center;
      -webkit-transition: opacity 500ms linear;
      -moz-transition: opacity 500ms linear;
      -o-transition: opacity 500ms linear;
      transition: opacity 500ms linear;
      z-index: 1;
    }
    .slide-left {
      left: 0px;
      top: 0px;
    }
    .slide-right {
      right: 0px;
      bottom: 0;
    }

    .ui-carousel:hover > .slide-left, .ui-carousel:hover > .slide-right {
        opacity: 0.4;
    }

    .image_cont{
        position: relative;
        margin-top: 10px;
        display: inline-block;
        margin-right: 10px;
    }

    .toolbox{
        position: absolute;
        opacity: 0;
        transition: opacity 300ms linear;
        width: 100%;
        height: 30px;
        background-color: #e0e0e0;
        z-index: 9;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .toolbox div{
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
    }

    .image_cont:hover .toolbox{
        opacity: 1;
    }

    .selected_photo{
        position: absolute;
        width: 100%;
        height: 3px;
        background-color: #cecbcb;
        top: -9px;
    }

  `]
})

export class UICarousel implements OnInit, OnChanges{
  public photos: Array<Photo>;
  public setIndex: number = 0;
  public position: number = 0;
  public showToolbox: boolean = false;
  public editable: boolean = false;
  slide_width: number = 235*1;
  slider_pos: number = 0;
  tr_duration: string = '0.4s';

  busy: boolean = false;

  @Output() getIndex: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() move: EventEmitter<any> = new EventEmitter();
  ngOnInit(){

  }

  ngOnChanges(changes: SimpleChanges){
      if(changes.setIndex && this.photos.length > 0){
          if(changes.setIndex.currentValue > changes.setIndex.previousValue)
            this.slideRight(changes.setIndex.currentValue);
          else
            this.slideLeft(changes.setIndex.currentValue);
      } else if(changes.photos && changes.photos.currentValue != changes.photos.previousValue){

      }
  }

  slideRight(val: any = "") {
      var ribbon    = <HTMLElement>document.getElementsByClassName("ribbon").item(0);
      var carousel  = ribbon.parentElement;
      var elem      = <HTMLElement>document.getElementsByClassName("image_cont").item(val);
      if(elem && elem.offsetLeft + 235 > carousel.offsetWidth){
          this.slider_pos -= elem.offsetLeft + 235 - carousel.offsetWidth;
      }
      this.getIndex.emit(val);
      this.position = val;
  }

  slideLeft(val: any = "") {
      var ribbon    = <HTMLElement>document.getElementsByClassName("ribbon").item(0);
      var carousel  = ribbon.parentElement;
      var elem      = <HTMLElement>document.getElementsByClassName("image_cont").item(val);
      if(elem && elem.offsetLeft < 0){
          this.slider_pos +=  - elem.offsetLeft;
      }
      this.getIndex.emit(val);
      this.position = val;
  }

  emitEvent(event, i){
      if((<HTMLElement>event.currentTarget).tagName == 'IMG')
        this.getIndex.emit(i);
        this.position = i;
  }

  deleteFile(photo){
      this.delete.emit(photo);
  }

  move_left(i){
      if(i != 0){
          let temp = this.photos[i-1];
          this.photos[i-1] = this.photos[i];
          this.photos[i] = temp;
      }
  }

  move_right(i){
      if(i != this.photos.length - 1){
          let temp = this.photos[i+1];
          this.photos[i+1] = this.photos[i];
          this.photos[i] = temp;
      }
  }
}
