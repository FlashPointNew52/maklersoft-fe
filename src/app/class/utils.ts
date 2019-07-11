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
                nextNextDay: '[Послезавтра в] LT',
                nextWeek: 'DD.MM.YYYY',
                lastDay: '[Вчера в] LT',
                lastWeek:  function(now) {
                    if (moment(this).startOf('day').diff(moment(now).startOf('day'), 'day', true) == -2) {
                      return '[Позавчера в] LT';
                    } else {
                      return 'DD.MM.YYYY';
                    }
                },
                sameElse: 'DD.MM.YYYY'
            });
    }

    public static getDateForGraph(number: number) {
        return moment(number).format("D MMMM");
    }
    public static getTitleDateForGraph(number: number) {
        return moment(number).format("D MMMM, YYYY");
    }
    public static getNumWithDellimet(n){
        n += "";
        n = new Array(4 - n.length % 3).join("U") + n;
        return n.replace(/([0-9U]{3})/g, "$1 ").replace(/U/g, "");
    }
    public static getCurrentTime(number: number) {
        return moment(number).get('hour') + '.' + moment(number).get('minute');
    }
    public static getNumWithWhitespace(str){
        if(!str) return "";
        return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
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

    //Функция проверки отнесения аккаунта
    public static canImpact(arr: any[], accountId){
        for (let elem of arr) {
           if(elem.accountId != accountId)
              return false;
        }
        return true;
    }
}
