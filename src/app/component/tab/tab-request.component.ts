import {Component, OnInit} from "@angular/core";

import {Tab} from '../../class/tab';
import {Offer} from '../../entity/offer';
import {Person} from '../../entity/person';
import {Request, ValueRange} from '../../entity/request';
import {PhoneBlock} from "../../class/phoneBlock";
import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {OfferService, OfferSource} from '../../service/offer.service';
import {RequestService} from '../../service/request.service';
import {OrganisationService} from '../../service/organisation.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {PersonService} from '../../service/person.service';
import {UserService} from '../../service/user.service';
import {AnalysisService} from '../../service/analysis.service';
import {SessionService} from "../../service/session.service";
import {Contact} from "../../entity/contact";


@Component({
    selector: 'tab-request',
    inputs: ['tab'],
    styles: [`
        .property_face > span{
            display: block;
            height: 12px;
            line-height: 12px;
            margin-bottom: 6px;
            font-style: italic;
        }
        .property_face .main_title{
            font-size: 20px;
            height: 20px;
            line-height: 20px;
            font-style: normal;
        }

        .property_face .title{
            float: left;
            width: 95px;

        }

        .work-area {
            float: left;
            width: calc(100% - 370px);
            height: calc(100% - 122px);
            position: relative;
        }

        gmap-view{
            width: calc(100% - 370px);
            height: 100%;
            display: block;
            position: relative;
        }

        .property_face > ui-tag{
            position: absolute;
            width: 7px;
            height: 100%;
            top: 0;
            right: 0;
        }
    `],
    template: `
        <div class="search-form">
            <input type="text" class="input_line" placeholder="Введите текст запроса" [style.width]="'calc(100% - 108px)'"
                [(ngModel)]="request.request" (keyup)="searchStringChanged($event)"
            ><span class="find_icon"></span>
            <div (click)="toggleDraw()" class="deactivate_draw" [class.activate_draw]="mapDrawAllowed">ОБВЕСТИ</div>
        </div>

        <div class = "property_face">
            <ui-tag
                [value]="request?.tag"
            >
            </ui-tag>
            <span class="main_title">{{request.id ? 'ЗАЯВКА' : 'НОВАЯ ЗАЯВКА'}}</span>
            <span class="title">Тип объекта</span>
            <span class="value">
                <ng-container *ngFor="let val of request.typeCodes; let i = index">
                    {{offClass.typeCodeOptionsHash[val]}}{{i < request.typeCodes.length-1 ? ", " : ""}}
                </ng-container>
            </span>
            <span class="title">Тип сделки</span><span class="value">{{reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
            <span class="title">Бюджет</span><span class="value">{{valRange.getHuman(request?.budget)}} тыс. руб.</span>
        </div>

        <hr class='underline'>

        <div class="pane" [style.left.px]="paneHidden ? -370 : 0">
            <div class = "source_menu">
                <div [class.active]="mode == 0" (click)="mode = 0">Заявка</div>
                <div [class.active]="mode == 1" (click)="mode = 1">Предложения</div>
                <div class="edit_ready" *ngIf="mode == 0">
                    <span class="link" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</span>
                    <span class="link" *ngIf="editEnabled && canEditable" (click)="save()">Готово</span>
                    <span *ngIf="!canEditable" class="pointer_menu" (click)="$event">...</span>
                </div>
                <div class="edit_ready" *ngIf="mode == 1">
                    <span>Общая база</span>
                    <switch-button [value]="false"></switch-button>
                </div>
            </div>
            <div class="fixed-button" (click)="toggleLeftPane()">
                <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
            </div>
            <ui-tabs-menu *ngIf="mode == 0">
                <ui-tab [title]="'ГЛАВНАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Дата создания</span>
                            <span class="view-value">{{ request.addDate}}</span>
                        </div>
                        <div class="show_block">
                            <span>Предложение</span>
                            <span class="view-value">{{conClass.typeOptions[contact.type]}}</span>
                        </div>
                        <div class="show_block">
                            <span>{{contact.type == 'person' ? 'ФИО' : 'Название организации'}}</span>
                            <span class="view-value">{{ contact?.name}}</span>
                        </div>
                        <div class="show_block">
                            <span>Телефон Личный</span>
                            <span class="view-value">{{ contact?.phoneBlock?.main}}</span>
                        </div>
                        <div class="show_block">
                            <span>Телефон Личный</span>
                            <span class="view-value">{{ contact?.phoneBlock?.main}}</span>
                        </div>
                        <div class="show_block">
                            <span>WhatsApp</span>
                            <span class="view-value">{{ contact?.messengerBlock?.whatsapp}}</span>
                        </div>
                        <div class="show_block">
                            <span>Viber</span>
                            <span class="view-value">{{ contact?.messengerBlock?.viber}}</span>
                        </div>
                        <div class="show_block">
                            <span>Telegram</span>
                            <span class="view-value">{{ contact?.messengerBlock?.telegram}}</span>
                        </div>
                        <div class="show_block">
                            <span>Email Основной</span>
                            <span class="view-value">{{ contact?.emailBlock?.main}}</span>
                        </div>
                        <div class="show_block">
                            <span>Email Рабочий</span>
                            <span class="view-value">{{ contact?.emailBlock?.work}}</span>
                        </div>
                        <div class="show_block">
                            <span>Email Другой</span>
                            <span class="view-value">{{ contact?.emailBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Web-сайт Основной</span>
                            <span class="view-value">{{ contact?.siteBlock?.main}}</span>
                        </div>
                        <div class="show_block">
                            <span>Web-сайт Рабочий</span>
                            <span class="view-value">{{ contact?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Web-сайт Другой</span>
                            <span class="view-value">{{ contact?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Соцсети</span>
                            <ui-view-social [block]="contact?.socialBlock"></ui-view-social>
                        </div>
                        <div class="show_block">
                            <span>Статус</span>
                            <span class="view-value">{{ contact?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип контакта</span>
                            <span class="view-value">{{ contact?.typeCode}}</span>
                        </div>
                        <div class="show_block">
                            <span>Лояльность</span>
                            <span class="view-value">{{ contact?.stateCode}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия</span>
                            <span class="view-value">{{ contact?.stageCode}}</span>
                        </div>
                        <div class="show_block">
                            <span>Ответственный</span>
                            <span class="view-value">{{ request.agent?.name}}</span>
                        </div>
                        <div class="show_block">
                            <span>Источник заявки</span>
                            <span class="view-value">{{ request?.sourceCode}}</span>
                        </div>
                        <div class="show_block">
                            <span>Сделка</span>
                            <span class="view-value">{{ request.offerTypeCode}}</span>
                        </div>
                        <div class="show_block">
                            <span>Договор</span>
                            <span class="view-value">{{ request.contractBlock?.number}}</span>
                        </div>
                        <div class="show_block">
                            <span>Действие договора</span>
                            <span class="view-value">{{ request.contractBlock?.begin}}-{{request.contractBlock?.end}}</span>
                        </div>
                        <div class="show_block">
                            <span>Договор продлён</span>
                            <span class="view-value">{{ request.contractBlock?.continued}}</span>
                        </div>
                        <div class="show_block">
                            <span>Договор расторгнут</span>
                            <span class="view-value">{{ request.contractBlock?.terminated}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name] = "'Предложение'" [options]="conClass.typeOptions"
                                      [value]="contact?.type"
                                      (result) = "contact.type = $event"
                        ></sliding-menu>
                        <input-line [name]="contact.type == 'person' ? 'ФИО' : 'Название организации'" [value]="contact?.name"></input-line>
                        <multiselect-menu
                            [name]="'Телефон контакта'" [block]="contact?.phoneBlock" [addName]="'Добавить телефон'"
                            [params]="{ 'main': {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'cellphone' : {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'office': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'fax': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'ip': {label: 'Внутренний', placeholder: 'Телефон'},
                                        'home': {label: 'Домашний', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'other': {label: 'Другой', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                    }"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Мессенджеры'" [block]="contact?.messengerBlock" [addName]="'Добавить мессенджер'"
                            [params]="{ 'whatsapp': {label: 'WhatsApp', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'viber' : {label: 'Viber', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'telegram': {label: 'Telegram', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                    }"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'E-mail'" [block]="contact?.emailBlock" [addName]="'Добавить email'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'E-mail'},
                                        'work' : {label: 'Рабочий', placeholder: 'E-mail'},
                                        'other': {label: 'Другой', placeholder: 'E-mail'}
                                    }"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Web-сайт'" [block]="contact?.siteBlock" [addName]="'Добавить сайт'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'Сайт'},
                                        'work' : {label: 'Рабочий', placeholder: 'Сайт'},
                                        'other': {label: 'Другой', placeholder: 'Сайт'}
                                    }"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Соцсети'" [block]="contact?.socialBlock" [addName]="'Добавить соцсеть'"
                            [params]="{ 'vk': {label: 'Вконтакте', placeholder: 'Адрес страницы'},
                                        'ok' : {label: 'Одноклассники', placeholder: 'Адрес страницы'},
                                        'facebook': {label: 'Facebook', placeholder: 'Адрес страницы'},
                                        'instagram': {label: 'Instagram', placeholder: 'Адрес страницы'},
                                        'twitter': {label: 'Twitter', placeholder: 'Адрес страницы'}
                                    }"
                        ></multiselect-menu>
                        <sliding-menu [name] = "'Источник'" [options]="conClass.sourceCodeOptions"
                                      [value]="contact?.sourceCode"
                                      (result)= "contact.sourceCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Статус'" [options]="conClass.middlemanOptions"
                                      [value]="contact.isMiddleman ? 'middleman' : 'owner'"
                                      (result)= "contact.isMiddleman = $event == 'middleman'"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Тип контакта'" [options]="conClass.typeCodeOptions"
                                      [value]="contact?.typeCode"
                                      (result) = "contact.typeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Лояльность'" [options]="conClass.loyaltyOptions"
                                      [value]="contact?.loyalty"
                                      (result) = "contact.loyalty = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Стадия контакта'" [options]="conClass.stageCodeOptions"
                                      [value]="contact?.stageCode"
                                      (result) = "contact.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]  = "'Сделка'" [options]="reqClass.offerTypeCodeOptions"
                                      [value] = "request?.offerTypeCode"
                                      (result)= "request.offerTypeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Стадия заявки'" [options]="reqClass.stageCodeOptions"
                                      [value]="request?.stageCode"
                                      (result) = "request.stageCode = $event"
                        ></sliding-menu>
                        <input-line [name]="'Ответственный'" [value]="request?.agent?.name"></input-line>
                        <multiselect-menu
                            [name]="'Договор'" [block]="request?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                        'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                        'end': {label: 'Дата конца', placeholder: 'Дата'},
                                        'continued': {label: 'Продлен', placeholder: 'Продление'},
                                        'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                    }"
                        ></multiselect-menu>
                        <ui-tag-block [value]="request?.tag"></ui-tag-block>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'УСЛОВИЯ'" *ngIf="request.offerTypeCode != 'rent'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Новостройка</span>
                            <switch-button [value]="request?.newBuilding" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Обременение</span>
                            <switch-button [value]="request?.encumbrance" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Год постройки</span>
                            <span class="view-value">{{ request?.buildYear}}</span>
                        </div>
                        <div class="show_block">
                            <span>Рейтинг</span>
                            <span class="view-value">{{ request?.rate}}</span>
                        </div>
                        <div class="show_block">
                            <span>Дополнительно</span>
                            <span class="view-value">{{ request?.description}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <div class="show_block">
                            <span>Новостройка</span>
                            <switch-button [value]="request?.newBuilding" (newValue)="request.newBuilding = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Обременение</span>
                            <switch-button [value]="request?.encumbrance" (newValue)="request.encumbrance = $event"></switch-button>
                        </div>
                        <input-line [name]="'Год постройки'" [value]="request?.buildYear"></input-line>
                        <input-line [name]="'Рейтинг'" [value]="request?.rate"></input-line>
                        <input-line [name]="'Дополнительно'" [value]="request?.description"></input-line>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'УСЛОВИЯ'" *ngIf="request.offerTypeCode == 'rent'">
                    <ng-container *ngIf="!editEnabled">
                        <conditions-switches [block]="request.conditions" [disabled]="true"></conditions-switches>
                        <div class="show_block">
                            <span>Дата заезда</span>
                            <span class="view-value">{{ request?.arrival_date}}</span>
                        </div>
                        <div class="show_block">
                            <span>Период проживания</span>
                            <span class="view-value">{{ request?.period}}</span>
                        </div>
                        <div class="show_block">
                            <span>Рейтинг</span>
                            <span class="view-value">{{ request?.rate}}</span>
                        </div>
                        <div class="show_block">
                            <span>Дополнительно</span>
                            <span class="view-value">{{ request.description}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <conditions-switches [block]="request.conditions" [disabled]="false"></conditions-switches>
                        <input-line [name]="'Дата заезда'" [value]="request?.arrival_date"></input-line>
                        <input-line [name]="'Период проживания'" [value]="request?.period"></input-line>
                        <input-line [name]="'Рейтинг'" [value]="request?.rate"></input-line>
                        <input-line [name]="'Дополнительно'" [value]="request?.description"></input-line>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode != 'rent'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span class="view-value">{{ valRange.getHuman(request?.budget)}} тыс. руб.</span>
                        </div>
                        <div class="show_block">
                            <span>Наличные</span>
                            <switch-button [value]="request?.cash" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Ипотека</span>
                            <switch-button [value]="request?.mortgage" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Сертификат</span>
                            <switch-button [value]="request?.certificate" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Материнский капитал</span>
                            <switch-button [value]="request?.maternalCapital" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Дополнительно</span>
                            <span class="view-value">{{ request?.costInfo}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'Дата заезда'" [value]="request?.budget"></input-line>
                        <div class="show_block">
                            <span>Наличные</span>
                            <switch-button [value]="request?.cash"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Ипотека</span>
                            <switch-button [value]="request?.mortgage"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Сертификат</span>
                            <switch-button [value]="request?.certificate"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Материнский капитал</span>
                            <switch-button [value]="request?.maternalCapital"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission"></switch-button>
                        </div>
                        <input-line [name]="'Дополнительно'" [value]="request?.costInfo"></input-line>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode == 'rent'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span class="view-value">{{ valRange.getHuman(request?.budget)}} тыс. руб.</span>
                        </div>
                        <div class="show_block">
                            <span>Форма оплаты</span>
                            <span class="view-value">{{request?.paymentMethod}}</span>
                        </div>
                        <div class="show_block">
                            <span>Комунальные платежи</span>
                            <switch-button [value]="request?.utilityBills" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Счетчики</span>
                            <switch-button [value]="request?.counters" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Депозит</span>
                            <switch-button [value]="request?.deposit" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Дополнительно</span>
                            <span class="view-value">{{ request?.costInfo}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'Бюджет'" [value]="request?.budget"></input-line>
                        <div class="show_block">
                            <span>Комунальные платежи</span>
                            <switch-button [value]="request?.paymentMethod"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комунальные платежи</span>
                            <switch-button [value]="request?.utilityBills"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Счетчики</span>
                            <switch-button [value]="request?.counters"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Депозит</span>
                            <switch-button [value]="request?.deposit"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission"></switch-button>
                        </div>
                        <input-line [name]="'Дополнительно'" [value]="request?.costInfo"></input-line>
                    </ng-container>
                </ui-tab>
                <div more class="more">ЕЩЁ...</div>
            </ui-tabs-menu>

            <ui-tabs-menu *ngIf="mode == 1">
                <ui-tab [title]="'ВСЕ'">
                </ui-tab>
                <ui-tab [title]="'ПРИНЦИПАЛ'">
                </ui-tab>
                <ui-tab [title]="'ПОСРЕДНИК'">
                </ui-tab>
            </ui-tabs-menu>
        </div>

        <div class="work-area">
            <yamap-view>

            </yamap-view>
        </div>
    `
})

