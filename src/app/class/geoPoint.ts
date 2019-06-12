export class GeoPoint {
    lat: number;
    lon: number;

    public constructor (obj: any){
        this.lat = obj.lat;
        this.lon = obj.lon;
    }

    public toArray(){
        return [this.lat, this.lon];
    }

    static fromArray(coords: any[]){
        let geoArray = [];
        for(let coord of coords){
            geoArray.push({lat: coord[0], lon: coord[1]});
        }
        return geoArray;
    }
}
