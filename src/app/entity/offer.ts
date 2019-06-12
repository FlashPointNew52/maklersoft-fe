import {GeoPoint} from "../class/geoPoint";
import {AddressBlock} from "../class/addressBlock";
import {ContractBlock} from "../class/contractBlock";
import {PhoneBlock} from "../class/phoneBlock";
import {EmailBlock} from "../class/emailBlock";
import {User} from "./user";
import {Person} from "./person";
import {Organisation} from "./organisation";
import {Rating} from "../class/rating";


export class Offer {

    id: number;                     //id
    import_id: number;             //id импорта
    accountId: number;              //id аккаунта

    stateCode: string;              //статус
    stageCode: string;              //стадия

    addressBlock: AddressBlock;     //блок адреса
    phoneBlock: PhoneBlock;
    emailBlock: EmailBlock;
    district: string;               //район
    poi: string;

    houseType: string;            //Материал дома
    roomScheme: string;           //Тип комнат
    condition: string;            //Состояние объекта
    bathroom: string;             //тип санузла

    roomsOfferCount: number;

    price: number;                  //цена
    ownerPrice: number;             //цена владельца
    agencyPrice: number;            //цена агентства
    leaseDepositL: number;
    comission: number;              //коммисия в рублях
    comissionPerc: number;           //коммисия в %

    description: string;            //дополнительное описание
    sourceMedia: string;            //Наименование источника
    sourceUrl: string;              //адрес источника

    addDate: number;                //дата добавления
    openDate: number;               //дата открытия
    changeDate: number;             //дата изменения
    assignDate: number;             //дата назначения
    deleteDate: number;             //дата удаления
    lastSeenDate: number;           //дата последнего просмотра

    multylisting: boolean;          //мультилистинг
    mlsPriceType: string;           //тип мультлистинга
    mlsPrice: number;               //цена мультилистинга

    agentId: number;                //id агента
    agent: User;                    //агент

    personId: number;               //id контакта
    person: Person;                 //контакт

    companyId: number;              //id контагента
    company: Organisation;          //контрагент

    location: GeoPoint;             //координаты

    photoUrl: string[];             //url фото
    docUrl: string[];               //url документов

    sourceCode: string;             //источник объекта

    offerTypeCode: string;          //Предложение (аренда/продажа)
    rentType: string;              //Тип Аренды
    categoryCode: string;           //категория недвижимости
    buildingType: string;           //тип дома
    buildingClass: string;          //тип недвижимости
    typeCode: string;               //тип объекта

    settlement: string;             //Наименование поселения
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

    landPurpose: string;            //назначение земель
    objectName: string;             //название объекта

    ceilingHeight: number;          //высота потолков
    contractBlock: ContractBlock;   //блок договора

    encumbrance: boolean;            //обременение
    mortgages: boolean;              //под ипотеку

    tag: string;                    //тэг

    mediatorCompany: string;      //информация продавца

    complete: boolean;              //укомплектована полностью
    living_room_furniture: boolean; //гостинная мебель
    kitchen_furniture: boolean;     //кухонная мебель
    couchette: boolean;             //спальное место
    bedding: boolean;               //постельные принадлежности
    dishes: boolean;                //посуда
    refrigerator: boolean;          //холодильник
    washer: boolean;                //стиральная машина
    microwave_oven: boolean;        //СВЧ печь
    air_conditioning: boolean;      //кондиционер
    dishwasher: boolean;            //Посудомойка
    tv: boolean;                    //телевизор

    with_animals: boolean;           //можно с животными
    with_children: boolean;          //можно с детьми
    can_smoke: boolean;              //можно курить
    activities: boolean;             //мероприятия

    prepayment: boolean;            //предоплата
    electrific_pay: boolean;        //плата за электричество
    water_pay: boolean;             //плата за воду
    gas_pay: boolean;               //плата за газ
    offerRef: number;
    // райтинги
    locRating: Rating;
    offerRaiting: Rating;

