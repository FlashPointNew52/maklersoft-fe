import * as moment from 'moment/moment';
import 'moment/locale/ru.js';
import {SessionService} from "../service/session.service";
import {Contact} from "../entity/contact";
import {PhoneBlock} from "./phoneBlock";
import {PersonService} from "../service/person.service";
import {Organisation} from "../entity/organisation";
import {OrganisationService} from "../service/organisation.service";
import {AsyncSubject} from "rxjs";
import {Person} from "../entity/person";

export class Utils{
    private  static _sessionService: SessionService;
    constructor(private  _personService: PersonService,
                private  _organisationService: OrganisationService
    ){
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
    public static canImpact(arr: any[]){
        for (let elem of arr) {
           if(elem.accountId != this._sessionService.getUser().accountId)
              return false;
        }
        return true;
    }

    public findContact(structure: any, contact: any){
        let ret_subj = <AsyncSubject<Contact>>new AsyncSubject();
        if(Object.keys(structure).length == 0 && contact.id){
            let type = contact.type;
            contact = new Contact();
            contact.type = type;
            ret_subj.next(contact);
            ret_subj.complete();
        } else if (!contact.id) {
            let phones = PhoneBlock.removeSymb(structure);
            if(PhoneBlock.check(phones)) {
                if(contact.type == "person") {
                    this._personService.findByPhone(phones).subscribe((data) => {
                        if (data != null) {
                            contact = data;
                            contact.type = 'person';
                        } else {
                            contact.phoneBlock = structure;
                        }
                        ret_subj.next(contact);
                        ret_subj.complete();
                    });
                } else{
                    this._organisationService.findByPhone(phones).subscribe((data)=>{
                        if(data != null){
                            contact = data;
                            contact.type = 'organisation';
                        } else{
                            contact.phoneBlock = structure;
                        }
                        ret_subj.next(contact);
                        ret_subj.complete();
                    });
                }
            }
        }
        return ret_subj;
    }
}
