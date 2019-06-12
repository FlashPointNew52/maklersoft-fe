/**
 * Created by owl on 2/6/17.
 */

import {Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment/moment';

@Pipe({name: 'strNn'})
export class StrNnPipe implements PipeTransform {
    transform(value: string, args: string[]) : any {
        if (value) {
            return value;
        }
        return '';
    }
}
