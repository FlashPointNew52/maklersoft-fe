import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {ConfigService} from './config.service';

import {Photo} from '../class/photo';


@Injectable()
export class FileService {

  RS: String = "";

  constructor(private _configService: ConfigService, private _http: Http) {
    this.RS = this._configService.getConfig().RESTServer;
  };

  getPhotos(entityId: String) {
    console.log('getPhotos');

    return new Promise<Photo[]>(resolve => {
    var _resourceUrl = this.RS + '/api/v1/photo/list/' + entityId;
    var headers = new Headers();
    this._http.get(_resourceUrl, {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(
        data => {
          resolve(data);
          if(data.result == "OK") {
          }
        },
        err => console.log(err)
      );
    });
  }

}
