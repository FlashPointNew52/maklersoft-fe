import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';


import {Offer} from '../../entity/offer';

@Component({
    selector: 'gmap-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['offers', 'drawMap', 'selected_offers', 'with_menu', 'same_offers', 'searchArea', 'lat', 'lon', 'drawBound'],
    styles: [`

        .map_params{
            position: absolute;
            right: 40px;
            top: 10px;
        }

        .menu_buttom{
            float: right;
        }

        .menu_buttom::before {
            content: '\\2261';
            width: 30px;
            height: 30px;
            display: block;
            font-size: 50px;
            color: rgb(158, 158, 158);
            line-height: 29px;
            cursor: pointer;
        }

        .menu_frame{
            width: 190px;
            float: left;
            min-height: 100px;
            background-color: white;
            border: 0px solid rgba(50, 65, 88, 1);
            border-radius: 0;
            //box-shadow: 0px 2px 10px 2px rgba(189,189,189,1);
            margin: 5px 10px;
            padding: 10px 0 0;
        }

        .menu_frame > div{
            height: 25px;
            width: 100%;
            cursor: pointer;
        }

        .menu_frame > div > .text{
            color: #616161;
            font-size: 12px;
        }

        .menu_frame > div > .icon{
            width: 30px;
            height: 25px;
            display: block;
            float: left;
            margin: 0 10px 0 15px;
        }

        .menu_frame > div > .icon > .color_label{
            height: 10px;
            width: 100%;
            display: inline-block;
        }

        .menu_frame > hr{
            margin: 10px;
            border-color: rgb(224, 224, 224);
        }

        .menu_frame > div:hover{
            background-color: rgba(224, 224, 224, 1);
        }

        .menu_frame > .show_all{
            font-size: 12px;
            color: #616161;
            height: 45px;
            width: 100%;
            text-align: center;
            line-height: 45px;
            margin-top: 10px;
            background-color: #fafafa;
        }

        .active_param{
            background-color: rgb(210,210,210);
        }


    `],
    template: `
        <agm-map [latitude]="lat"
                 [longitude]="lon"
                 [zoom]="zoom"
                 [styles]="mapStyle"
                 [mapDraggable] = "!drawMap || canMove"
                 [streetViewControl] = "false"
                 style="width: 100%;height: 100%;"
                 (mapMouseDown) = "mapMouseDown($event)"
                 (mapMouseMove) = "mapMouseMove($event)"
                 (mapMouseUp) = "mapMouseUp($event)"
                 (boundsChange) = "newBounds($event)"

        >
            <agm-polyline *ngIf="drawMap"  (lineMouseUp)="mapMouseUp($event)" [strokeColor] = "'#0a145b'">
                <agm-polyline-point *ngFor="let p of paths" [latitude]="p.lat" [longitude]="p.lng"></agm-polyline-point>
            </agm-polyline>
            <agm-polygon [paths]="paths" *ngIf="!isDraw && drawMap" [strokeColor] = "'#0a145b'" [fillColor] = "'#0a145b'">
            </agm-polygon>
            <agm-polygon [paths]="searchArea" *ngIf="searchArea && searchArea.length" [strokeColor] = "'#0a145b'" [fillColor] = "'#0a145b'">
            </agm-polygon>
            <div *ngIf="canMove">
                <agm-marker  *ngFor="let offer of offers; let i = index"
                        [latitude]="offer.locationLat"
                        [longitude]="offer.locationLon"
                        [iconUrl] = "selected_offers.indexOf(offer) > -1 ?
                                        'assets/map_icon/marker_dark_blue_small.png' :
                                        'assets/map_icon/marker_blue_small.png'"
                        (markerClick)="markerClick(offer, i)"
                >
                    <agm-info-window [disableAutoPan]="true" *ngIf="selected_offers.indexOf(offer) > -1">
                        <digest-offer-map
                            [offer]="offer"
                            style="background-color: #fff"
                        >
                        </digest-offer-map>
                    </agm-info-window>
                </agm-marker>
            </div>
            <div *ngIf="!canMove">
                <agm-marker  *ngFor="let offer of selected_offers; let i = index"
                        [latitude]="offer.locationLat"
                        [longitude]="offer.locationLon"
                        [iconUrl] = "'assets/map_icon/marker_dark_blue_small.png'"
                        (markerClick)="markerClick(offer, i)"
                >
                    <agm-info-window [disableAutoPan]="true">
                        <digest-offer-map
                            [offer]="offer"
                            style="background-color: #fff"
                        >
                        </digest-offer-map>
                    </agm-info-window>
                </agm-marker>
                <div *ngIf="map_params[2].isActive">
                    <agm-marker  *ngFor="let offer of same_offers; let i = index"
                            [latitude]="offer.locationLat"
                            [longitude]="offer.locationLon"
                            [iconUrl] = "selected_offers.indexOf(offer) > -1 ?
                                            'assets/map_icon/marker_dark_blue_small.png' :
                                            'assets/map_icon/marker_blue_small.png'"
                    >
                        <agm-info-window [disableAutoPan]="true">
                            <digest-offer-map
                                [offer]="offer"
                                style="background-color: #fff"
                            >
                            </digest-offer-map>
                        </agm-info-window>
                    </agm-marker>
                </div>
            </div>
        </agm-map>
        <div class="map_params" *ngIf="with_menu">
            <div class="menu_buttom" (click)="click_menu()"></div>
            <div *ngIf="show_menu" class="menu_frame">
                <div *ngFor="let param of map_params.slice(0, 2); let i=index"
                    [class.active_param]="param.isActive"
                    (click)="activate_param(i)"
                >
                    <span class="icon" [style.background-image] = "param.icon"></span>
                    <span class="text">{{param.name}}</span>
                </div>
                <hr>
                <div *ngFor="let param of map_params.slice(2); let i=index"
                    [class.active_param]="param.isActive"
                    (click)="activate_param(i+2)"
                >
                    <span class="icon"><span class="color_label" [style.background-color]="param.color"></span></span>
                    <span class="text">{{param.name}}</span>
                </div>
                <div class="show_all">ПОКАЗАТЬ ЕЩЁ</div>
            </div>
        </div>
    `
})

