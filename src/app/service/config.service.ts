import {Injectable} from '@angular/core';

import {Config} from '../class/config';


@Injectable()
export class ConfigService {
    public getConfig() {
        return CONFIG;
    }
}

let CONFIG: Config = {
    version: "b17.9",
    map: {
        default: {
            lat: 55.755505, lon: 37.617270, zoom: 16
        },
        khv: {
            lat: 48.480228, lon: 135.071921, zoom: 16
        },
        msk: {
            lat: 55.755505, lon: 37.617270, zoom: 16
        },
        kja: {
            lat: 56.014039, lon: 92.892053, zoom: 16
        },
        vld: {
            lat: 43.119348, lon: 131.886965, zoom: 16
        },
        irkutsk: {
            lat: 52.286450, lon: 104.304856, zoom: 16
        },
        tver: {
            lat: 56.858507, lon: 35.917521, zoom: 16
        },
        rzn: {
            lat: 54.609215, lon: 39.712564, zoom: 16
        },
        kms: {
            lat: 50.546913, lon: 137.011227, zoom: 16
        },
        nahodka: {
            lat: 42.820431, lon: 132.883842, zoom: 16
        },

        p_posad: {
            lat: 55.773481, lon: 38.653316, zoom: 16
        },
        stupino: {
            lat: 54.903123, lon: 38.080785, zoom: 16
        },
        voskresensk: {
            lat: 55.322338, lon: 38.681782, zoom: 16
        },
        o_zuevo : {
            lat: 55.802349, lon: 38.966713, zoom: 16
        },
        jaroslavl: {
            lat: 57.622242, lon: 39.884425, zoom: 16
        },
        el_gorsk: {
            lat: 55.875938, lon: 38.780314, zoom: 16
        },
        el_stal: {
            lat: 55.782371, lon: 38.453338, zoom: 16
        },
        el_ugli: {
            lat: 55.714968, lon: 38.209223, zoom: 16
        },
        noginsk: {
            lat: 55.874205, lon: 38.466371, zoom: 16
        },
        surgut: {
            lat: 61.254298, lon: 73.385749, zoom: 16
        },
        pushkino: {
            lat: 55.986301, lon: 37.841615, zoom: 16
        },
        mitishi: {
            lat: 55.918564, lon: 37.764960, zoom: 16
        },
        jukovski: {
            lat: 55.595562, lon: 38.112581, zoom: 16
        },
        ramenskoe: {
            lat: 55.567335, lon: 38.221941, zoom: 16
        },
        chekhov: {
            lat: 55.151720, lon: 37.460746, zoom: 16
        },
        dmitov: {
            lat: 56.341870, lon: 37.528703, zoom: 16
        },
        balachikha: {
            lat: 55.795506, lon: 37.968072, zoom: 16
        },
        sochi: {
            lat: 43.602402, lon: 39.734203, zoom: 16
        },
        orenburg: {
            lat: 51.762391, lon: 55.098985, zoom: 16
        },
        belgorod: {
            lat: 50.598446, lon: 36.598028, zoom: 16
        },
        chimki: {
            lat: 55.893240, lon: 37.444119, zoom: 16
        },
        shelkovo: {
            lat: 55.915040, lon: 38.036131, zoom: 16
        },
        narofominsk: {
            lat: 55.390574, lon: 36.725892, zoom: 16
        },
        kolomna: {
            lat: 55.092485, lon: 38.768343, zoom: 16
        },
        u_sakhalinsk: {
            lat: 46.961504, lon: 142.734414, zoom: 16
        },
        anapa: {
            lat: 44.884441, lon: 37.320182, zoom: 16
        },
        v_novgorod: {
            lat: 58.522177, lon: 31.273314, zoom: 16
        },
        spb: {
            lat: 59.925408, lon: 30.331908, zoom: 16
        },
        mapStyle: [
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
        ]

    },
    RESTServer: "http://maklersoft.com:4567",
    //RESTServer: "http://localhost:4567",

};
