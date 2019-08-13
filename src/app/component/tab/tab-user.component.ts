import {Component, OnInit, AfterViewInit} from '@angular/core';

import {Tab} from '../../class/tab';
import {User} from '../../entity/user';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {Utils} from '../../class/utils';
import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {ConfigService} from '../../service/config.service';
import {OfferService, OfferSource} from '../../service/offer.service';
import {RequestService} from '../../service/request.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {PersonService} from '../../service/person.service';
import {OrganisationService} from '../../service/organisation.service';
import {AnalysisService} from '../../service/analysis.service';
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";
import {ObjectBlock} from "../../class/objectBlock";

@Component({
    selector: 'tab-user',
    inputs: ['tab'],
    styles: [`
        .property_face {
            flex-wrap: wrap;
            align-content: flex-start;
            padding: 30px 0 30px 25px;
            justify-content: flex-start;
        }

        .property_face ui-tag{
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }

        .property_face > .photo {
            width: 60px;
            height: 60px;
            background: #f8f8f8 url(/assets/photo.png);
            background-size: cover;
            margin: 0 20px 0 0;
            background-position: center;
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

        .property_face > ui-view-value {
            font-style: italic;
            letter-spacing: 0;
            margin-top: 7px;
            height: 12px;
            line-height: 12px;
            width: 220px;
        }

        .edit_ready {
            height: 12px;
            margin-top: 15px;
            padding-right: 24px;
        }

        ui-tabs-menu{
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
        .ui-view-value{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
        }
    `],
    template: `
        <div class="property_face">
            <ui-tag [value]="user.tag"></ui-tag>
            <div class="photo" [style.background-image]= "user?.photoMini ? 'url('+ user?.photoMini +')' : null">
                <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile) = "addFile($event)" [obj_id]="user.id"
                    (progressState) = "displayProgress($event)" [obj_type] = "'users'">
                </ui-upload-file>
            </div>
            <div class="last_name">{{utils.getSurname(user.name) || "Неизвестно"}}</div>
            <div class="first_name">{{utils.getFirstName(user.name) || "Неизвестно"}}</div>
            <div class="ui-view-value" [ngStyle]="positionOptions">
                {{ userClass.positionOptionsByDepart[user.department][user.position]?.label }}
            </div>

        </div>
        <hr class='underline'>
        <hr class='underline progress_bar' [style.width]="progressWidth+'vw'"> 
        <div class="pane">
            <div class="edit_ready">
                <span class="link" style="z-index: 99;" *ngIf="!editEnabled" (click)="toggleEdit()">Изменить</span>
                <span class="link" style="z-index: 99;" *ngIf="editEnabled" (click)="save()">Готово</span>
            </div>
            <ui-tabs-menu>
                <ui-tab [title]="'ГЛАВНАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Дата создания</span>
                            <span class="view-value">{{ utils.getDateInCalendar(user.addDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Дата изменения</span>
                            <span class="view-value">{{ utils.getDateInCalendar(user.changeDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>ФИО</span>
                            <span class="view-value link">{{ user.name}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.main">
                            <span>Личный телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.cellphone">
                            <span>Личный телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.office">
                            <span>Рабочий телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.fax">
                            <span>Рабочий телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.home">
                            <span>Домашний телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.other">
                            <span>Другой телефон</span>
                            <span class="view-value link">{{ "+7" + user?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.phoneBlock?.ip">
                            <span>Внутренний телефон</span>
                            <span class="view-value link">{{ user?.phoneBlock?.ip}}</span>
                        </div>
                        <div class="show_block">
                            <span>Ответственный</span>
                            <span class="view-value link">{{ user.agent?.name}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.messengerBlock?.whatsapp">
                            <span>WhatsApp</span>
                            <span class="view-value link">{{ user?.messengerBlock?.whatsapp}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.messengerBlock?.viber">
                            <span>Viber</span>
                            <span class="view-value link">{{ user?.messengerBlock?.viber}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.messengerBlock?.telegram">
                            <span>Telegram</span>
                            <span class="view-value link">{{ user?.messengerBlock?.telegram}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.emailBlock?.main">
                            <span>Основной Email</span>
                            <span class="view-value link">{{ user?.emailBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.emailBlock?.work">
                            <span>Рабочий Email</span>
                            <span class="view-value link">{{ user?.emailBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.emailBlock?.other">
                            <span>Другой Email</span>
                            <span class="view-value link">{{ user?.emailBlock?.other}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.siteBlock?.main">
                            <span>Основной Web-сайт</span>
                            <span class="view-value link">{{ user?.siteBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.siteBlock?.work">
                            <span>Рабочий Web-сайт</span>
                            <span class="view-value link">{{ user?.siteBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="user?.siteBlock?.other">
                            <span>Другой Web-сайт</span>
                            <span class="view-value link">{{ user?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Соцсети</span>
                            <ui-view-social [block]="user?.socialBlock"></ui-view-social>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.region">
                            <span>Регион</span>
                            <span class="view-value">{{user.addressBlock?.region}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.city">
                            <span>Населённый пункт</span>
                            <span class="view-value">{{user.addressBlock?.city}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.admArea">
                            <span>Административный район</span>
                            <span class="view-value">{{user.addressBlock?.admArea}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.area">
                            <span>Микрорайон</span>
                            <span class="view-value">{{user.addressBlock?.area}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.street">
                            <span>Улица</span>
                            <span class="view-value">{{user.addressBlock?.street}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.building">
                            <span>Дом</span>
                            <span class="view-value">{{user.addressBlock?.building}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.apartment">
                            <span>Квартира</span>
                            <span class="view-value">{{user.addressBlock?.apartment}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.station">
                            <span>Станция</span>
                            <span class="view-value">{{user.addressBlock?.station}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.addressBlock?.busStop">
                            <span>Остановка</span>
                            <span class="view-value">{{user.addressBlock?.busStop}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(user.contractBlock)?.length == 0">
                            <div class="show_block" >
                                <span>Договор</span>
                                <span class="view-value">Нет</span>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="block.getAsArray(user.contractBlock)?.length > 0">
                            <div class="show_block" *ngIf="user?.contractBlock?.number">
                                <span>Номер договора</span>
                                <span class="view-value">{{ user.contractBlock?.number}}</span>
                            </div>
                            <div class="show_block" *ngIf="user?.contractBlock?.begin || user.contractBlock?.end">
                                <span>Действие договора</span>
                                <span class="view-value">{{ user.contractBlock?.begin}}-{{user.contractBlock?.end}}</span>
                            </div>
                            <div class="show_block" *ngIf="user?.contractBlock?.continued">
                                <span>Договор продлён</span>
                                <span class="view-value">{{ user.contractBlock?.continued}}</span>
                            </div>
                            <div class="show_block" *ngIf="user?.contractBlock?.terminated">
                                <span>Договор расторгнут</span>
                                <span class="view-value">{{ user.contractBlock?.terminated}}</span>
                            </div>
                        </ng-container>
                        <div class="show_block">
                            <span>Источник</span>
                            <span class="view-value">{{ userClass.sourceCodeOptions[user?.sourceCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Состояние</span>
                            <span class="view-value">{{ userClass.stateUserCodeOptions[user?.stateCode]?.label}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'ФИО'" [value]="user?.name" (newValue)="user.name = $event"></input-line>
                        <multiselect-menu
                            [name]="'Телефон'" [block]="user?.phoneBlock" [addName]="'Добавить телефон'"
                            [params]="{ 'main': {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'cellphone' : {label: 'Личный', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'office': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'fax': {label: 'Рабочий', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'ip': {label: 'Внутренний', placeholder: 'Телефон'},
                                        'home': {label: 'Домашний', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'other': {label: 'Другой', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                    }"
                            (newData)="user.phoneBlock = $event"
                        ></multiselect-menu>
                        <sliding-menu [name] = "'Ответственный'" [options]="agentOpts"
                                      [value]="user?.agentId"
                                      (result) = "agentChanged($event)"
                        ></sliding-menu>
                        <!-- <li><span class="view-label">Ответственный</span> <span class="view-value"
                                          [class.link]="user.agentId" (click)="openUser()">{{ user.agent?.name || 'Неизвестно'}}</span>
                        </li> -->
                        <multiselect-menu
                            [name]="'Мессенджеры'" [block]="user?.messengerBlock" [addName]="'Добавить мессенджер'"
                            [params]="{ 'whatsapp': {label: 'WhatsApp', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'viber' : {label: 'Viber', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                        'telegram': {label: 'Telegram', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                    }"
                            (newData)="user.messengerBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'E-mail'" [block]="user?.emailBlock" [addName]="'Добавить email'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'E-mail'},
                                        'work' : {label: 'Рабочий', placeholder: 'E-mail'},
                                        'other': {label: 'Другой', placeholder: 'E-mail'}
                                    }"
                            (newData)="user.emailBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Web-сайт'" [block]="user?.siteBlock" [addName]="'Добавить сайт'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'Сайт'},
                                        'work' : {label: 'Рабочий', placeholder: 'Сайт'},
                                        'other': {label: 'Другой', placeholder: 'Сайт'}
                                    }"
                            (newData)="user.siteBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Соцсети'" [block]="user?.socialBlock" [addName]="'Добавить соцсеть'"
                            [params]="{ 'vk': {label: 'Вконтакте', placeholder: 'Адрес страницы'},
                                        'ok' : {label: 'Одноклассники', placeholder: 'Адрес страницы'},
                                        'facebook': {label: 'Facebook', placeholder: 'Адрес страницы'},
                                        'instagram': {label: 'Instagram', placeholder: 'Адрес страницы'},
                                        'twitter': {label: 'Twitter', placeholder: 'Адрес страницы'}
                                    }"
                            (newData)="user.socialBlock = $event"
                        ></multiselect-menu>
                        <address-input [block]="user?.addressBlock" [name]="'Адрес регистрации'" [addressType]="user.category == 'commersial' ? 'office': 'apartment'"
                            (newData)="user.addressBlock = $event.address"
                        ></address-input>
                        <multiselect-menu
                            [name]="'Договор'" [block]="user?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                        'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                        'end': {label: 'Дата конца', placeholder: 'Дата'},
                                        'continued': {label: 'Продлен', placeholder: 'Продление'},
                                        'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                    }"
                            (newData)="user.contractBlock = $event"
                        ></multiselect-menu>
                        <sliding-menu [name] = "'Источник'" [options]="userClass.sourceCodeOptions"
                                      [value]="user?.sourceCode"
                                      (result)= "user.sourceCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Состояние'" [options]="userClass.stateUserCodeOptions"
                                      [value]="user?.stateCode"
                                      (result) = "user.stateCode = $event"
                        ></sliding-menu>
                        <sliding-tag [value]="user?.tag" (newValue)="user.tag = $event"></sliding-tag>
                    </ng-container>
                    <input-area [name]="'Дополнительно'" [value]="user?.description" [disabled]="!editEnabled" (newValue)="user.description = $event" [update]="update"></input-area>
                </ui-tab>
                <ui-tab [title]="'ОБЩАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Офис</span>
                            <span class="view-value" [class.link]="user.organisationId" (click)="openOrganisation()">{{ user.organisation?.name }}</span>
                        </div>
                        <div class="show_block">
                            <span>Отдел</span>
                            <span class="view-value">{{ userClass.departmentOptions[user?.department]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Должность</span>
                            <span class="view-value">{{ userClass.positionOptionsByDepart[user.department][user?.position]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.department != 'management'">
                            <span>Специализация</span>
                            <span class="view-value">{{ userClass.specializationOptionsByDepart[user.department][user.specialization]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.department == 'sale' && user.department && user.department != 'management'">
                            <span>Недвижимость</span>
                            <span class="view-value">{{ userClass.typeMarketCodeOptions[user.category]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="user.department != 'management'">
                            <span>Рынок</span>
                            <span class="view-value">{{ userClass.typeCodeOptions[user.typeCode]?.label}}</span>
                        </div>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line [name]="'Офис'" [value]="user?.organisation?.name || ''" [queryTipe]="'organisation'" [filter]="{'ourCompany': 1}" (newValue)="user.organisation = $event"></input-line>
                        <sliding-menu [name] = "'Отдел'" [options]="userClass.departmentOptions"
                                      [value]="user?.department"
                                      (result) = "user.department = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Должность'" [options]="userClass.positionOptionsByDepart[user?.department]" *ngIf="user.department"
                                      [value]="user?.position"
                                      (result) = "user.position = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Специализация'" [options]="userClass.specializationOptionsByDepart[user?.department] || {}" *ngIf="user.department && user.department != 'management'"
                                      [value]="user?.specialization"
                                      (result) = "user.specialization = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Недвижимость'" [options]="userClass.typeMarketCodeOptions" *ngIf="user.department == 'sale' && user.department"
                                      [value]="user?.category"
                                      (result) = "user.category = $event"
                        ></sliding-menu>
                        <sliding-menu [name] = "'Рынок'" [options]="userClass.typeCodeOptions" *ngIf="(user.department == 'sale' || user.department == 'evaluation' || user.department == 'mortgage') && user.department"
                                      [value]="user?.typeCode"
                                      (result) = "user.typeCode = $event"
                        ></sliding-menu>

                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'ОБУЧЕНИЕ'">
                </ui-tab>
                <div more class="more">ЕЩЁ...
                    <div>
                        <div (click)="workAreaMode = 'doc'" [class.selected]="workAreaMode == 'doc'">Документы</div>
                        <div (click)="workAreaMode = 'history'" [class.selected]="workAreaMode == 'history'">История</div>
                        <div class="delete" (click)="$event">Удалить пользователя</div>
                    </div>
                </div>
            </ui-tabs-menu>
        </div>

        <div class="work-area">
                <div class="rating_block">
                  <rating-view [obj]="user" [type]="'user'"></rating-view>
                </div>
                <div class="comment_block">
                    <comments-view [obj]="user" [type]="'user'"></comments-view>
                </div>
                <div class="graf_block">
                  <div class="graf1">
<!--                    <digest-timeline-chart></digest-timeline-chart>-->
                  </div>
                  <div class="graf2">
<!--                    <digest-line-chart-->
<!--                      [title]="'РЕЙТИНГ В ДИНАМИКЕ'" [variant] = "1"-->
<!--                    ></digest-line-chart>-->
                  </div>
                  <div class="graf3">
<!--                    <digest-line-chart-->
<!--                      [title]="'АКТИВНОСТЬ ВЗАИМОДЕЙСТВИЯ'" [variant] = "0"-->
<!--                    ></digest-line-chart>-->
                  </div>
                </div>

            </div>
    `
})

