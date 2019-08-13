import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AnalysisService} from '../../service/analysis.service';
import {Tab} from '../../class/tab';
import {Offer} from '../../entity/offer';
import {Person} from '../../entity/person';
import {Request} from '../../entity/request';
import {Utils} from '../../class/utils';
import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {OfferService} from '../../service/offer.service';
import {RequestService} from '../../service/request.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {PersonService} from '../../service/person.service';
import {OrganisationService} from '../../service/organisation.service';
import {UserService} from '../../service/user.service';
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";
import {ObjectBlock} from "../../class/objectBlock";
import {Contact} from "../../entity/contact";

@Component({
    selector: 'tab-person',
    inputs: ['tab'],
    styles:   [`
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
            background-size: cover;
            margin: 0 20px 0 0;
            background: #f8f8f8 url(/assets/photo.png) center;
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
        }
    `], 
    template: `
    <div class="property_face">
        <ui-tag [value]="person.tag"></ui-tag>
        <div class="photo" [style.background-image]= "person?.photoMini ? 'url('+ person?.photoMini +')' : null">
            <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile) = "addFile($event)"
                            (progressState) = "displayProgress($event)" [obj_type] = "'users'">
            </ui-upload-file>
        </div>
        <div class="last_name">{{utils.getSurname(person.name) || "Неизвестно"}}</div>
        <div class="first_name">{{utils.getFirstName(person.name) || "Неизвестно"}}</div>
        <div class="position">{{person.isMiddleman ? "Посредник" : "Принципал"}}</div>
        <div class="position">{{conClass.typeCodeOptions[person.typeCode]?.label}}</div>
    </div>
    <hr class='underline'>
    <hr class='underline progress_bar' [style.width]="0+'vw'">
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
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.cellphone">
                        <span>Личный телефон</span>
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.office">
                        <span>Рабочий телефон</span>
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.fax">
                        <span>Рабочий телефон</span>
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.home">
                        <span>Домашний телефон</span>
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.other">
                        <span>Другой телефон</span>
                        <span class="view-value link">{{ "+7" + person?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                    <div class="show_block" *ngIf="person?.phoneBlock?.ip">
                        <span>Внутренний телефон</span>
                        <span class="view-value link">{{ person?.phoneBlock?.ip}}</span>
                    </div>
                    <div class="show_block">
                        <span>Ответственный</span>
                        <span class="view-value link">{{ person.agent?.name}}</span>
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
                        <ui-view-social [block]="person?.socialBlock"></ui-view-social>
                    </div>
                    <div class="show_block" *ngIf="person.addressBlock?.region">
                        <span>Регион</span>
                        <span class="view-value">{{person.addressBlock?.region}}</span>
                    </div>
                    <div class="show_block" *ngIf="person.addressBlock?.city">
                        <span>Населённый пункт</span>
                        <span class="view-value">{{person.addressBlock?.city}}</span>
                    </div>
                    <div class="show_block" *ngIf="person.addressBlock?.admArea">
                        <span>Административный район</span>
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
                        <span class="view-value">{{ canEditable ? conClass.sourceCodeOptions[person?.sourceCode]?.label : "Общая база"}}</span>
                    </div>
                    <div class="show_block">
                        <span>Статус</span>
                        <span class="view-value">{{ person?.isMiddleman ? "Посредник" : "Принципал"}}</span>
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
                        <span class="view-value" [class.link]="person.agentId" (click)="openUser()">{{ person.agent?.name}}</span>
                    </div>
                    <ng-container *ngIf="block.getAsArray(person.contractBlock)?.length == 0">
                        <div class="show_block" >
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
                            <span class="view-value">{{ person.contractBlock?.begin}}-{{person.contractBlock?.end}}</span>
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
                    <!-- <li *ngIf="person?.isMiddleman"><span class="view-label">Организация:</span>
                      <span class="view-value" [class.link]="person.organisation?.id" (click)="openOrganisation()"
                      >{{ person.organisation?.name || 'Неизвестно'}}</span>
                    </li> -->
                </ng-container>
                <input-area [name]="'Дополнительно'" [value]="person?.description" [disabled]="!editEnabled" (newValue)="person.description = $event" [update]="update"></input-area>
            </ui-tab>
            <ui-tab [title]="'ПРЕДЛОЖЕНИЯ'"></ui-tab>
            <ui-tab [title]="'ЗАЯВКИ'"></ui-tab>
            <div more class="more">ЕЩЁ...</div>
        </ui-tabs-menu>
    </div>
      <!-- <div>
        <div class="pane">
        <div class="property" style="overflow-x: hidden;">
            <div class="property_body editable" *ngIf="editEnabled">
                <ul>
                  <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Телефон контакта</span>
                    <span class="view-value unknown" *ngIf="get_length(person?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                    <ui-multiselect style="display: none;"
                                    [params]="{'main': {label: 'Личный', placeholder: 'Введите номер телефона'},
                                              'cellphone' : {label: 'Личный', placeholder: 'Введите номер телефона'},
                                              'office': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                              'fax': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                              'ip': {label: 'Внутренний', placeholder: 'Введите номер телефона'},
                                              'home': {label: 'Домашний', placeholder: 'Введите номер телефона'},
                                              'other': {label: 'Другой', placeholder: 'Введите номер телефона'}
                                    }"
                                    [masks]="phoneMasks" [field]="person?.phoneBlock" [width]="'53%'" [prefix]="'+7'"
                                    (onChange)="person.phoneBlock = $event"></ui-multiselect>
                  </li>
                  <li>
                    <ui-input-line [placeholder]="'ФИО:'" [value]="person?.name || ''"
                                   (onChange)="person.name = $event"></ui-input-line>
                  </li>
                  <li style="height: auto;"><span class="view-label sliding-label">Статус</span>
                    <ui-slidingMenu [options]="middlemanOptions" [value]="person?.isMiddleman ? 'middleman' : 'owner'"
                                    (onChange)="person.isMiddleman = $event.selected.value == 'owner' ? false : true"></ui-slidingMenu>
                  </li>
                  <li *ngIf="person?.isMiddleman">
                    <ui-input-line [placeholder]="'Организация:'" [value]="person?.organisation?.name || ''"
                                   (onChange)="person.organisation = $event" [queryTipe]="'organisation'"
                                   [filter]="{ourCompany:0}"
                    ></ui-input-line>
                  </li>
                  <li style="height: auto;"><span class="view-label sliding-label">Тип контакта</span>
                    <ui-slidingMenu [options]="typeCodeOptions" [value]="person?.typeCode"
                                    (onChange)="person.typeCode = $event.selected.value"></ui-slidingMenu>
                  </li>
                  <li style="height: auto;"><span class="view-label sliding-label">Лояльность</span>
                    <ui-slidingMenu [options]="stateCodeOptions" [value]="person?.stateCode"
                                    (onChange)="person.stateCode = $event.selected.value"></ui-slidingMenu>
                  </li>
                  <li style="height: auto;"><span class="view-label sliding-label">Ответственный</span>
                    <ui-slidingMenu [options]="agentOpts" [value]="person?.agentId"
                                    (onChange)="agentChanged($event)"></ui-slidingMenu>
                  </li>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">E-mail</span> <span
                    class="view-value unknown" *ngIf="get_length(person?.emailBlock)==0">{{ "Неизвестно"}}</span>
                    <ui-multiselect style="display: none;"
                                    [params]="{\n                                        'work' : {label: 'Рабочий', placeholder: 'Введите E-mail'},\n                                        'main' : {label: 'Основной', placeholder: 'Введите E-mail'},\n                                        'other' : {label: 'Другой', placeholder: 'Введите E-mail'}\n                                    }"
                                    [field]="person?.emailBlock" [width]="'36%'"
                                    (onChange)="person.emailBlock = $event"></ui-multiselect>
                  </li>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Web-сайт</span> <span
                    class="view-value unknown" *ngIf="get_length(person?.siteBlock)==0">{{ "Неизвестно"}}</span>
                    <ui-multiselect style="display: none;"
                                    [params]="{\n                                        'work' : {label: 'Рабочий', placeholder: 'Введите название сайта'},\n                                        'main' : {label: 'Основной', placeholder: 'Введите название сайта'},\n                                        'other' : {label: 'Другой', placeholder: 'Введите название сайта'}\n                                    }"
                                    [field]="person?.siteBlock" [width]="'36%'"
                                    (onChange)="person.siteBlock = $event"></ui-multiselect>
                  </li>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Соцсети</span> <span
                    class="view-value unknown" *ngIf="get_length(person?.socialBlock)==0">{{ "Неизвестно"}}</span>
                    <ui-multiselect style="display: none;"
                                    [params]="{
                                            'vk' : {label: 'Вконтакте', placeholder: 'Введите адрес страницы'},
                                            'ok' : {label: 'Одноклассники', placeholder: 'Введите адрес страницы'},
                                            'facebook' : {label: 'Facebook', placeholder: 'Введите адрес страницы'},
                                            'google' : {label: 'Google+', placeholder: 'Введите адрес страницы'},
                                            'twitter' : {label: 'Twitter', placeholder: 'Введите адрес страницы'}
                                        }"
                                    [field]="person?.socialBlock" [width]="'36%'"
                                    (onChange)="person.socialBlock = $event"></ui-multiselect>
                  </li>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Мессенджеры</span> <span
                    class="view-value unknown" *ngIf="get_length(person?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                    <ui-multiselect style="display: none;"
                                    [params]="{
                                            'whatsapp' : {label: 'WhatsApp', placeholder: 'Введите номер телефона'},
                                            'telegram' : {label: 'Telegram', placeholder: 'Введите номер телефона'},
                                            'viber' : {label: 'Viber', placeholder: 'Введите номер телефона'}
                                        }"
                                    [field]="person?.messengerBlock" [width]="'36%'"
                                    (onChange)="person.messengerBlock = $event"></ui-multiselect>
                  </li>
                </ul>
                <ul>
                  <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                  <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Договор</span> <span
                    class="view-value unknown" *ngIf="get_length(person.contractBlock)==0">Неизвестно</span>
                    <ui-multiselect [style.display]="get_length(person.contractBlock) == 0 ? 'none' : ''"
                                    [params]="{\n                                        'number': {label: 'Номер', placeholder: 'Введите номер договора'},\n                                        'begin': {label: 'Начало', placeholder: 'Введите название сайта'},\n                                        'end': {label: 'Окончание', placeholder: 'Введите название сайта'},\n                                        'contined': {label: 'Продлён', placeholder: 'Введите название сайта'},\n                                        'terminated': {label: 'Расторгнут', placeholder: 'Введите название сайта'}\n                                    }"
                                    [field]="person.contractBlock" [width]="'43%'"
                                    (onChange)="person.contractBlock = $event"></ui-multiselect>
                  </li>

                  <li style="height: auto;"><span class="view-label sliding-label">Источник</span>
                    <ui-slidingMenu [options]="sourceCodeOptions" [value]="person.sourceCode"
                                    (onChange)="person.sourceCode = $event.selected.value"></ui-slidingMenu>
                  </li>
                </ul>
                <ul>
                  <div (click)="show_hide($event)">ТЭГИ</div>
                  <li style="height: auto; padding: 0;">
                    <ui-tag-block [value]="person?.tag" (valueChange)="person.tag = $event"></ui-tag-block>
                  </li>
                </ul>
            </div>
        </div>
      </div> -->
      <div class="work-area">
          <div class="rating_block">
            <rating-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></rating-view>
          </div>
          <div class="comment_block">
            <comments-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></comments-view>
          </div>
      </div>    `
})

