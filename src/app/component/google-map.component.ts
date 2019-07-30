import {
    Component,
    ChangeDetectionStrategy,
    ElementRef,
    SimpleChange, OnChanges, /*AfterViewChecked,*/ OnInit, ChangeDetectorRef, NgZone
} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';

import {ConcaveHull} from '../class/concavehull';
import {GeoPoint} from "../class/geoPoint";
import {Offer} from "../entity/offer";


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'google-map',
    inputs: [
        'latitude',
        'longitude',
        'zoom',
        'objects',
        'selected_objects',
        'place',
        'draw_allowed',
        'polygone_points'
    ],
    styles: [`
        .map-wrapper {
            height: 100%;
            width: 100%;
        }
    `],
    template: `
        <div class="map-wrapper">
            <ng-content></ng-content>
        </div>
    `
})

export class GoogleMapComponent implements OnInit, OnChanges/*, AfterViewChecked*/ {
    /*container: HTMLElement;
    map: google.maps.Map;

    markers: Map<number, google.maps.Marker> = new Map();
    placesMarkers: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];
    placesWindows: google.maps.InfoWindow = new google.maps.InfoWindow();
    service: google.maps.places.PlacesService;
    latitude: number = 0;
    longitude: number = 0;
    zoom: number = 8;

    objects: Offer[] = [];
    selected_objects: Offer[] = [];
    place: string;

    id: number = Math.round(Math.random() * 1000);
    p_w: number;
    p_h: number;

    draw_allowed: boolean = false;
    is_drawing: boolean = false;
    polyline: google.maps.Polyline;
    polygone_points: GeoPoint[];
    polygone: google.maps.Polygon;


    @Output() drawFinished: EventEmitter<any> = new EventEmitter();
    @Output() markerClicked: EventEmitter<any> = new EventEmitter();


    constructor(private _elem: ElementRef, private ref: ChangeDetectorRef) {
        ref.detach();
    }*/

