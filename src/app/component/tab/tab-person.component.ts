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

@Component({
  selector: 'tab-person',
  inputs: ['tab'],
  styles:   [`
    .main_info {
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .main_info > .photo {
        width: 67px;
        height: 67px;
        background: #f8f8f8 url(/assets/person_icon/photo.png);
        background-size: cover;
        margin: 22px 15px 22px 0;
     }

    .main_info > .last_name {
        font-size: 18px;
        text-transform: uppercase;
        margin-top: 22px;
        width: 220px;
        height: 18px;
        line-height: 18px;
        font-weight: bold;
    }

    .main_info > .first_name {
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        margin-top: 1px;
        width: 220px;
    }

    .main_info > ui-view-value {
        font-style: italic;
        letter-spacing: 0;
        margin-top: 7px;
        height: 12px;
        line-height: 12px;
        width: 220px;
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

    .right_pane {
      width: 370px;
      height: 100%;
      border-left: 1px solid #bdc0c1;
    }

    .rating_block {
      height: 235px;
      overflow: hidden;
      width: calc(100% - 370px - 400px);
      border: 1px solid #bdc0c1;
      border-top: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      justify-content: space-between;
    }

    .comment_block {
      height: calc(100% - 236px);
      overflow: auto;
      width: calc(100% - 370px - 400px);
      border: 1px solid #bdc0c1;
      border-top: 0;
      border-bottom: 0;
    }

    .graf_block {
      width: 400px;
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
  `],
  template: `
      <div class="main_info">
          <div class="photo" [style.background-image]= "person?.photoMini ? 'url('+ person?.photoMini +')' : null">
              <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile) = "addFile($event)" [obj_id]="person.id"
                (progressState) = "displayProgress($event)" [obj_type] = "'persons'">
              </ui-upload-file>
          </div>
          <div class="last_name">{{utils.getSurname(person.name) || "Неизвестно"}}</div>
          <div class="first_name">{{utils.getFirstName(person.name) || "Неизвестно"}}</div>
          <div>{{person.isMiddleman ? "Посредник" : "Принципал"}}</div>
          <ui-view-value
              [options]="typeCodeOptions"
              [value]="person.typeCode"
          >
          </ui-view-value>
          <ui-tag [value]="person.tag"></ui-tag>
      </div>
      <hr class='underline'>
      <div>
        <div class="pane">
        <div class="property" style="overflow-x: hidden;">
            <div class="edit_ready">
                <a href="#" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</a>
                <a href="#" *ngIf="editEnabled && canEditable" (click)="save()">Готово</a>
                <div *ngIf="!canEditable" class="pointer_menu" (click)="contextMenu($event)">...</div>
            </div>
            <div class="property_body" *ngIf="!editEnabled">
                <ul>
                  <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                  <li><span class="view-label">Телефон</span> <span class="view-value unknown"
                                                                    *ngIf="get_length(person?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                  </li>
                  <li *ngIf="person?.phoneBlock?.main" class="subpar"><span class="view-label">Личный</span> <span
                    class="view-value link">{{person?.phoneBlock?.main | mask: "+0 " + phoneMasks.main}}</span></li>
                  <li *ngIf="person?.phoneBlock?.cellphone" class="subpar"><span class="view-label">Личный</span> <span
                    class="view-value link">{{person?.phoneBlock?.cellphone | mask: "+0 " + phoneMasks.cellphone}}</span></li>
                  <li *ngIf="person?.phoneBlock?.office" class="subpar"><span class="view-label">Рабочий</span> <span
                    class="view-value link">{{person?.phoneBlock?.office | mask: "+0 " + phoneMasks.office}}</span></li>
                  <li *ngIf="person?.phoneBlock?.fax" class="subpar"><span class="view-label">Рабочий</span> <span
                    class="view-value link">{{person?.phoneBlock?.fax | mask: "+0 " + phoneMasks.fax}}</span></li>
                  <li *ngIf="person?.phoneBlock?.ip" class="subpar"><span class="view-label">Внутренний</span> <span
                    class="view-value link">{{person?.phoneBlock?.ip | mask: phoneMasks.ip}}</span></li>
                  <li *ngIf="person?.phoneBlock?.home" class="subpar"><span class="view-label">Домашний</span> <span
                    class="view-value link">{{person?.phoneBlock?.home | mask: "+0 " + phoneMasks.home}}</span></li>
                  <li *ngIf="person?.phoneBlock?.other" class="subpar"><span class="view-label">Другой</span> <span
                    class="view-value link">{{person?.phoneBlock?.other | mask: "+0 " + phoneMasks.other}}</span></li>
                  <li><span class="view-label">Статус</span>
                    <ui-view-value [options]="middlemanOptions" [value]="person?.isMiddleman ? 'middleman' : 'owner'"></ui-view-value>
                  </li>
                  <li *ngIf="person?.isMiddleman"><span class="view-label">Организация:</span>
                    <span class="view-value" [class.link]="person.organisation?.id" (click)="openOrganisation()"
                    >{{ person.organisation?.name || 'Неизвестно'}}</span>
                  </li>
                  <li *ngIf="canEditable"><span class="view-label">Тип контакта</span>
                    <ui-view-value [options]="typeCodeOptions" [value]="person?.typeCode"></ui-view-value>
                  </li>
                  <li><span class="view-label">Лояльность</span>
                    <ui-view-value [options]="stateCodeOptions" [value]="person?.stateCode"></ui-view-value>
                  </li>
                  <li *ngIf="canEditable"><span class="view-label">Ответственный</span>
                    <span class="view-value" [class.link]="person.agentId" (click)="openUser()">{{ person.agent?.name || 'Неизвестно'}}</span>
                  </li>
                  <li><span class="view-label">E-mail</span> <span class="view-value unknown"
                                                                   *ngIf="get_length(person?.emailBlock)==0">{{ "Неизвестно"}}</span>
                  </li>
                  <li *ngIf="person?.emailBlock?.main" class="subpar"><span class="view-label">Основной</span> <span
                    class="view-value link">{{person?.emailBlock?.main}}</span></li>
                  <li *ngIf="person?.emailBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <span
                    class="view-value link">{{person?.emailBlock?.work}}</span></li>
                  <li *ngIf="person?.emailBlock?.other" class="subpar"><span class="view-label">Другой</span> <span
                    class="view-value link">{{person?.emailBlock?.other}}</span></li>
                  <li><span class="view-label">Web-сайт</span> <span class="view-value unknown"
                                                                     *ngIf="get_length(person?.siteBlock)==0">{{ "Неизвестно"}}</span>
                  </li>
                  <li *ngIf="person?.siteBlock?.main" class="subpar"><span class="view-label">Основной</span> <a
                    [href]="'http://'+person?.siteBlock?.main" target="_blank">{{person?.siteBlock?.main}}</a></li>
                  <li *ngIf="person?.siteBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <a
                    [href]="'http://'+person?.siteBlock?.work" target="_blank">{{person?.siteBlock?.work}}</a></li>
                  <li *ngIf="person?.siteBlock?.other" class="subpar"><span class="view-label">Другой</span> <a
                    [href]="'http://'+person?.siteBlock?.other" target="_blank">{{person?.siteBlock?.other}}</a></li>
                  <li><span class="view-label">Соцсети</span> <span class="view-value unknown"
                                                                    *ngIf="get_length(person?.socialBlock)==0">{{ "Неизвестно"}}</span>
                  </li>
                  <li *ngIf="person?.socialBlock?.vk" class="subpar"><span class="view-label">Вконтакте</span> <span
                    class="view-value link">{{person?.socialBlock?.vk}}</span></li>
                  <li *ngIf="person?.socialBlock?.ok" class="subpar"><span class="view-label">Одноклассники</span> <span
                    class="view-value link">{{person?.socialBlock?.ok}}</span></li>
                  <li *ngIf="person?.socialBlock?.twitter" class="subpar"><span class="view-label">Twitter</span> <span
                    class="view-value link">{{person?.socialBlock?.twitter}}</span></li>
                  <li *ngIf="person?.socialBlock?.facebook" class="subpar"><span class="view-label">Facebook</span> <span
                    class="view-value link">{{person?.socialBlock?.facebook}}</span></li>
                  <li *ngIf="person?.socialBlock?.google" class="subpar"><span class="view-label">Google+</span> <span
                    class="view-value link">{{person?.socialBlock?.google}}</span></li>

                  <li><span class="view-label">Мессенджеры</span> <span class="view-value unknown"
                                                                    *ngIf="get_length(person?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                  </li>
                  <li *ngIf="person?.messengerBlock?.whatsapp" class="subpar"><span class="view-label">WhatsApp</span> <span
                    class="view-value link">{{person?.messengerBlock?.whatsapp}}</span></li>
                  <li *ngIf="person?.messengerBlock?.telegram" class="subpar"><span class="view-label">Telegram</span> <span
                    class="view-value link">{{person?.messengerBlock?.telegram}}</span></li>
                  <li *ngIf="person?.messengerBlock?.viber" class="subpar"><span class="view-label">Viber</span> <span
                    class="view-value link">{{person?.messengerBlock?.viber}}</span></li>
                </ul>
                <ul>
                  <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                  <li><span class="view-label">Добавлено</span> <span
                    class="view-value">{{ utils.getDateInCalendar(person.addDate)}}</span></li>
                  <li><span class="view-label">Изменено</span> <span
                    class="view-value">{{ utils.getDateInCalendar(person.changeDate)}}</span></li>
                  <li><span class="view-label">Назначено</span> <span
                    class="view-value">{{ utils.getDateInCalendar(person.assignDate)}}</span></li>
                  <li><span class="view-label">Договор</span> <span class="view-value unknown"
                                                                    *ngIf="!person.contractBlock">Неизвестно</span></li>
                  <li *ngIf="person.contractBlock?.number" class="subpar"><span class="view-label">Номер</span> <span
                    class="view-value">{{person.contractBlock.number}}</span></li>
                  <li *ngIf="person.contractBlock?.begin" class="subpar"><span class="view-label">Начало</span> <span
                    class="view-value">{{person.contractBlock.begin}}</span></li>
                  <li *ngIf="person.contractBlock?.end" class="subpar"><span class="view-label">Окончание</span> <span
                    class="view-value">{{person.contractBlock.end}}</span></li>
                  <li *ngIf="person.contractBlock?.contined" class="subpar"><span class="view-label">Продлён</span> <span
                    class="view-value">{{person.contractBlock.contined}}</span></li>
                  <li *ngIf="person.contractBlock?.terminated" class="subpar"><span class="view-label">Расторгнут</span> <span
                    class="view-value">{{person.contractBlock.terminated}}</span></li>
                  <li><span class="view-label">Источник</span>
                    <ui-view-value [options]="sourceCodeOptions" [value]="person.sourceCode"></ui-view-value>
                  </li>
                </ul>
                <ul>
                  <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                  <li style="height:auto" class="descr">
                    <div>{{person?.description || 'Неизвестно'}}</div>
                  </li>
                </ul>
            </div>
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
                  <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ</div>
                  <li style="height: auto;"><textarea placeholder="Введите текст дополнительного описания"
                                                      [(ngModel)]="person.description"></textarea></li>
                </ul>
                <ul>
                  <div (click)="show_hide($event)">ТЭГИ</div>
                  <li style="height: auto; padding: 0;">
                    <ui-tag-block [value]="person?.tag" (valueChange)="person.tag = $event"></ui-tag-block>
                  </li>
                </ul>
            </div>
        </div>
      </div>
      <div class="work-area">
          <div class="rating_block">
            <rating-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></rating-view>
          </div>
          <div class="comment_block">
            <comments-view [obj]="person" [type]="canEditable == true ? 'person' : 'user'"></comments-view>
          </div>
          <div class="graf_block">
            <div class="graf1">
                <digest-timeline-chart></digest-timeline-chart>
            </div>
            <div class="graf2">
              <digest-line-chart
                  [title]="'РЕЙТИНГ В ДИНАМИКЕ'" [variant] = "1"
              ></digest-line-chart>
            </div>
            <div class="graf3">
              <digest-line-chart
                   [title]="'АКТИВНОСТЬ ВЗАИМОДЕЙСТВИЯ'" [variant] = "0"
              ></digest-line-chart>
            </div>
          </div>
          <div class="right_pane">
              <ui-tabs-menu>
                  <ui-tab [title]="'ЗАЯВКИ'">

                  </ui-tab>
                  <ui-tab [title]="'ОБЪЕКТЫ'">
                  </ui-tab>
                  <ui-tab [title]="'СДЕЛКИ'">
                  </ui-tab>
                  <ui-tab [title]="'АКТИВНОСТЬ'">
                  </ui-tab>
              </ui-tabs-menu>
          </div>
      </div>
    </div>      `
})

