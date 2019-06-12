import {Person} from "./person";
import {Contact} from "./contact";

export class Organisation extends Contact{
    isMiddleman: boolean;

    contact: Person;
    contactId: number;

    stateCode: string;
    goverType: string;
    main_office: Organisation;
    main_office_id: number;
    isAccount: boolean;
    ourCompany: boolean;
    orgRef: number;


    public Organisation (name?) {
        Contact.apply(this, arguments);
        this.stateCode = "undefined";
        this.typeCode = "unknown";
        this.isMiddleman = false;
    }

    public copyFields(org: Organisation){

        this.id = org.id;
        this.accountId = org.accountId;
        this.name = org.name;
        this.description = org.description;
        this.addDate = org.addDate;
        this.changeDate = org.changeDate;
        this.typeCode = org.typeCode;
        this.addressBlock = org.addressBlock;
        this.phoneBlock = org.phoneBlock;
        this.emailBlock = org.emailBlock;
        this.siteBlock = org.siteBlock;
        this.contactId = org.contactId;
        this.stateCode = org.stateCode;
        this.sourceCode = org.sourceCode;
        this.agentId = org.agentId;
    }

    public static goverTypeOptions = [
        {value: 'main', label: 'Основной офис'},
        {value: 'filial', label: 'Филиал'},
        {value: 'subsidiary', label: 'Дочернее предприятие'},
        {value: 'franchise', label: 'Франшиза'}
    ];

    public static goverTypeOptionsHash = {
        main : 'Основной офис',
        filial: 'Филиал',
        subsidiary: 'Дочернее предприятие',
        franchise: 'Франшиза'
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