    constructor () {
        // set default vals
        this.stateCode = 'raw';
        this.stageCode = 'contact';
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
        this.contractBlock = new ContractBlock();
        this.addressBlock = new AddressBlock();
        this.phoneBlock = new PhoneBlock();
        this.emailBlock = new EmailBlock();
        this.locRating = new Rating();
        this.locRating.map = {'average' : 0};
        this.offerRaiting = new Rating();
        this.offerRaiting.map = {'average' : 0};
    }

    public static offerTypeCodeOptionsImport = [
        {value: 'sale', label: 'Продажа'},
        {value: 'rent', label: 'Аренда'}
    ];

    public static offerTypeCodeOptions = [
        {value: 'sale', label: 'Продажа'},
        {value: 'alternative', label: 'Альтернатива'},
        {value: 'exchange', label: 'Мена'},
        {value: 'rent', label: 'Аренда'}
    ];

    public static categoryOptions = [
        {value: 'rezidential', label: 'Жилая недвижимость'},
        {value: 'commersial', label: 'Коммерческая недвижимость'},
        {value: 'land', label: 'Земельный участок'}
    ];

    public static buildingTypeOptions = [
        {value: 'multisection_house', label: 'Многосекционный'},
        {value: 'singlesection_house', label: 'Односекционный'},
        {value: 'corridor_house', label: 'Коридорный'},
        {value: 'galary_house', label: 'Галерейный'},
        {value: 'lowrise_house', label: 'Малоэтажное жильё'},
        {value: 'agricultural_land', label: 'Земли сельхоз назначения'},
        {value: 'settlements_land', label: 'Земли населенных пунктов'},
        {value: 'gpurpose_place', label: 'Свободного назначения'},
        {value: 'market_place', label: 'Розничная торговля'},
        {value: 'office', label: 'Офисная'},
        {value: 'production_place', label: 'Индустриальная'}
    ];

    public static buildingClassOptions = [
        {value: 'elite', label: 'Элит класс'},
        {value: 'business', label: 'Бизнес класс'},
        {value: 'economy', label: 'Эконом класс'},
        {value: 'improved', label: 'Улучшенная'},
        {value: 'brezhnev', label: 'Брежневка'},
        {value: 'khrushchev', label: 'Хрущевка'},
        {value: 'stalin', label: 'Сталинка'},
        {value: 'old_fund', label: 'Старый фонд'},
        {value: 'small_apartm', label: 'Малосемейка'},
        {value: 'dormitory', label: 'Общежитие'},
        {value: 'gostinka', label: 'Гостинка'},
        {value: 'individual', label: 'Индивидуальная'},
        {value: 'single_house', label: 'Дом'},
        {value: 'cottage', label: 'Коттедж'},
        {value: 'dacha', label: 'Дача'},
        {value: 'townhouse', label: 'Таунхаус'},
        {value: 'duplex', label: 'Дуплекс'},
        {value: 'A', label: 'А'},
        {value: 'A+', label: 'А+'},
        {value: 'B', label: 'Б'},
        {value: 'B+', label: 'Б+'},
        {value: 'C', label: 'С'},
        {value: 'C+', label: 'С+'}
    ];

    public static typeCodeOptions = [
        {value: 'share', label: 'Доля'},
        {value: 'room', label: 'Комната'},
        {value: 'apartment', label: 'Квартира'},
        {value: 'house', label: 'Дом'},
        {value: 'cottage', label: 'Коттедж'},
        {value: 'dacha', label: 'Дача'},
        {value: 'townhouse', label: 'Таунхаус'},
        {value: 'duplex', label: 'Дуплекс'},
        {value: 'garden_land', label: 'Садовый земельный участок'},
        {value: 'cultivate_land', label: 'Огородный земельный участок'},
        {value: 'dacha_land', label: 'Дачный земельный участок'},
        {value: 'gpurpose_place', label: 'Свободного назначения'},
        {value: 'market_place', label: 'Розничная торговля'},
        {value: 'office', label: 'Офисная'},
        {value: 'production_place', label: 'Индустриальная'},
        {value: 'other', label: 'Другое'}
    ];