export class TabPersonComponent implements OnInit, AfterViewInit {
  public tab: Tab;
  canEditable: boolean = true;
  utils = Utils;
  person: Person = new Person();
  middlemanOptions = Person.middlemanOptions;
  typeCodeOptions = Person.typeCodeOptions;
  stateCodeOptions = [];//Person.stateCodeOptions;
  sourceCodeOptions = Person.sourceCodeOptions;

  phoneMasks = PhoneBlock.phoneFormats;
  organisationsOpts: any[] = [];
  agentOpts: any[] = [{class:'entry', value: null, label: "Не назначено"},
                      {class:'entry', value: this._sessionService.getUser().id, label: this._sessionService.getUser().name}
  ];

  offers: Offer[];
  requests: Request[];

  paneHidden: boolean = false;
  paneWidth: number;
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

    _organisationService.list(0, 10, 'local', {}, {}, null).subscribe(organisations => {
        for(let i = 0; i < organisations.length; i++) {
          let o = organisations[i];
          this.organisationsOpts.push({
            value: o.id,
            label: o.name
          });
        }
      }
    );

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
      if(this.person.id) {
        this.tab.header = 'Контакт';
      } else {
          this.tab.header = 'Новый контакт';
        }
    });
  }

  onResize(e) {
    this.calcSize();
  }

  calcSize() {
    if(this.paneHidden)
      this.paneWidth = 0;
    else
      this.paneWidth = 370;
  }

  show_hide(event) {
    let ul = (<HTMLElement>event.currentTarget).parentElement;
    if(ul.offsetHeight == 42) {
      ul.style.setProperty('height', 'auto');
      ul.style.setProperty('overflow', 'visible');
    }
    else {
      ul.style.setProperty('height', '42px');
      ul.style.setProperty('overflow', 'hidden');
    }
  }

  showMenu(event) {
    let elem = <HTMLElement>((<HTMLElement>event.currentTarget).getElementsByTagName('UI-MULTISELECT').item(0));
    if(elem.style.display != 'none') {
      elem.style.setProperty('display', 'none');
    } else {
      elem.style.removeProperty('display');
    }
  }

  get_length(obj: any) {
    let count = 0;
    for(let prop in obj) {
      if(obj[prop]) {
        count++;
      }
    }
    return count;
  }

  toggleEdit() {
    this.editEnabled = !this.editEnabled;
  }

  save() {
    if(PhoneBlock.getAsArray(this.person.phoneBlock).length <= 0) {
        alert("Не задан номер телефона");
        return;
    }

    if(!this.person.isMiddleman || !this.person.organisation ||!this.person.organisation.id){
        delete this.person.organisation;
        delete this.person.organisationId;
    }

    this._personService.save(this.person).subscribe(
      person => {
        setTimeout(() => {
          this.person.copyFields(person);
        });
        this.toggleEdit();
      },
      err => {
        console.log('Error: ' + err);
      }
    );
  }

  openOrganisation() {
    if(this.person.organisation.id) {
      let tab_sys = this._hubService.getProperty('tab_sys');
      tab_sys.addTab('organisation', {organisation: this.person.organisation});
    }
  }

  openUser() {
    if(this.person.agent.id) {
      let tab_sys = this._hubService.getProperty('tab_sys');
      tab_sys.addTab('user', {organisation: this.person.agent});
    }
  }

  agentChanged(e) {
    this.person.agentId = e.selected.value;
    if(this.person.agentId != null) {
      this._userService.get(this.person.agentId).subscribe(agent => {
        this.person.agent = agent;
      });
    }
  }

  addFile(event){
      this.person.photo = event;
      this.person.photoMini = event;
  }

  displayProgress(event){
  }

  /*find_contact(structure: any) {
    for(let field in structure) { //9144174361
      if(structure[field] && structure[field].length > 9) {
        let temp = structure[field];
        temp = temp.replace(/\(|\)|\+|\-|\s|/g, '');
        if(temp.charAt(0) == '7' || temp.charAt(0) == '8')
          temp = temp.substring(1);
        if(temp.length > 9) {
          temp = "7" + temp;
          this._personService.list(0, 1, 'local', {phone:temp}, null, null).subscribe(persons => {
            if(persons[0] && this.person.id != persons[0].id) {
              alert("Контакт с номером телефона +" + temp + " уже сохранени под именем " + persons[0].name);
              structure[field] = null;
            } else {
              /*this._organisationService.list(temp, true).subscribe(org => {
                 if(org[0]){
                    alert("Номером телефона +" + temp + " уже закреплен за организацией " + org[0].name);
                 }
               });
            }
          });

        }
      }
  }
}*/

  contextMenu(e) {
      e.preventDefault();
      e.stopPropagation();


      let uOpt = [];

      let menu = {
          pX: e.pageX,
          pY: e.pageY,
          scrollable: false,
          items: [
              {class: "entry", disabled: false, icon: "", label: 'Проверить', callback: () => {
                  //this.openPopup = {visible: true, task: "check"};
              }},

              {class: "entry", disabled:false, icon: "", label: "Просмотреть фото",
                  callback: () => {
                      this.clickContextMenu({event: "photo"});
                  }
              },
              {class: "delimiter"},
              {class: "entry", disabled: this.person.userRef != null, icon: "", label: "Добавить в контакты", callback: () => {
                  this.clickContextMenu({event: "add_to_local"});
              }},
              {class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: [

              ]},
              {class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: [

              ]},
              {class: "delimiter"},
              {class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
                  {class: "entry", disabled: false, label: "Email1"},
                  {class: "entry", disabled: false, label: "Email2"},
                  {class: "entry", disabled: false, label: "Email3"},
              ]},
              {class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                  {class: "entry", disabled: false, label: "Номер1"},
                  {class: "entry", disabled: false, label: "Номер2"},
                  {class: "entry", disabled: false, label: "Номер3"},
              ]},
              {class: "submenu", disabled: false, icon: "", label: "Позвонить",  items: [
                  {class: "entry", disabled: false, label: "Номер1"},
                  {class: "entry", disabled: false, label: "Номер2"},
                  {class: "entry", disabled: false, label: "Номер3"},
              ]},
              {class: "submenu", disabled: false, icon: "", label: "Написать в чат", items: [

              ]}
          ]
      };

      this._hubService.shared_var['cm'] = menu;
      this._hubService.shared_var['cm_hidden'] = false;
  }

  clickContextMenu(evt: any){
      if(evt.event == "add_to_local"){
            this.person.changeDate = Math.round((Date.now() / 1000));
            this.person.addDate = this.person.changeDate;
            this.person.stateCode = 'raw';
            this.person.typeCode = "client";
            if(evt.agent){
                this.person.agentId = evt.agent.id;
                this.person.agent = evt.agent;
            } else {
                this.person.agentId = null;
                this.person.agent = null;
            }
            this._personService.save(this.person);
        } else if(evt.event == "del_agent"){
            this.person.agentId = null;
            this.person.agent = null;
            this._personService.save(this.person);
        } else if(evt.event == "del_obj"){

        } else if(evt.event == "check"){

        } else if(evt.event == "photo"){

        }
  }
}
