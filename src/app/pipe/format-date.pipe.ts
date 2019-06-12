import {Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(value:any, args:string[]) : any {
    var r = '';

    if (value) {
      let d = moment(value * 1000);
      r = d.format('DD.MM.YY HH:mm');
    }
    return r;
  }
}
