import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'ui-slider-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['label','value'],
  template: `
        <div class="ui-slider-line"
             (mouseenter)="setSlider_on(true)"
             (mouseleave)="setSlider_on(false); "
             (mousemove)="mouse_move($event)"
             (mouseup)="mouse_up()"
             (window:resize)="resize()"
        >
            <div class="text">
                <span >{{label}}</span>
                <span>{{value}}</span>
            </div>
            <div class="line"
                 #lineElem
            >
              <div [style.width]="(value == 5 ? offset+5 : offset)  + 'px'"></div>
              <div class="avatar" [style.left]="offset + 'px'"></div>
              <div class="slider" *ngIf="slider_on" [style.left]="offset + 'px'" #slideElem 
                   (mousedown)="mouse_down($event)"
              ></div>
              
            </div>
        </div>
    `,
  styles: [`
        .ui-slider-line{
            margin: 0 30px;
            user-select: none;
            height: 36px;
            display: grid;
        }

        .ui-slider-line > .text{
            color: #4B5456;
            font-size: 12px;
            display: inline-flex;
            height: 11px;
            line-height: 10px;
            justify-content: space-between;
        }

        .ui-slider-line > .line{
            height: 5px;
            width: 100%;
            background-color: #c7c7c7;
            position: relative;
            margin: 8px 0 13px;
        }

        .ui-slider-line > .line > div{
            height: 100%;
            width: 0;
            background-color: var(--color-blue);
            transition: width 2s;
        }
 
        .ui-slider-line > .line > .slider, .ui-slider-line > .line > .avatar{
            width: 5px;
            height: 15px;
            position: relative;
            top: -10px;
            background-color: transparent;
        }

        .ui-slider-line > .line > .avatar{
            transition: background-color 1s;
            top: -5px;
            position: absolute;
        }

        .ui-slider-line:hover > .line > .avatar{
            background-color: #3f51b5;
        }
    `]
})


export class UiSliderLineComponent implements OnInit, OnChanges, AfterViewInit {
  public label: string = "";
  public value: number = 0;

  @Output() new_value: EventEmitter<any> = new EventEmitter();
  @Output() moved: EventEmitter<any> = new EventEmitter();
  @ViewChild('lineElem', { static: true }) lineElement: ElementRef;
  @ViewChild('slideElem', { static: true }) slideElement: ElementRef;

  slider_on: boolean = false;
  isMove: boolean = false;
  offset: number;
  startX: number;
  startPos: number;
  old_val: number;

  constructor(private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    //this.offset = 0;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    setTimeout(()=>{
      let len = (this.lineElement.nativeElement as HTMLElement).offsetWidth - 5;
      this.offset = len*this.value/5;
      this.cdRef.markForCheck();
    }, 300);

  }

  ngOnChanges(changes: SimpleChanges) {
  }

  mouse_down(event: MouseEvent) {
    this.isMove = true;
    this.startX = event.clientX ;
    this.startPos = (this.slideElement.nativeElement as HTMLElement).offsetLeft;
  }

  mouse_up() {
    this.isMove = false;
    let all = (this.lineElement.nativeElement as HTMLElement).offsetWidth - 5;
    this.value = Math.round(5*this.offset/all * 10) / 10;
    this.old_val = this.value;
    this.new_value.emit(0+this.value);
    setTimeout(()=>{
      this.cdRef.markForCheck();
    },300);

  }

  mouse_move(event: MouseEvent) {

      if(this.isMove){

          let mov = event.clientX - this.startX;
          if(this.startPos + mov > 0 && this.startPos + mov < (this.lineElement.nativeElement as HTMLElement).offsetWidth){
              this.offset = this.startPos + mov;
              let all = (this.lineElement.nativeElement as HTMLElement).offsetWidth - 5;
              let new_val = 5*this.offset/all;
              if (new_val <= 0.05){
                  this.value = 0;
                  this.offset = 0;
              } else if(new_val >= 4.95){
                  this.value = 5;
                  this.offset = all;
              } else
                  this.value = Math.round(new_val*10)/10;
          }
      }
  }

    setSlider_on(on: boolean) {
      if (on){
          this.old_val = this.value;
      } else if(this.old_val != this.value){
          this.mouse_up();
      }
      this.slider_on = on;
    }
    
    resize(){
      this.cdRef.markForCheck();
    }
}