export class TabRequestComponent implements OnInit{
    public tab: Tab;
    public request: Request = new Request();
    mode: number = 0;
    canEditable: boolean = true;
    page: number = 0;
    source: OfferSource = OfferSource.LOCAL;
    offers: Offer[];
    contact: Contact = new Contact;

    offClass = Offer;
    conClass = Contact;
    reqClass  = Request;
    valRange = ValueRange;


    editEnabled: boolean = false;
    mapDrawAllowed: boolean = false;
    paneHidden: boolean = false;

    latCentr: any;
    lonCentr: any;
    constructor(private _hubService: HubService,
                private _configService: ConfigService,
                private _offerService: OfferService,
                private _requestService: RequestService,
                private _taskService: TaskService,
                private _analysisService: AnalysisService,
                private _historyService: HistoryService,
                private _personService: PersonService,
                private _userService: UserService,
                private _sessionService: SessionService,
                private _organisationService: OrganisationService
    ) {

        setTimeout(() => {
            if (this.request.id) {
                this.tab.header = 'Заявка';
            } else {
                this.tab.header = 'Новая заявка';
            }
        });
    }

    ngOnInit() {
        this.request = this.tab.args.request;
        if (this.request.id == null) {
            this.editEnabled = true;
        }


        /*if (this.request.personId != null) {
            this._personService.get(this.request.personId).subscribe(
                data => {
                    this.request.person = data;
                    this.agentOrCompany = this.request.person;
                    console.log(this.request);
                }
            );
        } else{
            this.agentOrCompany = new Person();
            this.request.person = this.agentOrCompany;
        }*/


        /*if (this.request.agentId != null) {
            this._userService.get(this.request.agentId).subscribe(agent => {
                this.request.agent = agent;
            });
        }*/

        this.calcSize();

    }

