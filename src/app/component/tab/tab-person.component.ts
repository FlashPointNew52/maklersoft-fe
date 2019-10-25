import {Component, OnInit, AfterViewInit} from "@angular/core";
import {AnalysisService} from "../../service/analysis.service";
import {Tab} from "../../class/tab";
import {Offer} from "../../entity/offer";
import {Person} from "../../entity/person";
import {Request} from "../../entity/request";
import {Utils} from "../../class/utils";
import {HubService} from "../../service/hub.service";
import {ConfigService} from "../../service/config.service";
import {OfferService} from "../../service/offer.service";
import {RequestService} from "../../service/request.service";
import {TaskService} from "../../service/task.service";
import {HistoryService} from "../../service/history.service";
import {PersonService} from "../../service/person.service";
import {OrganisationService} from "../../service/organisation.service";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";
import {ObjectBlock} from "../../class/objectBlock";
import {Contact} from "../../entity/contact";

@Component({
    selector: "tab-person",
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


        ui-tabs-menu {
            margin-top: -10px;
        }

        .work-area {
            float: right;
            height: calc(100vh - 122px);
            width: 100vw;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: start;
            position: relative;
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

        .position {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            height: 13px;
        }
    `],
    template: `
        <div class="property_face">
            <ui-tag [value]="person.tag"></ui-tag>
            <div class="photo" [style.background-image]="person?.photoMini ? 'url('+ person?.photoMini +')' : null">
                <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile)="addFile($event)"
                                (progressState)="displayProgress($event)" [obj_type]="'users'">
                </ui-upload-file>
            </div>
            <div class="last_name">{{utils.getSurname(person.name) || "Неизвестно"}}</div>
            <div class="first_name">{{utils.getFirstName(person.name) || "Неизвестно"}}</div>
            <div class="position">{{person.isMiddleman ? "Посредник" : "Принципал"}}</div>
            <div class="position">{{conClass.typeCodeOptions[person.typeCode]?.label}}</div>
        </div>
        <hr class='underline'>
        <hr class='underline progress_bar'
            [ngStyle]="{'width': progressWidth + 'vw', 'transition': progressWidth > 0 ? 'all 2s ease 0s' : 'all 0s ease 0s'}">
        <div class="pane">
            <div class="edit_ready">
                <span class="link" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</span>
                <span class="link" *ngIf="editEnabled && canEditable" (click)="save()">Готово</span>
                <div *ngIf="!canEditable" class="pointer_menu" (click)="contextMenu($event)">...</div>
            </div>
            <ui-tabs-menu class="without_buttons">
                <ui-tab [title]="'ГЛАВНАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Дата создания</span>
                            <span class="view-value">{{ utils.getDateInCalendar(person.addDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Дата изменения</span>
                            <span class="view-value">{{ utils.getDateInCalendar(person.changeDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>ФИО</span>
                            <span class="view-value link">{{ person.name}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.main">
                            <span>Личный телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.cellphone">
                            <span>Личный телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.office">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.fax">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.home">
                            <span>Домашний телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.other">
                            <span>Другой телефон</span>
                            <span
                                class="view-value link">{{ "+7" + person?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.phoneBlock?.ip">
                            <span>Внутренний телефон</span>
                            <span class="view-value link">{{ person?.phoneBlock?.ip}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.messengerBlock?.whatsapp">
                            <span>WhatsApp</span>
                            <span class="view-value link">{{ person?.messengerBlock?.whatsapp}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.messengerBlock?.viber">
                            <span>Viber</span>
                            <span class="view-value link">{{ person?.messengerBlock?.viber}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.messengerBlock?.telegram">
                            <span>Telegram</span>
                            <span class="view-value link">{{ person?.messengerBlock?.telegram}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.emailBlock?.main">
                            <span>Основной Email</span>
                            <span class="view-value link">{{ person?.emailBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.emailBlock?.work">
                            <span>Рабочий Email</span>
                            <span class="view-value link">{{ person?.emailBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.emailBlock?.other">
                            <span>Другой Email</span>
                            <span class="view-value link">{{ person?.emailBlock?.other}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.siteBlock?.main">
                            <span>Основной Web-сайт</span>
                            <span class="view-value link">{{ person?.siteBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.siteBlock?.work">
                            <span>Рабочий Web-сайт</span>
                            <span class="view-value link">{{ person?.siteBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.siteBlock?.other">
                            <span>Другой Web-сайт</span>
                            <span class="view-value link">{{ person?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Соцсети</span>
                            <view-social [block]="person?.socialBlock"></view-social>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.region">
                            <span>Регион</span>
                            <span class="view-value">{{person.addressBlock?.region}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.city">
                            <span>Нас. пункт</span>
                            <span class="view-value">{{person.addressBlock?.city}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.admArea">
                            <span>Адм. район</span>
                            <span class="view-value">{{person.addressBlock?.admArea}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.area">
                            <span>Микрорайон</span>
                            <span class="view-value">{{person.addressBlock?.area}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.street">
                            <span>Улица</span>
                            <span class="view-value">{{person.addressBlock?.street}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.building">
                            <span>Дом</span>
                            <span class="view-value">{{person.addressBlock?.building}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.apartment">
                            <span>Квартира</span>
                            <span class="view-value">{{person.addressBlock?.apartment}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.station">
                            <span>Станция</span>
                            <span class="view-value">{{person.addressBlock?.station}}</span>
                        </div>
                        <div class="show_block" *ngIf="person.addressBlock?.busStop">
                            <span>Остановка</span>
                            <span class="view-value">{{person.addressBlock?.busStop}}</span>
                        </div>
                        <div class="show_block">
                            <span>Источник</span>
                            <span
                                class="view-value">{{ canEditable ? conClass.sourceCodeOptions[person?.sourceCode]?.label : "Общая база"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Статус</span>
                            <span class="view-value">{{ person?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                        </div>
                        <div class="show_block" *ngIf="person?.isMiddleman">
                            <span>Организация</span>
                            <span class="view-value" [class.link]="person.organisation?.id"  (click)="openOrganisation()">
                                {{ person.organisation?.name || 'Неизвестно'}}
                            </span>
                        </div>
                        <div class="show_block">
                            <span>Тип контакта</span>
                            <span class="view-value">{{ conClass.typeCodeOptions[person?.typeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Лояльность</span>
                            <span class="view-value">{{ conClass.loyaltyOptions[person?.loyalty]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия контакта</span>
                            <span class="view-value">{{ conClass.stageCodeOptions[person?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="canEditable">
                            <span>Ответственный</span>
                            <span class="view-value" [class.link]="person.agentId"
                                  (click)="openUser()">{{ person.agent?.name || 'Не назначено'}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(person.contractBlock)?.length == 0">
                            <div class="show_block">
                                <span>Договор</span>
                                <span class="view-value">Нет</span>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="block.getAsArray(person.contractBlock)?.length > 0">
                            <div class="show_block" *ngIf="person?.contractBlock?.number">
                                <span>Номер договора</span>
                                <span class="view-value">{{ person.contractBlock?.number}}</span>
                            </div>
                            <div class="show_block" *ngIf="person?.contractBlock?.begin || person.contractBlock?.end">
                                <span>Действие договора</span>
                                <span class="view-value">{{ person.contractBlock?.begin}}
                                    -{{person.contractBlock?.end}}</span>
                            </div>
                            <div class="show_block" *ngIf="person?.contractBlock?.continued">
                                <span>Договор продлён</span>
                                <span class="view-value">{{ person.contractBlock?.continued}}</span>
                            </div>
                            <div class="show_block" *ngIf="person?.contractBlock?.terminated">
                                <span>Договор расторгнут</span>
                                <span class="view-value">{{ person.contractBlock?.terminated}}</span>
                            </div>
                        </ng-container>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'ФИО'" [value]="person?.name" (newValue)="person.name = $event"></input-line>
                        <multiselect-menu
                            [name]="'Телефон'" [block]="person?.phoneBlock" [addName]="'Добавить телефон'"
                            [params]="{ 'main': {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'cellphone' : {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'office': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'fax': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'ip': {label: 'Внутренний', placeholder: 'Телефон'},
                                    'home': {label: 'Домашний', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'other': {label: 'Другой', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                }"
                            (newData)="findContact($event)"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Мессенджеры'" [block]="person?.messengerBlock" [addName]="'Добавить мессенджер'"
                            [params]="{ 'whatsapp': {label: 'WhatsApp', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'viber' : {label: 'Viber', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'telegram': {label: 'Telegram', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                }"
                            (newData)="person.messengerBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'E-mail'" [block]="person?.emailBlock" [addName]="'Добавить email'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'E-mail'},
                                    'work' : {label: 'Рабочий', placeholder: 'E-mail'},
                                    'other': {label: 'Другой', placeholder: 'E-mail'}
                                }"
                            (newData)="person.emailBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Web-сайт'" [block]="person?.siteBlock" [addName]="'Добавить сайт'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'Сайт'},
                                    'work' : {label: 'Рабочий', placeholder: 'Сайт'},
                                    'other': {label: 'Другой', placeholder: 'Сайт'}
                                }"
                            (newData)="person.siteBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Соцсети'" [block]="person?.socialBlock" [addName]="'Добавить соцсеть'"
                            [params]="{ 'vk': {label: 'Вконтакте', placeholder: 'Адрес страницы'},
                                    'ok' : {label: 'Одноклассники', placeholder: 'Адрес страницы'},
                                    'facebook': {label: 'Facebook', placeholder: 'Адрес страницы'},
                                    'instagram': {label: 'Instagram', placeholder: 'Адрес страницы'},
                                    'twitter': {label: 'Twitter', placeholder: 'Адрес страницы'}
                                }"
                            (newData)="person.socialBlock = $event"
                        ></multiselect-menu>
                        <address-input [block]="person?.addressBlock" [addressType]="'apartment'" [name]="'Адрес'"
                                       (newData)="person.addressBlock = $event.address"
                        ></address-input>
                        <sliding-menu [name]="'Источник'" [options]="conClass.sourceCodeOptions"
                                      [value]="person?.sourceCode"
                                      (result)="person.sourceCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Статус'" [options]="conClass.middlemanOptions"
                                      [value]="person.isMiddleman ? 'middleman' : 'owner'"
                                      (result)="person.isMiddleman = $event == 'middleman'"
                        ></sliding-menu>
                        <input-line *ngIf="person.isMiddleman" [name]="'Организация'" [value]="person?.organisation?.name"
                                    [query]="{type: 'org', filter:{}}" (newValue)="person.organisation = $event"
                        ></input-line>
                        <sliding-menu [name]="'Тип контакта'" [options]="conClass.typeCodeOptions"
                                      [value]="person?.typeCode"
                                      (result)="person.typeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Лояльность'" [options]="conClass.loyaltyOptions"
                                      [value]="person?.loyalty"
                                      (result)="person.loyalty = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия контакта'" [options]="conClass.stageCodeOptions"
                                      [value]="person?.stageCode"
                                      (result)="person.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Ответственный'" [options]="agentOpts"
                                      [value]="person?.agentId || null"
                                      (result)="agentChanged($event)"
                        ></sliding-menu>
                        <multiselect-menu
                            [name]="'Договор'" [block]="person?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                    'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                    'end': {label: 'Дата конца', placeholder: 'Дата'},
                                    'continued': {label: 'Продлен', placeholder: 'Продление'},
                                    'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                }"
                            (newData)="person.contractBlock = $event"
                        ></multiselect-menu>
                        <sliding-tag [value]="person?.tag" (newValue)="person.tag = $event"></sliding-tag>
                    </ng-container>
                    <input-area [name]="'Дополнительно'" [value]="person?.description" [disabled]="!editEnabled"
                                (newValue)="person.description = $event" [update]="update"></input-area>
                </ui-tab>
                <ui-tab [title]="'ПРЕДЛОЖЕНИЯ'" (tabSelect)="listOffers()">
                    <digest-offer *ngFor="let off of offers; let i = index" [offer]="off"
                                    [class.selected]="selectedOffers.indexOf(off) > -1"
                                    (click)="selectedOffers = select($event, offers, selectedOffers, off, i)"
                                    (contextmenu)="selectedOffers = select($event, offers, selectedOffers, off, i)"
                                    (dblclick)="selectedOffers = select($event, offers, selectedOffers, off, i)"
                                    [active]="selectedOffers.indexOf(off) > -1"
                    ></digest-offer>
                </ui-tab>
                <ui-tab [title]="'ЗАЯВКИ'" (tabSelect)="listRequests()">
                    <digest-request *ngFor="let req of requests; let i = index" [request]="req"
                                    [class.selected]="selectedRequests.indexOf(req) > -1"
                                    (click)="selectedRequests = select($event, requests, selectedRequests, req, i)"
                                    (contextmenu)="selectedRequests = select($event, requests, selectedRequests, req, i)"
                                    (dblclick)="selectedOffers = select($event, requests, selectedRequests, req, i)"
                                    [active]="selectedRequests.indexOf(req) > -1"
                    ></digest-request>
                </ui-tab>
                <div more class="more" (click)="contextMenu($event);" (offClick)="this._hubService.shared_var['cm_hidden'] = true">ЕЩЁ...
<!--                    <div>-->
<!--                        <div class="delete" (click)="delete()">Удалить контакт</div>-->
<!--                    </div>-->
                </div>
            </ui-tabs-menu>
        </div>
        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <div class="rating_block" *ngSwitchCase="'rating'">
                    <rating-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></rating-view>
                </div>
                <div class="comment_block" *ngSwitchCase="'rating'">
                    <comments-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></comments-view>
                </div>
                <files-view *ngSwitchCase="'photo'" [files]="" [type]="'photo'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'photo')" (delete)="person.photos = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
                <files-view *ngSwitchCase="'doc'" [files]="person.documents" [type]="'doc'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'doc')" (delete)="person.documents = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
            </ng-container>
        </div>    `
})

export class TabPersonComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    canEditable: boolean = true;

    progressWidth: number = 0;
    person: Person = new Person();
    conClass = Contact;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;
    workAreaMode: any;
    organisationsOpts: any[] = [];
    agentOpts: any = {
        null: {label: "Не назначено"}
    };

    offers: Offer[];
    selectedOffers: Offer[];
    requests: Request[];
    selectedRequests: Request[];
    lastClckIdx: number = 0;

    editEnabled: boolean = false;

    constructor(private _hubService: HubService,
                private _configService: ConfigService,
                private _offerService: OfferService,
                private _requestService: RequestService,
                private _taskService: TaskService,
                private _analysisService: AnalysisService,
                private _historyService: HistoryService,
                private _personService: PersonService,
                private _organisationService: OrganisationService,
                private _userService: UserService,
                private _sessionService: SessionService
    ) {
        this.utilsObj = new Utils(_sessionService, _personService, _organisationService);
        _organisationService.list(0, 10, "local", {}, {}, null).subscribe(organisations => {
            organisations.forEach(org => {
                this.organisationsOpts.push({
                    value: org.id,
                    label: org.name
                });
            });
        });

        this.agentOpts[this._sessionService.getUser().id] = {label: this._sessionService.getUser().name};
        for(let user of _userService.cacheUsers){
            this.agentOpts[user.value] = {label: user.label};
        }
    }

    ngOnInit() {
        this.person = this.tab.args.person;
        this.canEditable = this.tab.args.canEditable;

        if (this.person.organisationId) {
            this._organisationService.get(this.person.organisationId).subscribe(org => {
                this.person.organisation = org;
            });
        }

        if (this.person.id == null && this.canEditable) {
            this.toggleEdit();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.person.id) {
                this.tab.header = "Контакт";
            } else {
                this.tab.header = "Новый контакт";
            }
        });
    }

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    save() {
        if (!this.checkForm())
            return;

        if (!this.person.isMiddleman || !this.person.organisation || !this.person.organisation.id) {
            delete this.person.organisation;
            delete this.person.organisationId;
        }

        setTimeout(() => {
            this._personService.save(this.person).subscribe(
                person => {
                    this.person = person;
                    this.tab.setEvent({type: 'update', value: this.person});
                    this.toggleEdit();
                }
            );
        }, 50);
    }


    checkForm() {
        if (PhoneBlock.getNotNullData(this.person.phoneBlock) == "") {
            this._hubService.getProperty("modal-window").showMessage("Не указан контактный телефон");
            return false;
        }
        if (!PhoneBlock.check(PhoneBlock.removeSymb(this.person.phoneBlock))) {
            this._hubService.getProperty("modal-window").showMessage("Один из телефонов указан неверно");
            return false;
        }
        return true;
    }

    openOrganisation() {
        if (this.person.organisation.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("organisation", {organisation: this.person.organisation});
        }
    }

    openUser() {
        if (this.person.agent.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("user", {organisation: this.person.agent});
        }
    }

    agentChanged(event) {
        this.person.agentId = event == "null" ? null : event;
        if (this.person.agentId != null) {
            this._userService.get(this.person.agentId).subscribe(agent => {
                this.person.agent = agent;
            });
        } else{
            this.person.agent = null;
        }
    }
    addFile(event, array) {
        if (array == "photo")
            this.person.photos.length > 0 ? this.person.photos = [].concat(this.person.photos).concat(event) : this.person.photos = event;
        else if (array == "doc")
            this.person.documents.length > 0 ? this.person.documents = [].concat(this.person.documents).concat(event) : this.person.documents = event;
    }
    // addFile(event){
    //     this.person.photo = event[0].href;
    //     this.person.photoMini = event[0].href;
    // }

    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 1300);
    }

    listOffers() {
        this.offers = this.selectedOffers = this.requests = this.selectedRequests = [];
        this.lastClckIdx = 0;
        if(this.person.id){
            this._offerService.list(0, 200, 1,{personId: this.person.id}, [], "", []).subscribe(
                data => {
                    this.offers = data.list;
                }
            );
        }
    }

    listRequests() {
        this.offers = this.selectedOffers = this.requests = this.selectedRequests = [];
        this.lastClckIdx = 0;
        if(this.person.id){
            this._requestService.list(0, 200, {personId: this.person.id, source: 'our'}, [], "", []).subscribe(
                data => {
                    this.requests = data.list;
                }
            );
        }
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();


        let uOpt = [];
        let tag = this.person.tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry",  icon: "", label: 'Проверить', callback: () => {
                        //this.openPopup = {visible: true, task: "check"};
                    }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                        let tab_sys = this._hubService.getProperty('tab_sys');

                            tab_sys.addTab('person', {person: this.person, canEditable: this.canEditable});
                    }},
                {class: "delimiter"},
                {class: "entry",  icon: "", label: "Показать фото",
                    callback: () => {
                        this.clickContextMenu({event: "photo"});
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry",  icon: "", label: "Показать документы",
                    callback: () => {
                        this.clickContextMenu({event: "doc"});
                        this.workAreaMode = 'doc';
                    }
                },
                {class: "entry", label: "Заявка на ипотеку",
                    callback: () => {
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                        {class: "entry", disabled: false, label: "Как Контакт",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_person"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Как Организацию",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_company"});
                            }
                        },
                    ]},
                {class: "submenu",  icon: "", label: "Назначить", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickContextMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "delimiter"},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('notes', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('daily', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Написать в чат", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('chat', event);
                        block.setShow(true, event);
                    }},
                {class: "submenu", disabled: false, icon: "", label: "Позвонить",  items: [
                        {class: "entry", disabled: false, label: "Номер1", callback: (event) => {
                                let block = this._hubService.getProperty('notebook');

                                block.setMode("phone", event);
                                block.setShow(true, event);
                            }
                        },
                        {class: "entry", disabled: false, label: "Номер2", callback: (event) => {
                                let block = this._hubService.getProperty('notebook');

                                block.setMode("phone", event);
                                block.setShow(true, event);
                            }
                        },
                        {class: "entry", disabled: false, label: "Номер3", callback: (event) => {
                                let block = this._hubService.getProperty('notebook');

                                block.setMode("phone", event);
                                block.setShow(true, event);
                            }
                        },
                    ]},
                {class: "delimiter"},
                {class: "entry",  icon: "", label: "Сводка",
                    callback: () => {
                        this.workAreaMode = 'svodka';
                    }
                },
                {class: "entry",  icon: "", label: "Отчет",
                    callback: () => {
                        this.workAreaMode = 'report';
                    }
                },
                {class: "entry", icon: "", label: "История",
                    callback: () => {
                        this.workAreaMode = 'history';
                    }
                },
                {class: "submenu", icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.person != undefined ?  this.person : null, tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]},
                {class: "delimiter"},
                {class: "entry",  icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                }

            ]
        };

        this._hubService.shared_var["cm"] = menu;
        this._hubService.shared_var["cm_hidden"] = false;
    }

    clickContextMenu(evt: any) {
        if (evt.event == "add_to_local") {
            this.person.changeDate = Math.round((Date.now() / 1000));
            this.person.addDate = this.person.changeDate;
            this.person.stateCode = "raw";
            this.person.typeCode = "client";
            if (evt.agent) {
                this.person.agentId = evt.agent.id;
                this.person.agent = evt.agent;
            } else {
                this.person.agentId = null;
                this.person.agent = null;
            }
            this._personService.save(this.person);
        } else if (evt.event == "del_agent") {
            this.person.agentId = null;
            this.person.agent = null;
            this._personService.save(this.person);
        } else if (evt.event == "del_obj") {

        } else if (evt.event == "check") {

        } else if (evt.event == "photo") {

        }
    }

    public findContact(event) {
        this.utilsObj.findContact(event, this.person).subscribe(data => {
            if (data.id) this._hubService.getProperty("modal-window").showMessage("Контакт ("+ data.name +") с таким номером телефона уже существует");
        });
    }

    select(event: MouseEvent, objSelected: any, obj: any, objects: any, i: number) {
        if (event.button == 2) {    // right click
            if (objSelected.indexOf(obj) == -1) { // if not over selected items
                this.lastClckIdx = i;
                objSelected = [obj];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                objSelected = [].concat(objSelected).concat(obj);
            } else if (event.shiftKey) {
                objSelected = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = objects[idx++];
                    objSelected.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                objSelected = [obj];
            }
        }
        return objSelected;
    }

    public delete() {
        this._personService.delete(this.person).subscribe((stat) =>{
            this._hubService.getProperty("modal-window").showMessage("Контакт и все с ним связи удалены");
            this.tab.setEvent({type: 'delete', value: this.person.id});
            this._hubService.getProperty('tab_sys').closeTab(this.tab);
        });
    }
}
