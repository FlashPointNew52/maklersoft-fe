import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';

@Component({
    selector: 'requests-view',
    inputs: ['offer'],
    styles: [`
        .req_header{
            width: 100%;
            height: 55px;
            display: inline-flex;
            background-color: #fafafa;
            padding: 0 15px 15px;
            box-sizing: border-box;
        }

        .req_header div{
            display: flex;
            align-items: flex-end;
            font-size: 12px;
            color: #9E9E9E;
            justify-content: flex-end;
            width: 100%;
        }

        .req_header div span{
            margin-right: 5px;
        }

        .req_header ui-switch-button{
            margin-bottom: -3px;
        }

        .req_body{
            background-color: whitesmoke;
            height: calc(100% - 167px);
            padding-top: 6px;
        }

        .req_body > div{
            height: 45px;
            background-color: #5fa55a;
            color: white;
            font-size: 14px;
            padding-left: 20px;
            line-height: 45px;
        }

        .button{
            width: 20px;
            height: 20px;
            margin: 10px auto;
        }

        .edit_button {
            border: 1px solid rgba(224, 224, 224, 1);
        }

        .button > div{
            width: 25px;
            height: 25px;
            background-image: url(assets/tick1.png);
            background-size: cover;
            position: relative;
            top: -6px;
            left: 1px;
        }

        .name{
            font-size: 14px;
            color: #757575;
            text-align: left;
        }

        table{
            width: 100%;
            display: block;
            height: calc(100% - 45px);
        }

        thead, tbody{
            display: block;
        }

        tbody tr:nth-child(odd){
            background-color: #ffffff;
        }

        tbody tr:nth-child(even){

        }

        tr{
            display: flex;
            height: 43px;
            padding: 0 10px 0 20px;
            line-height: 43px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f7f7f7;
        }

        tbody{
            overflow: auto;
            height: calc(100% - 43px);
        }

        thead tr{
            color: #516B52;
            font-size: 10px;
            background-color: #e6ede6;
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
            text-align: left;
        }

    `],
    template: `
        <div class="req_header">
            <div>
                <span style="margin-top: 0;margin-right: 5px;color: rgb(80, 80, 80);font-size: 10pt;">Общая база</span>
                <ui-switch-button (newValue)="change_mode($event)" [value]="source_mode"> </ui-switch-button>
            </div>
        </div>
        <div class="req_body">
            <digest-request-small *ngFor="let request of requests"
                [request]="request"
            >
            </digest-request-small>
        </div>
    `
})

export class RequestsView implements OnInit, OnChanges {
    public offer: Offer = null;
    requests: Request[] = [];
    source_mode: boolean = false;

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
        private _requestService: RequestService,
    ){

    }

    ngOnInit(){

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    change_mode(value: boolean){
        this.source_mode = value;
        this._requestService.listForOffer(this.offer).subscribe(
            data => {
                this.requests = data;
            },
            err => console.log(err)

        )
    }
}
