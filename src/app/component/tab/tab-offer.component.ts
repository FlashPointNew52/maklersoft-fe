import {Component, OnInit, AfterViewInit, Output, EventEmitter} from "@angular/core";

import {HubService} from "../../service/hub.service";
import {ConfigService} from "../../service/config.service";
import {OfferService, OfferSource} from "../../service/offer.service";
import {TaskService} from "../../service/task.service";
import {HistoryService} from "../../service/history.service";
import {UserService} from "../../service/user.service";
import {AnalysisService} from "../../service/analysis.service";
import {PersonService} from "../../service/person.service";
import {OrganisationService} from "../../service/organisation.service";
import {SuggestionService} from "../../service/suggestion.service";
import {SessionService} from "../../service/session.service";

import {Tab} from "../../class/tab";
import {Utils} from "../../class/utils";
import {ObjectBlock} from "../../class/objectBlock";
import {Offer} from "../../entity/offer";
import {Request} from "../../entity/request";
import {PhoneBlock} from "../../class/phoneBlock";
import {Rating} from "../../class/rating";
import {User} from "../../entity/user";

import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {AddressBlock} from "../../class/addressBlock";
import {Contact} from "../../entity/contact";
import {ConditionsBlock} from "../../class/conditionsBlock";


@Component({
    selector: "tab-offer",
    inputs: ["tab"],
    styles: [`

        .property_face > span {
            display: block;
            height: 12px;
            line-height: 12px;
            margin-bottom: 6px;
            text-transform: uppercase;
        }

        .property_face .main_title {
            font-size: 20px;
            height: 20px;
            line-height: 20px;
            font-style: normal;
        }

        .property_face .title {
            float: left;
            width: 95px;
        }

        .work-area {
            float: left;
            width: 100%;
            height: calc(100% - 122px);
            position: relative;
        }

        gmap-view {
            width: calc(100% - 370px);
            height: 100%;
            display: block;
            position: relative;
        }

        .property_face > ui-tag {
            position: absolute;
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }

        .selected {
            background-color: var(--color-blue);
        }

        .rating {
            flex-wrap: wrap;
        }

        .rating > span {
            width: 200px;
        }

        .rating > star-mark {
            width: 76px;
        }

        digest-offer {
            border-bottom: 1px solid var(--bottom-border);
            width: 100%;
            height: 122px;
            display: block;
        }

        .digest-list digest-offer:last-of-type {
            border-bottom: 1px solid var(--bottom-border);
        }

        /*.suggestions {
            min-width: 160px;
            margin-top: 27px;
            padding: 5px 0;
            background-color: #f7f7f7;
            border: 1px solid #e3e3e3;
            width: 88%;
            position: absolute;
            z-index: 2;
            font-size: 11pt;
        }
        .suggestions > ul {margin: 0 0;list-style: none;padding: 3px 20px;}
        .suggestions > ul:hover {background: #bbbbbb;cursor: default;}*/
    `],
    template: `
        <div class="search-form" *ngIf="mode == 1">
            <input type="text" class="input_line" placeholder="Введите текст запроса" [style.width]="'100%'"
                   [(ngModel)]="searchQuery" (keyup)="$event" [disabled]="!editEnabled"
            ><span class="find_icon_right"></span>
            <div class="tool-box">
                <filter-select *ngIf="offer.offerTypeCode == 'sale'"
                               [name]="'Тип сделки'"
                               [options]="[
                              {value: 'sale', label: 'Продажа'},
                              {value: 'alternative', label: 'Альтернатива'}
                ]"
                               [value]="{'option' : filter.offerTypeCode}"
                               (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус контакта'" [firstAsName]="true"
                    [options]="[
                              {value: 'all', label: 'Все'},
                              {value: 'owner', label: 'Принципал'},
                              {value: 'middleman', label: 'Посредник'}
                ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Статус объекта'" [firstAsName]="true"
                    [options]="[
                              {value: 'all', label: 'Все объекты'},
                              {value: 'my', label: 'Мои объекты'},
                              {value: 'our', label: 'Наша компания'}
                ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Стадия объекта'" [firstAsName]="true"
                    [options]="[
                              {value: 'all', label: 'Все'},
                              {value: 'inactive', label: 'Не активно'},
                              {value: 'active', label: 'Активно'},
                              {value: 'listing', label: 'Листинг'},
                              {value: 'deal', label: 'Сделка'},
                              {value: 'suspended', label: 'Приостановлено'},
                              {value: 'archive', label: 'Архив'}
                ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag [value]="filter?.tag" (newValue)="filter.tag = $event;"></filter-select-tag>
                <filter-select
                    [name]="'Период'" [firstAsName]="true"
                    [options]="[
                              {value: 'all', label: 'Все'},
                              {value: '1', label: '1 день'},
                              {value: '3', label: '3 дня'},
                              {value: '7', label: 'Неделя'},
                              {value: '14', label: '2 недели'},
                              {value: '30', label: 'Месяц'},
                              {value: '90', label: '3 месяца'}
                ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Сортировка'" [firstAsName]="true"
                    [options]="[
                              {value: 'all', label: 'Все'},
                              {value: 'inactive', label: 'Не активно'},
                              {value: 'active', label: 'Активно'},
                              {value: 'listing', label: 'Листинг'},
                              {value: 'deal', label: 'Сделка'},
                              {value: 'suspended', label: 'Приостановлено'},
                              {value: 'archive', label: 'Архив'}
                ]"
                    [value]="{'option' : filter.offerTypeCode}"
                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"
                >
                </filter-select>
                <div class="found">Найдено: {{hitsCount + " "}}/{{" " + requests?.length }}</div>
            </div>
        </div>
        <div class="property_face">
            <ui-tag [value]="offer?.tag"></ui-tag>
            <span class="main_title">ПРЕДЛОЖЕНИЕ</span>
            <span class="type_title">{{ offClass.offerTypeCodeOptions[offer.offerTypeCode]?.label}}</span>
        </div>

        <hr class='underline'>
        <hr class='underline progress_bar'
            [ngStyle]="{'width': progressWidth + 'vw', 'transition': progressWidth > 0 ? 'all 2s ease 0s' : 'all 0s ease 0s'}">

        <div class="pane" [style.left.px]="paneHidden ? -339 : null">
            <div class="source_menu">
                <div [class.active]="mode == 0" (click)="mode = 0">ПРЕДЛОЖЕНИЕ</div>
                <div [class.active]="mode == 1" class="last"
                     (click)="mode = 1; filter.offerTypeCode = offer.offerTypeCode; workAreaMode = 'map'">ЛИСТИНГ
                </div>
                <div class="edit_ready" *ngIf="mode == 0">
                    <span class="link" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</span>
                    <span class="link" *ngIf="editEnabled && canEditable" (click)="save()">Готово</span>
                    <span *ngIf="!canEditable && false" class="pointer_menu" (click)="$event">...</span>
                    <!--                    <div *ngIf="!canEditable" class="pointer_menu" (click)="contextMenu($event)">...</div>-->
                </div>
            </div>
            <div class="fixed-button" (click)="toggleLeftPane()">
                <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
            </div>
            <ui-tabs-menu *ngIf="mode == 0">
                <ui-tab [title]="'ГЛАВНАЯ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Предложение от...</span>
                            <span class="view-value">{{conClass.typeOptions[contact.type]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>{{contact.type == 'person' ? 'ФИО' : 'Название организации'}}</span>
                            <span class="view-value link">{{ contact?.name}}</span>
                        </div>
                        <hr class="line">
                        <div class="show_block" *ngIf="contact?.phoneBlock?.main">
                            <span>Личный телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.cellphone">
                            <span>Личный телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.office">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.fax">
                            <span>Рабочий телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.home">
                            <span>Домашний телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.other">
                            <span>Другой телефон</span>
                            <span
                                class="view-value link">{{ "+7" + contact?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.ip">
                            <span>Внутренний телефон</span>
                            <span class="view-value link">{{ contact?.phoneBlock?.ip}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.messengerBlock?.whatsapp">
                            <span>WhatsApp</span>
                            <span class="view-value link">{{ contact?.messengerBlock?.whatsapp}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.messengerBlock?.viber">
                            <span>Viber</span>
                            <span class="view-value link">{{ contact?.messengerBlock?.viber}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.messengerBlock?.telegram">
                            <span>Telegram</span>
                            <span class="view-value link">{{ contact?.messengerBlock?.telegram}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.emailBlock?.main">
                            <span>Основной Email</span>
                            <span class="view-value link">{{ contact?.emailBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.emailBlock?.work">
                            <span>Рабочий Email</span>
                            <span class="view-value link">{{ contact?.emailBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.emailBlock?.other">
                            <span>Другой Email</span>
                            <span class="view-value link">{{ contact?.emailBlock?.other}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.siteBlock?.main">
                            <span>Основной Web-сайт</span>
                            <span class="view-value link">{{ contact?.siteBlock?.main}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.siteBlock?.work">
                            <span>Рабочий Web-сайт</span>
                            <span class="view-value link">{{ contact?.siteBlock?.work}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.siteBlock?.other">
                            <span>Другой Web-сайт</span>
                            <span class="view-value link">{{ contact?.siteBlock?.other}}</span>
                        </div>
                        <div class="show_block">
                            <span>Соцсети</span>
                            <view-social [block]="contact?.socialBlock"></view-social>
                        </div>
                        <hr class="line">
                        <div class="show_block">
                            <span>Статус контакта</span>
                            <span class="view-value">{{ contact?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип контакта</span>
                            <span class="view-value">{{ conClass.typeCodeOptions[contact?.typeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Лояльность контакта</span>
                            <span class="view-value">{{ conClass.loyaltyOptions[contact?.loyalty]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия контакта</span>
                            <span class="view-value">{{ conClass.stageCodeOptions[contact?.stageCode]?.label}}</span>
                        </div>
                        <hr class="line">
                        <hidden-text [name]="'Права третьих лиц'" [value]="offer?.thirdPartyRights"></hidden-text>
                        <hr class="line">
                        <div class="show_block">
                            <span>Ответственный</span>
                            <span class="view-value" [class.link]="offer.agentId">{{ offer.agent?.name || 'Не назначено'}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(offer.contractBlock)?.length == 0">
                            <div class="show_block">
                                <span>Наличие договора</span>
                                <span class="view-value">Нет</span>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="block.getAsArray(offer.contractBlock)?.length > 0">
                            <div class="show_block" *ngIf="offer?.contractBlock?.number">
                                <span>Номер договора</span>
                                <span class="view-value">{{ offer.contractBlock?.number}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.contractBlock?.begin || offer.contractBlock?.end">
                                <span>Действие договора</span>
                                <span class="view-value">{{ offer.contractBlock?.begin}}
                                    -{{offer.contractBlock?.end}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.contractBlock?.continued">
                                <span>Договор продлён</span>
                                <span class="view-value">{{ offer.contractBlock?.continued}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.contractBlock?.terminated">
                                <span>Договор расторгнут</span>
                                <span class="view-value">{{ offer.contractBlock?.terminated}}</span>
                            </div>
                        </ng-container>
                        <hr class="line">
                        <hidden-text [name]="'Создать заметку'" [value]="offer?.conditionInfo"></hidden-text>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name]="'Предложение от...'" [options]="conClass.typeOptions"
                                      [value]="contact?.type"
                                      (result)="contact.type = $event"
                        ></sliding-menu>
                        <input-line [name]="contact.type == 'person' ? 'ФИО' : 'Название организации'"
                                    [value]="contact?.name"
                                    (newValue)="contact.name = $event"
                        ></input-line>
                        <hr class="line">
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
                            (newData)="findContact($event)"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Мессенджеры'" [block]="contact?.messengerBlock" [addName]="'Добавить мессенджер'"
                            [params]="{ 'whatsapp': {label: 'WhatsApp', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'viber' : {label: 'Viber', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'},
                                    'telegram': {label: 'Telegram', mask: ' (000) 000-00-00', prefix: '+7', placeholder: 'Телефон'}
                                }"
                            (newData)="contact.messengerBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'E-mail'" [block]="contact?.emailBlock" [addName]="'Добавить email'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'E-mail'},
                                    'work' : {label: 'Рабочий', placeholder: 'E-mail'},
                                    'other': {label: 'Другой', placeholder: 'E-mail'}
                                }"
                            (newData)="contact.emailBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Web-сайт'" [block]="contact?.siteBlock" [addName]="'Добавить сайт'"
                            [params]="{ 'main': {label: 'Основной', placeholder: 'Сайт'},
                                    'work' : {label: 'Рабочий', placeholder: 'Сайт'},
                                    'other': {label: 'Другой', placeholder: 'Сайт'}
                                }"
                            (newData)="contact.siteBlock = $event"
                        ></multiselect-menu>
                        <multiselect-menu
                            [name]="'Соцсети'" [block]="contact?.socialBlock" [addName]="'Добавить соцсеть'"
                            [params]="{ 'vk': {label: 'Вконтакте', placeholder: 'Адрес страницы'},
                                    'ok' : {label: 'Одноклассники', placeholder: 'Адрес страницы'},
                                    'facebook': {label: 'Facebook', placeholder: 'Адрес страницы'},
                                    'instagram': {label: 'Instagram', placeholder: 'Адрес страницы'},
                                    'twitter': {label: 'Twitter', placeholder: 'Адрес страницы'}
                                }"
                            (newData)="contact.socialBlock = $event"
                        ></multiselect-menu>
                        <hr class="line">
                        <sliding-menu [name]="'Статус контакта'" [options]="conClass.middlemanOptions"
                                      [value]="contact.isMiddleman ? 'middleman' : 'owner'"
                                      (result)="contact.isMiddleman = $event == 'middleman'"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип контакта'" [options]="conClass.typeCodeOptions"
                                      [value]="contact?.typeCode"
                                      (result)="contact.typeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Лояльность контакта'" [options]="conClass.loyaltyOptions"
                                      [value]="contact?.loyalty"
                                      (result)="contact.loyalty = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия контакта'" [options]="conClass.stageCodeOptions"
                                      [value]="contact?.stageCode"
                                      (result)="contact.stageCode = $event"
                        ></sliding-menu>
                        <hr class="line">
                        <input-area [name]="'Права третьих лиц'" [value]="offer?.thirdPartyRights" [update]="update"
                                    (newValue)="offer.thirdPartyRights = $event"></input-area>
                        <hr class="line">
                        <sliding-menu [name]="'Ответственный'" [options]="agentOpts"
                                      [value]="offer?.agentId || null"
                                      (result)="agentChanged($event)"
                        ></sliding-menu>
                        <multiselect-menu
                            [name]="'Наличие договора'" [block]="offer?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                    'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                    'end': {label: 'Дата конца', placeholder: 'Дата'},
                                    'continued': {label: 'Продлен', placeholder: 'Продление'},
                                    'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                }"
                            (newData)="offer.contractBlock = $event"
                        ></multiselect-menu>
                        <sliding-tag [value]="offer?.tag" (newValue)="offer.tag = $event"></sliding-tag>
                        <hr class="line">
                        <input-area [name]="'Создать заметку'" [value]="offer?.conditionInfo" [update]="update"
                                    (newValue)="offer.conditionInfo = $event"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'ОБЪЕКТ'" (tabSelect)="update = {}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Дата создания</span>
                            <span class="view-value">{{ utils.getDateInCalendar(offer.addDate) }}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addDate != offer.changeDate">
                            <span>Дата изменения</span>
                            <span class="view-value">{{ utils.getDateInCalendar(offer.changeDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип сделки</span>
                            <span
                                class="view-value">{{ offClass.offerTypeCodeOptions[offer.offerTypeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия сделки</span>
                            <span class="view-value">{{ offClass.stageCodeOptions[offer?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.accountId == this._sessionService.getUser().accountId || !offer.accountId">
                            <span>Тип добавления</span>
                            <span class="view-value" *ngIf="offer.sourceMedia && offer.sourceUrl"><a
                                href="{{offer.sourceUrl}}"
                                target="_blank">{{offClass.sourceMediaOptions[offer?.sourceMedia]?.label}}</a></span>
                            <span class="view-value"
                                  *ngIf="offer.sourceMedia && !offer.sourceUrl">{{ offClass.sourceMediaOptions[offer?.sourceMedia]?.label}}</span>
                            <span class="view-value"
                                  *ngIf="!offer.sourceMedia && !offer.sourceUrl">{{ offClass.sourceOptions[offer?.sourceCode]?.label}}</span>
                        </div>
                        <hr class="line">
                        <div class="show_block">
                            <span>Категория</span>
                            <span class="view-value">{{ offClass.categoryOptions[offer?.categoryCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>{{offer.categoryCode != 'land' ? 'Тип дома' : 'Назначение земель'}}</span>
                            <span
                                class="view-value">{{ offClass.buildingTypeOptions[offer?.buildingType]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.categoryCode != 'land'">
                            <span>{{offer.categoryCode == 'rezidential' ? "Тип недвижимости" : "Класс здания"}}</span>
                            <span
                                class="view-value">{{ offClass.buildingClassOptions[offer?.buildingClass]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип объекта</span>
                            <span class="view-value">{{ offClass.typeCodeOptions[offer?.typeCode]?.label}}</span>
                        </div>
                        <hidden-text [name]="'Документы на объект'" [value]="offer?.documentsStr"></hidden-text>
                        <div class="show_block" *ngIf="offer.categoryCode != 'land'">
                            <span>Новостройка</span>
                            <switch-button [value]="offer?.newBuilding" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block" *ngIf="offer.newBuilding && offer.categoryCode != 'land'">
                            <span>Стадия объекта</span>
                            <span class="view-value">{{ offClass.objectStageOptions[offer?.objectStage]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.categoryCode != 'land'">
                            <span>{{offer?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'}}</span>
                            <span class="view-value">{{ offer.buildYear || 'Неизвестно'}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.offerTypeCode != 'rent'">
                            <span>Обременение</span>
                            <switch-button [value]="offer?.encumbrance" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block"
                             *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                            <span>Удаленность</span>
                            <span class="view-value">{{ offer?.distance || "Неизвестно"}}</span>
                        </div>
                        <hr class="line">
                        <div class="show_block"
                             *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                            <span>Наименование поселения</span>
                            <span class="view-value">{{ offer?.settlement || "Неизвестно"}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.categoryCode != 'land' && offer.buildingType != 'lowrise_house'">
                            <span>Жилищный комплекс</span>
                            <span class="view-value">{{ offer?.housingComplex || "Неизвестно"}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.region">
                            <span>Регион</span>
                            <span class="view-value">{{offer.addressBlock?.region}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.city">
                            <span>Нас. пункт</span>
                            <span class="view-value">{{offer.addressBlock?.city}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.admArea">
                            <span>Адм. район</span>
                            <span class="view-value">{{offer.addressBlock?.admArea}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.area">
                            <span>Микрорайон</span>
                            <span class="view-value">{{offer.addressBlock?.area}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.street">
                            <span>Улица</span>
                            <span class="view-value">{{offer.addressBlock?.street}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.building">
                            <span>Дом</span>
                            <span class="view-value">{{offer.addressBlock?.building}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.apartment">
                            <span>{{offer.categoryCode == 'commersial' ? 'Офис' : 'Квартира'}}</span>
                            <span class="view-value">{{offer.addressBlock?.apartment}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.station">
                            <span>Станция</span>
                            <span class="view-value">{{offer.addressBlock?.station}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.addressBlock?.busStop">
                            <span>Остановка</span>
                            <span class="view-value">{{offer.addressBlock?.busStop}}</span>
                        </div>
                        <!--                TODO: переместить label внутрь компонента-->
                        <div class="show_block rating">
                            <span class="view-label">Месторасположение</span>
                            <star-mark [value]="this.offer.locRating?.map['remoteness']"
                                       (estimate)="this.offer.locRating.map['remoteness']=$event"
                                       [editable]="false"
                            ></star-mark>
                            <span class="view-label">Транспортная доступность</span>
                            <star-mark [value]="this.offer.locRating?.map['transport']"
                                       (estimate)="this.offer.locRating.map['transport']=$event"
                                       [editable]="false"
                            ></star-mark>
                            <span class="view-label">Престижность района</span>
                            <star-mark [value]="this.offer.locRating?.map['prestigious']"
                                       (estimate)="this.offer.locRating.map['prestigious']=$event"
                                       [editable]="false"
                            ></star-mark>
                            <span class="view-label">Экология</span>
                            <star-mark [value]="this.offer.locRating?.map['ecology']"
                                       (estimate)="this.offer.locRating.map['ecology']=$event"
                                       [editable]="false"
                            ></star-mark>
                            <span class="view-label">Инфраструктура</span>
                            <star-mark [value]="this.offer.locRating?.map['infrastructure']"
                                       (estimate)="this.offer.locRating.map['infrastructure']=$event"
                                       [editable]="false"
                            ></star-mark>
                        </div>
                        <div class="show_block"
                             *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                            <span>Охраняемая территория</span>
                            <switch-button [value]="offer?.guard" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block" *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                            <span>Гостевая парковка</span>
                            <switch-button [value]="offer?.parking" [disabled]="true"></switch-button>
                        </div>
                        <hr class="line">
                        <ng-container
                            *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room' || offer.typeCode == 'share'">
                            <div class="show_block">
                                <span>Материал стен</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[offer?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Количество комнат</span>
                                <span class="view-value">{{ offer.roomsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'">
                                <span>Тип комнат</span>
                                <span
                                    class="view-value">{{ offClass.roomSchemeOptions[offer?.roomScheme]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floor">
                                <span>Этаж</span>
                                <span class="view-value">{{ offer.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floorsCount">
                                <span>Этажность</span>
                                <span class="view-value">{{ offer.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.levelsCount && offer.buildingType != 'lowrise_house'">
                                <span>Уровней</span>
                                <span class="view-value">{{ offer.levelsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareTotal">
                                <span>Общая площадь</span>
                                <span class="view-value">{{ offer.squareTotal }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareLiving">
                                <span>Жилая площадь</span>
                                <span class="view-value">{{ offer.squareLiving }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareKitchen">
                                <span>Площадь кухни</span>
                                <span class="view-value">{{ offer.squareKitchen }}</span>
                            </div>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="offer?.loggia" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="offer?.balcony" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Терраса</span>
                                <switch-button [value]="offer?.terrace" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Санузел</span>
                                <span class="view-value">{{ offClass.bathroomOptions[offer?.bathroom]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[offer?.condition]?.label}}</span>
                            </div>
                        </ng-container>
                        <ng-container
                            *ngIf="offer.typeCode == 'house' || offer.typeCode == 'cottage' || offer.typeCode == 'dacha' || offer.typeCode == 'townhouse' || offer.typeCode == 'duplex'">
                            <div class="show_block">
                                <span>Материал стен</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[offer?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Количество комнат</span>
                                <span class="view-value">{{ offer.roomsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'">
                                <span>Тип комнат</span>
                                <span
                                        class="view-value">{{ offClass.roomSchemeOptions[offer?.roomScheme]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floor">
                                <span>Этаж</span>
                                <span class="view-value">{{ offer.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floorsCount">
                                <span>Этажей</span>
                                <span class="view-value">{{ offer.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareTotal">
                                <span>Общая площадь</span>
                                <span class="view-value">{{ offer.squareTotal }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareLiving">
                                <span>Жилая площадь</span>
                                <span class="view-value">{{ offer.squareLiving }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.squareKitchen">
                                <span>Площадь кухни</span>
                                <span class="view-value">{{ offer.squareKitchen }}</span>
                            </div>
                            <div class="show_block">
                                <span>Площадь участка</span>
                                <span
                                    class="view-value">{{ offer?.squareLand + " " + (offer?.squareLandType == 0 ? "cот" : "га") }}</span>
                            </div>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="offer?.loggia" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="offer?.balcony" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Терраса</span>
                                <switch-button [value]="offer?.terrace" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Санузел</span>
                                <span class="view-value">{{ offClass.bathroomOptions[offer?.bathroom]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[offer?.condition]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.categoryCode == 'land'">
                            <div class="show_block">
                                <span>Площадь участка</span>
                                <span
                                    class="view-value">{{ offer?.squareLand + " " + (offer?.squareLandType == 0 ? "cот" : "га") }}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.categoryCode == 'commersial'">
                            <div class="show_block">
                                <span>Название</span>
                                <span class="view-value">{{ offer?.objectName || "Неизвестно"}}</span>
                            </div>
                            <div class="show_block">
                                <span>Материал здания</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[offer?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floor">
                                <span>Этаж</span>
                                <span class="view-value">{{ offer.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.floorsCount">
                                <span>Этажность</span>
                                <span class="view-value">{{ offer.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="offer?.levelsCount">
                                <span>Уровень</span>
                                <span class="view-value">{{ offer.levelsCount }}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Площадь помещения</span>
                                <span class="view-value">{{offer?.squareTotal }}</span>
                            </div>
                            <div class="show_block">
                                <span>Высота потолков</span>
                                <span class="view-value">{{offer?.ceilingHeight }}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[offer?.condition]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Лифт</span>
                                <switch-button [value]="offer?.lift" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <hidden-text [name]="'Дополнительное описание'" [value]="offer?.description"></hidden-text>
                        <hr class="line">
                        <hidden-text [name]="'Создать заметку'" [value]="offer?.conditionInfo"></hidden-text>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name]="'Тип сделки'" [options]="offClass.offerTypeCodeOptions"
                                      [value]="offer?.offerTypeCode"
                                      (result)="offer.offerTypeCode = $event; checkConditions();"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия сделки'" [options]="offClass.stageCodeOptions"
                                      [value]="offer?.stageCode"
                                      (result)="offer.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип добавления:'" [options]="offClass.sourceOptions"
                                      [value]="offer?.sourceCode"
                                      (result)="offer.sourceCode = $event"
                        ></sliding-menu>
                        <hr class="line">
                        <sliding-menu [name]="'Категория'" [options]="offClass.categoryOptions"
                                      [value]="offer?.categoryCode"
                                      (result)="offer.categoryCode = $event"
                        ></sliding-menu>
                        <sliding-menu
                            [name]="offer?.categoryCode != 'land' ? (offer.categoryCode == 'rezidential' ? 'Тип дома' : 'Тип недвижимости') : 'Назначение земель'"
                            [options]="offClass.buildindTypeByCategory[offer.categoryCode]"
                            [value]="offer?.buildingType"
                            (result)="offer.buildingType = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="offer.categoryCode == 'rezidential' ? 'Тип недвижимости' : 'Класс здания'"
                                      [options]="offClass.buildindClassByBuildingType[offer.buildingType]"
                                      [value]="offer?.buildingClass"
                                      (result)="offer.buildingClass = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип объекта'"
                                      [options]="offer.buildingType != 'lowrise_house' ? offClass.typeCodeByBuildingType[offer.buildingType] : offClass.typeCodeByBuildingClass[offer.buildingClass]"
                                      [value]="offer?.typeCode"
                                      (result)="offer.typeCode = $event"
                        ></sliding-menu>
                        <input-area [name]="'Документы на объект'" [value]="offer?.documentsStr" [update]="update"
                                    (newValue)="offer.documentsStr = $event"></input-area>
                        <div class="show_block" *ngIf="offer.categoryCode != 'land'">
                            <span>Новостройка</span>
                            <switch-button [value]="offer?.newBuilding"
                                           (newValue)="offer.newBuilding = $event"></switch-button>
                        </div>
                        <sliding-menu *ngIf="offer.newBuilding"
                                      [name]="'Стадия объекта'" [options]="offClass.objectStageOptions"
                                      [value]="offer?.objectStage"
                                      (result)="offer.objectStage = $event"
                        ></sliding-menu>
                        <input-line *ngIf="offer.categoryCode != 'land'"
                                    [name]="offer?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'"
                                    [value]="offer?.buildYear"
                                    (newValue)="offer.buildYear = $event"
                        ></input-line>
                        <ng-container *ngIf="offer.offerTypeCode != 'rent'">
                            <div class="show_block">
                                <span>Обременение</span>
                                <switch-button [value]="offer?.encumbrance"
                                               (newValue)="offer.encumbrance = $event"></switch-button>
                            </div>
                        </ng-container>
                        <input-line *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'"
                                    [name]="'Удаленность'" [value]="offer?.distance"
                                    (newValue)="offer.distance = $event"
                        ></input-line>
                        <hr class="line">
                        <input-line *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'"
                                    [name]="'Наименование поселения'" [value]="offer?.settlement"
                                    (newValue)="offer.settlement = $event"
                        ></input-line>
                        <input-line [name]="'Жилищный комплекс'" [value]="offer?.housingComplex" *ngIf="offer.categoryCode != 'land' && offer.buildingType != 'lowrise_house'"
                                    (newValue)="offer.housingComplex = $event"
                        ></input-line>
                        <address-input [block]="offer?.addressBlock"
                                       [addressType]="offer.categoryCode == 'commersial' ? 'office': 'apartment'"
                                       (newData)="offer.addressBlock = $event.address; $event.location ? offer.location = $event.location : null; $event.location ? updateSelected() : null;"
                                       [name]="'Адрес предложения'"
                        ></address-input>
                        <div class="show_block rating">
                            <span class="view-label">Месторасположение</span>
                            <star-mark [value]="this.offer.locRating?.map['remoteness']"
                                       (estimate)="this.offer.locRating.map['remoteness']=$event"
                                       [editable]="true"
                            ></star-mark>
                            <span class="view-label">Транспортная доступность</span>
                            <star-mark [value]="this.offer.locRating?.map['transport']"
                                       (estimate)="this.offer.locRating.map['transport']=$event"
                                       [editable]="true"
                            ></star-mark>
                            <span class="view-label">Престижность района</span>
                            <star-mark [value]="this.offer.locRating?.map['prestigious']"
                                       (estimate)="this.offer.locRating.map['prestigious']=$event"
                                       [editable]="true"
                            ></star-mark>
                            <span class="view-label">Экология</span>
                            <star-mark [value]="this.offer.locRating?.map['ecology']"
                                       (estimate)="this.offer.locRating.map['ecology']=$event"
                                       [editable]="true"
                            ></star-mark>
                            <span class="view-label">Инфраструктура</span>
                            <star-mark [value]="this.offer.locRating?.map['infrastructure']"
                                       (estimate)="this.offer.locRating.map['infrastructure']=$event"
                                       [editable]="true"
                            ></star-mark>
                        </div>
                        <ng-container *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                            <div class="show_block">
                                <span>Охраняемая территория</span>
                                <switch-button [value]="offer?.guard" (newValue)="offer.guard = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Гостевая парковка</span>
                                <switch-button [value]="offer?.parking"
                                               (newValue)="offer.parking = $event"></switch-button>
                            </div>
                        </ng-container>
                        <hr class="line">
                        <ng-container
                            *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room' || offer.typeCode == 'share'">
                            <sliding-menu
                                          [name]="'Материал стен'" [options]="offClass.houseTypeOptions"
                                          [value]="offer?.houseType"
                                          (result)="offer.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Количество комнат'" [value]="offer?.roomsCount"
                                        (newValue)="offer.roomsCount = $event"></input-line>
                            <sliding-menu [name]="'Тип комнат'" [options]="offClass.roomSchemeOptions"
                                          [value]="offer?.roomScheme"
                                          (result)="offer.roomScheme = $event"
                            ></sliding-menu>
                            <input-line [name]="'Этаж'" [value]="offer?.floor"
                                        (newValue)="offer.floor = $event"></input-line>
                            <input-line [name]="'Этажность'" [value]="offer?.floorsCount"
                                        (newValue)="offer.floorsCount = $event"></input-line>
                            <input-line [name]="'Уровней'" [value]="offer?.levelsCount" *ngIf="offer.buildingType != 'lowrise_house'"
                                        (newValue)="offer.levelsCount = $event"></input-line>
                            <input-line [name]="'Общая площадь'" [value]="offer?.squareTotal"
                                        (newValue)="offer.squareTotal = $event"></input-line>
                            <input-line [name]="'Жилая площадь'" [value]="offer?.squareLiving"
                                        (newValue)="offer.squareLiving = $event"></input-line>
                            <input-line [name]="'Площадь кухни'" [value]="offer?.squareKitchen"
                                        (newValue)="offer.squareKitchen = $event"></input-line>
                            <ng-container *ngIf="offer.buildingType == 'lowrise_house'">
                                <input-line [name]="'Площадь участка'" [value]="offer?.squareLand"
                                            (newValue)="offer.squareLand = $event"></input-line>
                                <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                              [value]="offer?.squareLandType"
                                              (result)="offer.squareLandType = $event"
                                ></sliding-menu>
                            </ng-container>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="offer?.loggia"
                                               (newValue)="offer.loggia = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="offer?.balcony"
                                               ></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Терраса</span>
                                <switch-button [value]="offer?.terrace" (newValue)="offer.terrace = $event"></switch-button>
                            </div>
                            <sliding-menu [name]="'Санузел'" [options]="offClass.bathroomOptions"
                                          [value]="offer?.bathroom"
                                          (result)="offer.bathroom = $event"
                            ></sliding-menu>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="offer?.condition"
                                          (result)="offer.condition = $event"
                            ></sliding-menu>
                        </ng-container>
                        <ng-container
                            *ngIf="offer.typeCode == 'house' || offer.typeCode == 'cottage' || offer.typeCode == 'dacha' || offer.typeCode == 'townhouse' || offer.typeCode == 'duplex'">
                            <sliding-menu [name]="'Материал стен'" [options]="offClass.houseTypeOptions"
                                          [value]="offer?.houseType"
                                          (result)="offer.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Количество комнат'" [value]="offer?.roomsCount"
                                        (newValue)="offer.roomsCount = $event"></input-line>
                            <sliding-menu *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'"
                                          [name]="'Тип комнат'" [options]="offClass.roomSchemeOptions"
                                          [value]="offer?.roomScheme"
                                          (result)="offer.roomScheme = $event"
                            ></sliding-menu>
                            <input-line [name]="'Этаж'" [value]="offer?.floor"
                                        (newValue)="offer.floor = $event"></input-line>
                            <input-line [name]="'Этажей'" [value]="offer?.floorsCount"
                                        (newValue)="offer.floorsCount = $event"></input-line>
                            <input-line [name]="'Общая площадь'" [value]="offer?.squareTotal"
                                        (newValue)="offer.squareTotal = $event"></input-line>
                            <input-line [name]="'Жилая площадь'" [value]="offer?.squareLiving"
                                        (newValue)="offer.squareLiving = $event"></input-line>
                            <input-line [name]="'Площадь кухни'" [value]="offer?.squareKitchen"
                                        (newValue)="offer.squareKitchen = $event"></input-line>
                            <input-line [name]="'Площадь участка'" [value]="offer?.squareLand"
                                        (newValue)="offer.squareLand = $event"></input-line>
                            <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                          [value]="offer?.squareLandType"
                                          (result)="offer.squareLandType = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="offer?.loggia" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="offer?.balcony" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Терраса</span>
                                <switch-button [value]="offer?.terrace" [disabled]="true"></switch-button>
                            </div>
                            <sliding-menu [name]="'Санузел'" [options]="offClass.bathroomOptions"
                                          [value]="offer?.bathroom"
                                          (result)="offer.bathroom = $event"
                            ></sliding-menu>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="offer?.condition"
                                          (result)="offer.condition = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply"
                                               (newValue)="offer.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification"
                                               (newValue)="offer.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification"
                                               (newValue)="offer.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage"
                                               (newValue)="offer.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating"
                                               (newValue)="offer.centralHeating = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.categoryCode == 'land'">
                            <input-line [name]="'Площадь участка'" [value]="offer?.squareLand"
                                        (newValue)="offer.squareLand = $event"></input-line>
                            <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                          [value]="offer?.squareLandType"
                                          (result)="offer.squareLandType = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply"
                                               (newValue)="offer.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification"
                                               (newValue)="offer.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification"
                                               (newValue)="offer.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage"
                                               (newValue)="offer.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating"
                                               (newValue)="offer.centralHeating = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.categoryCode == 'commersial'">
                            <input-line [name]="'Название'" [value]="offer?.objectName"
                                        (newValue)="offer.objectName = $event"></input-line>
                            <sliding-menu [name]="'Материал здания'" [options]="offClass.houseTypeOptions"
                                          [value]="offer?.houseType"
                                          (result)="offer.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Этаж'" [value]="offer?.floor"
                                        (newValue)="offer.floor = $event"></input-line>
                            <input-line [name]="'Этажность'" [value]="offer?.floorsCount"
                                        (newValue)="offer.floorsCount = $event"></input-line>
                            <input-line [name]="'Уровней'" [value]="offer?.levelsCount"
                                        (newValue)="offer.levelsCount = $event"></input-line>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="offer?.waterSupply"
                                               (newValue)="offer.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="offer?.gasification"
                                               (newValue)="offer.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="offer?.electrification"
                                               (newValue)="offer.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="offer?.sewerage"
                                               (newValue)="offer.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.centralHeating"
                                               (newValue)="offer.centralHeating = $event"></switch-button>
                            </div>
                            <input-line [name]="'Площадь помещения'" [value]="offer?.squareTotal"
                                        (newValue)="offer.squareTotal = $event"></input-line>
                            <input-line [name]="'Высота потолков'" [value]="offer?.ceilingHeight"
                                        (newValue)="offer.ceilingHeight = $event"></input-line>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="offer?.condition"
                                          (result)="offer.condition = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Лифт</span>
                                <switch-button [value]="offer?.lift" (newValue)="offer.lift = $event"></switch-button>
                            </div>
                        </ng-container>
                        <input-area [name]="'Дополнительное описание'" [value]="offer?.description" [update]="update"
                                    (newValue)="offer.description = $event"></input-area>
                        <hr class="line">
                        <input-area [name]="'Создать заметку'" [value]="offer?.conditionInfo" [update]="update"
                                    (newValue)="offer.conditionInfo = $event"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'УСЛОВИЯ'" *ngIf="offer.offerTypeCode == 'rent'" (tabSelect)="update = {}">
                    <ng-container *ngIf="!editEnabled">
                        <conditions-switches [block]="offer?.conditions" [disabled]="true"></conditions-switches>
                        <hr class="line">
                        <div class="show_block">
                            <span>Дата заезда</span>
                            <span class="view-value">{{ offer?.arrivalDate}}</span>
                        </div>
                        <div class="show_block">
                            <span>Период проживания</span>
                            <span class="view-value">{{ offer?.period}}</span>
                        </div>
                        <hr class="line">
                        <hidden-text [name]="'Создать заметку'" [value]="offer?.conditionInfo"></hidden-text>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <conditions-switches [block]="offer.conditions" [disabled]="false"></conditions-switches>
                        <hr class="line">
                        <input-line [name]="'Дата заезда'" [value]="offer?.arrivalDate"
                                    (newValue)="offer.arrivalDate = $event"></input-line>
                        <input-line [name]="'Период проживания'" [value]="offer?.period"
                                    (newValue)="offer.period = $event"></input-line>
                        <hr class="line">
                        <input-area [name]="'Создать заметку'" [value]="offer?.conditionInfo" [update]="update"
                                    (newValue)="offer.conditionInfo = $event"></input-area>
                    </ng-container>
                    
                </ui-tab>
                <ui-tab [title]="'ЦЕНА'" (tabSelect)="update = {}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>{{offer.offerTypeCode == 'rent' ? 'Стоимость аренды' : 'Цена продажи'}}</span>
                            <span class="view-value">{{ offer.ownerPrice ? utils.getNumWithDellimet(offer.ownerPrice * 1000) + " Р" : "Неизвестно"}}</span>
                        </div>
                        <div class="show_block" *ngIf="offer.offerTypeCode != 'rent'">
                            <span>Стоимость 1 кв.м</span>
                            <span class="view-value">{{ offer.ownerPrice ? utils.getNumWithDellimet(utils.ceil(offer.ownerPrice/offer.squareTotal) * 1000) + " Р" : "Неизвестно"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Форма расчёта</span>
                            <span class="view-value">{{offClass.paymentTypeOption[offer.paymentType]?.label}}</span>
                        </div>
                        <ng-container *ngIf="offer.offerTypeCode != 'rent'">
                            <div class="show_block">
                                <span>Требуется аванс/задаток</span>
                                <switch-button [value]="offer?.prepayment" (newValue)="offer.prepayment = $event"
                                               [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможна ипотека</span>
                                <switch-button [value]="offer?.mortgages" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможен сертификат</span>
                                <switch-button [value]="offer?.certificate" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможен материнский капитал</span>
                                <switch-button [value]="offer?.maternityCapital" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.offerTypeCode == 'rent'">
                            <div class="show_block">
                                <span>Требуется страховой депозит</span>
                                <switch-button [value]="offer?.deposit" (newValue)="offer.deposit = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Требуется залог</span>
                                <switch-button [value]="offer?.prepayment" (newValue)="offer.prepayment = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на электроэнергию</span>
                                <switch-button [value]="offer?.electrificPay" (newValue)="offer.electrificPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на воду</span>
                                <switch-button [value]="offer?.waterPay" (newValue)="offer.waterPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на газ</span>
                                <switch-button [value]="offer?.gasPay" (newValue)="offer.gasPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.heatingPay" (newValue)="offer.heatingPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Комунальные платежи</span>
                                <switch-button [value]="offer?.utilityBills" (newValue)="offer.utilityBills = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                        </ng-container>
                        <hr class="line">
                        <div class="show_block">
                            <span>Комиссия агента</span>
                            <span class="view-value">{{ offer.commission ? utils.getNumWithDellimet(offer.commission) : '' }} {{offer.commission ? offClass.commisionTypeOption[offer.commisionType]?.label : ''}}</span>
                        </div>
                        <div class="show_block">
                            <span>MLS</span>
                            <span class="view-value">{{ offer.mlsPrice ? utils.getNumWithDellimet(offer.mlsPrice) : ''}} {{offer.mlsPrice ? offClass.commisionTypeOption[offer.mlsPriceType]?.label : ''}}</span>
                        </div>
                        <hr class="line">
                        <hidden-text [name]="'Создать заметку'" [value]="offer?.costInfo"></hidden-text>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <input-line
                            [name]="offer.offerTypeCode == 'rent' ? 'Стоимость аренды' : 'Цена продажи'" [value]="offer?.ownerPrice * 1000"
                            (newValue)="offer.ownerPrice = $event / 1000"
                        ></input-line>
                        <sliding-menu [name]="'Форма расчёта'" [options]="offClass.paymentTypeOption"
                                      [value]="offer?.paymentType"
                                      (result)="offer.paymentType = $event"
                        ></sliding-menu>
                        <ng-container *ngIf="offer.offerTypeCode != 'rent'">
                            <div class="show_block">
                                <span>Требуется аванс/задаток</span>
                                <switch-button [value]="offer?.prepayment" (newValue)="offer.prepayment = $event"
                                               [disabled]="false"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможна ипотека</span>
                                <switch-button [value]="offer?.mortgages" [disabled]="false" (newValue)="offer.mortgages = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможен сертификат</span>
                                <switch-button [value]="offer?.certificate" [disabled]="false" (newValue)="offer.certificate = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Возможен материнский капитал</span>
                                <switch-button [value]="offer?.maternityCapital" [disabled]="false" (newValue)="offer.maternityCapital = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="offer.offerTypeCode == 'rent'">
                            <div class="show_block">
                                <span>Требуется страховой депозит</span>
                                <switch-button [value]="offer?.deposit" (newValue)="offer.deposit = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Требуется залог</span>
                                <switch-button [value]="offer?.prepayment" (newValue)="offer.prepayment = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на электроэнергию</span>
                                <switch-button [value]="offer?.electrificPay" (newValue)="offer.electrificPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на воду</span>
                                <switch-button [value]="offer?.waterPay" (newValue)="offer.waterPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Счетчик на газ</span>
                                <switch-button [value]="offer?.gasPay" (newValue)="offer.gasPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="offer?.heatingPay" (newValue)="offer.heatingPay = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Комунальные платежи</span>
                                <switch-button [value]="offer?.utilityBills" (newValue)="offer.utilityBills = $event"
                                               [disabled]="!editEnabled"></switch-button>
                            </div>
                        </ng-container>
                        <hr class="line">
                        <input-line
                            [name]="'Комиссия агента'" [value]="offer?.commission"
                            (newValue)="offer.commission = $event"
                        ></input-line>
                        <sliding-menu [name]="'Тип комиссии'" [options]="offClass.commisionTypeOption" *ngIf="offer.commission"
                                      [value]="offer?.commisionType"
                                      (result)="offer.commisionType = $event"
                        ></sliding-menu>
                        <input-line
                            [name]="'MLS'" [value]="offer?.mlsPrice"
                            (newValue)="offer.mlsPrice = $event"
                        ></input-line>
                        <sliding-menu [name]="'Тип MLS'" [options]="offClass.commisionTypeOption" *ngIf="offer.mlsPrice"
                                      [value]="offer?.mlsPriceType"
                                      (result)="offer.mlsPriceType = $event"
                        ></sliding-menu>
                        <hr class="line">
                        <input-area [name]="'Создать заметку'" [value]="offer?.costInfo" (newValue)="offer.costInfo = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
<!--                (click)="showContextMenu($event);"-->
                <div more class="more" (click)="showContextMenu($event);" (offClick)="this._hubService.shared_var['cm_hidden'] = true">ЕЩЁ...
<!--                    <div>-->
<!--                        <div>Проверить</div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div><a href="{{offer.sourceUrl}}">Перейти в источник</a></div>-->
<!--                        <div (click)="workAreaMode = 'photo'" [class.selected]="workAreaMode == 'photo'">Показать фото</div>-->
<!--                        <div (click)="workAreaMode = 'map'" [class.selected]="workAreaMode == 'map'">Перейти на карту</div>-->
<!--                        <div (click)="workAreaMode = 'doc'" [class.selected]="workAreaMode == 'doc'">Показать документы</div>                        -->
<!--                        <div (click)="workAreaMode = 'advert'" [class.selected]="workAreaMode == 'advert'">Экспорт предложения в...</div>-->
<!--                        <div (click)="workAreaMode = 'egrn'" [class.selected]="workAreaMode == 'egrn'">Выписка из ЕГРН-->
<!--                        </div>-->
<!--                        <div (click)="workAreaMode = 'mortgage'" [class.selected]="workAreaMode == 'mortgage'">Заявка на-->
<!--                            ипотеку-->
<!--                        </div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div (click)="openNotebook('notes', $event)" [class.selected]="workAreaMode == 'notes'">-->
<!--                            Добавить заметку-->
<!--                        </div>-->
<!--                        <div (click)="openNotebook('daily', $event)" [class.selected]="workAreaMode == 'daily'">-->
<!--                            Добавить задачу-->
<!--                        </div>-->
<!--                        <div (click)="openNotebook('chat', $event)" [class.selected]="workAreaMode == 'chat'">Написать в чат</div>-->
<!--                        <div (click)="openNotebook('phone', $event)" [class.selected]="workAreaMode == 'phone'">-->
<!--                            Позвонить-->
<!--                        </div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div (click)="workAreaMode = 'summary'" [class.selected]="workAreaMode == 'summary'">Сводка-->
<!--                        </div>-->
<!--                        <div (click)="workAreaMode = 'report'" [class.selected]="workAreaMode == 'report'">Отчет</div>-->
<!--                        <div (click)="workAreaMode = 'history'" [class.selected]="workAreaMode == 'history'">История-->
<!--                        </div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div class="delete" (click)="delete()">Удалить</div>-->
<!--                    </div>-->
                </div>
            </ui-tabs-menu>
            <div class="digest-list" (contextmenu)="$event" *ngIf="mode == 1">
                <!--TODO: Нужно потом переделать в нормальном виде-->
                <ui-tabs-menu>
                    <ui-tab [title]="'ОБЩАЯ БАЗА'" (tabSelect)="source = 0 ; getRequests();">
                        <digest-request *ngFor="let req of requests; let i = index" [request]="req"
                                        [class.selected]="selectedRequests.indexOf(req) > -1"
                                        (click)="select($event, req, i)"
                                        (contextmenu)="select($event, req, i)"
                                        (dblclick)="openRequest(req)"
                                        [active]="selectedRequests.indexOf(req) > -1"
                        ></digest-request>
                    </ui-tab>
                    <ui-tab [title]="'БАЗА КОМПАНИИ'" (tabSelect)="source = 1; getRequests();">
                        <digest-request *ngFor="let req of requests; let i = index" [request]="req"
                                        [class.selected]="selectedRequests.indexOf(req) > -1"
                                        (click)="select($event, req, i)"
                                        (contextmenu)="select($event, req, i)"
                                        (dblclick)="openRequest(req)"
                                        [active]="selectedRequests.indexOf(req) > -1"
                        ></digest-request>
                    </ui-tab>
                </ui-tabs-menu>
            </div>
        </div>

        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <yamap-view *ngSwitchCase="'map'"
                            [selected_offers]="selectedOffers"
                >
                </yamap-view>
                <adv-view *ngSwitchCase="'advert'" [offers]="[offer]"  [mode]="'offer'"></adv-view>
                <files-view *ngSwitchCase="'photo'" [files]="offer.photos" [full]="paneHidden" [type]="'photo'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'photo')" (delete)="offer.photos = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
                <files-view *ngSwitchCase="'doc'" [files]="offer.documents" [full]="paneHidden" [type]="'doc'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'doc')" (delete)="offer.documents = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
            </ng-container>
        </div>

    `,
    providers: [OfferService]
})