    public static buildindTypeByCategory = {
        'rezidential': [
            {value: 'multisection_house', label: 'Многосекционный'},
            {value: 'singlesection_house', label: 'Односекционный'},
            {value: 'corridor_house', label: 'Коридорный'},
            {value: 'galary_house', label: 'Галерейный'},
            {value: 'lowrise_house', label: 'Малоэтажное жильё'}
        ],
        'land': [
            {value: 'agricultural_land', label: 'Земли сельхоз назначения'},
            {value: 'settlements_land', label: 'Земли населенных пунктов'}
        ],
        'commersial': [
            {value: 'gpurpose_place', label: 'Свободного назначения'},
            {value: 'market_place', label: 'Розничная торговля'},
            {value: 'office', label: 'Офисная'},
            {value: 'production_place', label: 'Индустриальная'}
        ]
    };

    public static buildindClassByBuildingType = {
        'multisection_house': [
            {value: 'elite', label: 'Элит класс'},
            {value: 'business', label: 'Бизнес класс'},
            {value: 'economy', label: 'Эконом класс'},
            {value: 'improved', label: 'Улучшенная'},
            {value: 'brezhnev', label: 'Брежневка'},
            {value: 'khrushchev', label: 'Хрущевка'},
            {value: 'stalin', label: 'Сталинка'},
            {value: 'old_fund', label: 'Старый фонд'},
            {value: 'individual', label: 'Индивидуальная'}
        ],
        'singlesection_house': [
            {value: 'elite', label: 'Элит класс'},
            {value: 'business', label: 'Бизнес класс'},
            {value: 'economy', label: 'Эконом класс'},
            {value: 'improved', label: 'Улучшенная'},
            {value: 'brezhnev', label: 'Брежневка'},
            {value: 'individual', label: 'Индивидуальная'}
        ],
        'corridor_house': [
            {value: 'elite', label: 'Элит класс'},
            {value: 'business', label: 'Бизнес класс'},
            {value: 'economy', label: 'Эконом класс'},
            {value: 'improved', label: 'Улучшенная'},
            {value: 'small_apartm', label: 'Малосемейка'},
            {value: 'dormitory', label: 'Общежитие'},
            {value: 'gostinka', label: 'Гостинка'},
            {value: 'individual', label: 'Индивидуальная'}
        ],
        'galary_house': [
            {value: 'individual', label: 'Индивидуальная'}
        ],
        'lowrise_house': [
            {value: 'single_house', label: 'Дом'},
            {value: 'cottage', label: 'Коттедж'},
            {value: 'dacha', label: 'Дача'},
            {value: 'townhouse', label: 'Таунхаус'},
            {value: 'duplex', label: 'Дуплекс'}
        ],
        'agricultural_land': [],
        'settlements_land': [],
        'gpurpose_place': [
            {value: 'A', label: 'А'},
            {value: 'A+', label: 'А+'},
            {value: 'B', label: 'Б'},
            {value: 'B+', label: 'Б+'},
            {value: 'C', label: 'С'},
            {value: 'C+', label: 'С+'}
        ],
        'market_place': [
            {value: 'A', label: 'А'},
            {value: 'A+', label: 'А+'},
            {value: 'B', label: 'Б'},
            {value: 'B+', label: 'Б+'},
            {value: 'C', label: 'С'},
            {value: 'C+', label: 'С+'}
        ],
        'office': [
            {value: 'A', label: 'А'},
            {value: 'A+', label: 'А+'},
            {value: 'B', label: 'Б'},
            {value: 'B+', label: 'Б+'},
            {value: 'C', label: 'С'},
            {value: 'C+', label: 'С+'}
        ],
        'production_place': [
            {value: 'A', label: 'А'},
            {value: 'A+', label: 'А+'},
            {value: 'B', label: 'Б'},
            {value: 'B+', label: 'Б+'},
            {value: 'C', label: 'С'},
            {value: 'C+', label: 'С+'}
        ]
    };

