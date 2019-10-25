import {Component, OnInit} from "@angular/core";
import {Tab} from "../../class/tab";
import {Offer} from "../../entity/offer";
import {Person} from "../../entity/person";
import {Request, ValueRange} from "../../entity/request";
import {PhoneBlock} from "../../class/phoneBlock";
import {HubService} from "../../service/hub.service";
import {ConfigService} from "../../service/config.service";
import {OfferService, OfferSource} from "../../service/offer.service";
import {RequestService} from "../../service/request.service";
import {OrganisationService} from "../../service/organisation.service";
import {TaskService} from "../../service/task.service";
import {HistoryService} from "../../service/history.service";
import {PersonService} from "../../service/person.service";
import {UserService} from "../../service/user.service";
import {AnalysisService} from "../../service/analysis.service";
import {SessionService} from "../../service/session.service";
import {Contact} from "../../entity/contact";
import {Organisation} from "../../entity/organisation";
import {Utils} from "../../class/utils";
import {ObjectBlock} from "../../class/objectBlock";

@Component({
    selector: "tab-request",
    inputs: ["tab"],
    styles: [`
        .property_face > span:last-child {
            font-size: 12px;
            color: var(--color-inactive);
            font-style: normal;
            text-transform: uppercase;
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
            background-color: var(--color-blue)
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
        .map-buttons{
            position: absolute;
            top: 20px;
            left: calc(100% - 180px*3 - 30px);
            display: flex;
            z-index: 100;
        }
        .map-button{
            width: 180px;
            height: 35px;
            background-color: white;
            border: 1px solid #DFE1EE;
            box-shadow: 2px 0 4px #DFE1EE;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: none;
        }
        .map-button:first-child{
            border-right: none;
        }
        .map-button:last-child{
            border: 1px solid #DFE1EE;
        }
        .map-button:last-child:hover{
            border: 1px solid #3b5998;
        }
        .map-button:hover{
            background-color: #3b5998;
            color: white;
            cursor: pointer;
        }
        .map-button:focus, .map-button:active{
            background-color: #2B3C63;
            color: white;
        }
        .map-button.activate{
            background-color: #3b5998;
            color: white;
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
    `],
    template: `
<!--        <div class="search-form" *ngIf="workAreaMode != 'photo' && workAreaMode != 'advert'">-->
<!--            <input type="text" class="input_line" placeholder="Введите текст запроса"-->
<!--                   [style.width]="'100%'"-->
<!--                   [(ngModel)]="request.request" (keyup)="$event" [disabled]="!editEnabled"-->
<!--            ><span class="find_icon"></span>-->
<!--&lt;!&ndash;            <div (click)="editEnabled ? toggleDraw() : ''" class="deactivate_draw"&ndash;&gt;-->
<!--&lt;!&ndash;                 [class.activate_draw]="mapDrawAllowed"&ndash;&gt;-->
<!--&lt;!&ndash;                 [class.inactive_bottom]="!editEnabled"&ndash;&gt;-->
<!--&lt;!&ndash;            >ОБВЕСТИ&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--            <div class="tool-box" *ngIf="mode == 1">-->
<!--                <filter-select *ngIf="request.offerTypeCode == 'sale'"-->
<!--                               [name]="'Тип сделки'"-->
<!--                               [options]="[-->
<!--                                  {value: 'sale', label: 'Продажа'},-->
<!--                                  {value: 'alternative', label: 'Альтернатива'}-->
<!--                    ]"-->
<!--                               [value]="{'option' : filter.offerTypeCode}"-->
<!--                               (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <filter-select-->
<!--                    [name]="'Статус контакта'" [firstAsName]="true"-->
<!--                    [options]="[-->
<!--                                  {value: 'all', label: 'Все'},-->
<!--                                  {value: 'owner', label: 'Принципал'},-->
<!--                                  {value: 'middleman', label: 'Посредник'}-->
<!--                    ]"-->
<!--                    [value]="{'option' : filter.offerTypeCode}"-->
<!--                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <filter-select-->
<!--                    [name]="'Статус объекта'" [firstAsName]="true"-->
<!--                    [options]="[-->
<!--                                  {value: 'all', label: 'Все объекты'},-->
<!--                                  {value: 'my', label: 'Мои объекты'},-->
<!--                                  {value: 'our', label: 'Наша компания'}-->
<!--                    ]"-->
<!--                    [value]="{'option' : filter.offerTypeCode}"-->
<!--                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <filter-select-->
<!--                    [name]="'Стадия объекта'" [firstAsName]="true"-->
<!--                    [options]="[-->
<!--                                  {value: 'all', label: 'Все'},-->
<!--                                  {value: 'inactive', label: 'Не активно'},-->
<!--                                  {value: 'active', label: 'Активно'},-->
<!--                                  {value: 'listing', label: 'Листинг'},-->
<!--                                  {value: 'deal', label: 'Сделка'},-->
<!--                                  {value: 'suspended', label: 'Приостановлено'},-->
<!--                                  {value: 'archive', label: 'Архив'}-->
<!--                    ]"-->
<!--                    [value]="{'option' : filter.offerTypeCode}"-->
<!--                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <filter-select-tag [value]="filter?.tag" (newValue)="filter.tag = $event;"></filter-select-tag>-->
<!--                <filter-select-->
<!--                    [name]="'Период'" [firstAsName]="true"-->
<!--                    [options]="[-->
<!--                                  {value: 'all', label: 'Все'},-->
<!--                                  {value: '1', label: '1 день'},-->
<!--                                  {value: '3', label: '3 дня'},-->
<!--                                  {value: '7', label: 'Неделя'},-->
<!--                                  {value: '14', label: '2 недели'},-->
<!--                                  {value: '30', label: 'Месяц'},-->
<!--                                  {value: '90', label: '3 месяца'}-->
<!--                    ]"-->
<!--                    [value]="{'option' : filter.offerTypeCode}"-->
<!--                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <filter-select-->
<!--                    [name]="'Сортировка'" [firstAsName]="true"-->
<!--                    [options]="[-->
<!--                                  {value: 'all', label: 'Все'},-->
<!--                                  {value: 'inactive', label: 'Не активно'},-->
<!--                                  {value: 'active', label: 'Активно'},-->
<!--                                  {value: 'listing', label: 'Листинг'},-->
<!--                                  {value: 'deal', label: 'Сделка'},-->
<!--                                  {value: 'suspended', label: 'Приостановлено'},-->
<!--                                  {value: 'archive', label: 'Архив'}-->
<!--                    ]"-->
<!--                    [value]="{'option' : filter.offerTypeCode}"-->
<!--                    (newValue)="filter.offerTypeCode = $event.option; searchParamChanged();"-->
<!--                >-->
<!--                </filter-select>-->
<!--                <div class="found">Найдено: {{hitsCount + " "}}/{{" " + offers?.length }}</div>-->
<!--            </div>-->
<!--        </div>-->

        <div class="property_face">
            <ui-tag [value]="request?.tag"></ui-tag>
            <span class="main_title">{{request.id ? 'ЗАЯВКА' : 'НОВАЯ ЗАЯВКА'}}</span>
            <span class="type_title">{{reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
        </div>

        <hr class='underline'>
        <hr class='underline progress_bar'
            [ngStyle]="{'width': progressWidth + 'vw', 'transition': progressWidth > 0 ? 'all 2s ease 0s' : 'all 0s ease 0s'}">

        <div class="pane" [style.left.px]="paneHidden ? -339 : null">
            <div class="source_menu">
                <div class="button" [class.active]="mode == 0" (click)="mode = 0">ЗАЯВКА</div>
                <div class="button last" [class.active]="mode == 1"
                     (click)="mode = 1; filter.offerTypeCode = request.offerTypeCode;workAreaMode = 'map'"
                     style="border-right: solid rgba(59, 89, 152, 1) 1px">ПРЕДЛОЖЕНИЯ
                </div>
                <div class="edit_ready" *ngIf="mode == 0">
                    <span class="link" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</span>
                    <span class="link" *ngIf="editEnabled && canEditable" (click)="save()">Готово</span>
                    <span *ngIf="!canEditable && false" class="pointer_menu" (click)="$event">...</span>
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
                            <span class="view-value">{{ utils.getDateInCalendar(request.addDate) }}</span>
                        </div>
                        <div class="show_block">
                            <span>Предложение</span>
                            <span class="view-value">{{conClass.typeOptions[contact.type]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>{{contact.type == 'person' ? 'ФИО' : 'Название организации'}}</span>
                            <span class="view-value link">{{ contact?.name}}</span>
                        </div>
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
                        <div class="show_block">
                            <span>Источник</span>
                            <span
                                class="view-value">{{ canEditable ? conClass.sourceCodeOptions[contact?.sourceCode]?.label : "Общая база"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Статус</span>
                            <span class="view-value">{{ contact?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип контакта</span>
                            <span class="view-value">{{ conClass.typeCodeOptions[contact?.typeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Лояльность</span>
                            <span class="view-value">{{ conClass.loyaltyOptions[contact?.loyalty]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия контакта</span>
                            <span class="view-value">{{ conClass.stageCodeOptions[contact?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Сделка</span>
                            <span
                                class="view-value">{{ reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия заявки</span>
                            <span class="view-value">{{ reqClass.stageCodeOptions[request?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Ответственный</span>
                            <span class="view-value"
                                  [class.link]="request.agentId">{{ request.agent?.name || 'Не назначено'}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(request.contractBlock)?.length == 0">
                            <div class="show_block">
                                <span>Договор</span>
                                <span class="view-value">Нет</span>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="block.getAsArray(request.contractBlock)?.length > 0">
                            <div class="show_block" *ngIf="request?.contractBlock?.number">
                                <span>Номер договора</span>
                                <span class="view-value">{{ request.contractBlock?.number}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.contractBlock?.begin || request.contractBlock?.end">
                                <span>Действие договора</span>
                                <span class="view-value">{{ request.contractBlock?.begin}}
                                    -{{request.contractBlock?.end}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.contractBlock?.continued">
                                <span>Договор продлён</span>
                                <span class="view-value">{{ request.contractBlock?.continued}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.contractBlock?.terminated">
                                <span>Договор расторгнут</span>
                                <span class="view-value">{{ request.contractBlock?.terminated}}</span>
                            </div>
                        </ng-container>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name]="'Предложение'" [options]="conClass.typeOptions"
                                      [value]="contact?.type"
                                      (result)="contact.type = $event"
                        ></sliding-menu>
                        <input-line [name]="contact.type == 'person' ? 'ФИО' : 'Название организации'"
                                    [value]="contact?.name"
                                    (newValue)="contact.name = $event"
                        ></input-line>
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
                        <sliding-menu [name]="'Источник'" [options]="conClass.sourceCodeOptions"
                                      [value]="contact?.sourceCode"
                                      (result)="contact.sourceCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Статус'" [options]="conClass.middlemanOptions"
                                      [value]="contact.isMiddleman ? 'middleman' : 'owner'"
                                      (result)="contact.isMiddleman = $event == 'middleman'"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип контакта'" [options]="conClass.typeCodeOptions"
                                      [value]="contact?.typeCode"
                                      (result)="contact.typeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Лояльность'" [options]="conClass.loyaltyOptions"
                                      [value]="contact?.loyalty"
                                      (result)="contact.loyalty = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия контакта'" [options]="conClass.stageCodeOptions"
                                      [value]="contact?.stageCode"
                                      (result)="contact.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Сделка'" [options]="reqClass.offerTypeCodeOptions"
                                      [value]="request?.offerTypeCode"
                                      (result)="request.offerTypeCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Стадия заявки'" [options]="reqClass.stageCodeOptions"
                                      [value]="request?.stageCode"
                                      (result)="request.stageCode = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Ответственный'" [options]="agentOpts"
                                      [value]="request?.agentId || null"
                                      (result)="agentChanged($event)"
                        ></sliding-menu>
                        <multiselect-menu
                            [name]="'Договор'" [block]="request?.contractBlock" [addName]="'Добавить данные'"
                            [params]="{ 'number': {label: 'Номер', placeholder: 'Номер договора'},
                                        'begin' : {label: 'Дата начала', placeholder: 'Дата'},
                                        'end': {label: 'Дата конца', placeholder: 'Дата'},
                                        'continued': {label: 'Продлен', placeholder: 'Продление'},
                                        'terminated': {label: 'Расторгнут', placeholder: 'Расторжение'}
                                    }"
                            (newData)="request.contractBlock = $event"
                        ></multiselect-menu>
                        <sliding-tag [value]="request?.tag" (newValue)="request.tag = $event"></sliding-tag>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'ОБЪЕКТ'">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block"> 
                            <span>Категория</span>
                            <span class="view-value">{{ offClass.categoryOptions[request?.categoryCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>{{request.categoryCode != 'land' ? 'Тип дома' : 'Назначение земель'}}</span>
                            <span
                                    class="view-value">{{ offClass.buildingTypeOptions[request?.buildingType]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="request.categoryCode != 'land'">
                            <span>{{request.categoryCode == 'rezidential' ? "Тип недвижимости" : "Класс здания"}}</span>
                            <span
                                    class="view-value">{{ offClass.buildingClassOptions[request?.buildingClass]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Тип объекта</span>
                            <span class="view-value">{{ offClass.typeCodeOptions[request?.typeCode]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="request.categoryCode != 'land'">
                            <span>Новостройка</span>
                            <switch-button [value]="request?.newBuilding" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block" *ngIf="request.newBuilding && request.categoryCode != 'land'">
                            <span>Стадия объекта</span>
                            <span class="view-value">{{ offClass.objectStageOptions[request?.objectStage]?.label}}</span>
                        </div>
                        <div class="show_block" *ngIf="request.categoryCode != 'land'">
                            <span>{{request?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'}}</span>
                            <span class="view-value">{{ request.buildYear || 'Неизвестно'}}</span>
                        </div>
                        <div class="show_block"
                             *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'">
                            <span>Удаленность</span>
                            <span class="view-value">{{ request?.distance || "Неизвестно"}}</span>
                        </div>
                        <div class="show_block"
                             *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'">
                            <span>Наименование поселения</span>
                            <span class="view-value">{{ request?.settlement || "Неизвестно"}}</span>
                        </div>
                        <div class="show_block"
                             *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'">
                            <span>Охрана</span>
                            <switch-button [value]="request?.guard" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Жилищный комплекс</span>
                            <span class="view-value">{{ request?.housingComplex || "Неизвестно"}}</span>
                        </div>                        
                        <div class="show_block" *ngIf="request.offerTypeCode != 'rent'">
                            <span>Обременение</span>
                            <switch-button [value]="request?.encumbrance" [disabled]="true"></switch-button>
                        </div>
                        <div class="show_block" *ngIf="request.offerTypeCode != 'rent'">
                            <span>Подходит под ипотеку</span>
                            <switch-button [value]="request?.mortgages" [disabled]="true"></switch-button>
                        </div>
                        <ng-container
                                *ngIf="request.typeCode == 'apartment' || request.typeCode == 'room' || request.typeCode == 'share'">
                            <div class="show_block">
                                <span>Материал стен</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[request?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Количество комнат</span>
                                <span class="view-value">{{ request.roomsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request.roomsCount != 1 && request.typeCode != 'room'">
                                <span>Тип комнат</span>
                                <span
                                        class="view-value">{{ offClass.roomSchemeOptions[request?.roomScheme]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.floor">
                                <span>Этаж</span>
                                <span class="view-value">{{ request.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.floorsCount">
                                <span>Этажность</span>
                                <span class="view-value">{{ request.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.levelsCount">
                                <span>Уровень</span>
                                <span class="view-value">{{ request.levelsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareTotal">
                                <span>Общая площадь</span>
                                <span class="view-value">{{ request.squareTotal }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareLiving">
                                <span>Жилая площадь</span>
                                <span class="view-value">{{ request.squareLiving }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareKitchen">
                                <span>Площадь кухни</span>
                                <span class="view-value">{{ request.squareKitchen }}</span>
                            </div>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="request?.loggia" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="request?.balcony" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Санузел</span>
                                <span class="view-value">{{ offClass.bathroomOptions[request?.bathroom]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[request?.condition]?.label}}</span>
                            </div>
                        </ng-container>
                        <ng-container
                                *ngIf="request.typeCode == 'house' || request.typeCode == 'cottage' || request.typeCode == 'dacha' || request.typeCode == 'townhouse' || request.typeCode == 'duplex'">
                            <div class="show_block" *ngIf="request?.floor">
                                <span>Этаж</span>
                                <span class="view-value">{{ request.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.floorsCount">
                                <span>Этажность</span>
                                <span class="view-value">{{ request.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.levelsCount">
                                <span>Уровень</span>
                                <span class="view-value">{{ request.levelsCount }}</span>
                            </div>
                            <div class="show_block">
                                <span>Количество комнат</span>
                                <span class="view-value">{{ request.roomsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request.roomsCount != 1 && request.typeCode != 'room'">
                                <span>Тип комнат</span>
                                <span
                                        class="view-value">{{offClass.roomSchemeOptions[request?.roomScheme]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareTotal">
                                <span>Общая площадь</span>
                                <span class="view-value">{{ request.squareTotal }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareLiving">
                                <span>Жилая площадь</span>
                                <span class="view-value">{{ request.squareLiving }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.squareKitchen">
                                <span>Площадь кухни</span>
                                <span class="view-value">{{ request.squareKitchen }}</span>
                            </div>
                            <div class="show_block">
                                <span>Площадь участка</span>
                                <span
                                        class="view-value">{{ request?.squareLand + " " + (request?.squareLandType == 0 ? "cот" : "га") }}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[request?.condition]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Материал стен</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[request?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="request?.loggia" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="request?.balcony" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Санузел</span>
                                <span class="view-value">{{ offClass.bathroomOptions[request?.bathroom]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="request.categoryCode == 'land'">
                            <div class="show_block">
                                <span>Площадь участка</span>
                                <span
                                        class="view-value">{{ request?.squareLand + " " + (request?.squareLandType == 0 ? "cот" : "га") }}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="request.categoryCode == 'commersial'">
                            <div class="show_block">
                                <span>Название</span>
                                <span class="view-value">{{ request?.objectName || "Неизвестно"}}</span>
                            </div>
                            <div class="show_block">
                                <span>Материал здания</span>
                                <span class="view-value">{{ offClass.houseTypeOptions[request?.houseType]?.label}}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.floor"> 
                                <span>Этаж</span>
                                <span class="view-value">{{ request.floor }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.floorsCount">
                                <span>Этажность</span>
                                <span class="view-value">{{ request.floorsCount }}</span>
                            </div>
                            <div class="show_block" *ngIf="request?.levelsCount">
                                <span>Уровень</span>
                                <span class="view-value">{{ request.levelsCount }}</span>
                            </div>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Площадь помещения</span>
                                <span class="view-value">{{request?.squareTotal }}</span>
                            </div>
                            <div class="show_block">
                                <span>Высота потолков</span>
                                <span class="view-value">{{request?.ceilingHeight }}</span>
                            </div>
                            <div class="show_block">
                                <span>Состояние</span>
                                <span class="view-value">{{ offClass.conditionOptions[request?.condition]?.label}}</span>
                            </div>
                            <div class="show_block">
                                <span>Охрана</span>
                                <switch-button [value]="request?.guard" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Лифт</span>
                                <switch-button [value]="request?.lift" [disabled]="true"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Парковка</span>
                                <switch-button [value]="request?.parking" [disabled]="true"></switch-button>
                            </div>
                        </ng-container>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name]="'Категория'" [options]="offClass.categoryOptions"
                                      [value]="request?.categoryCode"
                                      (result)="request.categoryCode = $event"
                        ></sliding-menu>
                        <sliding-menu
                                [name]="request?.categoryCode != 'land' ? (request.categoryCode == 'rezidential' ? 'Тип дома' : 'Тип недвижимости') : 'Назначение земель'"
                                [options]="offClass.buildindTypeByCategory[request.categoryCode]"
                                [value]="request?.buildingType"
                                (result)="request.buildingType = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="request.categoryCode == 'rezidential' ? 'Тип недвижимости' : 'Класс здания'"
                                      [options]="offClass.buildindClassByBuildingType[request.buildingType]"
                                      [value]="request?.buildingClass"
                                      (result)="request.buildingClass = $event"
                        ></sliding-menu>
                        <sliding-menu [name]="'Тип объекта'"
                                      [options]="request.buildingType != 'lowrise_house' ? offClass.typeCodeByBuildingType[request.buildingType] : offClass.typeCodeByBuildingClass[request.buildingClass]"
                                      [value]="request?.typeCode"
                                      (result)="request.typeCode = $event"
                        ></sliding-menu>
                        <input-line *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'"
                                    [name]="'Удаленность'" [value]="request?.distance"
                                    (newValue)="request.distance = $event"
                        ></input-line>
                        <input-line *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'"
                                    [name]="'Наименование поселения'" [value]="request?.settlement"
                                    (newValue)="request.settlement = $event"
                        ></input-line>
                        <div class="show_block"
                             *ngIf="request.categoryCode == 'land' || request.buildingType == 'lowrise_house'">
                            <span>Охрана</span>
                            <switch-button [value]="request?.guard" (newValue)="request.guard = $event"></switch-button>
                        </div>
                        <input-line [name]="'Жилищный комплекс'" [value]="request?.housingComplex"
                                    (newValue)="request.housingComplex = $event"
                        ></input-line>
                        <div class="show_block" *ngIf="request.categoryCode != 'land'">
                            <span>Новостройка</span>
                            <switch-button [value]="request?.newBuilding"
                                           (newValue)="request.newBuilding = $event"></switch-button>
                        </div>
                        <sliding-menu *ngIf="request.newBuilding"
                                      [name]="'Тип объекта'" [options]="offClass.objectStageOptions"
                                      [value]="request?.objectStage"
                                      (result)="request.objectStage = $event"
                        ></sliding-menu>
                        <input-line *ngIf="request.categoryCode != 'land'"
                                    [name]="request?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'"
                                    [value]="request?.buildYear"
                                    (newValue)="request.buildYear = $event"
                        ></input-line>
                        <ng-container *ngIf="request.offerTypeCode != 'rent'">
                            <div class="show_block">
                                <span>Обременение</span>
                                <switch-button [value]="request?.encumbrance"
                                               (newValue)="request.encumbrance = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Подходит под ипотеку</span>
                                <switch-button [value]="request?.mortgages"
                                               (newValue)="request.mortgages = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container
                                *ngIf="request.typeCode == 'apartment' || request.typeCode == 'room' || request.typeCode == 'share'">
                            <sliding-menu *ngIf="request.newBuilding"
                                          [name]="'Материал стен'" [options]="offClass.houseTypeOptions"
                                          [value]="request?.houseType"
                                          (result)="request.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Количество комнат'" [value]="request?.roomsCount"
                                        (newValue)="request.roomsCount = $event"></input-line>
                            <sliding-menu *ngIf="request.roomsCount != 1 && request.typeCode != 'room'"
                                          [name]="'Тип комнат'" [options]="offClass.roomSchemeOptions"
                                          [value]="request?.roomScheme"
                                          (result)="request.roomScheme = $event"
                            ></sliding-menu>
                            <input-line [name]="'Этаж'" [value]="request?.floor"
                                        (newValue)="request.floor = $event"></input-line>
                            <input-line [name]="'Этажность'" [value]="request?.floorsCount"
                                        (newValue)="request.floorsCount = $event"></input-line>
                            <input-line [name]="'Уровней'" [value]="request?.levelsCount"
                                        (newValue)="request.levelsCount = $event"></input-line>
                            <input-line [name]="'Общая площадь'" [value]="request?.squareTotal"
                                        (newValue)="request.squareTotal = $event"></input-line>
                            <input-line [name]="'Жилая площадь'" [value]="request?.squareLiving"
                                        (newValue)="request.squareLiving = $event"></input-line>
                            <input-line [name]="'Площадь кухни'" [value]="request?.squareKitchen"
                                        (newValue)="request.squareKitchen = $event"></input-line>
                            <ng-container *ngIf="request.buildingType == 'lowrise_house'">
                                <input-line [name]="'Площадь участка'" [value]="request?.squareLand"
                                            (newValue)="request.squareLand = $event"></input-line>
                                <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                              [value]="request?.squareLandType"
                                              (result)="request.squareLandType = $event"
                                ></sliding-menu>
                            </ng-container>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="request?.loggia"
                                               (newValue)="request.loggia = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="request?.balcony"
                                               (newValue)="request.balcony = $event"></switch-button>
                            </div>
                            <sliding-menu [name]="'Санузел'" [options]="offClass.bathroomOptions"
                                          [value]="request?.bathroom"
                                          (result)="request.bathroom = $event"
                            ></sliding-menu>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="request?.condition"
                                          (result)="request.condition = $event"
                            ></sliding-menu>
                        </ng-container>
                        <ng-container
                                *ngIf="request.typeCode == 'house' || request.typeCode == 'cottage' || request.typeCode == 'dacha' || request.typeCode == 'townhouse' || request.typeCode == 'duplex'">
                            <input-line [name]="'Этаж'" [value]="request?.floor"
                                        (newValue)="request.floor = $event"></input-line>
                            <input-line [name]="'Этажность'" [value]="request?.floorsCount"
                                        (newValue)="request.floorsCount = $event"></input-line>
                            <input-line [name]="'Уровней'" [value]="request?.levelsCount"
                                        (newValue)="request.levelsCount = $event"></input-line>
                            <input-line [name]="'Количество комнат'" [value]="request?.roomsCount"
                                        (newValue)="request.roomsCount = $event"></input-line>
                            <sliding-menu *ngIf="request.roomsCount != 1 && request.typeCode != 'room'"
                                          [name]="'Тип комнат'" [options]="offClass.roomSchemeOptions"
                                          [value]="request?.roomScheme"
                                          (result)="request.roomScheme = $event"
                            ></sliding-menu>
                            <sliding-menu *ngIf="request.newBuilding"
                                          [name]="'Материал стен'" [options]="offClass.houseTypeOptions"
                                          [value]="request?.houseType"
                                          (result)="request.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Общая площадь'" [value]="request?.squareTotal"
                                        (newValue)="request.squareTotal = $event"></input-line>
                            <input-line [name]="'Жилая площадь'" [value]="request?.squareLiving"
                                        (newValue)="request.squareLiving = $event"></input-line>
                            <input-line [name]="'Площадь кухни'" [value]="request?.squareKitchen"
                                        (newValue)="request.squareKitchen = $event"></input-line>
                            <input-line [name]="'Площадь участка'" [value]="request?.squareLand"
                                        (newValue)="request.squareLand = $event"></input-line>
                            <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                          [value]="request?.squareLandType"
                                          (result)="request.squareLandType = $event"
                            ></sliding-menu>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="request?.condition"
                                          (result)="request.condition = $event"
                            ></sliding-menu>
                            <sliding-menu [name]="'Материал'" [options]="offClass.houseTypeOptions"
                                          [value]="request?.houseType"
                                          (result)="request.houseType = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Лоджия</span>
                                <switch-button [value]="request?.loggia"
                                               (newValue)="request.loggia = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Балкон</span>
                                <switch-button [value]="request?.balcony"
                                               (newValue)="request.balcony = $event"></switch-button>
                            </div>
                            <sliding-menu [name]="'Санузел'" [options]="offClass.bathroomOptions"
                                          [value]="request?.bathroom"
                                          (result)="request.bathroom = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply"
                                               (newValue)="request.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification"
                                               (newValue)="request.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification"
                                               (newValue)="request.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage"
                                               (newValue)="request.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating"
                                               (newValue)="request.centralHeating = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="request.categoryCode == 'land'">
                            <input-line [name]="'Площадь участка'" [value]="request?.squareLand"
                                        (newValue)="request.squareLand = $event"></input-line>
                            <sliding-menu [name]="'Тип площади'" [options]="offClass.squareLandTypeOptions"
                                          [value]="request?.squareLandType"
                                          (result)="request.squareLandType = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply"
                                               (newValue)="request.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification"
                                               (newValue)="request.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification"
                                               (newValue)="request.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage"
                                               (newValue)="request.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating"
                                               (newValue)="request.centralHeating = $event"></switch-button>
                            </div>
                        </ng-container>
                        <ng-container *ngIf="request.categoryCode == 'commersial'">
                            <input-line [name]="'Название'" [value]="request?.objectName"
                                        (newValue)="request.objectName = $event"></input-line>
                            <sliding-menu [name]="'Материал здания'" [options]="offClass.houseTypeOptions"
                                          [value]="request?.houseType"
                                          (result)="request.houseType = $event"
                            ></sliding-menu>
                            <input-line [name]="'Этаж'" [value]="request?.floor"
                                        (newValue)="request.floor = $event"></input-line>
                            <input-line [name]="'Этажность'" [value]="request?.floorsCount"
                                        (newValue)="request.floorsCount = $event"></input-line>
                            <input-line [name]="'Уровней'" [value]="request?.levelsCount"
                                        (newValue)="request.levelsCount = $event"></input-line>
                            <div class="show_block">
                                <span>Водоснабжение</span>
                                <switch-button [value]="request?.waterSupply"
                                               (newValue)="request.waterSupply = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Газификация</span>
                                <switch-button [value]="request?.gasification"
                                               (newValue)="request.gasification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Электроснабжение</span>
                                <switch-button [value]="request?.electrification"
                                               (newValue)="request.electrification = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Канализация</span>
                                <switch-button [value]="request?.sewerage"
                                               (newValue)="request.sewerage = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Отопление</span>
                                <switch-button [value]="request?.centralHeating"
                                               (newValue)="request.centralHeating = $event"></switch-button>
                            </div>
                            <input-line [name]="'Площадь помещения'" [value]="request?.squareTotal"
                                        (newValue)="request.squareTotal = $event"></input-line>
                            <input-line [name]="'Высота потолков'" [value]="request?.ceilingHeight"
                                        (newValue)="request.ceilingHeight = $event"></input-line>
                            <sliding-menu [name]="'Состояние'" [options]="offClass.conditionOptions"
                                          [value]="request?.condition"
                                          (result)="request.condition = $event"
                            ></sliding-menu>
                            <div class="show_block">
                                <span>Охрана</span>
                                <switch-button [value]="request?.guard" (newValue)="request.guard = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Лифт</span>
                                <switch-button [value]="request?.lift" (newValue)="request.lift = $event"></switch-button>
                            </div>
                            <div class="show_block">
                                <span>Парковка</span>
                                <switch-button [value]="request?.parking"
                                               (newValue)="request.parking = $event"></switch-button>
                            </div>
                        </ng-container>
                    </ng-container>
                    <!--                TODO: переместить label внутрь компонента-->
                    <div class="show_block rating">
                        <span class="view-label">Месторасположение</span>
                        <star-mark [value]="this.request.locRating?.map['remoteness']"
                                   (estimate)="this.request.locRating.map['remoteness']=$event"
                                   [editable]="editEnabled"
                        ></star-mark>
                        <span class="view-label">Транспортная доступность</span>
                        <star-mark [value]="this.request.locRating?.map['transport']"
                                   (estimate)="this.request.locRating.map['transport']=$event"
                                   [editable]="editEnabled"
                        ></star-mark>
                        <span class="view-label">Престижность района</span>
                        <star-mark [value]="this.request.locRating?.map['prestigious']"
                                   (estimate)="this.request.locRating.map['prestigious']=$event"
                                   [editable]="editEnabled"
                        ></star-mark>
                        <span class="view-label">Экология</span>
                        <star-mark [value]="this.request.locRating?.map['ecology']"
                                   (estimate)="this.request.locRating.map['ecology']=$event"
                                   [editable]="editEnabled"
                        ></star-mark>
                        <span class="view-label">Инфраструктура</span>
                        <star-mark [value]="this.request.locRating?.map['infrastructure']"
                                   (estimate)="this.request.locRating.map['infrastructure']=$event"
                                   [editable]="editEnabled"
                        ></star-mark>
                    </div>
                    <input-area [name]="'Дополнительно'" [value]="request?.description" [disabled]="!editEnabled"
                                (newValue)="request.description = $event" [update]="update"></input-area>
                </ui-tab>
                <ui-tab [title]="'УСЛОВИЯ'" *ngIf="request.offerTypeCode == 'rent'" (tabSelect)="update = {}">
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
                        <input-area [name]="'Дополнительно'" [value]="request?.description" [disabled]="true"
                                    [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <conditions-switches [block]="request.conditions" [disabled]="false"></conditions-switches>
                        <input-line [name]="'Дата заезда'" [value]="request?.arrival_date"
                                    (newValue)="request.arrival_date = $event"></input-line>
                        <input-line [name]="'Период проживания'" [value]="request?.period"
                                    (newValue)="request.period = $event"></input-line>
                        <input-line [name]="'Рейтинг'" [value]="request?.rate"
                                    (newValue)="request.rate = $event"></input-line>
                        <input-area [name]="'Дополнительно'" [value]="request?.description"
                                    (newValue)="request.description = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode != 'rent'" (tabSelect)="update = {}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span
                                class="view-value">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}}
                                руб.</span>
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
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" [disabled]="true"
                                    [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <div class="show_block">
                            <span>Наличные</span>
                            <switch-button [value]="request?.cash" (newValue)="request.cash = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Ипотека</span>
                            <switch-button [value]="request?.mortgage"
                                           (newValue)="request.mortgage = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Сертификат</span>
                            <switch-button [value]="request?.certificate"
                                           (newValue)="request.certificate = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Материнский капитал</span>
                            <switch-button [value]="request?.maternalCapital"
                                           (newValue)="request.maternalCapital = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission"
                                           (newValue)="request.commission = $event"></switch-button>
                        </div>
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo"
                                    (newValue)="request.costInfo = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode == 'rent'" (tabSelect)="update={}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span
                                class="view-value">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}}
                                руб.</span>
                        </div>
                        <div class="show_block">
                            <span>Форма оплаты</span>
                            <span
                                class="view-value">{{reqClass.paymentMethodOptions[request?.paymentMethod]?.label}}</span>
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
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" [disabled]="true"
                                    [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name]="'Форма оплаты'" [options]="reqClass.paymentMethodOptions"
                                      [value]="request?.paymentMethod"
                                      (result)="request.paymentMethod = $event"
                        ></sliding-menu>
                        <div class="show_block">
                            <span>Комунальные платежи</span>
                            <switch-button [value]="request?.utilityBills"
                                           (newValue)="request.utilityBills = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Счетчики</span>
                            <switch-button [value]="request?.counters"
                                           (newValue)="request.counters = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Депозит</span>
                            <switch-button [value]="request?.deposit"
                                           (newValue)="request.deposit = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission"
                                           (newValue)="request.commission = $event"></switch-button>
                        </div>
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo"
                                    (newValue)="request.costInfo = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <div more class="more" (click)="showContextMenu($event);" (offClick)="this._hubService.shared_var['cm_hidden'] = true">ЕЩЁ...
<!--                    <div>-->
<!--                        <div>Проверить</div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div (click)="workAreaMode = 'photo'" [class.selected]="workAreaMode == 'photo'">Показать фото</div>-->
<!--                        <div (click)="workAreaMode = 'map'" [class.selected]="workAreaMode == 'map'">Перейти на карту</div>-->
<!--                        <div (click)="workAreaMode = 'doc'" [class.selected]="workAreaMode == 'doc'">Показать документы</div>-->
<!--                        <div (click)="workAreaMode = 'advert'" [class.selected]="workAreaMode == 'advert'">Экспорт заявки в...</div>-->
<!--                        <div (click)="workAreaMode = 'mortgage'" [class.selected]="workAreaMode == 'mortgage'">Заявка на-->
<!--                            ипотеку-->
<!--                        </div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        -->
<!--                        <div (click)="openNotebook('notes', $event)" [class.selected]="workAreaMode == 'notes'">-->
<!--                            Заметки-->
<!--                        </div>-->
<!--                        <div (click)="openNotebook('daily', $event)" [class.selected]="workAreaMode == 'daily'">-->
<!--                            Ежедневник-->
<!--                        </div>-->
<!--                        <div (click)="openNotebook('chat', $event)" [class.selected]="workAreaMode == 'chat'">Чат</div>-->
<!--                        <div (click)="openNotebook('phone', $event)" [class.selected]="workAreaMode == 'phone'">-->
<!--                            IP-телефония-->
<!--                        </div>-->
<!--                        -->
<!--                        <div (click)="workAreaMode = 'summary'" [class.selected]="workAreaMode == 'summary'">Сводка-->
<!--                        </div>-->
<!--                        <div (click)="workAreaMode = 'report'" [class.selected]="workAreaMode == 'report'">Отчет</div>-->
<!--                        <div (click)="workAreaMode = 'history'" [class.selected]="workAreaMode == 'history'">История-->
<!--                        </div>-->
<!--                        <hr style="margin: 4px 13px;"/>-->
<!--                        <div class="delete" (click)="delete()">Удалить заявку</div>-->
<!--                    </div>-->
                </div>
            </ui-tabs-menu>
            <div class="digest-list" (contextmenu)="showContextMenu($event)" *ngIf="mode == 1">
                <!--TODO: Нужно потом переделать в нормальном виде-->
                <ui-tabs-menu>
                    <ui-tab [title]="'ОБЩАЯ БАЗА'" (tabSelect)="source = 0 ; getOffers();">
                        <digest-offer *ngFor="let offer of offers; let i = index" [offer]="offer"
                                      [class.selected]="selectedOffers.indexOf(offer) > -1"
                                      (click)="select($event, offer, i)"
                                      (contextmenu)="select($event, offer, i)"
                                      (dblclick)="openOffer(offer)"
                                      [active]="selectedOffers.indexOf(offer) > -1"
                        ></digest-offer>
                    </ui-tab>
                    <ui-tab [title]="'БАЗА КОМПАНИИ'" (tabSelect)="source = 1; getOffers();">
                        <digest-offer *ngFor="let offer of offers; let i = index" [offer]="offer"
                                      [class.selected]="selectedOffers.indexOf(offer) > -1"
                                      (click)="select($event, offer, i)"
                                      (contextmenu)="select($event, offer, i)"
                                      (dblclick)="openOffer(offer)"
                                      [active]="selectedOffers.indexOf(offer) > -1"
                        ></digest-offer>
                    </ui-tab>
                </ui-tabs-menu>
            </div>
        </div>
        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <div class="map-buttons" *ngSwitchCase="'map'" >
                    <div class="map-button" (click)="editEnabled ? toggleDraw() : ''" [class.activate]="mapDrawAllowed">ОБВЕДИТЕ ЛОКАЦИЮ</div>
                    <div class="map-button">ИНФРАСТРУКТУРА</div>
                    <div class="map-button">СВОДКА</div>
                </div>
                <adv-view *ngSwitchCase="'advert'" [request]="request"  [mode]="'request'"></adv-view>
                <yamap-view *ngSwitchCase="'map'" [drawMap]="mapDrawAllowed"
                            (drawFinished)="request.searchArea = $event.coords"
                            [searchArea]="request.searchArea" [offers]="offers"
                >
                </yamap-view>
                <files-view *ngSwitchCase="'photo'" [files]="request.documents" [full]="paneHidden" [type]="'photo'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'photo')" (delete)="request.documents = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
                <files-view *ngSwitchCase="'doc'" [files]="request.documents" [full]="paneHidden" [type]="'doc'"
                            [editMode]="editEnabled"
                            (add)="addFile($event, 'doc')" (delete)="request.documents = $event"
                            (progressLoad)="displayProgress($event)"></files-view>
            </ng-container>
        </div>
    `
})

