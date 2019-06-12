import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs';

import {HubService} from '../../service/hub.service'

import {Offer} from '../../entity/offer';
import {User} from '../../entity/user';
import {PhoneBlock} from '../../class/phoneBlock';

@Component({
    selector: 'digest-offer-row',
    inputs: ['offer'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .traw{
            width: max-content;
            display: inline-flex;
            font-size: 14px;
            color: inherit;
            height: 100%;
            align-items: center;
            min-height: 40px;
        }

        .traw > div {
            text-align: center;
            margin: 5px 0;
            height: max-content;
            text-overflow: ellipsis;
            overflow: hidden;
        }



    `],
    template: `
        <div class="traw" *ngIf="offer">
            <div *ngFor="let f of fields; trackBy: trackByFn"
                [hidden]="!f.visible"
                [style.width]="f.width"
            >
                <span *ngIf="f.id=='stateCode'" class="icon-{{ f.val(offer) }}"></span>
                <span *ngIf="f.id=='photo' && offer.photoUrl" class="icon-photo" (click)="clickMenu.emit({event: 'photo'})"></span>
                <span *ngIf="f.id=='sourceMedia'">
                    <a [href]="f.val(offer).url" target="_blank" style="text-transform: capitalize;">{{f.val(offer).media}}</a>
                </span>
                <span *ngIf="f.id =='agentName'" >
                    <a *ngIf="f.val(offer) != ''" (click)="openAgent(f.val(offer))">{{f.val(offer).name}}</a>
                </span>
                <span *ngIf="f.id =='personName'" >
                    <a *ngIf="f.val(offer).type == 'person'" (click)="openPerson(f.val(offer))">
                        {{f.val(offer).obj.name ? f.val(offer).obj.name : (f.val(offer).obj.phoneBlock ? getPnone(f.val(offer).obj.phoneBlock) : "")}}
                    </a>
                    <span *ngIf="f.val(offer).type == 'array'">
                        <span *ngFor="let value of f.val(offer).obj" style="display: block">{{value}}</span>
                    </span>
                </span>
                <span *ngIf="f.id =='mediator'" >
                    <a *ngIf="f.val(offer).type" (click)="openPerson(f.val(offer))">
                        {{f.val(offer).obj.name ? f.val(offer).obj.name : (f.val(offer).obj.phoneBlock ? getPnone(f.val(offer).obj.phoneBlock) : "")}}
                    </a>
                    <span *ngIf="isString(f.val(offer))">{{f.val(offer)}}</span>
                </span>
                <span *ngIf= "f.id!='stateCode' && f.id!='photo' && f.id!='photo' && f.id!='sourceMedia'
                        && f.id !='personName' && f.id !='agentName' && f.id !='mediator'
                ">
                    {{ f.val(offer) }}
                </span>
            </div>
        </div>
    `
})

export class DigestOfferRowComponent implements OnInit {

    public offer: Offer;
    public compact: boolean = false;
    @Input() fields = [];
    private to: any;

    constructor(private _hubService: HubService) { };

    ngOnInit() {

    }

    openAgent(agent: User){
        var tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('user', {user: agent});
    }

    openPerson(data: any){
        var tab_sys = this._hubService.getProperty('tab_sys');
        if(data.type == "person")
            tab_sys.addTab('person', {person: data.obj});
        else if(data.type == "company")
            tab_sys.addTab('organisation', {organisation: data.obj});
    }

    isString(val){
        if (typeof val  === 'string')
            return true;
        else return false;
    }

    getPnone(ph_bl){
        return PhoneBlock.getNotNullData(ph_bl);
    }

    trackByFn(index, f) :string{
        return f.id; // or item.id
    }

}
