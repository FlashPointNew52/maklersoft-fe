import {Component, AfterContentInit, OnChanges, SimpleChanges, ElementRef, OnDestroy} from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';
import {HubService} from '../../service/hub.service'
import {UserService} from '../../service/user.service'
import {OfferService, OfferSource} from '../../service/offer.service';
import {Offer} from '../../entity/offer';
import {User} from '../../entity/user';
import {Person} from '../../entity/person';

@Component({
    selector: 'digest-window',
    inputs: ['open'],
    styles: [`
        .popup{
            position: absolute;
            width: 100vw;
            height: 100vh;
            left: 0;
            background-color: rgb(255,255,255);
            z-index: 999;
            overflow-y: scroll;
        }

        .popup:before{
            content: "";
            filter: blur(10px);
        }

        .close_button{
            width: 35px;
            height: 35px;
            position: fixed;
            left: calc(100% - 110px);
            top: calc(30px);
            background-image: url(assets/cross.png);
            background-position: center;
            background-size: cover;
            z-index: 999;
        }

        .close_button:hover{
            filter: contrast(2);
        }

        .check_window{
            width: 65%;
            height: calc(100% - 50px);
            margin: 50px auto 0 auto;
            max-width: 1360px;
            min-width: 1000px;
        }

        .search_box{
            width: 70%;
            margin: 0 auto;
            position: relative;
        }

        .search_input{
            height: 30px;
            background-color: rgb(59,63,87);
            width: 100%;
            border: 0px;
            padding-left: 35px;
            color: rgb(164,168,187);
        }

        .icon-search{
            position: absolute;
            top: 7px;
            left: 8px;
            color: rgb(88,91,105);
            font-weight: 800;
        }

        .main_info{
            color: rgb(164,168,187);
            font-size: 17pt;
            margin: 15px auto 0;
            text-align:  center;
        }

        .main_info_active:hover{
            text-decoration: underline;
            cursor: hand;
        }

        .add_info{
            text-align: center;
            font-size: 14px;
            color: rgb(88,91,105);
            margin-bottom: 55px;
        }

        .title{
            color: #5F626E;
            text-transform: uppercase;
            font-size: 11pt;
            width: calc(100% - 150px);
            float: left;
        }

        .hits{
            color: #5F626E;
            font-size: 10pt;
            text-align: right;
        }

        .hits::after{
            display: block;
            content: "";
            border-bottom: 1px solid;
            width: 100%;
            height: 1px;
            margin: 5px 0 15px;
        }

        .yet{
            color: #6f6c6c;
            text-align: right;
            padding-right: 20px;
        }
        .yet:hover{
            color: #dcd4d4;
        }

        .address{
            width: calc(100% - 100px);
            height: 110px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 100px;
            color: #294057;
        }

        .main_photo_container{
            width: 100%;
            height: calc(100% - 320px);
            display: inline-flex;
            margin-bottom: 8px;
        }

        .main_photo_container .arrow{
            width: 100px;
            height: 100%;
            display: block;
            cursor: pointer;
            text-align: center;
            position: relative;
        }

        .main_photo_container .arrow:hover{
            filter: contrast(2);
        }

        .main_photo_container .arrow_left{
            margin-left: 50px;
        }

        .main_photo_container .arrow_right{
            margin-right: 50px;
        }

        .main_photo_container .arrow:before{
            content: "";
            width: 50px;
            height: 30px;
            display: block;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            background-image: url(assets/arrow.png);
            position: absolute;
            top: calc(50% - 15px);
            left: calc(50% - 25px);
        }

        .main_photo_container .arrow_left:before{
            transform: rotate(90deg);
        }

        .main_photo_container .arrow_right:before{
            transform: rotate(-90deg);
        }

        .main_photo{
            max-height: 100%;
            max-width: 100%;
            margin: auto;
        }

        .whirligig{
            width: calc(100% - 100px);
            margin: 0 50px;
            height: 175px;
            display: inline-flex;
            overflow: hidden;
        }

        .whirligig .photo_ticket{
            width: 190px;
            height: 140px;
        }

        .map_container{
            width: 100%;
            height: 100%;
            display: block;
            //margin-top: 100px;
        }

        .map_container agm-map{
            width: 100%;
            height: 100%;
        }

        .map_params{
            position: absolute;
            top: 100px;
            right: 50px;
            width: 45px;
        }

        .map_params div{
            width: 40px;
            height: 40px;
            margin-top: 10px;
            background-color: #ffffff;
            border-radius: 5px;
        }

        .active_param{
            background-color: #80808080 !important;
        }

    `],
    template: `
        <div *ngIf="open.visible" class="popup">
            <div class="close_button" (click)="close()"></div>
            <div class="check_window" *ngIf="open.task == 'check'">
                <div class="search_box">
                    <input type="text" class="search_input" placeholder="" onclick="focus()"
                        [(ngModel)]="open.value"
                    >
                    <span class="icon-search"></span>
                    <div class="main_info" (click)="openPerson(open.person)" [class.main_info_active] = "open.person">
                        {{open.person ? open.person.name : "Неизвестный контакт"}}
                    </div>
                    <div class="add_info">
                        {{'Хабаровск, '}}
                        {{open.person && open.person.organisation ? open.person.organisation.name+', ' : ''}}
                        {{open.person ? personType[open.person.typeCode] : ''}}
                    </div>
                </div>
                <div><div class="title">Предложения</div> <div class="hits">Найдено: {{hitsCountImportOffers}}</div></div>
                <div>
                        <digest-offer-line *ngFor="let offer of importOffers | slice:0:limitedImportOffers; let i = index"
                                    [offer]="offer"
                                    [base] = "1"
                                    [class.seen]="offer.openDate > timestamp"
                        >
                        </digest-offer-line>
                        <div (click)="limitedImportOffers = limitedImportOffers == importOffers.length ? 4 : importOffers.length" class="yet">
                            {{limitedImportOffers < importOffers.length &&  importOffers.length > 4 ? 'Ещё...'
                                : (limitedImportOffers == importOffers.length &&  importOffers.length > 4 ? 'Свернуть...' : '')
                            }}
                        </div>
                </div>
                <div><div class="title">Заявки</div><div class="hits">Найдено: 0</div></div>
                <div>

                </div>
                <div><div class="title">Ежедневник</div><div class="hits">Найдено: 0</div></div>
                <div>

                </div>
                <div><div class="title">Контакты</div><div class="hits">Найдено: 0</div></div>
                <div>

                </div>
            </div>
            <div сlass="check_window" *ngIf="open.task == 'photo'">
                <div class="address">
                    <div style="font-size: 20px;">{{open.offer.fullAddress && open.offer.fullAddress.city? open.offer.fullAddress.city : ""}}</div>
                    <div style="font-size: 26px;">{{open.offer.fullAddress && open.offer.fullAddress.street ? open.offer.fullAddress.street : ""}}
                         {{open.offer.fullAddress &&  open.offer.fullAddress.house ? open.offer.fullAddress.house : ""}}
                    </div>
                </div>
                <div class="main_photo_container">
                    <div class="arrow arrow_left" (click)="to_next(false)"></div>
                    <img class="main_photo" [src]="open.offer.photoUrl[currentPhoto]">
                    <div class="arrow arrow_right" (click)="to_next(true)"></div>
                </div>
                <div class="whirligig">
                    <ui-upload-file class="img-wrap pull-left" [type]="'image'" style="height: 165px; flex: 0 0 225px; margin-top: 10px;"
                        *ngIf="open.value == 1" (addNewFile) = "addPhoto($event)"
                    ></ui-upload-file>
                    <ui-carousel
                        [photos] = "open.offer.photoUrl"
                        (getIndex) = "currentPhoto = $event; "
                        (delete) = "deleteImage($event)"
                        (move) = "save($event)"
                        [setIndex] = "next"
                        [showToolbox] = "open.value == 1"
                        [style.width] = "open.value == 1 ? 'calc(100% - 225px)' : '100%'"
                        [style.marginLeft] = "open.value == 1 ? '10px' : '0px'"
                        style="position: relative; width:100%; height: 100%;"
                    >
                    </ui-carousel>
                </div>
            </div>
            <div сlass="check_window" *ngIf="open.task == 'map'" style="height: 100vh">
                <div class="map_container">
                    <!--<google-map
                        [latitude]="open.map.lat"
                        [longitude]="open.map.lon"
                        [zoom]="open.map.zoom"
                        [objects]="open.offers"
                        [draw_allowed]="true"
                    >
                    </google-map>
                    <ya-map [latitude]="55.76" [longitude]="37.64" ></ya-map>
                    <ui-gmap></ui-gmap>-->

                    <agm-map [latitude]="open.map.lat"
                             [longitude]="open.map.lot"
                             [zoom]="open.map.zoom"
                             [styles]="mapStyle"
                    >
                        <agm-marker  *ngFor="let offer of open.offers"
                                    [latitude]="offer.locationLat"
                                    [longitude]="offer.locationLon"
                        ></agm-marker>
                    </agm-map>
                    <div class="map_params">
                        <div *ngFor="let param of map_params; let i=index"
                            [class.active_param]="param.isActive"
                            (click)="activate_param(i)"
                        ></div>
                    </div>
                <div>

            </div>
        </div>
    `
})