    ngOnInit() {
        /*this.container = this._elem.nativeElement.querySelector('.map-wrapper');

        var opts: google.maps.MapOptions = {
            center: new google.maps.LatLng(this.latitude, this.longitude),
            zoom: this.zoom,
            disableDefaultUI: true,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 30
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6c6c6c"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#cacaca"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#fefdfd"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6c6c6c"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#474747"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.rail",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]
        };

        this.map = new google.maps.Map(this.container, opts);

        this.service =  new google.maps.places.PlacesService(this.map);
        if (this.polygone_points) {
            this.polygone = new google.maps.Polygon({
                paths: this.toGooglePoints(this.polygone_points),
                strokeColor: "#062141",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#062141",
                fillOpacity: 0.35,
                editable: false,
                geodesic: false,
                map: this.map,
            });
        } else {
            this.polygone = new google.maps.Polygon();
        }

        this.refreshMarkers();
        this.refreshPlacesMarkers();
        this.initDrawer();*/
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {

        /*if (!this.map) return;
        for (let p_name in changes) {
            let prop = changes[p_name];
            switch (p_name) {
                case 'objects':
                    this.refreshMarkers();
                    break;
                case 'selected_objects':
                    this.refreshSelected();
                    break;
                case 'place':
                    this.refreshPlacesMarkers();
                    break;
                case 'latitude':
                case 'longitude':
                    this.map.panTo(new google.maps.LatLng(this.latitude, this.longitude));
                    break;
                case 'draw_allowed':
                    if (!this.draw_allowed) {
                        this.polygone.setMap(null);
                        this.map.setOptions({draggable: true});
                    } else {
                        this.map.setOptions({draggable: false});
                    }
                case 'polygone_points':
                    if (this.polygone_points) {
                        this.polygone = new google.maps.Polygon({
                            paths: this.toGooglePoints(this.polygone_points),
                            strokeColor: "#062141",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#062141",
                            fillOpacity: 0.35,
                            editable: false,
                            geodesic: false,
                            map: this.map,
                        });
                    } else {
                        this.polygone = new google.maps.Polygon();
                    }
                    break;
            }
        }*/
    }



    /*ngAfterViewChecked() {
        if (this.container.clientWidth != this.p_w) {
            this.p_w = this.container.clientWidth;
            google.maps.event.trigger(this.map, 'resize');
        }
    }

    refreshSelected() {
        this.infoWindows.forEach( iw => {
            iw.close();
        });
        this.infoWindows = [];
        this.selected_objects.forEach(o => {
            var iw = new google.maps.InfoWindow({
                content: '<div>' + Offer.getDigest(o) + '</div>'
            });


            iw.open(this.map, this.markers[o.id]);
            this.infoWindows.push(iw);
        });
        if (this.selected_objects && this.selected_objects.length > 0) {
            this.latitude = this.selected_objects[this.selected_objects.length - 1].locationLat;
            this.longitude = this.selected_objects[this.selected_objects.length - 1].locationLon;
            this.map.panTo(new google.maps.LatLng(this.latitude, this.longitude));
        }
    }

    refreshMarkers() {
        if (this.objects == null) return;
        this.markers.forEach((marker: google.maps.Marker, id: number) => {
            marker.setMap(null);
        });
        this.markers = new Map();

        var c = this;

        let minLat = 100000;
        let minLon = 100000;
        let maxLat = 0;
        let maxLon = 0;
        let mark = 0;

        this.objects.forEach(obj => {
            if(obj.locationLat) {

                if (obj.locationLat > maxLat) {
                    maxLat = obj.locationLat;
                    mark ++;
                }
                if (obj.locationLon > maxLon) {
                    maxLon = obj.locationLon;
                    mark ++;
                }
                if (obj.locationLat < minLat) {
                    minLat = obj.locationLat;
                    mark ++;
                }
                if (obj.locationLon < minLon) {
                    minLon = obj.locationLon;
                    mark ++;
                }

                var m = new google.maps.Marker({
                    map: this.map,
                    position: new google.maps.LatLng(obj.locationLat, obj.locationLon),
                    title: '',
                    //icon: ico,
                    animation: google.maps.Animation.DROP
                });

                this.markers[obj.id] = m;

                var iw = new google.maps.InfoWindow({
                    content: '<div>' + Offer.getDigest(obj) + '</div>'
                });

                this.infoWindows.push(iw);

                m.addListener('click', function () {
                    iw.open(this.map, m);
                    //c.click.emit(_this);
                    c.markerClicked.emit(obj);
                });

            }
        });


        if (mark > 3) {
            var bounds = new google.maps.LatLngBounds();
            //sw
            bounds.extend(new google.maps.LatLng(minLat, minLon));
            //ne
            bounds.extend(new google.maps.LatLng(maxLat, maxLon));

            this.map.fitBounds(bounds);
        }
    }

    refreshPlacesMarkers() {
        this.placesMarkers = [];

        if (this.place == null) return;
        this.placesMarkers.forEach(m => {
            m.setMap(null);
        });

        var request = {
            bounds: this.map.getBounds(),
            keyword: this.place
        };

        this.service.radarSearch(request,  (results, status) => {
            for (var i = 0; i < results.length; i++) {
                this.addMark(new google.maps.Marker({
                    map: this.map,
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP
                    //icon: 'src/icons/googleTarget.png'
                }), results[i], this.service);
            }
        });
    }

    addMark(elem: any, rez: any,  serv: any) {
            this.placesMarkers.push(elem);
            google.maps.event.addListener(elem, 'mouseover', () => {
                serv.getDetails(rez, (result, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        console.error(status);
                        return;
                    }
                    this.placesWindows.setContent(result.name);
                    this.placesWindows.open(this.map, elem);
                });
             });

    }

    initDrawer() {
        var _this = this;

        google.maps.event.addListener(this.map, 'mousemove', function (e) {
            if (_this.is_drawing == true) {
                _this.polyline.getPath().push(e.latLng);
            }
        });

        google.maps.event.addListener(this.map, 'mousedown', function () {
            if (_this.draw_allowed) {
                _this.is_drawing = true;

                if (_this.polyline) {
                    _this.polyline.setMap(null);
                }

                _this.polyline = new google.maps.Polyline({
                    clickable: false,
                    strokeColor: "#062141",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    map: _this.map
                });
            }
        });

        google.maps.event.addListener(this.map, 'mouseup', function () {
            _this.is_drawing = false;

            if (_this.draw_allowed) {
                _this.draw_allowed = false;
                _this.map.setOptions({draggable: true});

                var pa = [];
                _this.polyline.getPath().forEach(function forEach(ll) {
                    pa.push({lat: ll.lat(), lng: ll.lng()});
                });

                var ch = new ConcaveHull(pa, 2000).getLatLngs();

                _this.polygone = new google.maps.Polygon({
                    paths: ch,
                    strokeColor: "#062141",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#062141",
                    fillOpacity: 0.35,
                    editable: true,
                    geodesic: false,
                    map: _this.map,
                });

                _this.drawFinished.emit(_this.toRplusPoints(ch));
                _this.polyline.setMap(null);
            }
        });
    }

    toGooglePoints(pList: GeoPoint[]) {
        var result: any[] = [];
        pList.forEach(p => {
            result.push({lat: p.lat, lng: p.lon});
        });
        return result;
    }

    toRplusPoints(pList: any[]) {
        var result: GeoPoint[] = [];
        pList.forEach(p => {
            result.push({lat: p.lat, lon: p.lng});
        });
        return result;
    }*/
}


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'google-map-marker',
    inputs: ['latitude', 'longitude', 'info_str', 'icon_id', 'is_selected'],
    styles: [``],
    template: `<div></div>`,
})

export class GoogleMapMarkerComponent implements OnChanges {
    /*map: google.maps.Map;
    marker: google.maps.Marker;
    infowindow: google.maps.InfoWindow;

    latitude: number = 0;
    longitude: number = 0;
    info_str: string = '';
    icon_id: number = 0;
    is_selected: boolean = false;

    @Output() click: EventEmitter<any> = new EventEmitter();

    constructor(parent: GoogleMapComponent, private ref: ChangeDetectorRef) {
        this.map = parent.map;
        ref.detach();
    }

    ngOnInit() {
        var ico: google.maps.Icon = null;
        var icons: google.maps.Icon[] = [
            {url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',},
            {url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',},
            {url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',},
        ];

        if (this.icon_id > 0 && this.icon_id < icons.length) {
            ico = icons[this.icon_id - 1];
        }

        this.marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(this.latitude, this.longitude),
            title: '',
            icon: ico,
            animation: google.maps.Animation.DROP
        });

        this.infowindow = new google.maps.InfoWindow({
            content: '<div>' + this.info_str + '</div>'
        });

        var _this = this;
        this.marker.addListener('click', function () {
            _this.infowindow.open(this.map, this.marker);
            _this.click.emit(_this);
        });
    }*/

    ngOnChanges() {
        /*if (this.marker) {
            if (this.is_selected) {
                this.marker.setAnimation(google.maps.Animation.BOUNCE);
                this.infowindow.open(this.map, this.marker);
            } else {
                this.marker.setAnimation(null);
                this.infowindow.close();
            }
        }*/
    }
}