export class GmapView implements OnInit, OnChanges {
    public drawMap: boolean = false;
    public selected_offers: Offer[] = [];
    public offers: Offer[] = [];
    public same_offers: Offer[] = [];
    public with_menu: boolean = false;
    public searchArea: any[] = [];
    public lat: number;
    public lon: number;
    public drawBound: boolean = false;
    @Output() drawFinished: EventEmitter<any> = new EventEmitter();
    @Output() scrollToOffer: EventEmitter<any> = new EventEmitter();
    @Output() showSameOffers: EventEmitter<any> = new EventEmitter();


    zoom: number;
    out_zoom: number;
    paths: any[] = [];
    mapStyle: any[];
    isDraw: boolean = false;
    canMove: boolean = false;

    view: any[] = [];
    timer: any;
    map_params: any[] = [
        {icon:"", isActive: false, name: "Маршруты"},
        {icon:"", isActive: false, name: "Понорама"},
        {color:"rgb(30, 136, 229)", isActive: false, name: "Похожые"},
        {color:"rgb(63, 81, 181)", isActive: false, name: "Образование"},
        {color:"rgb(142, 36, 170)", isActive: false, name: "Здоровье"},
        {color:"rgb(0, 137, 123)", isActive: false, name: "Питание"},
        {color:"rgb(251, 140, 0)", isActive: false, name: "Фитнес"},
        {color:"rgb(229, 57, 53)", isActive: false, name: "Банкоматы"}
    ];

