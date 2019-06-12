import {Component, OnInit, AfterViewInit} from '@angular/core';

import {Tab} from '../../class/tab';
import {User} from '../../entity/user';
import {Offer} from '../../entity/offer';
import {Person} from '../../entity/person';
import {Request} from '../../entity/request';
import {HistoryRecord} from '../../class/historyRecord';
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

@Component({
    selector: 'tab-user',
    inputs: ['tab'],
    styles: [`
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
            background-position: center;
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
            <div class="photo" [style.background-image]= "user?.photoMini ? 'url('+ user?.photoMini +')' : null">
                <ui-upload-file *ngIf="editEnabled" [type]="'image'" (addNewFile) = "addFile($event)" [obj_id]="user.id"
                (progressState) = "displayProgress($event)" [obj_type] = "'users'">
                </ui-upload-file>
            </div>
            <div class="last_name">{{utils.getSurname(user.name) || "Неизвестно"}}</div>
            <div class="first_name">{{utils.getFirstName(user.name) || "Неизвестно"}}</div>
            <ui-view-value
                [options]="positionOptions"
                [value]="user.position"
            >
            </ui-view-value>
            <ui-tag [value]="user.tag"></ui-tag>
        </div>
        <hr class='underline'>
        <div>
            <div class="pane">
                <div class="property" style="overflow-x: hidden;">
                    <div class="edit_ready">
                        <a href="#" *ngIf="!editEnabled" (click)="toggleEdit()">Изменить</a>
                        <a href="#" *ngIf="editEnabled" (click)="save()">Готово</a>
                    </div>
                    <div class="property_body" *ngIf="!editEnabled">
                      <ul>
                        <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                        <li><span class="view-label">Телефон</span> <span class="view-value unknown"
                                                                          *ngIf="get_length(user?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                        </li>
                        <li *ngIf="user?.phoneBlock?.main" class="subpar"><span class="view-label">Личный</span> <span
                          class="view-value link">{{user?.phoneBlock?.main | mask: "+0 " + phoneMasks.main}}</span></li>
                        <li *ngIf="user?.phoneBlock?.cellphone" class="subpar"><span class="view-label">Личный</span> <span
                          class="view-value link">{{user?.phoneBlock?.cellphone | mask: "+0 " + phoneMasks.cellphone}}</span></li>
                        <li *ngIf="user?.phoneBlock?.office" class="subpar"><span class="view-label">Рабочий</span> <span
                          class="view-value link">{{user?.phoneBlock?.office | mask: "+0 " + phoneMasks.office}}</span></li>
                        <li *ngIf="user?.phoneBlock?.fax" class="subpar"><span class="view-label">Рабочий</span> <span
                          class="view-value link">{{user?.phoneBlock?.fax | mask: "+0 " + phoneMasks.fax}}</span></li>
                        <li *ngIf="user?.phoneBlock?.ip" class="subpar"><span class="view-label">Внутренний</span> <span
                          class="view-value link">{{user?.phoneBlock?.ip | mask: phoneMasks.ip}}</span></li>
                        <li *ngIf="user?.phoneBlock?.home" class="subpar"><span class="view-label">Домашний</span> <span
                          class="view-value link">{{user?.phoneBlock?.home | mask: "+0 " + phoneMasks.home}}</span></li>
                        <li *ngIf="user?.phoneBlock?.other" class="subpar"><span class="view-label">Другой</span> <span
                          class="view-value link">{{user?.phoneBlock?.other | mask: "+0 " + phoneMasks.other}}</span></li>
                        <li><span class="view-label">Ответственный</span> <span class="view-value"
                                          [class.link]="user.agentId" (click)="openUser()">{{ user.agent?.name || 'Неизвестно'}}</span>
                        </li>
                        <li><span class="view-label">E-mail</span> <span class="view-value unknown"
                                                                         *ngIf="get_length(user?.emailBlock)==0">{{ "Неизвестно"}}</span>
                        </li>
                        <li *ngIf="user?.emailBlock?.main" class="subpar"><span class="view-label">Основной</span> <span
                          class="view-value link">{{user?.emailBlock?.main}}</span></li>
                        <li *ngIf="user?.emailBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <span
                          class="view-value link">{{user?.emailBlock?.work}}</span></li>
                        <li *ngIf="user?.emailBlock?.other" class="subpar"><span class="view-label">Другой</span> <span
                          class="view-value link">{{user?.emailBlock?.other}}</span></li>
                        <li><span class="view-label">Web-сайт</span> <span class="view-value unknown"
                                                                           *ngIf="get_length(user?.siteBlock)==0">{{ "Неизвестно"}}</span>
                        </li>
                        <li *ngIf="user?.siteBlock?.main" class="subpar"><span class="view-label">Основной</span> <a
                            [href]="'http://'+user?.siteBlock?.main" target="_blank">{{user?.siteBlock?.main}}</a></li>
                        <li *ngIf="user?.siteBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <a
                            [href]="'http://'+user?.siteBlock?.work" target="_blank">{{user?.siteBlock?.work}}</a></li>
                        <li *ngIf="user?.siteBlock?.other" class="subpar"><span class="view-label">Другой</span> <a
                            [href]="'http://'+user?.siteBlock?.other" target="_blank">{{user?.siteBlock?.other}}</a></li>
                        <li><span class="view-label">Соцсети</span> <span class="view-value unknown"
                                                                          *ngIf="get_length(user?.socialBlock)==0">{{ "Неизвестно"}}</span>
                        </li>
                        <li *ngIf="user?.socialBlock?.vk" class="subpar"><span class="view-label">Вконтакте</span> <span
                            class="view-value link">{{user?.socialBlock?.vk}}</span></li>
                        <li *ngIf="user?.socialBlock?.ok" class="subpar"><span class="view-label">Одноклассники</span> <span
                            class="view-value link">{{user?.socialBlock?.ok}}</span></li>
                        <li *ngIf="user?.socialBlock?.twitter" class="subpar"><span class="view-label">Twitter</span> <span
                            class="view-value link">{{user?.socialBlock?.twitter}}</span></li>
                        <li *ngIf="user?.socialBlock?.facebook" class="subpar"><span class="view-label">Facebook</span> <span
                            class="view-value link">{{user?.socialBlock?.facebook}}</span></li>
                        <li *ngIf="user?.socialBlock?.google" class="subpar"><span class="view-label">Google+</span> <span
                            class="view-value link">{{user?.socialBlock?.google}}</span></li>

                        <li><span class="view-label">Мессенджеры</span> <span class="view-value unknown"
                                                                             *ngIf="get_length(user?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                        </li>
                        <li *ngIf="user?.messengerBlock?.whatsapp" class="subpar"><span class="view-label">WhatsApp</span> <span
                              class="view-value link">{{user?.messengerBlock?.whatsapp}}</span></li>
                        <li *ngIf="user?.messengerBlock?.telegram" class="subpar"><span class="view-label">Telegram</span> <span
                              class="view-value link">{{user?.messengerBlock?.telegram}}</span></li>
                        <li *ngIf="user?.messengerBlock?.viber" class="subpar"><span class="view-label">Viber</span> <span
                            class="view-value link">{{user?.messengerBlock?.viber}}</span></li>

                        <li><span class="view-label">Адрес регистрации</span> <span class="view-value unknown" *ngIf="!user.addressBlock">Неизвестно</span>
                        </li>
                        <li *ngIf="user.addressBlock?.region" class="subpar"><span class="view-label">Регион</span> <span
                          class="view-value">{{user.addressBlock.region}}</span></li>
                        <li *ngIf="user.addressBlock?.city" class="subpar"><span class="view-label">Нас. пункт</span> <span
                          class="view-value">{{user.addressBlock.city}}</span></li>
                        <li *ngIf="user.addressBlock?.admArea" class="subpar"><span class="view-label">Адм. район</span>
                          <span class="view-value">{{user.addressBlock.admArea}}</span></li>
                        <li *ngIf="user.addressBlock?.area" class="subpar"><span class="view-label">Район</span> <span
                          class="view-value">{{user.addressBlock.area}}</span></li>
                        <li *ngIf="user.addressBlock?.street" class="subpar"><span class="view-label">Улица</span> <span
                          class="view-value">{{user.addressBlock.street}}</span></li>
                        <li *ngIf="user.addressBlock?.house" class="subpar"><span class="view-label">Дом</span> <span
                          class="view-value">{{user.addressBlock.house}}</span></li>
                        <li *ngIf="user.addressBlock?.housing" class="subpar"><span class="view-label">Корпус</span> <span
                          class="view-value">{{user.addressBlock.housing}}</span></li>
                        <li *ngIf="user.addressBlock?.apartment" class="subpar"><span class="view-label">Квартира</span> <span
                          class="view-value">{{user.addressBlock.apartment}}</span></li>
                        <li *ngIf="user.addressBlock?.bus_stop" class="subpar"><span class="view-label">Остановка</span> <span
                          class="view-value">{{user.addressBlock.bus_stop}}</span></li>
                        <li *ngIf="user.addressBlock?.metro" class="subpar"><span class="view-label">Метро</span> <span
                          class="view-value">{{user.addressBlock.metro}}</span></li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                        <li><span class="view-label">Дата добавления</span> <span
                          class="view-value">{{ utils.getDateInCalendar(user.addDate)}}</span></li>
                        <li><span class="view-label">Дата изменения</span> <span
                          class="view-value">{{ utils.getDateInCalendar(user.changeDate)}}</span></li>
                        <li><span class="view-label">Офис:</span>
                            <span class="view-value" [class.link]="user.organisationId" (click)="openOrganisation()">
                                            {{ user.organisation?.name || 'Неизвестно'}}
                            </span>
                        </li>
                        <li><span class="view-label">Отдел</span>
                          <ui-view-value [options]="departmentOptions" [value]="user.department"></ui-view-value>
                        </li>
                        <li><span class="view-label">Должность</span>
                          <ui-view-value [options]="positionOptions[user.department]" [value]="user.position"></ui-view-value>
                        </li>
                        <li *ngIf="user.department != 'management'"><span class="view-label">Специализация</span>
                          <ui-view-value [options]="specializationOptions[user.department]" [value]="user.specialization"></ui-view-value>
                        </li>
                        <li *ngIf="user.department == 'sale' && user.department && user.department != 'management'"><span class="view-label">Недвижимость</span>
                          <ui-view-value [options]="categoryOptions" [value]="user.category"></ui-view-value>
                        </li>
                        <li *ngIf="user.department != 'management'"><span class="view-label" >Рынок</span>
                          <ui-view-value [options]="typeCodeOptions" [value]="user.typeCode"></ui-view-value>
                        </li>
                        <li><span class="view-label">Состояние</span>
                          <ui-view-value [options]="stateCodeOptions" [value]="user.stateCode"></ui-view-value>
                        </li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                        <li style="height:auto">
                          <div>{{user?.description || 'Неизвестно'}}</div>
                        </li>
                      </ul>
                    </div>
                    <div class="property_body editable" *ngIf="editEnabled">
                      <ul>
                        <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Телефон контакта</span>
                          <span class="view-value unknown" *ngIf="get_length(user?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{'main': {label: 'Личный', placeholder: 'Введите номер телефона'},
                                              'cellphone' : {label: 'Личный', placeholder: 'Введите номер телефона'},
                                              'office': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                              'fax': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                              'ip': {label: 'Внутренний', placeholder: 'Введите номер телефона'},
                                              'home': {label: 'Домашний', placeholder: 'Введите номер телефона'},
                                              'other': {label: 'Другой', placeholder: 'Введите номер телефона'}
                                          }"
                                          [masks]="phoneMasks" [field]="user?.phoneBlock" [width]="'53%'" [prefix]="'+7'"
                                          (onChange)="user.phoneBlock = $event"></ui-multiselect>
                        </li>
                        <li>
                          <ui-input-line [placeholder]="'ФИО:'" [value]="user?.name || ''"
                                         (onChange)="user.name = $event"></ui-input-line>
                        </li>
                        <li style="height: auto;" *ngIf="_sessionService.getUser().id != user.id"><span class="view-label sliding-label">Ответственный</span>
                          <ui-slidingMenu [options]="agentOpts" [value]="user?.agentId"
                                          (onChange)="agentChanged($event)"></ui-slidingMenu>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">E-mail</span> <span
                          class="view-value unknown" *ngIf="get_length(user?.emailBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                                'work' : {label: 'Рабочий', placeholder: 'Введите E-mail'},
                                                'main' : {label: 'Основной', placeholder: 'Введите E-mail'},
                                                'other' : {label: 'Другой', placeholder: 'Введите E-mail'}
                                            }"
                                          [field]="user?.emailBlock" [width]="'36%'"
                                          (onChange)="user.emailBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Web-сайт</span> <span
                          class="view-value unknown" *ngIf="get_length(user?.siteBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                                'work' : {label: 'Рабочий', placeholder: 'Введите название сайта'},
                                                'main' : {label: 'Основной', placeholder: 'Введите название сайта'},
                                                'other' : {label: 'Другой', placeholder: 'Введите название сайта'}
                                            }"
                                          [field]="user?.siteBlock" [width]="'36%'"
                                          (onChange)="user.siteBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Соцсети</span> <span
                          class="view-value unknown" *ngIf="get_length(user?.socialBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                                'vk' : {label: 'Вконтакте', placeholder: 'Введите адрес страницы'},
                                                'ok' : {label: 'Одноклассники', placeholder: 'Введите адрес страницы'},
                                                'facebook' : {label: 'Facebook', placeholder: 'Введите адрес страницы'},
                                                'google' : {label: 'Google+', placeholder: 'Введите адрес страницы'},
                                                'twitter' : {label: 'Twitter', placeholder: 'Введите адрес страницы'}
                                            }"
                                          [field]="user?.socialBlock" [width]="'36%'"
                                          (onChange)="user.socialBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Мессенджеры</span> <span
                          class="view-value unknown" *ngIf="get_length(user?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                          <ui-multiselect style="display: none;"
                                          [params]="{
                                                'whatsapp' : {label: 'WhatsApp', placeholder: 'Введите номер телефона'},
                                                'telegram' : {label: 'Telegram', placeholder: 'Введите номер телефона'},
                                                'viber' : {label: 'Viber', placeholder: 'Введите номер телефона'}
                                            }"
                                          [field]="user?.messengerBlock" [width]="'36%'"
                                          (onChange)="user.messengerBlock = $event"></ui-multiselect>
                        </li>
                        <li class="multiselect">
                            <ui-input-line [placeholder]="'Адрес регистрации:'" [value]="''" style="height: 42px" [width]="'225px'"
                                         (onChange)="user.addressBlock = $event" [queryTipe]="'address'"></ui-input-line>
                            <ui-multiselect [style.display]="get_length(user.addressBlock) == 0 ? 'none' : ''"
                                          [params]="{
                                                'region': {label: 'Регион', placeholder: 'Введите название сайта'},
                                                'city': {label: 'Нас. пункт', placeholder: 'Введите название сайта'},
                                                'admArea': {label: 'Адм. район', placeholder: 'Введите название сайта'},
                                                'area': {label: 'Район', placeholder: 'Введите название сайта'},
                                                'street': {label: 'Улица', placeholder: 'Введите название сайта'},
                                                'house': {label: 'Дом', placeholder: 'Введите название сайта'},
                                                'housing': {label: 'Корпус', placeholder: 'Введите название сайта'},
                                                'apartment': {label: 'Квартира', placeholder: 'Введите название сайта'}
                                            }"
                                          [field]="user.addressBlock" [width]="'36%'"
                                          (onChange)="user.addressBlock = $event">
                            </ui-multiselect>
                        </li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                        <li>
                          <ui-input-line [placeholder]="'Офис'" [value]="user?.organisation?.name || ''"
                                         (onChange)="user.organisation = $event" [queryTipe]="'organisation'" [filter]="{'ourCompany': 1}"></ui-input-line>
                        </li>
                        <li style="height: auto;"><span class="view-label sliding-label">Отдел</span>
                          <ui-slidingMenu [options]="departmentOptions" [value]="user?.department"
                                          (onChange)="user.department = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;" *ngIf="user.department"><span class="view-label sliding-label">Должность</span>
                          <ui-slidingMenu [options]="positionOptions[user.department]" [value]="user?.position"
                                          (onChange)="user.position = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;" *ngIf="user.department && user.department != 'management'">
                            <span class="view-label sliding-label">Специализация</span>
                            <ui-slidingMenu [options]="specializationOptions[user.department]" [value]="user?.specialization"
                                          (onChange)="user.specialization = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;" *ngIf="user.department == 'sale' && user.department">
                          <span class="view-label sliding-label">Недвижимость</span>
                          <ui-slidingMenu [options]="categoryOptions" [value]="user?.category"
                                          (onChange)="user.category = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;" *ngIf="(user.department == 'sale' || user.department == 'evaluation' || user.department == 'mortgage') && user.department">
                          <span class="view-label sliding-label">Рынок</span>
                          <ui-slidingMenu [options]="typeCodeOptions" [value]="user?.typeCode"
                                          (onChange)="user.typeCode = $event.selected.value"></ui-slidingMenu>
                        </li>
                        <li style="height: auto;"><span class="view-label sliding-label">Состояние</span>
                          <ui-slidingMenu [options]="stateCodeOptions" [value]="user.stateCode"
                                          (onChange)="user.stateCode = $event.selected.value"></ui-slidingMenu>
                        </li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ</div>
                        <li style="height: auto;"><textarea placeholder="Введите текст дополнительного описания"
                                                            [(ngModel)]="user.description"></textarea></li>
                      </ul>
                      <ul>
                        <div (click)="show_hide($event)">ТЭГИ</div>
                        <li style="height: auto; padding: 0;">
                          <ui-tag-block [value]="user?.tag" (valueChange)="user.tag = $event"></ui-tag-block>
                        </li>
                      </ul>
                    </div>
                </div>
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
                    <ui-tab [title]="'ОБЪЕКТЫ'">
                    </ui-tab>
                    <ui-tab [title]="'ЗАЯВКИ'">
                    </ui-tab>
                    <ui-tab [title]="'КОНТАКТЫ'">
                    </ui-tab>
                    <ui-tab [title]="'СДЕЛКИ'">
                    </ui-tab>
                    <ui-tab [title]="'ОБУЧЕНИЕ'">
                    </ui-tab>
                  </ui-tabs-menu>
                </div>
            </div>
        </div>
    `
})

export class TabUserComponent implements OnInit, AfterViewInit {
    public tab: Tab;
    user: User;
    utils = Utils;

    departmentOptions = User.departmentOptions;
    positionOptions = User.positionOptionsByDepart;
    positionOptionsHash = User.positionOptionsHash;
    specializationOptions = User.specializationOptionsByDepart;
    categoryOptions = Offer.categoryOptions;
    typeCodeOptions = User.typeMarketCodeOptions;
    stateCodeOptions = User.stateUserCodeOptions;

    phoneMasks = PhoneBlock.phoneFormats;
    offers: Offer[];
    requests: Request[];

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
        if(this.user.id){
            for(let i = 0 ; i <= this.agentOpts.length; ++i){
                if (this.agentOpts[i].value == this.user.id){
                    this.agentOpts.splice(i,1);
                    break;
                }
            }
        }

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

    getUserPosition() {
        return User.positionOptionsHash[this.user.position || ""] || "Неизвестно";
    }

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    save() {
        if (!this.chechForm())
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

    chechForm(){
        if(!PhoneBlock.check(this.user.phoneBlock)){
           alert("Не указан номер телефона или формат не верный")
           return false;
        }
        if(this.user.name == "" || !this.user.name){
            alert("Не указано имя пользователя")
            return false;
        }
        if(this.user.name.split(" ").length < 3){
            alert("Не указано Фамилия, Имя или Отчество")
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
        this.user.photo = event;
        this.user.photoMini = event;
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
              if(persons[0] && this.user.id != persons[0].id) {
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
}
