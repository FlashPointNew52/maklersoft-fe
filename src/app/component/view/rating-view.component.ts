import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit} from "@angular/core";

import {SessionService} from "../../service/session.service";
import {ConfigService} from "../../service/config.service";
import {Rating} from "../../entity/rating";
import {RatingService} from "../../service/rating.service";

@Component({
    selector: "rating-view",
    inputs: ["obj", "type"],
    styles: [`
        .rating_header {
            height: 68px;
            display: block;
            flex-direction: column;
            width: 100%;
            padding-top: 20px;
            box-sizing: border-box;
            float: left;
        }

        .rating_header > span:first-child {
            margin: 0 20px 45px 30px;
            font-size: 18px;
            color: #3b4345;
            height: 17px;
            line-height: 19px;
            float: left;
            width: 82px;
        }

        .rating_header > span:last-child {
            font-size: 11px;
            color: #677578;
            height: 29px;
            line-height: 12px;
            max-width: 275px;
            float: left;
            width: calc(100% - 132px);
        }

        .rating_set {
            height: 167px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: calc(100% - 137px);
            float: left;
        }

        .container{
            padding: 0 30px;
            height: 40px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .container span{

        }

        .container input{
            width: 100%;
            -webkit-appearance: none;
            background: #c7c7c7;
            height: 5px;
        }

        .container input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 5px;
            height: 15px;
            background: #3f51b5; 
            cursor: pointer; 
        }
        
        .rating_graph {
            width: 120px;
            height: 120px;
            float: left;
            margin-right: 0;
            margin-top: 13px;
            margin-bottom: 0;
            position: relative;
        }

        .rating_graph .middle_rate {
            position: absolute;
            top: 22px;
            left: 22px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 74px;
        }

        .middle_rate span:first-child {
            color: #414141;
            font-size: 30px;
        }

        .middle_rate span:last-child {
            color: #252F32;
            font-size: 12px;
        }

    `],
    template: `
        <div class="rating_header"><span>РЕЙТИНГ</span>
            <span>Составьте свой рейтинг по контакту. Ваша оценка будет влиять на общий рейтинг</span>
        </div>
        <div class="rating_set">
            <div class="container">
                <span>Готовность к совершению сделки</span><span>{{rating.mark1}}</span>
                <input type="range" min="0" max="5" step="1" [style.background]="'linear-gradient(90deg, #3f51b5 ' + rating.mark1 * 20 + '%, #c7c7c7 0%)'"
                       [(ngModel)]="rating.mark1" (ngModelChange)="send_rate($event, 1)">
            </div>
            <div class="container">
                <span>Лояльность</span><span>{{rating.mark2}}</span>
                <input type="range" min="0" max="5" step="1" [style.background]="'linear-gradient(90deg, #3f51b5 ' + rating.mark2 * 20 + '%, #c7c7c7 0%)'"
                       [(ngModel)]="rating.mark2" (ngModelChange)="send_rate($event, 2)">
            </div>
            <div class="container">
                <span>Ответственность</span><span>{{rating.mark3}}</span>
                <input type="range" min="0" max="5" step="1" [style.background]="'linear-gradient(90deg, #3f51b5 ' + rating.mark3 * 20 + '%, #c7c7c7 0%)'"
                       [(ngModel)]="rating.mark3" (ngModelChange)="send_rate($event, 3)">
            </div>
            <div class="container">
                <span>Компетентность</span><span>{{rating.mark4}}</span>
                <input type="range" min="0" max="5" step="1" [style.background]="'linear-gradient(90deg, #3f51b5 ' + rating.mark4 * 20 + '%, #c7c7c7 0%)'"
                       [(ngModel)]="rating.mark4" (ngModelChange)="send_rate($event, 4)">
            </div>
        </div>

        <div class="rating_graph">
            <svg viewBox="0 0 130 130" style="transform: rotate(-90deg)">
                <circle _ngcontent-c13="" cx="70" cy="70" id="pie" r="67" fill="#fff"></circle>
                <circle _ngcontent-c13="" cx="65" cy="65" id="pie" r="61" fill="transparent" stroke="#c7c7c7"
                        stroke-width="7"></circle>
                <circle _ngcontent-c13="" cx="65" cy="65" id="pie" r="61" fill="transparent" stroke="var(--color-blue)"
                        stroke-width="7" [attr.stroke-dasharray]="getDash()" stroke-dashoffset="0"
                        style="transition: stroke-dasharray 2s;"
                ></circle>
            </svg>
            <div class="middle_rate"><span>{{obj.rate | number: '1.0-1'}}</span>
                <span>Общий<br>рейтинг</span>
            </div>
        </div>
    `
})

export class RatingViewComponent implements OnInit, AfterViewInit {
    public obj: any;
    public type: string;
    rating: Rating = new Rating();
    timerId = null;
    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
        private _ratingService: RatingService
    ) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        if (this.obj && this.obj.id != null) {
            this._ratingService.get(this.obj.id, this.type).subscribe(data => {
                    this.rating = data;
                    this.rating.objId = this.obj.id;
                },
                err => {
                });
        }
    }

    send_rate(event: any, number: number) {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() =>{
            switch (number) {
                case 1:
                    this.rating.mark1 = event;
                    break;
                case 2:
                    this.rating.mark2 = event;
                    break;
                case 3:
                    this.rating.mark3 = event;
                    break;
                case 4:
                    this.rating.mark4 = event;
                    break;
                case 5:
                    this.rating.mark5 = event;
                    break;
            }

            if (this.obj.id != null) {
                this.rating.objId = this.obj.id;
                if (!this.rating.objType) {
                    this.rating.objType = this.type;
                }
                this._ratingService.save(this.rating).subscribe(data => {
                    this.rating = data;
                    this.obj.rate = this.rating.avarege_mark;
                });
            }
        }, 1000);

    }

    getDash() {
        let percentValue = (this.obj.rate / 5) * 2 * 61 * Math.PI;
        return percentValue + " " + (2 * 61 * Math.PI);
    }
}
