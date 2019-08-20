import {Person} from "./person";
import {Contact} from "./contact";

export class Organisation extends Contact{
    isMiddleman: boolean;

    contact: Person;
    contactId: number;

    goverType: string;
    main_office: Organisation;
    main_office_id: number;
    isAccount: boolean;
    ourCompany: boolean;
    orgRef: number;


    public Organisation(name?) {
        Contact.apply(this, arguments);
        this.stateCode = "undefined";
        this.typeCode = "unknown";
        this.isMiddleman = false;
    }

    public static goverTypeOptions = {
        main: {label: 'Основной офис'},
        filial: {label: 'Филиал'},
        subsidiary: {label: 'Дочернее предприятие'},
        franchise: {label: 'Франшиза'}
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
