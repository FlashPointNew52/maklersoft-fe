import {User} from "./user";
import {Person} from "./person";
import {ContractBlock} from "../class/contractBlock";
import {ConditionsBlock} from "../class/conditionsBlock";
import {Organisation} from "./organisation";

export class ValueRange {
    fixVal: any;
    lowerVal: any;
    upperVal: any;

    static getHuman(obj: ValueRange, factor: number = 1): string{
        if(obj.fixVal) return ""+obj.fixVal*factor;
        else {
            let val = "";
            if(obj.lowerVal)
                val += "от "+ (obj.lowerVal*factor);
            if(obj.upperVal)
                val += " до "+ (obj.upperVal*factor);
            return val;
        }
    }
}

export class Request {

    id: number;
    accountId: number;

    agentId: number;
    agent: User;
    personId: number;
    person: Person;
    companyId: number;
    company: Organisation;

    addDate: number;
    changeDate: number;
    assignDate: number;
    arrival_date: number;

    stageCode: string;
    offerTypeCode: string;
    sourceCode: string;
    request: string;

    newBuilding: boolean;
    encumbrance: boolean;
    buildYear: string;
    rate: number;

    contractBlock: ContractBlock;
    conditions: ConditionsBlock;

    period: string;
    costInfo: string;
    paymentMethod: string;
    cash: boolean;
    mortgage: boolean;
    certificate: boolean;
    maternalCapital: boolean;
    commission: boolean;
    utilityBills: boolean;
    deposit: boolean;
    counters: boolean;

    typeCodes: string[];
    budget: ValueRange;
    roomsCount: ValueRange;
    floor: ValueRange;
    square: ValueRange;

    tag: number;
    searchArea: any[];
    description: string;


    constructor () {
        this.offerTypeCode = 'sale';
        this.searchArea = [];
        this.person = new Person();
        this.request = '';
        this.contractBlock = new ContractBlock();
        this.conditions = new ConditionsBlock();
    }

    public static offerTypeCodeOptions = {
        purchase: {label: 'Покупка', items: []},
        alternative: {label: 'Альтернатива', items: []},
        exchange: {label: 'Мена', items: []},
        rent: {label: 'Аренда', items: []}
    };

    public static sourceCodeOptions = {
        internet: {label: 'Интернет площадки'},
        print: {label: 'Печатные издания'},
        social: {label: 'Социальные сети'},
        messengers: {label: 'Мессенджеры'},
        email: {label: 'E-mail-рассылка'},
        recommendations: {label: 'Рекомендации'}
    };

    public static stageCodeOptions = [
        {value: 'raw', label: 'Не активно'},
        {value: 'active', label: 'Активно'},
        {value: 'listing', label: 'Листинг'},
        {value: 'deal', label: 'Сделка'},
        {value: 'suspended', label: 'Приостановлено'},
        {value: 'archive', label: 'Архив'}
    ];


}
