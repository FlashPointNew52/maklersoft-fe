import {Component, OnInit, AfterViewInit} from "@angular/core";

import {AnalysisService} from "../../service/analysis.service";
import {Tab} from "../../class/tab";
import {Offer} from "../../entity/offer";
import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {Utils} from "../../class/utils";
import {HubService} from "../../service/hub.service";
import {ConfigService} from "../../service/config.service";
import {UserService} from "../../service/user.service";
import {OrganisationService} from "../../service/organisation.service";
import {TaskService} from "../../service/task.service";
import {HistoryService} from "../../service/history.service";
import {OfferService} from "../../service/offer.service";
import {PersonService} from "../../service/person.service";
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";
import {Contact} from "../../entity/contact";
import {ObjectBlock} from "../../class/objectBlock";

@Component({
    selector: "tab-organisation",
    inputs: ["tab"],
    styles: [`
        .property_face {
            flex-wrap: wrap;
            align-content: flex-start;
            padding: 30px 0 30px 25px;
            justify-content: flex-start;
        }

        .property_face ui-tag {
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }

        .property_face > .photo {
            width: 60px;
            height: 60px;
            margin: 0 20px 0 0;
            background: #f8f8f8 url(/assets/photo.png) center;
            background-size: cover;
        }

        .property_face > .last_name {
            font-size: 16px;
            text-transform: uppercase;
            height: 16px;
            line-height: 16px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .property_face > .first_name {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
        }

        .edit_ready {
            height: 12px;
            margin-top: 15px;
            padding-right: 24px;
        }

        ui-tabs-menu {
            margin-top: -10px;
        }

        .work-area {
            float: right;
            height: calc(100vh - 115px);
            width: calc(100vw - 400px);
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: start;
        }

        .rating_block {
            height: 235px;
            overflow: hidden;
            width: 45%;
            border: 1px solid #bdc0c1;
            border-top: 0;
            border-left: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: start;
            justify-content: space-between;
        }

        .comment_block {
            height: calc(100% - 236px);
            overflow: auto;
            width: 45%;
            border-right: 1px solid #bdc0c1;
        }

        .graf_block {
            width: 55%;
            height: 100%;
        }

        .graf_block .graf1 {
            width: 100%;
            height: 235px;
            border-bottom: 1px solid #bdc0c1;
        }

        .graf_block .graf2, .graf_block .graf3 {
            width: 100%;
            height: calc(50% - 117px);
            border-bottom: 1px solid #bdc0c1;
        }

        .position{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            height: 13px;
        }
    `],
    template: `
        <div class="property_face">
            <ui-tag [value]="organisation.tag"></ui-tag>
            <div class="photo" [style.background-image]="organisation?.photoMini ? 'url('+ organisation?.photoMini +')' : null">
                <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile)="addFile($event)"
                                (progressState)="displayProgress($event)" [obj_type]="'users'">
                </ui-upload-file>
            </div>
            <div class="city">{{organisation?.addressBlock?.city || "Город не указано"}}</div>
            <div class="street">{{organisation?.addressBlock?.street || "Улица не указана"}} {{organisation?.addressBlock?.building}}</div>
            <div class="last_name">{{organisation?.name || "Неизвестно"}}</div>
            <div class="first_name">{{utils.getFirstName(organisation.name) || "Неизвестно"}}</div>
            <div class="position">{{organisation.isMiddleman ? "Посредник" : "Принципал"}}</div>
            <div class="position">{{conClass.typeCodeOptions[organisation.typeCode]?.label}}</div>
        </div>
        <hr class='underline'>
        <hr class='underline progress_bar'
            [ngStyle]="{'width': progressWidth + 'vw', 'transition': progressWidth > 0 ? 'all 2s ease 0s' : 'all 0s ease 0s'}">
        <div class="pane">
            <div class="edit_ready">
                <span class="link" *ngIf="!editEnabled && canEditable" style="z-index: 99;" (click)="toggleEdit()">Изменить</span>
                <span class="link" *ngIf="editEnabled && canEditable" (click)="save()">Готово</span>
                <div *ngIf="!canEditable" class="pointer_menu" (click)="contextMenu($event)">...</div>
            </div>
            <ui-tabs-menu>
                <ui-tab [title]="'ГЛАВНАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Дата создания</span>
                            <span class="view-value">{{ utils.getDateInCalendar(organisation.addDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Дата изменения</span>
                            <span class="view-value">{{ utils.getDateInCalendar(organisation.changeDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Название организации</span>
                            <span class="view-value link">{{ organisation.name}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.main">
                            <span>Основной телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.cellphone">
                            <span>Основной телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.home">
                            <span>Основной телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.office">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.fax">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.other">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + organisation?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.phoneBlock?.ip">
                            <span>IP телефон</span>
                            <span class="view-value link">{{ organisation?.phoneBlock?.ip}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.messengerBlock?.whatsapp">
                            <span>WhatsApp</span>
                            <span class="view-value link">{{ organisation?.messengerBlock?.whatsapp}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.messengerBlock?.viber">
                            <span>Viber</span>
                            <span class="view-value link">{{ organisation?.messengerBlock?.viber}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.messengerBlock?.telegram">
                            <span>Telegram</span>
                            <span class="view-value link">{{ organisation?.messengerBlock?.telegram}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.emailBlock?.main">
                            <span>Основной Email</span>
                            <span class="view-value link">{{ organisation?.emailBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.emailBlock?.work">
                            <span>Рабочий Email</span>
                            <span class="view-value link">{{ organisation?.emailBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.emailBlock?.other">
                            <span>Другой Email</span>
                            <span class="view-value link">{{ organisation?.emailBlock?.other}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.siteBlock?.main">
                            <span>Основной Web-сайт</span>
                            <span class="view-value link">{{ organisation?.siteBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.siteBlock?.work">
                            <span>Рабочий Web-сайт</span>
                            <span class="view-value link">{{ organisation?.siteBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation?.siteBlock?.other">
                            <span>Другой Web-сайт</span>
                            <span class="view-value link">{{ organisation?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Соцсети</span>
                            <view-social [block]="organisation?.socialBlock"></view-social>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.region">
                            <span>Регион</span>
                            <span class="view-value">{{organisation.addressBlock?.region}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.city">
                            <span>Населённый пункт</span>
                            <span class="view-value">{{organisation.addressBlock?.city}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.admArea">
                            <span>Административный район</span>
                            <span class="view-value">{{organisation.addressBlock?.admArea}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.area">
                            <span>Микрорайон</span>
                            <span class="view-value">{{organisation.addressBlock?.area}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.street">
                            <span>Улица</span>
                            <span class="view-value">{{organisation.addressBlock?.street}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.building">
                            <span>Дом</span>
                            <span class="view-value">{{organisation.addressBlock?.building}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.apartment">
                            <span>Офис</span>
                            <span class="view-value">{{organisation.addressBlock?.apartment}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.station">
                            <span>Станция</span>
                            <span class="view-value">{{organisation.addressBlock?.station}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.addressBlock?.busStop">
                            <span>Остановка</span>
                            <span class="view-value">{{organisation.addressBlock?.busStop}}</span>
                        </div>
                        <div class="show_block">
                            <span>Источник</span>
                            <span
                                class="view-value">{{ canEditable ? conClass.sourceCodeOptions[organisation?.sourceCode]?.label : "Общая база"}}</span>
                        </div>
                        <ng-container *ngIf="!organisation.ourCompany">
                            <div class="show_block">
                                <span>Статус</span>
                                <span class="view-value">{{ organisation?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                            </div>
                            <div class="show_block" *ngIf="organisation.ourCompany">
                                <span>Тип контрагента</span>
                                <span class="view-value">{{ conClass.typeCodeOptions[organisation?.typeCode]?.label }}</span>
                            </div>

                        </ng-container>
                        <ng-container *ngIf="organisation.ourCompany">
                            <div class="show_block">
                                <span>Тип контрагента</span>
                                <span class="view-value">Наша компания</span>
                            </div>
                        </ng-container>


                        <div class="show_block">
                            <span>Тип организации</span>
                            <span class="view-value">{{ conClass.typeCodeOptions[organisation?.typeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Форма управления</span>
                            <span class="view-value">{{ orgClass.goverTypeOptions[organisation?.goverType]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="organisation.goverType != 'franchise' && organisation.goverType != 'main'">
                            <span>Основной офис</span>
                            <span class="view-value" [class.link]="organisation?.main_office?.id" (click)="openOrganisation()">
                                {{organisation?.main_office?.name }}
                            </span>
                        </div>
                        <div class="show_block">
                            <span>Лояльность</span>
                            <span class="view-value">{{ conClass.loyaltyOptions[organisation?.loyalty]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия</span>
                            <span class="view-value">{{ conClass.stageCodeOptions[organisation?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="canEditable">
                            <span>Ответственный</span>
                            <span class="view-value" [class.link]="organisation.agentId"
                                  (click)="openUser()">{{ organisation.agent?.name}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(organisation.contractBlock)?.length == 0">
                            <div class="show_block">
                                <span>Договор</span>
                                <span class="view-value">Нет</span>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="block.getAsArray(organisation.contractBlock)?.length > 0">
                            <div class="show_block" *ngIf="organisation?.contractBlock?.number">
                                <span>Номер договора</span>
                                <span class="view-value">{{ organisation.contractBlock?.number}}</span>
                            </div>
                            <div class="show_block" *ngIf="organisation?.contractBlock?.begin || organisation.contractBlock?.end">
                                <span>Действие договора</span>
                                <span class="view-value">{{ organisation.contractBlock?.begin}}
                                    -{{organisation.contractBlock?.end}}</span>
                            </div>
                            <div class="show_block" *ngIf="organisation?.contractBlock?.continued">
                                <span>Договор продлён</span>
                                <span class="view-value">{{ organisation.contractBlock?.continued}}</span>
                            </div>
                            <div class="show_block" *ngIf="organisation?.contractBlock?.terminated">
                                <span>Договор расторгнут</span>
                                <span class="view-value">{{ organisation.contractBlock?.terminated}}</span>
                            </div>
                        </ng-container>
                        <div class="show_block">
                            <span>Контактное лицо</span>
                            <span class="view-value" [class.link]="organisation.contact?.id || organisation.agent?.id" (click)="openPerson(organisation.contact || null)">
                                {{organisation.contact?.name || organisation.agent?.name || 'Не указано'}}
                            </span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'Название организации'" [value]="organisation?.name" (newValue)="organisation.name = $event"></input-line>
                        <multiselect-menu
                            [name]="'Телефон'" [block]="organisation?.phoneBlock" [addName]="'Добавить телефон'"
                            [params]="{ 'main': {label: 'Основной', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'cellphone' : {label: 'Основной', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'office': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'fax': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'ip': {label: 'IP телефон', placeholder: 'Телефон'},
                                    'home': {label: 'Основной', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'other': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                }"
                            (newData)="findContact($event)"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Мессенджеры'" [block]="organisation?.messengerBlock" [addName]="'Добавить мессенджер'"
                            [params]="{ 'whatsapp': {label: 'WhatsApp', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'viber' : {label: 'Viber', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'telegram': {label: 'Telegram', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                }"
                            (newData)="organisation.messengerBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'E-mail'" [block]="organisation?.emailBlock" [addName]="'Добавить email'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'E-mail'},
                                    'work' : {label: 'Рабочий', placeholder: 'E-mail'},
                                    'other': {label: 'Другой', placeholder: 'E-mail'}
                                }"
                            (newData)="organisation.emailBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Web-сайт'" [block]="organisation?.siteBlock" [addName]="'Добавить сайт'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'Сайт'},
                                    'work' : {label: 'Рабочий', placeholder: 'Сайт'},
                                    'other': {label: 'Другой', placeholder: 'Сайт'}
                                }"
                            (newData)="organisation.siteBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Соцсети'" [block]="organisation?.socialBlock" [addName]="'Добавить соцсеть'"
                            [params]="{ 'vk': {label: 'Вконтакте', placeholder: 'Адрес страницы'},
                                    'ok' : {label: 'Одноклассники', placeholder: 'Адрес страницы'},
                                    'facebook': {label: 'Facebook', placeholder: 'Адрес страницы'},
                                    'instagram': {label: 'Instagram', placeholder: 'Адрес страницы'},
                                    'twitter': {label: 'Twitter', placeholder: 'Адрес страницы'}
                                }"
                            (newData)="organisation.socialBlock = $event"
                        ></multiselect-menu>
                        <address-input [block]="organisation?.addressBlock" [addressType]="'apartment'" [name]="'Адрес'"
                                       (newData)="organisation.addressBlock = $event.address"
                        ></address-input>
                        <sliding-menu [name]="'Источник'" [options]="conClass.sourceCodeOptions"
                                      [value]="organisation?.sourceCode"
                                      (result)="organisation.sourceCode = $event"
                        ></sliding-menu>
                        <sliding-menu *ngIf="!organisation.ourCompany"
                                      [name]="'Статус'" [options]="conClass.middlemanOptions"
                                      [value]="organisation.isMiddleman ? 'middleman' : 'owner'"
                                      (result)="organisation.isMiddleman = $event == 'middleman'"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип организации'" [options]="conClass.typeCodeOptions"
                                      [value]="organisation?.typeCode"
                                      (result)="organisation.typeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Форма управления'" [options]="orgClass.goverTypeOptions"
                                      [value]="organisation?.goverType"
                                      (result)="organisation.goverType = $event"
                        ></sliding-menu>
                        <sliding-menu *ngIf="organisation.goverType != 'franchise' && organisation.goverType != 'main'"
                                      [name]="'Основной офис'" [options]="{}"
                                      [value]="organisation?.main_office?.name"
                                      (result)="organisation.main_office = $event; checkOur($event);"
                        ></sliding-menu>
                        
                        <sliding-menu [name]="'Лояльность'" [options]="conClass.loyaltyOptions"
                                      [value]="organisation?.loyalty"
                                      (result)="organisation.loyalty = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия'" [options]="conClass.stageCodeOptions"
                                      [value]="organisation?.stageCode"
                                      (result)="organisation.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Ответственный'" [options]="agentOpts"
                                      [value]="organisation?.agentId"
                                      (result)="agentChanged($event)"
                        ></sliding-menu>
                        <multiselect-menu
                            [name]="'Договор'" [block]="organisation?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                    'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                    'end': {label: 'Дата конца', placeholder: 'Дата'},
                                    'continued': {label: 'Продлен', placeholder: 'Продление'},
                                    'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                }"
                            (newData)="organisation.contractBlock = $event"
                        ></multiselect-menu>
<!--                            <li>-->
<!--                                <ui-input-line [placeholder]="'Контактное лицо'"-->
<!--                                               [value]="organisation?.contact?.name || organisation?.agent?.name || 'Не указано'"-->
<!--                                               (onChange)="organisation.ourCompany ? organisation.agent = $event : organisation.contact = $event "-->
<!--                                               [queryTipe]="organisation.ourCompany ? 'user' :'person'"-->
<!--                                >-->
<!--                                </ui-input-line>-->
<!--                            </li>-->
                        <sliding-tag [value]="organisation?.tag" (newValue)="organisation.tag = $event"></sliding-tag>
                    </ng-container>
                    <input-area [name]="'Дополнительно'" [value]="organisation?.description" [disabled]="!editEnabled"
                                (newValue)="organisation.description = $event" [update]="update"></input-area>
                </ui-tab>
                <ui-tab [title]="'ФИЛИАЛЫ'">
                </ui-tab>
            </ui-tabs-menu>
        </div>
        


        <div class="work-area">
            <div class="rating_block">
                <rating-view [obj]="organisation" [type]="canEditable == true ? 'person' : 'user'"></rating-view>
            </div>
            <div class="comment_block">
                <comments-view [obj]="organisation" [type]="canEditable == true ? 'person' : 'user'"></comments-view>
            </div>
        </div>
    `
})