    public static typeCodeByBuildingType = {
        'multisection_house': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'}
        ],
        'singlesection_house': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'}
        ],
        'corridor_house': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'}
        ],
        'galary_house': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'}
        ],
        'lowrise_house': [],
        'agricultural_land': [
            {value: 'garden_land', label: 'Садовый земельный участок'},
            {value: 'dacha_land', label: 'Дачный земельный участок'},
            {value: 'cultivate_land', label: 'Огородный земельный участок'}
        ],
        'settlements_land': [
            {value: 'garden_land', label: 'Садовый земельный участок'},
            {value: 'dacha_land', label: 'Дачный земельный участок'},
            {value: 'cultivate_land', label: 'Огородный земельный участок'}
        ],
        'gpurpose_place' : [ //свободного назначечение
            {value: 'hotel', label: 'Отель'},
            {value: 'restaurant', label: 'Ресторан'},
            {value: 'сafe', label: 'Кафе'},
            {value: 'sport_building', label: 'Спортивное сооружение'}
        ],
        'market_place' : [  //розничная торговля
            {value: 'shop', label: 'Магазин'},
            {value: 'shops_center', label: 'Торговый центр'},
            {value: 'shop_entertainment', label: 'Торгово-развлекательный комплекс'}
        ],
        'office': [        //Офисная
            {value: 'cabinet', label: 'Кабинет'},
            {value: 'office_space', label: 'Офисное помещение'},
            {value: 'office_building', label: 'Офисное здание'},
            {value: 'business_center', label: 'Бизнес-центр'}
        ],
        'production_place': [  //Индустриальная
            {value: 'manufacture_building', label: 'Производственное здание'},
            {value: 'warehouse_space', label: 'Складское помещение'},
            {value: 'industrial_enterprice', label: 'Промышленное предприятие'}
        ]
    };

    public static typeCodeByBuildingClass = {
        'duplex': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'},
            {value: 'duplex', label: 'Дуплекс'}
        ],
        'single_house':[
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'house', label: 'Дом'}
        ],
        'cottage': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'cottage', label: 'Коттедж'}
        ],
        'dacha': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'dacha', label: 'Дача'}
        ],
        'townhouse': [
            {value: 'share', label: 'Доля'},
            {value: 'room', label: 'Комната'},
            {value: 'apartment', label: 'Квартира'},
            {value: 'townhouse', label: 'Таунхаус'}
        ]
    };

    public static typeCodeOptionsHash = {
        'share': 'Доля',
        'room': 'Комната',
        'apartment' : 'Квартира',
        'house' : 'Дом',
        'cottage' : 'Коттедж',
        'dacha': 'Дача',
        'townhouse': 'Таунхаус',
        'duplex': 'Дуплекс',
        'garden_land' : 'Садовый земельный участок',
        'dacha_land' : 'Дачный земельный участок',
        'cultivate_land' : 'Огородный земельный участок',
        'hotel': 'Отель',
        'restaurant': 'Ресторан',
        'сafe': 'Кафе',
        'sport_building': 'Спортивное сооружение',
        'shop': 'Магазин',
        'shops_center': 'Торговый центр',
        'shop_entertainment': 'ТРК',
        'cabinet': 'Кабинет',
        'office_space': 'Офисное помещение',
        'office_building': 'Офисное здание',
        'business_center': 'Бизнес центр',
        'manufacture_building': 'Производственное здание',
        'warehouse_space': 'Складское помещение',
        'industrial_enterprice': 'Промышленное предприятие',
        'other' : 'Другое'
    };


    public static buildingTypeOptionsToCategory = {
        'multisection_house' : 'rezidential',
        'singlesection_house' : 'rezidential',
        'corridor_house' : 'rezidential',
        'galary_house' : 'rezidential',
        'townhouse': 'rezidential',
        'duplex': 'rezidential',
        'ihc': 'rezidential',
        'agricultural_land': 'land',
        'settlements_land': 'land',
        'gpurpose_place': 'commersial',
        'market_place': 'commersial',
        'office': 'commersial',
        'production_place': 'commersial'
    };

    public static typeCodeOptionsToBuilding = {
        'share' : 'multisection_house',
        'room' : 'multisection_house',
        'apartment': 'multisection_house',
        'house': 'ihc',
        'cottage': 'ihc',
        'dacha': 'ihc',
        'duplex': 'duplex',
        'townhouse': 'townhouse',
        'garden_land': 'agricultural_land',
        'dacha_land': 'agricultural_land',
        'cultivate_land': 'agricultural_land',
        'hotel': 'gpurpose_place',
        'restaurant': 'gpurpose_place',
        'сafe': 'gpurpose_place',
        'sport_building': 'gpurpose_place',
        'shop': 'market_place',
        'shops_center': 'market_place',
        'shop_entertainment': 'market_place',
        'cabinet': 'office',
        'office_space': 'office',
        'office_building': 'office',
        'business_center': 'office',
        'manufacture_building': 'production_place',
        'warehouse_space': 'production_place',
        'industrial_enterprice': 'production_place',
        'other': 'social_place'
    };

    public static stateCodeOptions = [
        {value: 'all', label: 'Всё'},
        {value: 'raw', label: 'Не активно'},
        {value: 'active', label: 'Активно'},
        {value: 'listing', label: 'Листинг'},
        {value: 'deal', label: 'Сделка'},
        {value: 'suspended', label: 'Приостановлено'},
        {value: 'archive', label: 'Архив'}
    ];

    public static objectStageOptions = [
        {value: 'project', label: 'Проект'},
        {value: 'building', label: 'Строящийся'},
        {value: 'ready', label: 'Сдан'}
    ];

    public static houseTypeOptions = [
        {value: 'brick', label: 'Кирпичный'},
        {value: 'panel', label: 'Панель'},
        {value: 'monolithic', label: 'Монолит'},
        {value: 'monolithic_brick', label: 'Кирпично-монолитный'},
        {value: 'wood', label: 'Деревянный'},
        {value: 'cinder block', label: 'Шлакоблочный'},
        {value: 'other', label: 'Другое'}
    ];

    public static roomSchemeOptions = [
        {value: 'separate', label: 'Раздельные'},
        {value: 'adjoining', label: 'Смежные'},
        {value: 'adjoin_separate', label: 'Смежно-раздельные'},
        {value: 'studio', label: 'Студия'},
        {value: 'free', label: 'Свободная'},
        {value: 'other', label: 'Другое'}
    ];

    public static conditionOptions = [
        {value: 'rough', label: 'После строителей'},
        {value: 'social', label: 'Социальный ремонт'},
        {value: 'repaired', label: 'Сделан ремонт'},
        {value: 'euro', label: 'Евроремонт'},
        {value: 'designer', label: 'Дизайнерский ремонт'},
        {value: 'need', label: 'Требуется ремонт'},
        {value: 'other', label: 'Другое'}
    ];

    public static bathroomOptions = [
        {value: "no", label: 'Нет'},
        {value: "splited", label: 'Раздельный'},
        {value: "combined", label: 'Совмещенный'},
        {value: 'other', label: 'Другое'}
    ];

    public static sourceOptions = [
        {value: 'internet', label: 'Интернет площадки'},
        {value: 'print', label: 'Печатные издания'},
        {value: 'social', label: 'Социальные сети'},
        {value: 'messengers', label: 'Мессенджеры'},
        {value: 'email', label: 'E-mail-рассылка'},
        {value: 'recommendations', label: 'Рекомендации'}
    ];

    public static landOption = [
        {value: 'igs', label: 'Земли сельскохозяйственного назначения'},
        {value: 'garden', label: 'Земли населённых пунктов'},
        {value: 'prom_land', label: 'Земли промышленного назначения'},
        {value: 'farm_comn', label: 'Земли охраняемых территорий'},
        {value: 'garden_comn', label: 'Земли лесного фонда'},
        {value: 'wh_kand', label: 'Земли водного фонда'},
        {value: 'sh_land', label: 'Земли запаса'}
    ];

    public static sourceMediaOptions = {
        "present_site" : "Презент сайт",
        "present_archive" : "Презент архив",
        "avito" : "Авито",
        "farpost" : "Фарпост",
        "cian" : "Циан",
        "irr": "Из рук в руки",
        "mkv": "Мир квартир"
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
            addressBlock.house = address[1];
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