export class TabOfferComponent implements OnInit {
    public tab: Tab;
    public offer: Offer = new Offer();

    @Output() action: EventEmitter<any> = new EventEmitter();
    selectedOffers: Offer[] = []; //объект для отобраения на карте
    mode: number = 0;
    progressWidth: number = 0;
    workAreaMode: string = "map";
    canEditable: boolean = true;

    page: number = 0;
    source: OfferSource = OfferSource.LOCAL;
    requests: Request[] = [];
    selectedRequests: Request[] = [];
    contact: Contact = new Contact();
    update: any;

    hitsCount: number = 0;

    offClass = Offer;
    conClass = Contact;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;
    openPopup: any = {visible: false};
    agentOpts: any = {
        null: {label: "Не назначено"}
    };
    similarOffers: Offer[] = [];
    paneHidden: boolean = false;
    searchQuery: any;
    editEnabled: boolean = false;


    filter: any = {
        agentId: "all",
        stateCode: "all",
        tag: "all",
        offerTypeCode: "sale"
    };


    typeCodeOptions = Offer.typeCodeOptions;

    sameObject: boolean = false;

    userSubscribe: any;
    offerSubscribe: any;

    constructor(private _hubService: HubService,
                private _configService: ConfigService,
                private _offerService: OfferService,
                private _taskService: TaskService,
                private _analysisService: AnalysisService,
                private _historyService: HistoryService,
                private _userService: UserService,
                private _personService: PersonService,
                private _organisationService: OrganisationService,
                private _suggestionService: SuggestionService,
                private _sessionService: SessionService
    ) {
        this.utilsObj = new Utils(_sessionService, _personService, _organisationService);
        setTimeout(() => {
            if (this.offer.id) {
                this.tab.header = "Предложение ";
            } else {
                this.tab.header = "Новый Объект";
            }

            this.agentOpts[this._sessionService.getUser().id] = {label: this._sessionService.getUser().name};
            for(let user of _userService.cacheUsers){
                this.agentOpts[user.value] = {label: user.label};
            }
        });
    }