export class TabOrganisationComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    public organisation: Organisation;
    canEditable: boolean = true;

    progressWidth: number = 0;

    conClass = Contact;
    orgClass = Organisation;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;

    offers: Offer[];

    agentOpts: any[] = [];

    editEnabled: boolean = false;

    constructor(private _hubService: HubService,
                private _configService: ConfigService,
                private _userService: UserService,
                private _offerService: OfferService,
                private _taskService: TaskService,
                private _analysisService: AnalysisService,
                private _historyService: HistoryService,
                private _personService: PersonService,
                private _organisationService: OrganisationService,
                private _sessionService: SessionService
    ) {
        this.agentOpts = this.agentOpts.concat(_userService.cacheUsers);
    }

    ngOnInit() {
        this.organisation = this.tab.args.organisation;
        this.canEditable = this.tab.args.canEditable;
        if (this.organisation.id && this.organisation.accountId == this._sessionService.getUser().accountId && this.canEditable) {
            this._organisationService.get(this.organisation.id).subscribe(org => {
                this.organisation = org;
            });
        }

        if (!this.organisation.main_office && this.organisation.main_office_id != null) {
            this._organisationService.get(this.organisation.main_office_id).subscribe(org => {
                this.organisation.main_office = org;
            });
        }
        /*if (!this.organisation.id || this.organisation.id == null) {
            this.toggleEdit();
        }*/
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.organisation.id) {
                this.tab.header = "Контрагент";
            } else {
                this.tab.header = "Новый контрагент";
            }
        });
    }


    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    save() {
        if (this.organisation.ourCompany) {
            delete this.organisation.contact;
            delete this.organisation.contactId;
            this.organisation.agentId = this.organisation.agent.id || null;
        } else {
            delete this.organisation.agent;
            delete this.organisation.agentId;
            this.organisation.contactId = this.organisation.contact ? this.organisation.contact.id : null;
        }

        if (!this.organisation.main_office || !this.organisation.main_office.id)
            this.organisation.main_office = null;
        this.organisation.main_office_id = null;

        this._organisationService.save(this.organisation).subscribe(org => {
            setTimeout(() => {
                this.organisation = org;
            });
            this.toggleEdit();
        });
    }

    agentChanged(e) {
        /*if (e.selected.value != null) {
            this._userService.get(e.selected.value).subscribe(agent => {
                this.organisation.agent = agent;
            });
        }*/
    }

    addFile(event){
        this.organisation.photo = event[0].href;
        this.organisation.photoMini = event[0].href;
    }

    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 1300);
    }


    openOrganisation() {
        if (this.organisation.main_office_id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("organisation", {organisation: this.organisation.main_office});
        }
    }

    openUser() {
        /*if(this.organisation.agent.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.organisation.agent});
        }*/
    }

    openPerson(person: Person) {
        if (person.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("person", {person});
        }
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let uOpt = [];

        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: "Проверить", callback: () => {
                        //this.openPopup = {visible: true, task: "check"};
                    }
                },
                {
                    class: "entry",
                    disabled: this.organisation.orgRef,
                    icon: "",
                    label: "Добавить в контрагенты",
                    callback: () => {
                        this.clickContextMenu({event: "add_to_local"});
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: []
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: []
                },
                {class: "delimiter"},
                {
                    class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
                        {class: "entry", disabled: false, label: "Email1"},
                        {class: "entry", disabled: false, label: "Email2"},
                        {class: "entry", disabled: false, label: "Email3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                        {class: "entry", disabled: false, label: "Номер1"},
                        {class: "entry", disabled: false, label: "Номер2"},
                        {class: "entry", disabled: false, label: "Номер3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Позвонить", items: [
                        {class: "entry", disabled: false, label: "Номер1"},
                        {class: "entry", disabled: false, label: "Номер2"},
                        {class: "entry", disabled: false, label: "Номер3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Написать в чат", items: []
                }
            ]
        };
        this._hubService.shared_var["cm"] = menu;
        this._hubService.shared_var["cm_hidden"] = false;
    }

    clickContextMenu(evt: any) {
        if (evt.event == "add_to_local") {
            this.organisation.changeDate = Math.round((Date.now() / 1000));
            this.organisation.addDate = this.organisation.changeDate;
            this.organisation.stateCode = "raw";
            this.organisation.typeCode = "realtor";
            this.organisation.id = null;
            this._organisationService.save(this.organisation);
        } else if (evt.event == "del_obj") {

        } else if (evt.event == "check") {

        }
    }

    checkOur(company: Organisation) {
        if(company != null &&
            (company.isAccount && company.id == this._sessionService.getUser().accountId
                || company.ourCompany && company.accountId == this._sessionService.getUser().accountId
            )
        )
            this.organisation.ourCompany = true;
        else this.organisation.ourCompany = false;
    }

    public findContact(event) {
        this.utilsObj.findContact(event, this.organisation).subscribe(data => {
            if (data.id) this._hubService.getProperty("modal-window").showMessage("Контакт с таким номером телефона уже существует");
        });
    }
}