export class TabRequestComponent implements OnInit {
    public tab: Tab;
    public request: Request = new Request();
    public offer: Offer = new Offer();
    offClass = Offer;
    mode: number = 0;
    progressWidth: number = 0;
    workAreaMode: string = "map";
    canEditable: boolean = true;
    page: number = 0;
    source: OfferSource = OfferSource.LOCAL;
    offers: Offer[] = [];
    selectedOffers: Offer[] = [];
    requests: Request[] = [];
    selectedRequests: Request[] = [];
    contact: Contact = new Contact();
    update: any;

    hitsCount: number = 0;

    conClass = Contact;
    reqClass = Request;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;
    valRange = ValueRange;

    agentOpts: any = {
        null: {label: "Не назначено"}
    };

    filter: any = {
        agentId: "all",
        stateCode: "all",
        tag: "all",
        offerTypeCode: "sale"
    };

    editEnabled: boolean = false;
    mapDrawAllowed: boolean = false;
    paneHidden: boolean = false;

    lastClckIdx: number = 0;

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
        this.utilsObj = new Utils(_sessionService, _personService, _organisationService);
        this.agentOpts[this._sessionService.getUser().id] = {label: this._sessionService.getUser().name};
        for (let user of _userService.cacheUsers) {
            this.agentOpts[user.value] = {label: user.label};
        }