    show_menu: boolean = false;

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
    ){

    }

    ngOnInit(){

        this.calc_center();
        this.out_zoom = this.zoom;
        this.searchArea = this.toUnnormalPoints(this.searchArea);
    }

    ngOnChanges(changes: SimpleChanges) {
       if(changes.drawMap && changes.drawMap.currentValue != changes.drawMap.previousValue){
           this.paths = [];
           this.canMove = false;
           if(changes.drawMap.currentValue == false) {
               this.drawFinished.emit({coords:this.view});
           }
       } else if(changes.selected_offers && changes.selected_offers.currentValue != changes.selected_offers.previousValue){
           if(this.selected_offers.length > 0 ){
               this.show_menu = false;
               this.activate_param();
               this.lat = changes.selected_offers.currentValue[0].locationLat;
               this.lon = changes.selected_offers.currentValue[0].locationLon;
           }
       } else if(changes.searchArea && changes.searchArea.currentValue != changes.searchArea.previousValue){
           this.searchArea = this.toUnnormalPoints(this.searchArea);
       }
    }

    activate_param(index?: number){
        for(let param of this.map_params)
            param.isActive = false;
        if(index){
            this.map_params[index].isActive = true;
            this.showSameOffers.emit({show: this.map_params[2].isActive});
        }

    }

    mapMouseDown(event){
        if (this.drawMap && !this.canMove){
            this.paths = [];
            this.isDraw = true;
            if(event.coords.lat && event.coords.lng)
                this.paths.push({"lat":parseFloat(event.coords.lat.toFixed(5)), "lng":parseFloat(event.coords.lng.toFixed(5))});
        }
    }

    mapMouseMove(event){
        if (this.isDraw && this.drawMap && event.coords.lat && event.coords.lng){
            this.paths.push({"lat":parseFloat(event.coords.lat.toFixed(5)), "lng":parseFloat(event.coords.lng.toFixed(5))});
        }
    }

    mapMouseUp(event){
        if (this.drawMap && !this.canMove && this.paths.length > 0){
            this.isDraw = false;
            this.canMove = true;
            this.paths.push(this.paths[0]);
            this.drawFinished.emit({coords:this.toNormalPoints(this.paths), zoom: this.out_zoom});
        } else if(!this.drawMap){
        }
    }

    markerClick(offer: Offer, index){
        if (this.drawMap && !this.canMove && this.paths.length > 0){
            this.isDraw = false;
            this.canMove = true;
            this.paths.push(this.paths[0]);
            this.drawFinished.emit({coords:this.toNormalPoints(this.paths), zoom: this.out_zoom});
        } else if(offer){
                //this.scrollToOffer.emit(index);
        }
    }

    toNormalPoints(list: any[]) {
        let result: any[] = [];
        list.forEach(p => {
            result.push({lat: p.lat, lon: p.lng});
        });
        return result;
    }

    toUnnormalPoints(list: any[]) {
        let result: any[] = [];
        list.forEach(p => {
            result.push({lat: p.lat, lng: p.lon});
        });
        return result;
    }

    newBounds(event){
        if(event.f.b && event.f.f && event.b.b && event.b.f && this.drawBound){
            this.view = [];
            this.view.push({lat: event.f.b, lon: event.b.b});
            this.view.push({lat: event.f.f, lon: event.b.b});
            this.view.push({lat: event.f.f, lon: event.b.f});
            this.view.push({lat: event.f.b, lon: event.b.f});
            var timer = setTimeout(()=>{
                if(timer == this.timer && !this.drawMap)
                    this.drawFinished.emit({coords:this.view, zoom: this.out_zoom});
                else clearTimeout(timer);
            },100);
            this.timer = timer;
        }
    }

    zooming(event){
        var calc = event - this.zoom;
        if( calc > 0){
            this.out_zoom = calc;
                //this.drawFinished.emit({coords:this.view, zoom: this.out_zoom});
        } else {
            this.out_zoom = 0;
        }
    }

    click_menu(){
        this.show_menu = !this.show_menu;
    }

    calc_center(){
        var c = this._configService.getConfig();
        let loc = this._sessionService.getAccount().location;
        this.mapStyle = c.map['mapStyle'];
        if (c.map[loc]) {
            if(!this.lat && !this.lon){
                    this.lat = c.map[loc].lat;
                    this.lon = c.map[loc].lon;
            }
            this.zoom = c.map[loc].zoom;
        } else {
            if(!this.lat && !this.lon){
                this.lat = c.map['default'].lat;
                this.lon = c.map['default'].lon;
            }
            this.zoom = c.map['default'].zoom;
        }
    }
}
