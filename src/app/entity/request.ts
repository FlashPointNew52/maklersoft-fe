import {User} from "./user";
import {Person} from "./person";
import {ContractBlock} from "../class/contractBlock";
import {ConditionsBlock} from "../class/conditionsBlock";
import {Organisation} from "./organisation";
import {UploadFile} from "../class/uploadFile";
import {Rating} from '../class/rating';
import {AddressBlock} from '../class/addressBlock';
import {PhoneBlock} from '../class/phoneBlock';
import {EmailBlock} from '../class/emailBlock';

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

    categoryCode: string;           //категория недвижимости
    buildingType: string;           //тип дома
    buildingClass: string;          //тип недвижимости
    typeCode: string;               //тип объекта
    objectStage: string;            //стадия строительства
    distance: string;               //удаленность
    settlement: string;             //Наименование поселения
    guard: boolean;                 //есть охрана
    housingComplex: string;         //Жилищный комплекс
    mortgages: boolean;              //под ипотеку
    houseType: string;            //Материал дома
    roomScheme: string;           //Тип комнат
    floorsCount: number;            //этажность
    levelsCount: number;            //уровней

    squareTotal: number;            //площадь общая
    squareLiving: number;           //площадь жилая
    squareKitchen: number;          //площадь кухни
    balcony: boolean;               //есть балкон
    loggia: boolean;                //есть лоджия
    condition: string;            //Состояние объекта
    bathroom: string;             //тип санузла
    squareLand: number;             //площадь участка
    squareLandType: number;         //тип участка
    waterSupply: boolean;           //есть водоснабжение
    gasification: boolean;          //есть газ
    electrification: boolean;       //есть электричество
    sewerage: boolean;              //есть канализация
    centralHeating: boolean;        //есть отопление
    objectName: string;             //название объекта
    ceilingHeight: number;          //высота потолков
    lift: boolean;                  //есть лифт
    parking: boolean;               //есть парковка
    locRating: Rating;

    addDate: number;
    changeDate: number;
    assignDate: number;
    arrival_date: number;

    stageCode: string;
    offerTypeCode: string;

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
    roomsCount: number;
    floor: number;
    square: ValueRange;

    tag: number;
    searchArea: any[];
    description: string;

    documents: UploadFile[];
    photos: UploadFile[];

    constructor() {
        this.categoryCode = "rezidential";
        this.buildingType =  'multisection_house';
        this.buildingClass =  'economy';
        this.typeCode = 'apartment';
        this.houseType = "other";
        this.bathroom = "other";
        this.roomScheme = "other";
        this.condition = "other";
        this.locRating = new Rating();
        this.locRating.map = {average : 0};

        this.offerTypeCode = "sale";
        this.stageCode = "raw";
        this.searchArea = [];
        this.budget = new ValueRange();
        this.contractBlock = new ContractBlock();
        this.conditions = new ConditionsBlock();
        this.documents = [];
        this.agentId = null;
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