    searchStringChanged(e) {
        let c = this;
        /*clearTimeout(this.suggestionTo);
        this.suggestionTo = setTimeout(function() {
            c.searchParamChanged(e);
        }, 500);*/
    }

    onResize(e) {
        this.calcSize();
    }

    calcSize() {

    }


    agentChanged(e) {
        this.request.agentId = e.selected.value;
        if (this.request.agentId != null) {
            this._userService.get(this.request.agentId).subscribe(agent => {
                this.request.agent = agent;
            });
        }
    }

    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
        this.calcSize();
    }

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    toggleDraw() {
        this.mapDrawAllowed = !this.mapDrawAllowed;
        if (!this.mapDrawAllowed) {
            this.page = 0;
            this.offers = [];
            this.request.searchArea = [];
        }
    }

    finishDraw(e) {
        if(!this.request.id){
            this.page = 0;
            this.offers = [];
            this.request.searchArea = e.coords;
        }
    }

    save() {

        if (!this.chechForm())
            return;
        /*if(!this.agentOrCompany.id && PhoneBlock.getNotNullData(this.agentOrCompany.phoneBlock) != ""){
                this._personService.save(this.agentOrCompany).subscribe(person => {
                    setTimeout(() => {
                        this.request.personId = person.id;
                        delete this.request.person;
                        this.agentOrCompany = person;
                        this._requestService.save(this.request).subscribe(request => {
                            setTimeout(() => {
                                this.request = request;
                            });
                            this.toggleEdit();
                        });
                    });
                });
        } else{*/
                this._requestService.save(this.request).subscribe(request => {
                        this.request = request;
                    this.toggleEdit();
                });
       /* }*/
    }

    chechForm(){
        if (this.request.request.length < 1){
            alert("Введите текст запроса");
            return false;
        }
        /*if(PhoneBlock.getNotNullData(this.agentOrCompany.phoneBlock) == ""){
            alert("Не указан контактный телефон");
            return false;
        }*/
        return true;
    }

    offersSelected() {
        this.getOffers(0, 16);
    }


    getOffers(page, per_page) {
        this._offerService.list(page, per_page, this.source, {offerTypeCode: this.request.offerTypeCode}, null, this.request.request, this.request.searchArea).subscribe(
            offers => {
                this.offers = offers.list;
            },
            err => console.log(err)
        );
    }


    getOfferDigest(r: Offer) {
        return Offer.getDigest(r);
    }


    openOffer(offer: Offer) {
        var tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('offer', {offer: offer});
    }

    get_length(obj: any){
        let count = 0;
        for (let prop in obj) {
            if(obj[prop])
                count++;
        }
        return count;
    }

    find_contact(structure: any){
        for(let field in structure){ //9144174361
            if(structure[field] && structure[field].length > 9){
                let temp = structure[field];
                temp = temp.replace(/\(|\)|\+|\-|\s|/g, '');
                if(temp.charAt(0) == '7' || temp.charAt(0) == '8')
                  temp = temp.substring(1);
                if(temp.length> 9){
                    temp = "7"+temp;
                    this._personService.list(0, 1, 'local', {phone:temp}, null, null).subscribe(persons => {
                        if(persons[0]){
                            alert("Указанный телефон принадлежит контакту \""+persons[0].name+"\". Введите другой телефон!");
                        } else{
                            /*this._organisationService.list(temp, true).subscribe(org => {
                                if(org[0]){
                                    alert("Указанный телефон принадлежит контрагенту \""+org[0].name+"\". Введите другой телефон!")
                                }
                            });*/
                        }
                    });
                    return;
                }
            }
        }
    }

}
