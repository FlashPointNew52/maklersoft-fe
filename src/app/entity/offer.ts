import {GeoPoint} from "../class/geoPoint";
import {AddressBlock} from "../class/addressBlock";
import {ContractBlock} from "../class/contractBlock";
import {PhoneBlock} from "../class/phoneBlock";
import {EmailBlock} from "../class/emailBlock";
import {User} from "./user";
import {Person} from "./person";
import {Organisation} from "./organisation";
import {Rating} from "../class/rating";
import {ConditionsBlock} from "../class/conditionsBlock";
import {UploadFile} from "../class/uploadFile";


export class Offer {

    id: number;                     //id
    import_id: number;             //id импорта
    accountId: number;              //id аккаунта

    stageCode: string;              //стадия

    addressBlock: AddressBlock;     //блок адреса
    phoneBlock: PhoneBlock;
    emailBlock: EmailBlock;
    poi: string;

    houseType: string;            //Материал дома
    roomScheme: string;           //Тип комнат
    condition: string;            //Состояние объекта
    bathroom: string;             //тип санузла

    price: number;                  //цена
    ownerPrice: number;             //цена владельца
    agencyPrice: number;            //цена агентства
    leaseDepositL: number;
    comission: number;              //коммисия
    commisionType: string;           //Тип комиссии

    description: string;            //дополнительное описание
    costInfo: string;               //Доп инфо о цене
    conditionInfo: string;          //Доп инфо об условиях
    sourceMedia: string;            //Наименование источника
    sourceUrl: string;              //адрес источника

    addDate: number;                //дата добавления
    openDate: number;               //дата открытия
    changeDate: number;             //дата изменения
    assignDate: number;             //дата назначения
    arrivalDate: string;
    deleteDate: number;             //дата удаления
    lastSeenDate: number;           //дата последнего просмотра

    period: string;

    mlsPrice: number;               //цена мультилистинга
    mlsPriceType: string;           //тип мультлистинга

    agentId: number;                //id агента
    agent: User;                    //агент

    personId: number;               //id контакта
    person: Person;                 //контакт

    companyId: number;              //id контагента
    company: Organisation;          //контрагент

    location: GeoPoint;             //координаты

    photos: UploadFile[];         //url фото
    documents: UploadFile[];         //url документов
    
    sourceCode: string;             //источник объекта

    offerTypeCode: string;          //Предложение (аренда/продажа)
    rentType: string;              //Тип Аренды
    categoryCode: string;           //категория недвижимости
    buildingType: string;           //тип дома
    buildingClass: string;          //тип недвижимости
    typeCode: string;               //тип объекта

    settlement: string;             //Наименование поселения
    housingComplex: string;         //Жилищный комплекс
    distance: string;               //удаленность
    newBuilding: boolean;           //Новостройка
    objectStage: string;            //стадия строительства
    buildYear: string;              //год постройки

    roomsCount: number;             //количество комнат

    floor: number;                  //этаж
    floorsCount: number;            //этажность
    levelsCount: number;            //уровней

    squareTotal: number;            //площадь общая
    squareLiving: number;           //площадь жилая
    squareKitchen: number;          //площадь кухни
    squareLand: number;             //площадь участка
    squareLandType: number;         //тип участка

    balcony: boolean;               //есть балкон
    loggia: boolean;                //есть лоджия
    guard: boolean;                 //есть охрана
    waterSupply: boolean;           //есть водоснабжение
    gasification: boolean;          //есть газ
    electrification: boolean;       //есть электричество
    sewerage: boolean;              //есть канализация
    centralHeating: boolean;        //есть отопление
    lift: boolean;                  //есть лифт
    parking: boolean;               //есть парковка

    objectName: string;             //название объекта

    ceilingHeight: number;          //высота потолков
    contractBlock: ContractBlock;   //блок договора
    conditions: ConditionsBlock;