export class TabUserComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    user: User;
    progressWidth: number = 0;
    progressTimer: number;
    block = ObjectBlock;
    utils = Utils;
    userClass = User;

    positionOptions = User.positionOptionsByDepart;
    typeCodeOptions = User.typeMarketCodeOptions;

    offers: Offer[];
    requests: Request[];

    workAreaMode: string = '';
    agentOpts: any[] = [{class:'entry', value: null, label: "Не назначено"},
            {class:'entry', value: this._sessionService.getUser().id, label: this._sessionService.getUser().name}
    ];

    editEnabled: boolean = false;

    constructor(private _hubService: HubService,
                private _userService: UserService,
                private _configService: ConfigService,
                private _offerService: OfferService,
                private _requestService: RequestService,
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

        this.user = this.tab.args.user;
        if(this.user.id) {
            this._userService.get(this.user.id).subscribe(usr => {
                this.user = usr;
            });
        } else{
           this.editEnabled = true;
        }
        /*if(this.user.id){
            for(let i = 0 ; i <= this.agentOpts.length; ++i){
                if (this.agentOpts[i].value == this.user.id){
                    this.agentOpts.splice(i,1);
                    break;
                }
            }
        }*/

        /*if(this.user.organisationId) {
          this._organisationService.get(this.user.organisationId).subscribe(org => {
            this.user.organisation = org;
          });
      }*/

        /*if (this.user.agentId != null) {
            this._userService.get(this.user.agentId).subscribe(superior => {
                this.user.agent = superior;
            });
        }*/
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.user.id) {
                this.tab.header = 'Пользователь ';
            } else {
                this.tab.header = 'Новый пользователь';
            }
        });
    }
    

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    save() {
        if (!this.checkForm())
            return;
        if (!this.user.agentId)
            this.user.agent = null;
        if(this.user.organisation)
            this.user.organisationId = this.user.organisation.id;
        this._userService.save(this.user).subscribe(user => {
            setTimeout(() => {
                this.user = user;
            });
            this.toggleEdit();
        });
    }

    checkForm(){
        if(PhoneBlock.getNotNullData(this.user.phoneBlock) == ""){
            this._hubService.getProperty("modal-window").showMessage("Не указан контактный телефон");
            return false;
        }
        if(!PhoneBlock.check(PhoneBlock.removeSymb(this.user.phoneBlock))){
            this._hubService.getProperty("modal-window").showMessage("Один из телефонов указан неверно");
            return false;
        }
        if(this.user.name == "" || !this.user.name){
            this._hubService.getProperty("modal-window").showMessage("Не указано имя пользователя!");
            return false;
        }
        if(this.user.name.split(" ").length < 3){
            this._hubService.getProperty("modal-window").showMessage("Не указано Фамилия, Имя или Отчество");
            return false;
        }

        return true;
    }


    agentChanged(e) {
        this.user.agentId = e.selected.value;
        this._userService.get(this.user.agentId).subscribe(agent => {
            this.user.agent = agent;
        });
    }

    openUser(){
        if(this.user.agentId){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.user.agentId});
        }
    }

    openOrganisation() {
      if(this.user.organisationId) {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('organisation', {organisation: this.user.organisation});
      }
    }

    addFile(event){
        this.user.photo = event[0].href;
        this.user.photoMini = event[0].href;
    }

    public displayProgress(event) {
        clearInterval(this.progressTimer);
        this.progressWidth = event;
        if(event < 100){
            this.progressTimer = setInterval(()=>{
                if (this.progressWidth >= 80) {
                    clearInterval(this.progressTimer);
                } else {
                    this.progressWidth++;
                }
            }, 10);
        } else {
            this.progressWidth = 100;
            setTimeout(()=>{this.progressWidth = 0;}, 1000);
        }
    }
}