export class TabPersonComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    canEditable: boolean = true;

    person: Person = new Person();
    conClass = Contact;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;

    organisationsOpts: any[] = [];
    agentOpts: any[] = [{class:'entry', value: null, label: "Не назначено"},
                      {class:'entry', value: this._sessionService.getUser().id, label: this._sessionService.getUser().name}
    ];

    offers: Offer[];
    requests: Request[];

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
        this.utilsObj = new Utils(_sessionService, _personService,_organisationService);
        _organisationService.list(0, 10, 'local', {}, {}, null).subscribe(organisations => {
            organisations.forEach(org => {
                this.organisationsOpts.push({
                    value: org.id,
                    label: org.name
                });
            });
        });

        this.agentOpts = this.agentOpts.concat(_userService.cacheUsers);
    }

    ngOnInit() {
        this.person = this.tab.args.person;
        this.canEditable = this.tab.args.canEditable;
        if(this.person.id && this.person.accountId == this._sessionService.getUser().accountId && this.canEditable) {
            this._personService.get(this.person.id).subscribe(pers => {
                this.person = pers;
            });
        }

        if(this.person.organisationId) {
            this._organisationService.get(this.person.organisationId).subscribe(org => {
                this.person.organisation = org;
            });
        }

        if(this.person.agentId != null) {
          /*this._userService.get(this.person.agentId).subscribe(agent => {
            this.person.agent = agent;
        });*/
        }

        if(this.person.id == null && this.canEditable) {
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

        this._personService.save(this.person).subscribe(
            person => {
                setTimeout(() => {
                    this.person.copyFields(person);
                });
                this.toggleEdit();
            }
        );
    }

    checkForm(){
        if(PhoneBlock.getNotNullData(this.person.phoneBlock) == ""){
            this._hubService.getProperty("modal-window").showMessage("Не указан контактный телефон");
            return false;
        }
        if(!PhoneBlock.check(PhoneBlock.removeSymb(this.person.phoneBlock))){
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

    agentChanged(e) {
        this.person.agentId = e.selected.value;
        if (this.person.agentId != null) {
            this._userService.get(this.person.agentId).subscribe(agent => {
                this.person.agent = agent;
            });
        }
    }

    addFile(event) {
        this.person.photo = event;
        this.person.photoMini = event;
    }

    displayProgress(event) {
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
                    class: "entry", disabled: false, icon: "", label: "Просмотреть фото",
                    callback: () => {
                        this.clickContextMenu({event: "photo"});
                    }
                },
                {class: "delimiter"},
                {
                    class: "entry",
                    disabled: this.person.userRef != null,
                    icon: "",
                    label: "Добавить в контакты",
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
            if (data.id) this._hubService.getProperty("modal-window").showMessage("Контакт с таким номером телефона уже существует");
        });
    }
}