    encumbrance: boolean;            //обременение
    mortgages: boolean;              //под ипотеку

    tag: string;                    //тэг

    mediatorCompany: string;      //информация продавца

    prepayment: boolean;           //предоплата
    electrificPay: boolean;        //плата за электричество
    waterPay: boolean;             //плата за воду
    gasPay: boolean;               //плата за газ
    heatingPay: boolean;           //плата за газ
    utilityBills: boolean;         //
    offerRef: number;
    // райтинги
    locRating: Rating;

    constructor() {
        // set default vals
        this.stageCode = 'raw';
        this.offerTypeCode = 'sale';
        this.categoryCode = "rezidential";
        this.buildingType =  'multisection_house';
        this.buildingClass =  'economy';
        this.typeCode = 'apartment';
        this.houseType = "other";
        this.sourceCode = "input";
        this.bathroom = "other";
        this.roomScheme = "other";
        this.condition = "other";
        this.photos = [];
        this.documents = [];
        this.contractBlock = new ContractBlock();
        this.addressBlock = new AddressBlock();
        this.phoneBlock = new PhoneBlock();
        this.emailBlock = new EmailBlock();
        this.locRating = new Rating();
        this.locRating.map = {average : 0};
        this.conditions = new ConditionsBlock();
        this.agentId = null;
    }

    public static offerTypeCodeOptions = {
        sale: {label: 'Продажа', items: []},
        alternative: {label: 'Альтернатива', items: []},
        rent: {label: 'Аренда', items: []}
    };

