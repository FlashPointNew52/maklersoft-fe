import {Component, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import ymaps from 'ymaps';
import {Offer} from '../../entity/offer';
import {GeoPoint} from "../../class/geoPoint";

declare var ymaps: any;


@Component({
    selector: 'yamap-view',
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

        .ya-map {
            width: 100%;
            height: 100%;
            display: block;
        }

        .map-container-inner{
            width: 100%;
            height: 100%;
            display: block;
        }

    `],
    template: `
        <div [id]="mapID" class="ya-map">
        </div>
    `
})

export class YamapView implements AfterViewInit, OnChanges {
    mapID: string = "map"+Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    map: any;
    paintProcess: any;
    coordinates: any[] = [];
    selectedObject: any;
    circledObjects: any;
    drawPath: any;
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

    ngAfterViewInit(){
        ymaps.ready().then(this.initMap());
        /*this.calc_center();
        this.out_zoom = this.zoom;
        this.searchArea = this.toUnnormalPoints(this.searchArea);
        */
    }

    ngOnChanges(changes: SimpleChanges) {
       if(changes.drawMap && changes.drawMap.currentValue != changes.drawMap.previousValue){
           this.paths = [];
           this.canMove = false;
           this.map.geoObjects.removeAll();
           this.coordinates = [];
           if(changes.drawMap.currentValue == false && this.map) {
               this.drawFinished.emit({coords: []});
           }
       } else if(changes.selected_offers && changes.selected_offers.currentValue != changes.selected_offers.previousValue){
           if(this.selected_offers.length > 0 ){
               this.show_menu = false;
               if(changes.selected_offers.currentValue[0].location)
                    this.map.panTo(new GeoPoint(changes.selected_offers.currentValue[0].location).toArray(), {useMapMargin: true});
               //this.map.setCenter(new GeoPoint(changes.selected_offers.currentValue[0].location).toArray());
               /*this.lat = changes.selected_offers.currentValue[0].locationLat;
               this.lon = changes.selected_offers.currentValue[0].locationLon;*/
               this.updateMarkers();
               this.map.geoObjects.remove(this.selectedObject);
               this.selectedObject.removeAll();
               for (let i = 0; i < this.selected_offers.length ; i++) {
                   let baloon = new ymaps.Placemark([this.selected_offers[i].location.lat, this.selected_offers[i].location.lon]);
                   /*baloon.events.add("mouseup", event => {
                       this.scrollToOffer.emit(i);
                   });*/
                   this.selectedObject.add(baloon);
               }
               this.map.geoObjects.add(this.selectedObject);
               /*let size = ymaps.util.bounds.getCenterAndZoom(this.selectedObject.getBounds(), this.map.container.getSize(),  this.map.options.get('projection'));
               this.map.panTo(size.center);
               if(this.selected_offers.length > 1){
                   this.map.setZoom(size.zoom + 1);
               }*/

           }
       } else if(changes.offers && changes.offers.currentValue != changes.offers.previousValue){
           if(this.offers.length > 0 && this.coordinates.length > 0){
               this.map.geoObjects.remove(this.circledObjects);
               this.circledObjects.removeAll();
               for (let i = 0; i < this.offers.length ; i++) {
                   let baloon = new ymaps.Placemark([this.offers[i].location.lat, this.offers[i].location.lon]);
                   baloon.events.add("mouseup", event => {
                       this.scrollToOffer.emit(i);
                   });
                   this.circledObjects.add(baloon);
               }
               this.map.geoObjects.add(this.circledObjects);
               //this.map.setCenter(new GeoPoint(changes.selected_offers.currentValue[0].location).toArray());
               /*this.lat = changes.selected_offers.currentValue[0].locationLat;
                this.lon = changes.selected_offers.currentValue[0].locationLon;*/
               //this.updateMarkers();

           }
           /*this.searchArea = this.toUnnormalPoints(this.searchArea);*/

       }
    }

    initMap() {
        this.map = new ymaps.Map(this.mapID,
            {
                center: [48.4862268, 135.0826369],
                zoom: 15,
                controls: ['geolocationControl']
            },
            {suppressMapOpenBlock: true}
        );

        this.map.events.add('mousedown', event => {
            if (this.drawMap && this.coordinates.length == 0) {
                this.clearMap();
                this.paintProcess = this.paintOnMap();
            }
        });

        this.map.events.add('mouseup', event => {
            if (this.paintProcess) {
                // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
                this.coordinates = this.paintProcess.finishPaintingAt(event);
                this.paintProcess = null;
                let style = {
                    strokeColor: '#252f32',
                    strokeOpacity: 0.7,
                    strokeWidth: 3,
                    fillColor: '#252f32',
                    fillOpacity: 0.4
                };
                if (this.drawMap) {
                    this.drawPath = new ymaps.Polygon([this.coordinates], {}, style);
                    this.drawPath.events.add('click', eq => {
                        if (!this.drawMap) {
                            this.map.geoObjects.remove(this.drawPath);
                        }
                    });
                    this.map.geoObjects.add(this.drawPath);
                    this.map.behaviors.enable('drag');
                    this.drawFinished.emit({coords: GeoPoint.fromArray(this.coordinates)});
                }

            }
        });

        this.selectedObject = new ymaps.GeoObjectCollection(null, {
          preset: 'islands#yellowIcon',
          iconColor: '#c50101'
        });
        this.circledObjects = new ymaps.GeoObjectCollection(null, {
          preset: 'islands#yellowIcon',
          iconColor: '#0e60c5'
        });
    }

    clearMap() {
        this.map.geoObjects.removeAll();
        //this.map.geoObjects.add(this.selectedObject).add(this.grayCol);
    }

    paintOnMap() {
        this.map.behaviors.disable('drag');
        let style = {
            strokeColor: '#252f32',
            strokeOpacity: 0.7,
            strokeWidth: 3,
            fillColor: '#252f32',
            fillOpacity: 0.4
        };

        let pane = new ymaps.pane.EventsPane(this.map, {
            css: {position: 'absolute', width: '100%', height: '100%'},
            zIndex: 550,
            transparent: true
        });

        this.map.panes.append('ext-paint-on-map', pane);

        let rect = this.map.container.getParentElement().getBoundingClientRect();
        let canvas = document.createElement('canvas');
        let ctx2d = canvas.getContext('2d');

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx2d.globalAlpha = style.strokeOpacity;
        ctx2d.strokeStyle = style.strokeColor;
        ctx2d.lineWidth = style.strokeWidth;

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        pane.getElement().appendChild(canvas);

        let bounds = this.map.getBounds();
        let latDiff = bounds[1][0] - bounds[0][0];
        let lonDiff = bounds[1][1] - bounds[0][1];

        let coordinates: any[] = [];

        canvas.onmousemove = function (ev) {
            coordinates.push([ev.offsetX, ev.offsetY]);
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            ctx2d.beginPath();
            ctx2d.moveTo(coordinates[0][0], coordinates[0][1]);
            for (let i = 1; i < coordinates.length; i++) {
                ctx2d.lineTo(coordinates[i][0], coordinates[i][1]);
            }
            ctx2d.stroke();
        }.bind(this);

      let paintingProcess = {
        finishPaintingAt: positionOrEvent1 => {

          this.map.panes.remove(pane);

          let calc = Math.floor(coordinates.length / 30);
          let coords: any[] = [];
          for (let i = 0; i < coordinates.length; i++) {
            if ( i % calc == 0 ) {
              let lon = bounds[0][1] + (coordinates[i][0] / canvas.width) * lonDiff;
              let lat = bounds[0][0] + (1 - coordinates[i][1] / canvas.height) * latDiff;
              coords.push([lat, lon]);
            }
          }

          return coords;
        }
      };
      return paintingProcess;
    }

    updateMarkers(){

    }

    /*activate_param(index?: number){
        for(let param of this.map_params)
            param.isActive = false;
        if(index){
            this.map_params[index].isActive = true;
            this.showSameOffers.emit({show: this.map_params[2].isActive});
        }
    }*/

    /*mapMouseDown(event){
        if (this.drawMap && !this.canMove){
            this.paths = [];
            this.isDraw = true;
            if(event.coords.lat && event.coords.lng)
                this.paths.push({"lat":parseFloat(event.coords.lat.toFixed(5)), "lng":parseFloat(event.coords.lng.toFixed(5))});
        }
    }*/

    /*mapMouseMove(event){
        if (this.isDraw && this.drawMap && event.coords.lat && event.coords.lng){
            this.paths.push({"lat":parseFloat(event.coords.lat.toFixed(5)), "lng":parseFloat(event.coords.lng.toFixed(5))});
        }
    }*/

    /*mapMouseUp(event){
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
*/


}
