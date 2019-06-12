import {Component, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-star-view',
    inputs: ['value', 'maxStars', 'editable'],
    template: `
        <div class="ui-star-view" (mousemove) ='inRate($event)' (mouseout)='ngOnInit()' (click)='toEstimate($event)'>
            <div [style.width]="prevalue+'%'"></div>
        </div>
    `,
    styles: [`
        .ui-star-view {
            background-image: url(assets/star_disable.png);
            background-size: 15px 15px;
            width: 74px;
            background-position: left center;
            background-repeat: repeat-x;
        }
        .ui-star-view div{
            background-image: url(assets/star_active.png);
            height: 25px;
            background-size: 15px 15px;
            background-position: left center;
            background-repeat: repeat-x;
        }
    `]
})


export class UIStarViewComponent implements OnInit {
    public value: any = 0;
    public maxStars : number = 5;
    public editable: boolean = true;
    prevalue: any = 0;
    @Output() estimate: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.prevalue = 0+this.value;
    }

    ngOnChanges() {
        this.prevalue = 0+this.value;
    }

    inRate(event: MouseEvent){
        if(this.editable){
            let elem = <HTMLElement>(event.currentTarget);
            this.prevalue = Math.round(event.offsetX * 100 / elem.offsetWidth);
        }
    }

    outRate(sd){

    }

    toEstimate(event){
        if(this.editable){
            let elem = <HTMLElement>(event.currentTarget);
            this.prevalue = Math.round(event.offsetX * 100 / elem.offsetWidth);
            this.estimate.emit(this.prevalue);
        }
    }

}