    public static offerTypeCodeOptionsImport = {
        sale: {label: 'Продажа', items: []},
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

    public static categoryOptions = {
        rezidential: {label: 'Жилая недвижимость'},
        commersial: {label: 'Коммерческая недвижимость'},
        land: {label: 'Земельный участок'}
    };

    public static squareLandTypeOptions = {
        0: {label: 'Сотки'},
        1: {label: 'Гектар'},
    };

    public static buildingTypeOptions = {
        multisection_house: {label: 'Многосекционный'},
        singlesection_house: {label: 'Односекционный'},
        corridor_house: {label: 'Коридорный'},
        galary_house: {label: 'Галерейный'},
        lowrise_house: {label: 'Малоэтажное жильё'},
        agricultural_land: {label: 'Земли сельхоз назначения'},
        settlements_land: {label: 'Земли населенных пунктов'},
        gpurpose_place: {label: 'Свободного назначения'},
        market_place: {label: 'Розничная торговля'},
        office: {label: 'Офисная'},
        production_place: {label: 'Индустриальная'}
    };

    public static buildingClassOptions = {
        elite: {label: 'Элит класс'},
        business: {label: 'Бизнес класс'},
        economy: {label: 'Эконом класс'},
        improved: {label: 'Улучшенная'},
        brezhnev: {label: 'Брежневка'},
        khrushchev: {label: 'Хрущевка'},
        stalin: {label: 'Сталинка'},
        old_fund: {label: 'Старый фонд'},
        small_apartm: {label: 'Малосемейка'},
        dormitory: {label: 'Общежитие'},
        gostinka: {label: 'Гостинка'},
        individual: {label: 'Индивидуальная'},
        single_house: {label: 'Дом'},
        cottage: {label: 'Коттедж'},
        dacha: {label: 'Дача'},
        townhouse: {label: 'Таунхаус'},
        duplex: {label: 'Дуплекс'},
        A: {label: 'А'},
        Ap: {label: 'А+'},
        B: {label: 'Б'},
        Bp: {label: 'Б+'},
        C: {label: 'С'},
        Cp: {label: 'С+'}
    };

    public static typeCodeOptions = {
        share: {label: 'Доля'},
        room: {label: 'Комната'},
        apartment: {label: 'Квартира'},
        house: {label: 'Дом'},
        cottage: {label: 'Коттедж'},
        dacha: {label: 'Дача'},
        townhouse: {label: 'Таунхаус'},
        duplex: {label: 'Дуплекс'},
        garden_land: {label: 'Садовый земельный участок'},
        cultivate_land: {label: 'Огородный земельный участок'},
        dacha_land: {label: 'Дачный земельный участок'},
        gpurpose_place: {label: 'Свободного назначения'},
        market_place: {label: 'Розничная торговля'},
        office: {label: 'Офисная'},
        production_place: {label: 'Индустриальная'},
        other: {label: 'Другое'}
    };

    public static buildindTypeByCategory = {
        rezidential: {
            multisection_house: {label: 'Многосекционный'},
            singlesection_house: {label: 'Односекционный'},
            corridor_house: {label: 'Коридорный'},
            galary_house: {label: 'Галерейный'},
            lowrise_house: {label: 'Малоэтажное жильё'}
        },
        land: {
            agricultural_land: {label: 'Земли сельхоз назначения'},
            settlements_land: {label: 'Земли населенных пунктов'}
        },
        commersial: {
            gpurpose_place: {label: 'Свободного назначения'},
            market_place: {label: 'Розничная торговля'},
            office: {label: 'Офисная'},
            production_place: {label: 'Индустриальная'}
        }
    };

    public static buildindClassByBuildingType = {
        multisection_house: {
            elite: {label: 'Элит класс'},
            business: {label: 'Бизнес класс'},
            economy: {label: 'Эконом класс'},
            improved: {label: 'Улучшенная'},
            brezhnev: {label: 'Брежневка'},
            khrushchev: {label: 'Хрущевка'},
            stalin: {label: 'Сталинка'},
            old_fund: {label: 'Старый фонд'},
            individual: {label: 'Индивидуальная'}
        },
        singlesection_house: {
            elite: {label: 'Элит класс'},
            business: {label: 'Бизнес класс'},
            economy: {label: 'Эконом класс'},
            improved: {label: 'Улучшенная'},
            brezhnev: {label: 'Брежневка'},
            individual: {label: 'Индивидуальная'}
        },
        corridor_house: {
            elite: {label: 'Элит класс'},
            business: {label: 'Бизнес класс'},
            economy: {label: 'Эконом класс'},
            improved: {label: 'Улучшенная'},
            small_apartm: {label: 'Малосемейка'},
            dormitory: {label: 'Общежитие'},
            gostinka: {label: 'Гостинка'},
            individual: {label: 'Индивидуальная'}
        },
        galary_house: {
            individual: {label: 'Индивидуальная'}
        },
        lowrise_house: {
            single_house: {label: 'Дом'},
            cottage: {label: 'Коттедж'},
            dacha: {label: 'Дача'},
            townhouse: {label: 'Таунхаус'},
            duplex: {label: 'Дуплекс'}
        },
        agricultural_land: {},
        settlements_land: {},
        gpurpose_place: {
            A: {label: 'А'},
            Ap: {label: 'А+'},
            B: {label: 'Б'},
            Bp: {label: 'Б+'},
            C: {label: 'С'},
            Cp: {label: 'С+'}
        },
        market_place: {
            A: {label: 'А'},
            Ap: {label: 'А+'},
            B: {label: 'Б'},
            Bp: {label: 'Б+'},
            C: {label: 'С'},
            Cp: {label: 'С+'}
        },
        office: {
            A: {label: 'А'},
            Ap: {label: 'А+'},
            B: {label: 'Б'},
            Bp: {label: 'Б+'},
            C: {label: 'С'},
            Cp: {label: 'С+'}
        },
        production_place: {
            A: {label: 'А'},
            Ap: {label: 'А+'},
            B: {label: 'Б'},
            Bp: {label: 'Б+'},
            C: {label: 'С'},
            Cp: {label: 'С+'}
        }
    };

    public static commisionTypeOption = {
        percent:  {label: '%%'},
        fix: {label: 'тыс. руб.'}
    };

    public static typeCodeByBuildingType = {
        multisection_house: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'}
        },
        singlesection_house: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'}
        },
        corridor_house: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'}
        },
        galary_house: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'}
        },
        lowrise_house: {},
        agricultural_land: {
            garden_land: {label: 'Садовый земельный участок'},
            dacha_land: {label: 'Дачный земельный участок'},
            cultivate_land: {label: 'Огородный земельный участок'}
        },
        settlements_land: {
            garden_land: {label: 'Садовый земельный участок'},
            dacha_land: {label: 'Дачный земельный участок'},
            cultivate_land: {label: 'Огородный земельный участок'}
        },
        gpurpose_place: { //свободного назначечение
            hotel: {label: 'Отель'},
            restaurant: {label: 'Ресторан'},
            сafe: {label: 'Кафе'},
            sport_building: {label: 'Спортивное сооружение'}
        },
        market_place: {  //розничная торговля
            shop: {label: 'Магазин'},
            shops_center: {label: 'Торговый центр'},
            shop_entertainment: {label: 'Торгово-развлекательный комплекс'}
        },
        office: {        //Офисная
            cabinet: {label: 'Кабинет'},
            office_space: {label: 'Офисное помещение'},
            office_building: {label: 'Офисное здание'},
            business_center: {label: 'Бизнес-центр'}
        },
        production_place: {  //Индустриальная
            manufacture_building: {label: 'Производственное здание'},
            warehouse_space: {label: 'Складское помещение'},
            industrial_enterprice: {label: 'Промышленное предприятие'}
        }
    };

    public static typeCodeByBuildingClass = {
        duplex: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'},
            duplex: {label: 'Дуплекс'}
        },
        single_house: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            house: {label: 'Дом'}
        },
        cottage: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            cottage: {label: 'Коттедж'}
        },
        dacha: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            dacha: {label: 'Дача'}
        },
        townhouse: {
            share: {label: 'Доля'},
            room: {label: 'Комната'},
            apartment: {label: 'Квартира'},
            townhouse: {label: 'Таунхаус'}
        }
    };

    public static typeCodeOptionsHash = {
        share: 'Доля',
        room: 'Комната',
        apartment: 'Квартира',
        house: 'Дом',
        cottage: 'Коттедж',
        dacha: 'Дача',
        townhouse: 'Таунхаус',
        duplex: 'Дуплекс',
        garden_land: 'Садовый земельный участок',
        dacha_land: 'Дачный земельный участок',
        cultivate_land: 'Огородный земельный участок',
        hotel: 'Отель',
        restaurant: 'Ресторан',
        сafe: 'Кафе',
        sport_building: 'Спортивное сооружение',
        shop: 'Магазин',
        shops_center: 'Торговый центр',
        shop_entertainment: 'ТРК',
        cabinet: 'Кабинет',
        office_space: 'Офисное помещение',
        office_building: 'Офисное здание',
        business_center: 'Бизнес центр',
        manufacture_building: 'Производственное здание',
        warehouse_space: 'Складское помещение',
        industrial_enterprice: 'Промышленное предприятие',
        other: 'Другое'
    };


    public static buildingTypeOptionsToCategory = {
        multisection_house: 'rezidential',
        singlesection_house: 'rezidential',
        corridor_house: 'rezidential',
        galary_house: 'rezidential',
        townhouse: 'rezidential',
        duplex: 'rezidential',
        ihc: 'rezidential',
        agricultural_land: 'land',
        settlements_land: 'land',
        gpurpose_place: 'commersial',
        market_place: 'commersial',
        office: 'commersial',
        production_place: 'commersial'
    };

    public static typeCodeOptionsToBuilding = {
        share: 'multisection_house',
        room: 'multisection_house',
        apartment: 'multisection_house',
        house: 'ihc',
        cottage: 'ihc',
        dacha: 'ihc',
        duplex: 'duplex',
        townhouse: 'townhouse',
        garden_land: 'agricultural_land',
        dacha_land: 'agricultural_land',
        cultivate_land: 'agricultural_land',
        hotel: 'gpurpose_place',
        restaurant: 'gpurpose_place',
        сafe: 'gpurpose_place',
        sport_building: 'gpurpose_place',
        shop: 'market_place',
        shops_center: 'market_place',
        shop_entertainment: 'market_place',
        cabinet: 'office',
        office_space: 'office',
        office_building: 'office',
        business_center: 'office',
        manufacture_building: 'production_place',
        warehouse_space: 'production_place',
        industrial_enterprice: 'production_place',
        other: 'social_place'
    };

    public static objectStageOptions = {
        project: {label: 'Проект'},
        building: {label: 'Строящийся'},
        ready: {label: 'Сдан'}
    };

    public static houseTypeOptions = {
        brick: {label: 'Кирпичный'},
        panel: {label: 'Панель'},
        monolithic: {label: 'Монолит'},
        monolithic_brick: {label: 'Кирпично-монолитный'},
        wood: {label: 'Деревянный'},
        cinder_block: {label: 'Шлакоблочный'},
        other: {label: 'Другое'}
    };

    public static roomSchemeOptions = {
        separate: {label: 'Раздельные'},
        adjoining: {label: 'Смежные'},
        adjoin_separate: {label: 'Смежно-раздельные'},
        studio: {label: 'Студия'},
        free: {label: 'Свободная'},
        other: {label: 'Другое'}
    };

    public static conditionOptions = {
        rough: {label: 'После строителей'},
        social: {label: 'Социальный ремонт'},
        repaired: {label: 'Сделан ремонт'},
        euro: {label: 'Евроремонт'},
        designer: {label: 'Дизайнерский ремонт'},
        need: {label: 'Требуется ремонт'},
        other: {label: 'Другое'}
    };

    public static bathroomOptions = {
        no: {label: 'Нет'},
        splited: {label: 'Раздельный'},
        combined: {label: 'Совмещенный'},
        other: {label: 'Другое'}
    };

    public static sourceOptions = {
        internet: {label: 'Интернет площадки'},
        print: {label: 'Печатные издания'},
        social: {label: 'Социальные сети'},
        messengers: {label: 'Мессенджеры'},
        email: {label: 'E-mail-рассылка'},
        recommendations: {label: 'Рекомендации'}
    };

    public static landOption = {
        igs: {label: 'Земли сельскохозяйственного назначения'},
        garden: {label: 'Земли населённых пунктов'},
        prom_land: {label: 'Земли промышленного назначения'},
        farm_comn: {label: 'Земли охраняемых территорий'},
        garden_comn: {label: 'Земли лесного фонда'},
        wh_kand: {label: 'Земли водного фонда'},
        sh_land: {label: 'Земли запаса'}
    };

    public static sourceMediaOptions = {
        present_site: "Презент сайт",
        present_archive: "Презент архив",
        avito: "Авито",
        farpost: "Фарпост",
        cian: "Циан",
        irr: "Из рук в руки",
        mkv: "Мир квартир"
    };

    public static importSort = [
        // {class:'submenu', value: 'address', label: 'Адресу', items:  [
        //     {class: 'entry', value: 'ASC', label: 'По возрастанию'},
        //     {class: 'entry', value: 'DESC', label: 'По убыванию'}
        //   ]},
        {class:'submenu', value: 'addDate', label: 'Добавлено', items:  [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]},

        {class:'submenu', value: 'changeDate', label: 'Изменено' , items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]},

        {class:'submenu', value: 'ownerPrice', label: 'Цене', items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]}
    ];

  public static localSort = [
      // {class:'submenu', value: 'address', label: 'Адресу', items:  [
      //     {class: 'entry', value: 'ASC', label: 'По возрастанию'},
      //     {class: 'entry', value: 'DESC', label: 'По убыванию'}
      //   ]},
      {class:'submenu', value: 'requests', label: 'Заявкам', items:  [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'addDate', label: 'Добавлено', items:  [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'assignDate', label: 'Назначено', items:  [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'changeDate', label: 'Изменено' , items: [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'sourceMedia', label: 'Рейтингу', items: [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'ownerPrice', label: 'Цене', items: [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
      {class:'submenu', value: 'MLS', label: 'MLS', items: [
          {class: 'entry', value: 'ASC', label: 'По возрастанию'},
          {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]}
  ];


    public static getDigest(o: Offer) {
        let digest = [];

        digest.push('<strong>' + o.typeCode + '</strong>');
        if (o.roomsCount) digest.push(o.roomsCount + 'к');
        if (o.floor && o.floorsCount) {
            digest.push(o.floor + '/' + o.floorsCount + ' эт.');
        } else if (o.floor || o.floorsCount) {
            digest.push((o.floor || o.floorsCount) + ' эт.');
        }
        {
            let squares = [];
            if (o.squareTotal) squares.push(o.squareTotal);
            if (o.squareLiving) squares.push(o.squareLiving);
            if (o.squareKitchen) squares.push(o.squareKitchen);
            if (squares.length) digest.push(squares.join('/') + ' кв. м.');
        }
        digest.push('<br>');
        if (o.houseType) digest.push(o.houseType);
        if (o.roomScheme) digest.push(o.roomScheme);
        if (o.condition) digest.push(o.condition);
        if (o.balcony) digest.push(o.balcony);
        if (o.bathroom) digest.push(o.bathroom);
        if (o.squareLand) digest.push(o.squareLand + ' га');
        if (o.description) {
            digest.push(o.description);
        }
        digest.push('<br>');
        if (o.ownerPrice) digest.push('<span class="text-primary">' + o.ownerPrice + ' тыс. руб.' + '</span>');

        return digest.join(' ');
    }

    public static parseAddress(itm: string): AddressBlock{
        let addressBlock = new AddressBlock();
        let address: Array<string> = itm.split(',');
        for(let i=0; i< address.length; ++i)
            address[i] = address[i].trim();
        if(parseInt(address[1], 10) > 0) {
            if(address.length == 5){
                if(address[4].indexOf("Москва") != -1){
                    addressBlock.city = address[4];
                    addressBlock.admArea = address[2];
                }
                else if(address[3].indexOf("р-н") != -1){
                    addressBlock.region = address[4];
                    addressBlock.city = address[2];
                    addressBlock.admArea = address[3].split(" ")[0];
                } else{
                    addressBlock.region = address[4];
                    addressBlock.city = address[3];
                }
            } else if(address.length == 4 && address[3].indexOf("Санкт-Петербург") != -1){
                addressBlock.city = address[3].split(" ")[1];
            } else if(address.length == 4){
                addressBlock.region = address[3];
                addressBlock.city = address[2];
            }
            addressBlock.street = address[0];
            addressBlock.building = address[1];
        }
        else if(address.length == 4){
            if(address[3].indexOf("Москва") != -1){
                addressBlock.city = address[3];
                addressBlock.admArea = address[1];
            } else{
                addressBlock.region = address[3];
                addressBlock.city = address[1];
                if(address[2].indexOf("р-н") != -1)
                    addressBlock.admArea = address[2];
            }
            addressBlock.street = address[0];
        } else if(address.length == 3){
            if(address[1].indexOf("р-н") != -1){
                addressBlock.region = address[2];
                addressBlock.city = address[0];
                addressBlock.admArea = address[1];
            } else if(address[2].indexOf("Санкт-Петербург") != -1){
                addressBlock.city = address[2].split(" ")[1];
                addressBlock.street = address[0];
            }
            else{
                addressBlock.region = address[2];
                addressBlock.city = address[1];
                addressBlock.street = address[0];
            }
        }
        return addressBlock;
    }
}
