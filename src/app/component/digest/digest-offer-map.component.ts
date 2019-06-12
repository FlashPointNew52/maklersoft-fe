import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PhoneBlock} from "../../class/phoneBlock";
import {HubService} from '../../service/hub.service'

import {Offer} from '../../entity/offer';



@Component({
    selector: 'digest-offer-map',
    inputs: ['offer', 'compact'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`

        .billet {
            background-color: white;
            color: #696969;
            font-weight: 200;
            font-size: 14px;
            height: 86px;
            position: relative;
            width: 367px;
        }

        .photo{

        }

        .describe{
            color: #616161;
            line-height: 17px;
            flex: 0 0 calc(100% - 155px);
        }

        .row1, .row2, .row3{
            display: block;
            font-size: 11px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .row1{
            color: #424242;
            font-weight: bold;
        }

        .row2{
            color: #424242;
        }

        .row3{
            color: #757575;
        }

        .row4{
            color: #616161;
            display: inline-flex;
            height: 35px;
            align-items: center;
            font-size: 10px;
        }

        .rait{
            flex: 0 0 125px;
        }

        .rait > .stars{
            background-image: url(assets/star_active.png);
            height: 14px;
            background-size: 15px;
            background-position: left center;
            background-repeat: repeat-x;
            width: 75px;
            float: right;
        }

        .request{
            flex: 0 0 80px;
        }

        .request > span{
            font-size: 16px;
            margin: 0 0 0 5px;
        }

        .delimetr{
            flex: 0 0 2px;
            height: 26px;
            margin: 0 10px;
            background-color: #efefef;
        }

    `],
    template: `
        <div class="billet" data-id="r{{offer._id}}" id="r{{offer.id}}">
            <div class="photo">
                <img src="{{ offer.photoUrl?offer.photoUrl[0]:'assets/no_photo.png' }}"
                    style="height: 85px;width: 120px;float: left; margin: 0 20px 0 0;"
                >
            </div>
            <div class="describe" >
                    <span class="row1">
                        {{ offer.typeCode ? typeCodeOptionsHash[offer.typeCode].split(" ")[0] : "" }}
                        {{ offer.roomsCount  === undefined ? "" : ", "+ offer.roomsCount+" комн."}}
                        {{ offer.floor  === undefined ? ", ?/" : ", "+ offer.floor+"/"}}
                        {{ offer.floorsCount  === undefined ? "? эт., " : ""+ offer.floorsCount +" эт., "}}
                        {{ offer.squareTotal  === undefined ? "?/" : ""+ offer.squareTotal +"/"}}
                        {{ offer.squareLiving  === undefined ? "?/" : ""+ offer.squareLiving +"/" }}
                        {{ offer.squareKitchen  === undefined ? "?" : ""+ offer.squareKitchen }}
                    </span>
                    <span class="row2">
                        {{ offer.addressBlock?.street || "" }}
                        {{ offer.addressBlock.house === undefined ? "" : (" " + offer.addressBlock.house) }}
                        {{ offer.addressBlock.city === undefined ? " " : ", " + offer.addressBlock.city }}
                    </span>
                    <span class="row3">Цена:
                        {{ offer.ownerPrice + " тыс.руб "}}
                        {{ offer.squareTotal  === undefined ? "": "/ "+ round(offer.ownerPrice / offer.squareTotal)  + " тыс.руб.метр"}}
                    </span>
                    <span class="row4">
                        <div class="rait">РЕЙТИНГ <div class="stars"></div></div>
                        <div class="delimetr"></div>
                        <div class="request">ЗАЯВКИ <span>{{"17"}}</span></div>
                    </span>
            </div>
        </div>
    `
})

export class DigestOfferMapComponent {

    public offer: Offer;
    public compact: boolean = false;

    private to: any;
    mediator: any;
    contact: any;
    typeCodeOptionsHash = Offer.typeCodeOptionsHash;

    constructor(private _hubService: HubService) { };

    compactHeight(){
        if(this.compact)
            return '68px';
        else return '85px';
    }

    round(val: any){
        return Math.round(val);
    }
}
