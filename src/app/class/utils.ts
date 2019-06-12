import * as moment from 'moment/moment';
import 'moment/locale/ru.js';

export class Utils{
    constructor(){
        moment.locale("ru");
    }

    public static getDateInCalendar(date: number){
        return moment(date * 1000).calendar(null, {
                sameDay: '[Сегодня в] LT',
                nextDay: '[Завтра в] LT',
                nextNextDay: '[Послезавтра]',
                nextWeek: 'DD.MM.YYYY',
                lastDay: '[Вчера в] LT',
                lastWeek:  function (now) {
                    if (moment(this).startOf('day').diff(moment(now).startOf('day'), 'day', true) == -2) {
                      return '[Позавчера]';
                    } else {
                      return 'DD.MM.YYYY';
                    }
                },
                sameElse: 'DD.MM.YYYY'
            });
    }

    public static getNumWithDellimet(n){
        n += "";
        n = new Array(4 - n.length % 3).join("U") + n;
        return n.replace(/([0-9U]{3})/g, "$1 ").replace(/U/g, "");
    }

    public static inLastDay(date: number) {
        return moment().subtract(1, 'days').isBefore(date*1000);

    }

    public static trancateFio(fio: string){
        if (!fio || fio.trim().length == 0) return null;
        let spArray = fio.split(" ");
        let ret = spArray[0];
        for(let i = 1; i < spArray.length; ++i){
            ret += " " + spArray[i].charAt(0) + ".";
        }
        return ret;
    }

    public static getSurname(fio: string){
        if(fio){
            return fio.split(" ")[0];
        }
        return null;
    }

    public static getFirstName(fio: string){
        if(fio){
            let spArray = fio.split(" ");
            let ret = "";
            for(let i = 1; i < spArray.length; ++i){
                ret += spArray[i] + " ";
            }
            if(ret != "") return ret;
        }
        return null;
    }
}
