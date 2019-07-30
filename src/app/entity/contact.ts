import {AddressBlock} from "../class/addressBlock";
import {EmailBlock} from "../class/emailBlock";
import {SiteBlock} from "../class/siteBlock";
import {PhoneBlock} from "../class/phoneBlock";
import {SocialBlock} from "../class/socialBlock";
import {MessengerBlock} from "../class/messengerBlock";
import {Organisation} from "./organisation";
import {User} from "./user";
import {ContractBlock} from "../class/contractBlock";

export class Contact {
    id: number;
    accountId: number;
    name: string;
    description: string;
    addDate: number;
    changeDate: number;
    assignDate: number;
    archiveDate: number;
    addressBlock: AddressBlock;
    phoneBlock: PhoneBlock;
    emailBlock: EmailBlock;
    siteBlock: SiteBlock;
    socialBlock: SocialBlock;
    messengerBlock: MessengerBlock;
    contractBlock: ContractBlock;
    agentId: number;
    agent: User;
    organisationId: number;
    organisation: Organisation;
    typeCode: string;
    stateCode: string;
    stageCode: string;
    loyalty: string;
    tag: string;
    rate: number;
    sourceCode: number;

    isMiddleman: boolean;
    type: string;

    constructor (name?) {
        //this.agent = new User();
        this.type = "person";
        this.addressBlock = new AddressBlock();
        this.phoneBlock = new PhoneBlock();
        this.emailBlock = new EmailBlock();
        this.siteBlock = new SiteBlock();
        this.socialBlock = new SocialBlock();
        this.messengerBlock = new MessengerBlock();
        this.contractBlock = new ContractBlock();
        if(name){
            this.name = name;
        }
        this.loyalty = "undefined";
        this.typeCode = "unknown";
        this.stageCode = "potential";
    }

    public static typeOptions = {
        person: {label: 'Контакт', items: []},
        organisation: {label: 'Организация', items: []}
    };

    public static middlemanOptions = {
        owner: {label: 'Принципал', items: []},
        middleman: {label: 'Посредник', items: []}
    };

    public static sourceCodeOptions = {
        'internet': {label: 'Интернет площадки'},
        'print': {label: 'Печатные издания'},
        'social': {label: 'Социальные сети'},
        'messengers': {label: 'Мессенджеры'},
        'email': {label: 'E-mail-рассылка'},
        'recommendations': {label: 'Рекомендации'},
        'other': {label: 'Другое'}
    };

    public static loyaltyOptions = {
        undefined: {label: 'Не определено', items: []},
        unacceptable: {label: 'Неприемлемо', items: []},
        neutral: {label: 'Нейтрально', items: []},
        reasonably: {label: 'Разумно', items: []},
        standard: {label: 'Стандартно', items: []}
    };

    public static typeCodeOptions = {
      unknown: {label: 'Не определено', items: []},
      client: {label: 'Клиент', items: []},
      partner: {label: 'Партнер', items: []},
      competitor: {label: 'Конкурент', items: []}
    };

    public static stageCodeOptions = {
        potential: {label: 'Потенциальный клиент', items: []},
        new: {label: 'Новый клиент', items: []},
        permanent: {label: 'Постоянный клиент', items: []},
        lost: {label: 'Потерянный клиент', items: []},
        recycled: {label: 'Восстановленный клиент', items: []}
    };

    public static allSort = [
        {class:'submenu', value: 'addDate', label: 'Добавлено', items:  [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]},

        {class:'submenu', value: 'changeDate', label: 'Изменено' , items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]},

        {class:'submenu', value: 'ownerPrice', label: 'Рейтингу', items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]}
    ];

    public static localSort = [
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
        {class:'submenu', value: 'rate', label: 'Рейтингу', items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
          ]}
    ];

}
