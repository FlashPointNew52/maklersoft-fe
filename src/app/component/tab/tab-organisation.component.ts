import {Component, OnInit, AfterViewInit} from '@angular/core';

import {AnalysisService} from '../../service/analysis.service';
import {Tab} from '../../class/tab';
import {Offer} from '../../entity/offer';
import {Person} from '../../entity/person';
import {Organisation} from '../../entity/organisation';
import {Utils} from '../../class/utils';
import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {UserService} from '../../service/user.service';
import {OrganisationService} from '../../service/organisation.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {OfferService} from '../../service/offer.service';
import {PersonService} from '../../service/person.service';
import {SessionService} from "../../service/session.service";
import {PhoneBlock} from "../../class/phoneBlock";

@Component({
    selector: 'tab-organisation',
    inputs: ['tab'],
    styles: [`
        .main_info {
            flex-wrap: wrap;
            align-content: flex-start;
            padding-left: 30px;
            width: 341px;
            letter-spacing: 0;
        }

        .main_info > .last_name {
            font-size: 18px;
            text-transform: uppercase;
            margin-top: 10px;
            width: 100%;
            min-height: 18px;
            max-height: 42px;
            height: auto;
            line-height: 19px;
            font-weight: bold;
        }

        .main_info > .city {
            height: 12px;
            line-height: 12px;
            margin-top: 8px;
        }

        .main_info > .street {
            height: 12px;
            line-height: 12px;
            margin-top: 3px;
        }

        .main_info > ui-view-value {
            font-style: italic;
            margin-top: 3px;
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
            <div class="last_name">{{organisation?.name || "Неизвестно"}}</div>
            <div class="city">{{organisation?.addressBlock?.city || "Город не указано"}}</div>
            <div class="street">{{organisation?.addressBlock?.street || "Улица не указана"}} {{organisation?.addressBlock?.house}}</div>
            <div>{{organisation.isMiddleman ? "Посредник" : "Принципал"}}</div>
            <ui-view-value
                [options]="typeCodeOptions"
                [value]="organisation.typeCode"
            >
            </ui-view-value>
            <ui-tag [value]="organisation.tag"></ui-tag>
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
                                    *ngIf="get_length(organisation?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                            </li>
                            <li *ngIf="organisation?.phoneBlock?.main" class="subpar"><span class="view-label">Основной</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.main | mask: "+0 " + phoneMasks.main}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.cellphone" class="subpar"><span class="view-label">Основной</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.cellphone | mask: "+0 "+ phoneMasks.cellphone}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.home" class="subpar"><span class="view-label">Основной</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.home | mask: "+0 "+ phoneMasks.home}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.office" class="subpar"><span class="view-label">Рабочий</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.office | mask: "+0 "+ phoneMasks.office}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.fax" class="subpar"><span class="view-label">Рабочий</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.fax | mask: ("+0 "+ phoneMasks.fax)}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.other" class="subpar"><span class="view-label">Рабочий</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.other | mask: ("+0 "+ phoneMasks.other)}}</span></li>
                            <li *ngIf="organisation?.phoneBlock?.ip" class="subpar"><span class="view-label">IP-телефон</span> <span
                              class="view-value link">{{organisation?.phoneBlock?.ip | mask: phoneMasks.ip}}</span></li>
                            <li><span class="view-label">Форма управления</span>
                              <ui-view-value [options]="goverTypeOptions" [value]="organisation.goverType"></ui-view-value>
                            </li>
                            <li *ngIf="organisation.goverType != 'franchise' && organisation.goverType != 'main'">
                              <span class="view-label">Основной офис</span>
                              <span class="view-value"  [class.link]="organisation?.main_office?.id" (click)="openOrganisation()">
                                            {{ organisation?.main_office?.name || 'Неизвестно'}}
                                </span>
                            </li>
                            <li *ngIf="!organisation.ourCompany"><span class="view-label">Статус</span>
                              <ui-view-value [options]="middlemanOptions" [value]="organisation?.isMiddleman ? 'middleman' : 'owner'"></ui-view-value>
                            </li>
                            <li *ngIf="organisation.ourCompany">
                              <span class="view-label">Тип контрагента</span>
                              <span class="view-value">Наша компания</span>
                            </li>
                            <li *ngIf="!organisation.ourCompany"><span class="view-label">Тип контрагента</span>
                              <ui-view-value [options]="typeCodeOptions" [value]="organisation?.typeCode"></ui-view-value>
                            </li>
                            <li><span class="view-label">Лояльность</span>
                              <ui-view-value [options]="stateCodeOptions" [value]="organisation?.stateCode"></ui-view-value>
                            </li>
                            <li><span class="view-label">Контактное лицо</span>
                              <span class="view-value" [class.link] = "organisation.contact?.id || organisation.agent?.id"
                                    (click)="openPerson(organisation.contact || null)"
                              >{{organisation.contact?.name  || organisation.agent?.name ||'Не указано'}}</span>
                            </li>
                            <li><span class="view-label">Адрес</span> <span class="view-value unknown" *ngIf="!organisation.addressBlock">Неизвестно</span>
                            </li>
                            <li *ngIf="organisation.addressBlock?.region" class="subpar"><span class="view-label">Регион</span> <span
                              class="view-value">{{organisation.addressBlock.region}}</span></li>
                            <li *ngIf="organisation.addressBlock?.city" class="subpar"><span class="view-label">Нас. пункт</span> <span
                              class="view-value">{{organisation.addressBlock.city}}</span></li>
                            <li *ngIf="organisation.addressBlock?.admArea" class="subpar"><span class="view-label">Адм. район</span>
                              <span class="view-value">{{organisation.addressBlock.admArea}}</span></li>
                            <li *ngIf="organisation.addressBlock?.area" class="subpar"><span class="view-label">Район</span> <span
                              class="view-value">{{organisation.addressBlock.area}}</span></li>
                            <li *ngIf="organisation.addressBlock?.street" class="subpar"><span class="view-label">Улица</span> <span
                              class="view-value">{{organisation.addressBlock.street}}</span></li>
                            <li *ngIf="organisation.addressBlock?.house" class="subpar"><span class="view-label">Дом</span> <span
                              class="view-value">{{organisation.addressBlock.house}}</span></li>
                            <li *ngIf="organisation.addressBlock?.housing" class="subpar"><span class="view-label">Корпус</span> <span
                              class="view-value">{{organisation.addressBlock.housing}}</span></li>
                            <li *ngIf="organisation.addressBlock?.apartment" class="subpar"><span class="view-label">Офис</span> <span
                              class="view-value">{{organisation.addressBlock.apartment}}</span></li>
                            <li *ngIf="organisation.addressBlock?.bus_stop" class="subpar"><span class="view-label">Остановка</span> <span
                              class="view-value">{{organisation.addressBlock.bus_stop}}</span></li>
                            <li *ngIf="organisation.addressBlock?.metro" class="subpar"><span class="view-label">Метро</span> <span
                              class="view-value">{{organisation.addressBlock.metro}}</span></li>
                            <li><span class="view-label">E-mail</span> <span class="view-value unknown"
                                                                             *ngIf="get_length(organisation?.emailBlock)==0">{{ "Неизвестно"}}</span>
                            </li>
                            <li *ngIf="organisation?.emailBlock?.main" class="subpar"><span class="view-label">Основной</span> <span
                              class="view-value link">{{organisation?.emailBlock?.main}}</span></li>
                            <li *ngIf="organisation?.emailBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <span
                              class="view-value link">{{organisation?.emailBlock?.work}}</span></li>
                            <li *ngIf="organisation?.emailBlock?.other" class="subpar"><span class="view-label">Другой</span> <span
                              class="view-value link">{{organisation?.emailBlock?.other}}</span></li>
                            <li><span class="view-label">Web-сайт</span> <span class="view-value unknown"
                                                                               *ngIf="get_length(organisation?.siteBlock)==0">{{ "Неизвестно"}}</span>
                            </li>
                            <li *ngIf="organisation?.siteBlock?.main" class="subpar"><span class="view-label">Основной</span> <a
                              [href]="'http://'+organisation?.siteBlock?.main" target="_blank">{{organisation?.siteBlock?.main}}</a></li>
                            <li *ngIf="organisation?.siteBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <a
                              [href]="'http://'+organisation?.siteBlock?.work" target="_blank">{{organisation?.siteBlock?.work}}</a></li>
                            <li *ngIf="organisation?.siteBlock?.other" class="subpar"><span class="view-label">Другой</span> <a
                              [href]="'http://'+organisation?.siteBlock?.other" target="_blank">{{organisation?.siteBlock?.other}}</a></li>
                            <li><span class="view-label">Соцсети</span> <span class="view-value unknown"
                                                                              *ngIf="get_length(organisation?.socialBlock)==0">{{ "Неизвестно"}}</span>
                            </li>
                            <li *ngIf="organisation?.socialBlock?.vk" class="subpar"><span class="view-label">Вконтакте</span> <span
                              class="view-value link">{{organisation?.socialBlock?.vk}}</span></li>
                            <li *ngIf="organisation?.socialBlock?.ok" class="subpar"><span class="view-label">Одноклассники</span> <span
                              class="view-value link">{{organisation?.socialBlock?.ok}}</span></li>
                            <li *ngIf="organisation?.socialBlock?.twitter" class="subpar"><span class="view-label">Twitter</span> <span
                              class="view-value link">{{organisation?.socialBlock?.twitter}}</span></li>
                            <li *ngIf="organisation?.socialBlock?.facebook" class="subpar"><span class="view-label">Facebook</span> <span
                              class="view-value link">{{organisation?.socialBlock?.facebook}}</span></li>
                            <li *ngIf="organisation?.socialBlock?.google" class="subpar"><span class="view-label">Google+</span> <span
                              class="view-value link">{{organisation?.socialBlock?.google}}</span></li>

                            <li><span class="view-label">Мессенджеры</span> <span class="view-value unknown"
                                                                                 *ngIf="get_length(organisation?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                            </li>
                            <li *ngIf="organisation?.messengerBlock?.whatsapp" class="subpar"><span class="view-label">WhatsApp</span> <span
                              class="view-value link">{{organisation?.messengerBlock?.whatsapp}}</span></li>
                            <li *ngIf="organisation?.messengerBlock?.telegram" class="subpar"><span class="view-label">Telegram</span> <span
                              class="view-value link">{{organisation?.messengerBlock?.telegram}}</span></li>
                            <li *ngIf="organisation?.messengerBlock?.viber" class="subpar"><span class="view-label">Viber</span> <span
                              class="view-value link">{{organisation?.messengerBlock?.viber}}</span></li>
                        </ul>
                        <ul>
                            <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                            <li><span class="view-label">Добавлено</span> <span
                              class="view-value">{{ utils.getDateInCalendar(organisation.addDate)}}</span></li>
                            <li><span class="view-label">Изменено</span> <span
                              class="view-value">{{ utils.getDateInCalendar(organisation.changeDate)}}</span></li>
                            <li><span class="view-label">Назначено</span> <span
                              class="view-value">{{ utils.getDateInCalendar(organisation.assignDate)}}</span></li>

                            <li><span class="view-label">Источник</span>
                              <ui-view-value [options]="sourceCodeOptions" [value]="organisation.sourceCode"></ui-view-value>
                            </li>

                        </ul>
                        <ul>
                            <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                            <li style="height:auto" class="descr">
                              <div>{{organisation?.description || 'Неизвестно'}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="property_body editable" *ngIf="editEnabled">
                      <ul>
                        <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Телефон контрагента</span>
                          <span class="view-value unknown" *ngIf="get_length(organisation?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{'main': {label: 'Основной', placeholder: 'Введите номер телефона'},
                                            'cellphone' : {label: 'Основной', placeholder: 'Введите номер телефона'},
                                            'home': {label: 'Основной', placeholder: 'Введите номер телефона'},
                                            'office': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                            'fax': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                             'other': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                             'ip': {label: 'IP-телефон', placeholder: 'Введите номер телефона'}
                                          }"
                                          [masks]="phoneMasks" [prefix] = "'+7'"
                                          [field]="organisation?.phoneBlock" [width]="'53%'"
                                          (onChange)="organisation.phoneBlock = $event"></ui-multiselect>
                        </li>
                        <li>
                          <ui-input-line [placeholder]="'Название организации'" [value]="organisation?.name || ''"
                                         (onChange)="organisation.name = $event"></ui-input-line>
                        </li>
                        <li style="height: auto;"><span class="view-label sliding-label">Форма управления</span>
                          <ui-slidingMenu [options]="goverTypeOptions" [value]="organisation.goverType"
                                          (onChange)="organisation.goverType = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li *ngIf="organisation.goverType != 'franchise' && organisation.goverType != 'main'">
                          <ui-input-line [placeholder]="'Основной офис'" [value]="organisation?.main_office?.name || ''"
                                         (onChange)="organisation.main_office = $event; checkOur($event);"
                                         [queryTipe]="'organisation'" [filter]="{}"></ui-input-line>
                        </li>
                        <li style="height: auto;" *ngIf="!organisation.ourCompany"><span class="view-label sliding-label">Статус</span>
                          <ui-slidingMenu [options]="middlemanOptions" [value]="organisation?.isMiddleman ? 'middleman' : 'owner'"
                                          (onChange)="organisation.isMiddleman = $event.selected.value == 'owner' ? false : true"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;" *ngIf="!organisation.ourCompany"><span class="view-label sliding-label">Тип контрагента</span>
                          <ui-slidingMenu [options]="typeCodeOptions" [value]="organisation?.typeCode"
                                          (onChange)="organisation.typeCode = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;"><span class="view-label sliding-label">Лояльность</span>
                          <ui-slidingMenu [options]="stateCodeOptions" [value]="organisation?.stateCode"
                                          (onChange)="organisation.stateCode = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li>
                          <ui-input-line [placeholder]="'Контактное лицо'" [value]="organisation?.contact?.name || organisation?.agent?.name || 'Не указано'"
                                         (onChange)="organisation.ourCompany ? organisation.agent = $event : organisation.contact = $event "
                                         [queryTipe]="organisation.ourCompany ? 'user' :'person'"
                          >
                          </ui-input-line>
                        </li>
                        <li class="multiselect">
                          <ui-input-line [placeholder]="'Адрес организации'" [value]="''" style="height: 42px" [width]="'225px'"
                                         (onChange)="organisation.addressBlock = $event" [queryTipe]="'address'"></ui-input-line>
                          <ui-multiselect [style.display]="get_length(organisation.addressBlock) == 0 ? 'none' : ''"
                                          [params]="{
                                          'region': {label: 'Регион', placeholder: 'Введите название сайта'},
                                          'city': {label: 'Нас. пункт', placeholder: 'Введите название сайта'},
                                          'admArea': {label: 'Адм. район', placeholder: 'Введите название сайта'},
                                          'area': {label: 'Район', placeholder: 'Введите название сайта'},
                                          'street': {label: 'Улица', placeholder: 'Введите название сайта'},
                                          'house': {label: 'Дом', placeholder: 'Введите название сайта'},
                                          'housing': {label: 'Корпус', placeholder: 'Введите название сайта'},
                                          'apartment': {label: 'Офис', placeholder: 'Введите название сайта'},
                                          'bus_stop': {label: 'Остановка', placeholder: 'Введите название сайта'},
                                          'metro': {label: 'Метро', placeholder: 'Введите название сайта'}
                                      }"
                                          [masks]="{}" [field]="organisation.addressBlock" [width]="'36%'"
                                          (onChange)="organisation.addressBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">E-mail</span> <span
                          class="view-value unknown" *ngIf="get_length(organisation?.emailBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                          'work' : {label: 'Рабочий', placeholder: 'Введите E-mail'},
                                          'main' : {label: 'Основной', placeholder: 'Введите E-mail'},
                                          'other' : {label: 'Другой', placeholder: 'Введите E-mail'}
                                      }"
                                          [masks]="{}" [field]="organisation?.emailBlock" [width]="'36%'"
                                          (onChange)="organisation.emailBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Web-сайт</span> <span
                          class="view-value unknown" *ngIf="get_length(organisation?.siteBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                          'work' : {label: 'Рабочий', placeholder: 'Введите название сайта'},
                                          'main' : {label: 'Основной', placeholder: 'Введите название сайта'},
                                          'other' : {label: 'Другой', placeholder: 'Введите название сайта'}
                                      }"
                                          [masks]="{}" [field]="organisation?.siteBlock" [width]="'36%'"
                                          (onChange)="organisation.siteBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Соцсети</span> <span
                          class="view-value unknown" *ngIf="get_length(organisation?.socialBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                          'vk' : {label: 'Вконтакте', placeholder: 'Введите адрес страницы'},
                                          'ok' : {label: 'Одноклассники', placeholder: 'Введите адрес страницы'},
                                          'facebook' : {label: 'Facebook', placeholder: 'Введите адрес страницы'},
                                          'google' : {label: 'Google+', placeholder: 'Введите адрес страницы'},
                                          'twitter' : {label: 'Twitter', placeholder: 'Введите адрес страницы'}
                                      }"
                                          [masks]="{}" [field]="organisation?.socialBlock" [width]="'36%'"
                                          (onChange)="organisation.socialBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Мессенджеры</span> <span
                          class="view-value unknown" *ngIf="get_length(organisation?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                          'whatsapp' : {label: 'WhatsApp', placeholder: 'Введите номер телефона'},
                                          'telegram' : {label: 'Telegram', placeholder: 'Введите номер телефона'},
                                          'viber' : {label: 'Viber', placeholder: 'Введите номер телефона'}
                                      }"
                                          [masks]="{}" [field]="organisation?.messengerBlock" [width]="'36%'"
                                          (onChange)="organisation.messengerBlock = $event"></ui-multiselect>
                        </li>

                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                        <li style="height: auto;"><span class="view-label sliding-label">Источник</span>
                          <ui-slidingMenu [options]="sourceCodeOptions" [value]="organisation.sourceCode"
                                          (onChange)="organisation.sourceCode = $event.selected.value"></ui-slidingMenu>
                        </li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ</div>
                        <li style="height: auto;"><textarea placeholder="Введите текст дополнительного описания"
                                                            [(ngModel)]="organisation.description"></textarea></li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">ТЭГИ</div>
                        <li style="height: auto; padding: 0;">
                          <ui-tag-block [value]="organisation?.tag" (valueChange)="organisation.tag = $event"></ui-tag-block>
                        </li>
                      </ul>
                    </div>
                </div>
            </div>

            <div class="work-area">
                <div class="rating_block">
                    <rating-view [obj]="organisation" [type]="'organisation'"></rating-view>
                </div>
                <div class="comment_block">
                    <comments-view [obj]="organisation" [type]="'organisation'"></comments-view>
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
                        <ui-tab [title]="'СОТРУДНИКИ'">
                        </ui-tab>
                        <ui-tab [title]="'ОФИСЫ'">
                        </ui-tab>
                    </ui-tabs-menu>
                </div>
            </div>
            <!-- РАБОЧАЯ ОБЛАСТЬ: КОНЕЦ -->
        </div>
    `
})

export class TabOrganisationComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    public organisation: Organisation;
    canEditable: boolean = true;
    utils = Utils;
    typeCodeOptions = Organisation.typeCodeOptions;
    stateCodeOptions = [];// Organisation.stageCodeOptions;
    sourceCodeOptions = Organisation.sourceCodeOptions;
    goverTypeOptions = Organisation.goverTypeOptions;
    middlemanOptions = Organisation.middlemanOptions;
    phoneMasks = PhoneBlock.phoneFormats;
    persons: Person[];
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
        if(this.organisation.id && this.organisation.accountId == this._sessionService.getUser().accountId && this.canEditable) {
            this._organisationService.get(this.organisation.id).subscribe(org => {
              this.organisation = org;
            });
        }

        if(!this.organisation.main_office && this.organisation.main_office_id != null){
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
                this.tab.header = 'Контрагент';
            } else {
                this.tab.header = 'Новый контрагент';
            }
        });
    }


    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    save() {
        if (this.organisation.ourCompany){
            delete this.organisation.contact;
            delete this.organisation.contactId;
            this.organisation.agentId = this.organisation.agent.id || null;
        } else {
            delete this.organisation.agent;
            delete this.organisation.agentId;
            this.organisation.contactId = this.organisation.contact ? this.organisation.contact.id : null;
        }

        if(!this.organisation.main_office || !this.organisation.main_office.id)
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

    get_length(obj: any) {
      let count = 0;
      for(let prop in obj) {
        if(obj[prop]) {
          count++;
        }
      }
      return count;
    }

    showMenu(event) {
      let elem = <HTMLElement>((<HTMLElement>event.currentTarget).getElementsByTagName('UI-MULTISELECT').item(0));
      if(elem.style.display != 'none') {
        elem.style.setProperty('display', 'none');
      } else {
        elem.style.removeProperty('display');
      }
    }

    openOrganisation() {
          if(this.organisation.main_office_id) {
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('organisation', {organisation: this.organisation.main_office});
          }
    }

    openUser(){
        /*if(this.organisation.agent.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.organisation.agent});
        }*/
    }

    openPerson(person: Person){
        if(person.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('person', {person: person});
        }
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
              if(persons[0] && this.organisation.id != persons[0].id) {
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
                {class: "entry", disabled: this.organisation.orgRef, icon: "", label: "Добавить в контрагенты", callback: () => {
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
            this.organisation.changeDate = Math.round((Date.now() / 1000));
            this.organisation.addDate = this.organisation.changeDate;
            this.organisation.stateCode = 'raw';
            this.organisation.typeCode = "realtor";
            this.organisation.id = null;
            this._organisationService.save(this.organisation);
        } else if(evt.event == "del_obj"){

        } else if(evt.event == "check"){

        }
    }

    checkOur(company: Organisation){
      if(company != null &&
        (      company.isAccount && company.id == this._sessionService.getUser().accountId
          || company.ourCompany && company.accountId == this._sessionService.getUser().accountId
        )
      )
        this.organisation.ourCompany = true;
      else this.organisation.ourCompany = false;
    }
 }