        setTimeout(() => {
            this.selectedRequests = [this.request];
            if (this.request.id) {
                this.tab.header = "Заявка";

            } else {
                this.tab.header = "Новая заявка";
            }
        });
    }

    ngOnInit() {

        this.request = this.tab.args.request;
        this.canEditable = this.tab.args.canEditable;
        if (this.request.id == null) {
            this.editEnabled = true;
        }

        if (this.request.person) {
            this.contact = this.request.person;
            this.contact.type = "person";
        } else if (this.request.company) {
            this.contact = this.request.company;
            this.contact.type = "organisation";
        }
    }
    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        //let users: User[] = this._userService.listCached("", 0, "");
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
                {class: "entry", disabled: false, label: s.label, callback: () => {
                        c.selectedRequests.forEach(o => {
                            o.stageCode = s.value;
                            c._requestService.save(o);
                        });
                    }
                }
            );
        });
        let tag;
        if (this.request.tag != undefined) {
            tag = this.request.tag;
        } else  {
            tag = null;
        }
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedRequests.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {

                    }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                        let tab_sys = this._hubService.getProperty('tab_sys');
                        this.selectedRequests.forEach(o => {
                            let canEditable =  this._sessionService.getAccount().id == o.accountId;
                            tab_sys.addTab('offer', {offer: o, canEditable});
                        });
                    }},
                {class: "delimiter"},
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать фото",
                    callback: () => {
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry", icon: "", label: "Перейти на карту",
                    callback: () => {
                        this.workAreaMode = 'map';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать документы",
                    callback: () => {
                        this.workAreaMode = 'doc';
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Экспорт заявки в...", callback: () => {
                        this.workAreaMode = 'advert';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Заявка на ипотеку",
                    callback: () => {
                        this.workAreaMode = 'mortgage';
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
                {class: "submenu", disabled: !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickContextMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('notes', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('diary', event);
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
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Сводка",
                    callback: () => {
                        this.workAreaMode = 'svodka';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Отчет",
                    callback: () => {
                        this.workAreaMode = 'report';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "История",
                    callback: () => {
                        this.workAreaMode = 'history';
                    }
                },
                {class: "submenu", disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedRequests.length == 1 ? this.selectedRequests[0] : null, tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]},
                {class: "delimiter"},
                {class: "entry", sub_class: 'del', disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: 'Удалить',
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
        this.selectedRequests.forEach(o => {
            if(evt.event == "add_to_person"){
                if(!o.person){
                    /* let pers: Person = new Person();
                     pers.phoneBlock = PhoneBlock.toFormat(o.phoneBlock);
                     this.subscription_person = this._personService.save(pers).subscribe(
                         data => {
                             o.person = data;
                             o.personId = data.id;
                             /*this.offers.forEach(t => {
                                 if(t.phones_import)
                             });
                             let tabSys = this._hubService.getProperty('tab_sys');
                             tabSys.addTab('person', {person: o.person, canEditable: true});
                         }
                     );*/
                }
            }
            else if(evt.event == "add_to_company"){
            } else if(evt.event == "set_agent"){
                o.agentId = evt.agentId;
                let temp_ag = o.agent;
                o.agent = null;
                this._requestService.save(o).subscribe(request => {
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
                o.agent = temp_ag;

            } else if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._requestService.save(o).subscribe(request =>{
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
            } else if(evt.event == "del_obj"){
                this._requestService.delete(o).subscribe(
                    data => {
                        this.selectedRequests.splice(this.selectedRequests.indexOf(o), 1);
                        this.requests.splice(this.requests.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){
                //this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._requestService.save(o).subscribe(request =>{
                    this.requests[this.requests.indexOf(o)] = request;
                    this.selectedRequests[this.selectedRequests.indexOf(o)] = request;
                });
            }
        });
    }
    updateSelected() {
        setTimeout(() => {
            this.selectedOffers = [this.offer];
        }, 200);
    }
    agentChanged(event) {
        this.request.agentId = event == "null" ? null : event;
        if (this.request.agentId != null) {
            this._userService.get(this.request.agentId).subscribe(agent => {
                this.request.agent = agent;
            });
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

    toggleDraw() {
        this.mapDrawAllowed = !this.mapDrawAllowed;
        if (!this.mapDrawAllowed) {
            this.page = 0;
            this.offers = [];
            this.request.searchArea = [];
        }
    }

    save() {
        if (!this.chechForm())
            return;

        if (this.contact.type == "person") {
            this._personService.save(this.contact as Person).subscribe(person => {
                if (person) {
                    this.request.personId = person.id;
                    this.request.person = person;
                    delete this.request.company;
                    delete this.request.companyId;
                    this.contact = person;
                    this.contact.type = "person";
                    this._requestService.save(this.request).subscribe(request => {
                        this.request = request;
                        this.tab.setEvent({type: 'update', value: this.request});

                        this.toggleEdit();
                    });
                }
            });
        } else {
            this._organisationService.save(this.contact as Organisation).subscribe(org => {
                if (org) {
                    this.request.companyId = org.id;
                    this.request.company = org;
                    delete this.request.person;
                    delete this.request.personId;
                    this.contact = org;
                    this.contact.type = "organisation";
                    this._requestService.save(this.request).subscribe(request => {
                        setTimeout(() => {
                            this.request = request;
                            this.tab.setEvent({type: 'update', value: this.request});
                        });
                        this.toggleEdit();
                    });
                }
            });
        }
    }

    chechForm() {
        if (PhoneBlock.getNotNullData(this.contact.phoneBlock) == "") {
            alert("Не указан контактный телефон");
            return false;
        }
        if (!PhoneBlock.check(PhoneBlock.removeSymb(this.contact.phoneBlock))) {
            alert("Один из телефонов указан неверно");
            return false;
        }
        if (!this.contact.name || this.contact.name.length < 5) {
            alert("Не указано имя контакта или имя слишком короткое");
            return false;
        }
        return true;
    }

    getOffers() {
        this.offers = [];
        this.selectedOffers = [];
        this._offerService.list(0, 100, this.source, this.filter, null, "", this.request.searchArea).subscribe(
            offers => {
                this.offers = offers.list;
            },
            err => console.log(err)
        );
    }

    displayProgress(event) {
        this.progressWidth = event;
        if (event == 100) setTimeout(() => {
            this.progressWidth = 0;
        }, 3000);
    }

    addFile(event, array) {
        if (array == "doc")
            this.request.documents.length > 0 ? this.request.documents.push(event) : this.request.documents = event;
    }

    showContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        //let users: User[] = this._userService.listCached("", 0, "");
        let uOpt = [{
            class: "entry", label: "На себя", disabled: false, callback: () => {
                this.clickMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
            }
        }];
        for (let op of this._userService.cacheUsers) {
            op.callback = () => {
                this.clickMenu({event: "set_agent", agentId: op.value});
            };
            uOpt.push(op);
        }

        let stateOpt = [];
        let states = [
            {value: "raw", label: "Не активен"},
            {value: "active", label: "Активен"},
            {value: "work", label: "В работе"},
            {value: "suspended", label: "Приостановлен"},
            {value: "archive", label: "Архив"}
        ];

        states.forEach(s => {
            stateOpt.push(
                {
                    class: "entry", disabled: false, label: s.label, callback: () => {
                        c.selectedOffers.forEach(o => {
                            o.stageCode = s.value;
                            c._offerService.save(o);
                        });
                    }
                }
            );
        });
        let tag;
        if (this.request.tag != undefined) {
            tag = this.request.tag;
        } else  {
            tag = null;
        }
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedRequests.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {

                    }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                        let tab_sys = this._hubService.getProperty('tab_sys');
                        this.selectedRequests.forEach(o => {
                            let canEditable =  this._sessionService.getAccount().id == o.accountId;
                            tab_sys.addTab('offer', {offer: o, canEditable});
                        });
                    }},
                {class: "delimiter"},
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать фото",
                    callback: () => {
                        this.workAreaMode = 'photo';
                    }
                },
                {class: "entry", icon: "", label: "Перейти на карту",
                    callback: () => {
                        this.workAreaMode = 'map';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Показать документы",
                    callback: () => {
                        this.workAreaMode = 'doc';
                    }
                },
                {class: "entry", disabled: false, icon: "", label: "Экспорт заявки в...", callback: () => {
                        this.workAreaMode = 'advert';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Заявка на ипотеку",
                    callback: () => {
                        this.workAreaMode = 'mortgage';
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
                {class: "submenu", disabled: !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickContextMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
                {class: "entry", disabled: false, icon: "", label: "Добавить заметку", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('notes', event);
                        block.setShow(true, event);
                    }},
                {class: "entry", disabled: false, icon: "", label: "Добавить задачу", callback: (event) => {
                        let block = this._hubService.getProperty('notebook');
                        block.setMode('diary', event);
                        block.setShow(true, event);
                    }},
                {class: "submenu", disabled: false, icon: "", label: "Написать в чат", callback: (event) => {
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
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Сводка",
                    callback: () => {
                        this.workAreaMode = 'svodka';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "Отчет",
                    callback: () => {
                        this.workAreaMode = 'report';
                    }
                },
                {class: "entry", disabled: this.selectedRequests.length != 1, icon: "", label: "История",
                    callback: () => {
                        this.workAreaMode = 'history';
                    }
                },
                {class: "submenu", disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedRequests.length == 1 ? this.selectedRequests[0] : null, tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]},
                {class: "delimiter"},
                {class: "entry", sub_class: 'del', disabled:  !this.utilsObj.canImpact(this.selectedRequests), icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                }
            ]
        };

        this._hubService.shared_var["cm"] = menu;
        this._hubService.shared_var["cm_hidden"] = false;
    }

    clickMenu(evt: any) {
        this.selectedOffers.forEach(offer => {
            if (evt.event == "add_to_person") {
                if (!offer.person) {
                    let pers: Person = new Person();
                    pers.phoneBlock = PhoneBlock.toFormat(offer.phoneBlock);
                    this._personService.save(pers).subscribe(
                        data => {
                            offer.person = data;
                            offer.personId = data.id;
                            let tabSys = this._hubService.getProperty("tab_sys");
                            tabSys.addTab("person", {person: offer.person, canEditable: true});
                        }
                    );
                }
            } else if (evt.event == "add_to_company") {
                if (!offer.person && !offer.company && offer.phoneBlock.main) {
                    let org: Organisation = new Organisation();
                    org.phoneBlock = PhoneBlock.toFormat(offer.phoneBlock);

                    this._organisationService.save(org).subscribe(
                        data => {
                            offer.company = data;
                            offer.companyId = data.id;
                            let tabSys = this._hubService.getProperty("tab_sys");
                            tabSys.addTab("organisation", {organisation: offer.company, canEditable: true});
                        }
                    );
                }
            } else if (evt.event == "set_agent") {
                offer.agentId = evt.agentId;
                offer.agent = null;
                this._offerService.save(offer);
            } else if (evt.event == "del_agent") {
                offer.agentId = null;
                offer.agent = null;
                this._offerService.save(offer);
            } else if (evt.event == "del_obj") {
                /*this.subscription_offer = this._requestService.delete(o).subscribe(
                    data => {
                        this.selectedRequests.splice(this.selectedRequests.indexOf(o), 1);
                        this.requests.splice(this.requests.indexOf(o), 1);
                    }
                );*/
            } else if (evt.event == "check") {
                //this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if (evt.event == "set_tag") {
                offer.tag = evt.tag;
                this._offerService.save(offer);
            } else {
                this._offerService.save(offer);
            }
        });
    }

    select(event: MouseEvent, offer: Offer, i: number) {

        if (event.button == 2) {    // right click
            if (this.selectedOffers.indexOf(offer) == -1) { // if not over selected items
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedOffers.push(offer);
                this.selectedOffers = [].concat(this.selectedOffers);
            } else if (event.shiftKey) {
                this.selectedOffers = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.offers[idx++];
                    this.selectedOffers.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedOffers = [offer];
            }
        }
    }

    searchParamChanged() {
        this.getOffers();
    }

    openOffer(offer: Offer) {
        let tab_sys = this._hubService.getProperty("tab_sys");
        let canEditable = this.source == OfferSource.IMPORT ? false : (this._sessionService.getUser().accountId == offer.accountId);
        tab_sys.addTab("offer", {offer, canEditable});
    }

    public findContact(event) {
        this.utilsObj.findContact(event, this.contact).subscribe(data => this.contact = data);
    }

    public delete() {
        this._requestService.delete(this.request).subscribe((stat) =>{
            this._hubService.getProperty("modal-window").showMessage("Заявка удалена успешно");
            this.tab.setEvent({type: 'delete', value: this.request.id});
            this._hubService.getProperty('tab_sys').closeTab(this.tab);
        });
    }
}