    ngOnInit() {
        this.offer = this.tab.args.offer;
        this.canEditable = this.tab.args.canEditable;
        this.updateSelected();
        if (!this.offer.locRating) {
            this.offer.locRating = new Rating();
            this.offer.locRating.map = {};
            this.offer.locRating.map = {average: 0};
        }

        this.offer.openDate = Math.round((Date.now() / 1000));
        if (this.offer.person) {
            this.contact = this.offer.person;
            this.contact.type = "person";
        } else if (this.offer.company) {
            this.contact = this.offer.company;
            this.contact.type = "organisation";
        } else{
            this.contact.phoneBlock = this.offer.phoneBlock;
            this.contact.type = "person";
        }
        let c = this._configService.getConfig();
        let loc = null;//this._sessionService.getAccount().location;

        if (!this.offer.buildingType) {
            this.offer.buildingType = Offer.typeCodeOptionsToBuilding[this.offer.typeCode];
        }

        if (!this.offer.categoryCode) {
            this.offer.categoryCode = Offer.buildingTypeOptionsToCategory[this.offer.buildingType];
        }

        if (this.offer.id == null && this.offer.sourceMedia == null) {
            this.offer = new Offer();
            if (this.tab.args.person) {
                this.offer.personId = this.tab.args.person.id;
            }
            this.editEnabled = true;

        }
    }
    showContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        let uOpt = [{class:'entry', label: "На себя", disabled: false, callback: () => {
                this.clickContextMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
            }}];
        for (let op of this._userService.cacheUsers){
            op.callback = () => {
                this.clickContextMenu({event: "set_agent", agentId: op.value});
            };
            uOpt.push(op);
        }
        let stateOpt = [];
        let states = [
            {value: 'raw', label: 'Не активен'},
            {value: 'active', label: 'Активен'},
            {value: 'work', label: 'В работе'},
            {value: 'suspended', label: 'Приостановлен'},
            {value: 'archive', label: 'Архив'}
        ];
        states.forEach(s => {
            stateOpt.push(
                {class: "entry", disabled: false, label: s.label, callback() {
                        c.selectedOffers.forEach(o => {
                            o.stageCode = s.value;
                            c._offerService.save(o);
                        });
                    }}
            );
        });
        let tag = this.selectedOffers[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: 'Проверить', callback: () => {
                        this.openPopup = {visible: true, task: "check"};
                    }},
                {class: "delimiter"},
                {class: "entry", disabled: false, icon: "", label: 'Перейти в источник',
                    callback: () => {
                        this.selectedOffers.forEach(o => {
                            if(o.sourceUrl)
                                window.open(o.sourceUrl, '_blank');
                        });
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Показать фото",
                    callback: () => {
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Перейти на карту",
                    callback: () => {
                        this.workAreaMode = 'map';
                        let off = this.selectedOffers[0];
                        this.selectedOffers = [];
                        setTimeout(() => {
                            this.selectedOffers = [off]
                        }, 100);
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Показать документы",
                    callback: () => {
                        this.workAreaMode = 'doc';
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Экспорт предложения в...", callback: () => {
                        this.workAreaMode = 'advert';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Выписка из ЕГРН",
                    callback: () => {
                        this.workAreaMode = 'egrn';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Заявка на ипотеку",
                    callback: () => {
                        this.workAreaMode = 'mortgage';
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить как...", items: [
                        {class: "entry", disabled: this.source == OfferSource.LOCAL, label: "Предложение",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_local"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Контакт",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_person"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Организацию",
                            callback: () => {
                                this.clickContextMenu({event: "add_to_company"});
                            }
                        },
                    ]},
                {class: "submenu", disabled: !(this.source != OfferSource.LOCAL || this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: "Назначить на...", items: [
                        {class: "entry", disabled: this.source != OfferSource.LOCAL, label: "Не назначено",
                            callback: () => {
                                this.clickContextMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "delimiter"},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("notes", event);
                        block.setShow(true, event);
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("daily", event);
                        block.setShow(true, event);
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Написать в чат",  callback: (event) => {
                        let block = this._hubService.getProperty('notebook');

                        block.setMode("chat", event);
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
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Сводка",
                    callback: () => {
                        this.workAreaMode = 'svodka';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "Отчет",
                    callback: () => {
                        this.workAreaMode = 'report';
                    }
                },
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: "История",
                    callback: () => {
                        this.workAreaMode = 'history';
                    }
                },
                {class: "submenu", disabled: !(this.source == OfferSource.LOCAL && this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedOffers.length == 1 ? this.selectedOffers[0] : null, tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]},
                {class: "delimiter"},
                {class: "entry", sub_class: 'del', disabled: !(this.source == OfferSource.LOCAL && this.utilsObj.canImpact(this.selectedOffers)), icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                }
            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }
    clickContextMenu(evt: any){
        this.selectedOffers.forEach(o => {
            if(evt.event == "add_to_local"){
                if(this.source == OfferSource.LOCAL){
                    o.changeDate = Math.round((Date.now() / 1000));
                } else{
                    o.addDate = null;
                }
                o.stageCode = 'raw';
                if(evt.agent){
                    o.agentId = evt.agent.id;
                    o.agent = evt.agent;
                } else {
                    o.agentId = null;
                    o.agent = null;
                }
                if(!o.person && !o.company && o.phoneBlock.main){
                    let pers: Person = new Person();
                    pers.phoneBlock =  PhoneBlock.toFormat(o.phoneBlock);
                    if(evt.agent) {
                        pers.agent = evt.agent;
                        pers.agentId = evt.agent.id;
                    }
                    this._personService.save(pers).subscribe(
                        data => {
                            o.person = data;
                            o.personId = data.id;
                            this._offerService.save(o);
                        }
                    );
                } else{
                    o.person != null ? o.personId = o.person.id : o.companyId = o.company.id;
                    this._offerService.save(o);
                    o.offerRef = 1;
                }
            } else if(evt.event == "add_to_person"){
                if(!o.person  && o.phoneBlock.main){
                    let pers: Person = new Person();
                    pers.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);
                    this._personService.save(pers).subscribe(
                        data => {
                            o.person = data;
                            o.personId = data.id;
                            /*this.offers.forEach(t => {
                                if(t.phones_import)
                            });*/
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('person', {person: o.person, canEditable: true});
                        }
                    );
                }
            }
            else if(evt.event == "add_to_company"){
                if(!o.person && !o.company && o.phoneBlock.main){
                    let org: Organisation = new Organisation();
                    org.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);

                    this._organisationService.save(org).subscribe(
                        data => {
                            o.company = data;
                            o.companyId = data.id;
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('organisation', {organisation: o.company, canEditable: true});
                        }
                    );
                }
            } else if(evt.event == "set_agent"){
                o.agentId = evt.agentId;
                this._offerService.save(o).subscribe(offer =>{
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });

            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._offerService.save(o).subscribe(offer =>{
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });
            } else if(evt.event == "del_obj"){
                this._offerService.delete(o).subscribe(
                    data => {
                        this.selectedOffers.splice(this.selectedOffers.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){
                this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "photo"){
                this.openPopup = {visible: true, task: "photo", offer: o, value: this.source};
            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._offerService.save(o).subscribe(offer =>{
                    this.selectedOffers[this.selectedOffers.indexOf(o)] = offer;
                });
            } else {
                this._offerService.save(o);
            }
        });
        if(evt.event == "map"){
            this.openPopup = {visible: true, task: "map", offers: this.selectedOffers, value: this.source,
                map: {}
            };
        }
    }
    openNotebook(name, event) {
        let block = this._hubService.getProperty("notebook");

        block.setMode(name, event);
        block.setShow(true, event);
    }

    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
    }

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    agentChanged(event) {
        this.offer.agentId = event == "null" ? null : event;
        if (this.offer.agentId != null ) {
            this._userService.get(this.offer.agentId).subscribe(agent => {
                this.offer.agent = agent;
            });
        }
    }

    updateSelected() {
        setTimeout(() => {
            this.selectedOffers = [this.offer];
        }, 200);
    }

    checkConditions(){
        if(this.offer.offerTypeCode == 'rent' && !this.offer.conditions)
            this.offer.conditions = new ConditionsBlock();
    }

    save() {
        if (!this.checkForm())
            return;

        let middleRat = {count: 0, value: 0};
        for (let ratCat in this.offer.locRating.map) {
            if (this.offer.locRating.map[ratCat] > 0) {
                middleRat.count++;
                middleRat.value += this.offer.locRating.map[ratCat];
            }
        }
        this.offer.locRating.map["average"] = middleRat.count > 0 ? middleRat.value / middleRat.count : 0;
        //this.offer.ownerPrice = this.offer.ownerPrice / 1000;
        if (this.contact.type == "person") {
            this._personService.save(this.contact as Person).subscribe(person => {
                if (person) {
                    this.offer.personId = person.id;
                    delete this.offer.company;
                    delete this.offer.companyId;
                    delete this.offer.person;
                    this.contact = person;
                    this.contact.type = "person";
                    this._offerService.save(this.offer).subscribe(offer => {
                        setTimeout(() => {
                            let type = this.offer.id ? 'update' : 'new';
                            this.offer = offer;
                            this.tab.setEvent({type, value: this.offer});
                        });
                        this.updateSelected();
                        this.toggleEdit();
                    });
                }
            });
        } else {
            this._organisationService.save(this.contact as Organisation).subscribe(org => {
                if (org) {
                    this.offer.companyId = org.id;
                    this.offer.company = org;
                    delete this.offer.person;
                    delete this.offer.personId;
                    delete this.offer.company;
                    this.contact = org;
                    this.contact.type = "organisation";
                    this._offerService.save(this.offer).subscribe(offer => {
                        setTimeout(() => {
                            let type = this.offer.id ? 'update' : 'new';
                            this.offer = offer;
                            this.tab.setEvent({type, value: this.offer});
                        });
                        this.updateSelected();
                        this.toggleEdit();
                    });
                }
            });
        }
    }

    checkForm() {
        if (PhoneBlock.getNotNullData(this.contact.phoneBlock) == "") {
            this._hubService.getProperty("modal-window").showMessage("Не указан контактный телефон");
            return false;
        }
        if (!PhoneBlock.check(PhoneBlock.removeSymb(this.contact.phoneBlock))) {
            this._hubService.getProperty("modal-window").showMessage("Один из телефонов указан неверно");
            return false;
        }
        if (!AddressBlock.check(this.offer.addressBlock)) {
            this._hubService.getProperty("modal-window").showMessage("Адрес не заполнен. Сохранение невозможно!");
            return false;
        }
        if (this.offer.stageCode == 'listing' && !this.offer.agentId) {
            this._hubService.getProperty("modal-window").showMessage("Невозможно перевести объект в стадию \"Листинг\" без ответственного");
            return false;
        }

        return true;
    }

    public findContact(event) {
        this.utilsObj.findContact(event, this.contact).subscribe(data => this.contact = data);
    }

    similarObjSelected() {
        this.sameObject = !this.sameObject;
        if (this.sameObject) {
            this.getSimilarOffers(0, 16);
        }
    }

    getSimilarOffers(page, per_page) {
        this.offerSubscribe = this._offerService.getSimilar(this.offer, page, per_page).subscribe(
            data => {
                this.similarOffers = data.list;
            },
            err => console.log(err)
        );
    }

    openPerson() {
        if (this.offer.person.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("person", {person: this.offer.person});
        }
    }

    openUser() {
        if (this.offer.agent.id) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("user", {user: this.offer.agent});
        }
    }

    openOrganisation() {
        if (this.offer.companyId) {
            let tab_sys = this._hubService.getProperty("tab_sys");
            tab_sys.addTab("organisation", {organisation: this.offer.company});
        }
    }


    ParseInt(val) {
        if (isNaN(parseInt(val, 10)))
            return null;
        else
            return parseInt(val, 10);
    }

    ParseFloat(val) {
        if (isNaN(parseFloat(val)))
            return null;
        else
            return parseFloat(val);
    }

    changeOfferTypeCode(value) {
        this.offer.offerTypeCode = value;

    }

    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 3000);
    }

    addFile(event, array) {
        if (array == "photo")
            this.offer.photos.length > 0 ? this.offer.photos = [].concat(this.offer.photos).concat(event) : this.offer.photos = event;
        else if (array == "doc")
            this.offer.documents.length > 0 ? this.offer.documents = [].concat(this.offer.documents).concat(event) : this.offer.documents = event;
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        let c = this;
        let users: User[] = this._userService.listCached("", 0, "");
        let uOpt = [];

        users.forEach(u => {
            if (u.id != this._sessionService.getUser().id)
                uOpt.push(
                    {
                        class: "entry", disabled: false, label: u.name, callback: () => {
                            this.clickMenu({event: "add_to_local", agent: u});
                        }
                    }
                );
        });

        let stateOpt = [];
        let states = [
            {value: "raw", label: "Не активен"},
            {value: "active", label: "Активен"},
            {value: "work", label: "В работе"},
            {value: "suspended", label: "Приостановлен"},
            {value: "archive", label: "Архив"}
        ];
        let stageOpt = [];
        let stages = [
            {value: "contact", label: "Первичный контакт"},
            {value: "pre_deal", label: "Заключение договора"},
            {value: "show", label: "Показ"},
            {value: "prep_deal", label: "Подготовка договора"},
            {value: "decision", label: "Принятие решения"},
            {value: "negs", label: "Переговоры"},
            {value: "deal", label: "Сделка"}
        ];
        states.forEach(s => {
            stateOpt.push(
                {
                    class: "entry", disabled: false, label: s.label, callback: function () {
                        this.offer.stageCode = s.value;
                        this.save();
                    }
                }
            );
        });
        stages.forEach(s => {
            stageOpt.push(
                {
                    class: "entry", disabled: false, label: s.label, callback: function () {
                        this.offer.stageCode = s.value;
                        this.save();
                    }
                }
            );
        });
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: "Проверить", callback: () => {
                        this.openPopup = {visible: true, task: "check"};
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Показать фото",
                    callback: () => {
                        this.clickMenu({event: "photo"});
                    }
                },
                {class: "delimiter"},
                {
                    class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                        {
                            class: "entry", disabled: !this.tab.args.canEditable, label: "В базу компании",
                            callback: () => {
                                this.clickMenu({event: "add_to_local"});
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "В контакты",
                            callback: () => {
                                this.clickMenu({event: "add_to_person"});
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "В контрагенты",
                            callback: () => {
                                this.clickMenu({event: "add_to_company"});
                            }
                        }
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Назначить", items: [
                        {
                            class: "entry", disabled: this.tab.args.canEditable, label: "Не назначено",
                            callback: () => {
                                this.clickMenu({event: "del_agent", agent: null});
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "",
                            callback: () => {
                                this.clickMenu({event: "add_to_local", agent: this._sessionService.getUser()});
                            }
                        },
                        {class: "delimiter"}
                    ].concat(uOpt)
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
                        {
                            class: "entry", disabled: false, label: "Произвольно", callback: function () {
                                alert("yay s1!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 1", callback: function () {
                                alert("yay s2!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 2", callback: function () {
                                alert("yay s2!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 3", callback: function () {
                                alert("yay s2!");
                            }
                        }
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                        {
                            class: "entry", disabled: false, label: "Произвольно", callback: function () {
                                alert("yay s1!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 1", callback: function () {
                                alert("yay s2!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 2", callback: function () {
                                alert("yay s2!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "Шаблон 3", callback: function () {
                                alert("yay s2!");
                            }
                        }
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Позвонить", items: [
                        {
                            class: "entry", disabled: false, label: "Произвольно", callback: function () {
                                alert("yay s1!");
                            }
                        },
                        {class: "delimiter"},
                        {
                            class: "entry", disabled: false, label: "На основной", callback: function () {
                                alert("yay s1!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "На рабочий", callback: function () {
                                alert("yay s1!");
                            }
                        },
                        {
                            class: "entry", disabled: false, label: "На мобильный", callback: function () {
                                alert("yay s2!");
                            }
                        }
                    ]
                },
                {class: "submenu", disabled: false, icon: "", label: "Написать в чат",  callback: (event) => {
                    let block = this._hubService.getProperty('notebook');

                    block.setMode("chat", event);
                    block.setShow(true, event);
                }}
            ]
        };

        this._hubService.shared_var["cm"] = menu;
        this._hubService.shared_var["cm_hidden"] = false;
    }

    clickMenu(evt: any) {
        if (evt.event == "add_to_local") {

            this.offer.stageCode = "raw";
            if (evt.agent) {
                this.offer.agentId = evt.agent.id;
                this.offer.agent = evt.agent;
            } else {
                this.offer.agentId = null;
                this.offer.agent = null;
            }
            if (!this.offer.person && this.offer.phoneBlock.main) {
                let pers: Person = new Person();
                pers.phoneBlock = this.offer.phoneBlock;

                if (evt.agent) {
                    pers.agent = evt.agent;
                    pers.agentId = evt.agent.id;
                }
                this._personService.save(pers).subscribe(
                    data => {
                        this.offer.person = data;
                        this.offer.personId = data.id;
                        this._offerService.save(this.offer);
                    }
                );
            } else {
                this.offer.personId = this.offer.person.id;
                this._offerService.save(this.offer);
            }
        } else if (evt.event == "add_to_person") {
            if (!this.offer.person && this.offer.phoneBlock.main) {
                let pers: Person = new Person();
                pers.phoneBlock.main = "+" + this.offer.phoneBlock;
                this._personService.save(pers).subscribe(
                    data => {
                        this.offer.person = data;
                        this.offer.personId = data.id;
                        let tabSys = this._hubService.getProperty("tab_sys");
                        tabSys.addTab("person", {person: this.offer.person});
                    }
                );
            }
        } else if (evt.event == "add_to_company") {
            if (!this.offer.person && !this.offer.company && this.offer.phoneBlock.main) {
                let org: Organisation = new Organisation();
                org.phoneBlock = this.offer.phoneBlock;

                this._organisationService.save(org).subscribe(
                    data => {
                        this.offer.company = data;
                        this.offer.companyId = data.id;
                        let tabSys = this._hubService.getProperty("tab_sys");
                        tabSys.addTab("organisation", {organisation: this.offer.company});
                    }
                );
            }
        } else if (evt.event == "del_agent") {
            this.offer.agentId = null;
            this.offer.agent = null;
            this._offerService.save(this.offer);
        } else if (evt.event == "del_obj") {

        } else if (evt.event == "check") {

        } else {
            this._offerService.save(this.offer);
        }
    }

    public searchParamChanged() {

    }

    public getRequests() {

    }

    public select($event: MouseEvent, req: Request, i: number) {

    }

    public openRequest(req) {

    }

    public delete() {
        this._offerService.delete(this.offer).subscribe((stat) =>{
            this._hubService.getProperty("modal-window").showMessage("Предложение удалено успешно");
            this.tab.setEvent({type: 'delete', value: this.offer.id});
            this._hubService.getProperty('tab_sys').closeTab(this.tab);
        });
    }
}