export class DigestWindowComponent implements OnChanges, OnDestroy{
    public open: any = {visible: false, value: ""};
    public user: User;
    importOffers: Offer[] = [];
    personType = {
        client: 'Клиент',
        realtor: 'Конкурент',
        company: 'Наша компания',
        partner: 'Партнер'
    }
    constructor(
        private _hubService: HubService,
        private _offerService: OfferService,
    ) { };
    filter: any = {
        stageCode: 'all',
        contactType: 'all',
        tag: 'all',
        changeDate: 'all',
    };

    sort: any= {
        addDate: 'DESC'
    };
    limitedImportOffers : number = 4;
    hitsCountImportOffers : number = 0;
    currentPhoto : number = 0;
    next : number = 0;
    map_params: any[] = [
        {icon:"", isActive: false, name: "Панорама"},
        {icon:"", isActive: false, name: "Маршруты"},
        {icon:"", isActive: false, name: "Больницы"},
        {icon:"", isActive: false, name: "Школы"},
        {icon:"", isActive: false, name: "Детские сады"},
        {icon:"", isActive: false, name: "Магазины"},
    ];

    mapStyle = [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-39"
                },
                {
                    "lightness": "35"
                },
                {
                    "gamma": "1.08"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "10"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "-14"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "10"
                },
                {
                    "gamma": "2.26"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "-3"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "54"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "-7"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "-2"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#00c6ff"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "100"
                },
                {
                    "visibility": "on"
                },
                {
                    "color": "#6990b4"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "saturation": "-100"
                },
                {
                    "lightness": "-100"
                }
            ]
        }
    ];

    ngOnDestroy(){
        this.open = null;
        this.user = null;
        this.importOffers = null;
        this.personType = null;

        this.filter = null;

        this.sort = null;
        this.limitedImportOffers = null;
        this.hitsCountImportOffers = null;
        this.currentPhoto = null;
        this.next = null;
        this.map_params = null;
    }
     ngOnChanges(changes: SimpleChanges) {
        if(changes.open && changes.open.currentValue != changes.open.previousValue){
            this.limitedImportOffers = 4;
            this.hitsCountImportOffers = 0;
            if (this.open.offer){
                //this.getOffers();
            }
            if(changes.open.currentValue.index){
                this.next = changes.open.currentValue.index;
            } else{
                this.next = 0;
            }
        }


     }

     getOffers(){
         this._offerService.list(0, 100, OfferSource.IMPORT, this.filter, this.sort, this.open.value, []).subscribe(
             data => {
                     this.hitsCountImportOffers = data.hitsCount || 0;
                     this.importOffers = data.list;
             },
             err => {
                 console.log(err);
             }
         );
     }

     openPerson(person: Person) {
         if(person){
            var tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('person', {person: person});
        }
    }

    to_next(next: boolean){
        if(next)
            this.next =  this.open.offer.photoUrl.length > this.currentPhoto + 1 ? this.currentPhoto + 1 : this.next;
        else
            this.next = this.currentPhoto - 1 >=0 ? this.currentPhoto - 1 : 0 ;
    }

    addPhoto(event){
        this.open.offer.photoUrl.unshift(event);
    }

    deleteImage(event){
        this.open.offer.photoUrl.splice(this.open.offer.photoUrl.indexOf(event), 1);
    }

    close(){
        if(this.open.task == 'photo'){
            this.save(0);
        }
        this.open.visible = false;
        this.importOffers = [];
    }

    save(event){
        for(let i = 0 ; i < this.open.offer.photoUrl.length; ++i){
            if(this.open.offer.photoUrl[i] == "" || this.open.offer.photoUrl[i] == null)
                this.open.offer.photoUrl.splice(i, 1);
        }
        this._offerService.save(this.open.offer).subscribe(offer => {
            setTimeout(() => {
                this.open.offer = offer;
            });
        });
    }

    activate_param(index){
        for(let param of this.map_params)
            param.isActive = false;
        this.map_params[index].isActive = true;
    }

}
