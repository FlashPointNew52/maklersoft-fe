import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {Photo} from '../class/photo';


@Injectable()
export class FileService {

  RS: String = "";

  constructor(private _configService: ConfigService, private _http: HttpClient) {
    this.RS = this._configService.getConfig().RESTServer;
  };

  getPhotos(entityId: String) {
    console.log('getPhotos');

    return new Promise<Photo[]>(resolve => {
    let _resourceUrl = this.RS + '/api/v1/photo/list/' + entityId;
    this._http.get(_resourceUrl).pipe(
      map((res: Response) => res)).subscribe(
        raw => {
          let data = JSON.parse(JSON.stringify(raw));
          resolve(data);
          if(data.result == "OK") {
          }
        },
        err => console.log(err)
      );
    });
  }

}
