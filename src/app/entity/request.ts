import {User} from "./user";
import {Person} from "./person";
import {ContractBlock} from "../class/contractBlock";
import {ConditionsBlock} from "../class/conditionsBlock";
import {Organisation} from "./organisation";
import {UploadFile} from "../class/uploadFile";

export class ValueRange {
    fixVal: any;
    lowerVal: any;
    upperVal: any;

    constructor(){
        this.fixVal = 0;
        this.lowerVal = 0;
        this.upperVal = 0;
    }

    static getHuman(obj: ValueRange, factor: number = 1): string{
        if(obj && obj.fixVal) return ""+obj.fixVal*factor;
        else if(obj){
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

    documents: UploadFile[];

    constructor() {
        this.offerTypeCode = "sale";
        this.stageCode = "raw";
        this.searchArea = [];
        this.request = '';
        this.budget = this.roomsCount = this.roomsCount = this.floor = this.square = new ValueRange();
        this.contractBlock = new ContractBlock();
        this.conditions = new ConditionsBlock();
        this.documents = [];
    }

    public static offerTypeCodeOptions = {
        sale: {label: 'Покупка', items: []},
        alternative: {label: 'Альтернатива', items: []},
        rent: {label: 'Аренда', items: []}
    };


    public static stageCodeOptions = {
        raw: {label: 'Не активно'},
        active: {label: 'Активно'},
        listing: {label: 'Листинг'},
        deal: {label: 'Сделка'},
        suspended: {label: 'Приостановлено'},
        archive: {label: 'Архив'}
    };

    public static paymentMethodOptions = {
        cash: {label: 'Наличные'},
        cashless: {label: 'Безналичные'},
        combine: {label: 'Наличные/Безналичные'}
    };
}
