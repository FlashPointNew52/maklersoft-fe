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
import {Organisation} from "../../entity/organisation";
import {Utils} from "../../class/utils";
import {ObjectBlock} from "../../class/objectBlock";

@Component({
    selector: 'tab-request',
    inputs: ['tab'],
    styles: [`
        .property_face > span:last-child{
           /* display: block;*/
           /* height: 12px;  */
           /* line-height: 12px;*/
           /* margin-bottom: 6px;*/
            font-size: 12px;
            color: var(--color-inactive);
            font-style: normal;
            text-transform: uppercase;
        }
        .property-face .type_title {
            font-size: 12px; 
            color: var(--color-inactive);
            font-style: normal;
            text-transform: uppercase;
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
            width: 100%;
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
            width: 5px;
            height: 100%;
            top: 0;
            left: 0;
        }

        .selected {
            background-color: var(--selected-digest) !important;
        }
         
    `],
    template: `        
        <div class="search-form" *ngIf="workAreaMode != 'photo' && workAreaMode != 'advert'">
            <input type="text" class="input_line" placeholder="Введите текст запроса" [style.width]="'calc(100% - 108px)'"
                [(ngModel)]="request.request" (keyup)="$event" [disabled]="!editEnabled"
            ><span class="find_icon"></span>
            <div (click)="editEnabled ? toggleDraw() : ''" class="deactivate_draw" [class.activate_draw]="mapDrawAllowed"
                 [class.inactive_bottom]="!editEnabled"
            >ОБВЕСТИ</div>
            <div class="tool-box" *ngIf="mode == 1">
                <filter-select *ngIf="request.offerTypeCode == 'sale'"
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
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+ offers?.length }}</div>
            </div>
        </div>

        <div class = "property_face">
            <ui-tag [value]="request?.tag"></ui-tag>
            <span class="main_title">{{request.id ? 'ЗАЯВКА' : 'НОВАЯ ЗАЯВКА'}}</span>
            <span class="type_title">{{reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
        </div>

        <hr class='underline'>

        <div class="pane" [style.left.px]="paneHidden ? -339 : null">
            <div class = "source_menu">
                <div class="button" [class.active]="mode == 0" (click)="mode = 0">ЗАЯВКА</div>
                <div class="button" [class.active]="mode == 1" (click)="mode = 1; filter.offerTypeCode = request.offerTypeCode;workAreaMode = 'map'" style="border-right: solid rgba(59, 89, 152, 1) 1px">ПРЕДЛОЖЕНИЯ</div>
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
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.cellphone">
                            <span>Личный телефон</span>
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.office">
                            <span>Рабочий телефон</span>
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.fax">
                            <span>Рабочий телефон</span>
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.home">
                            <span>Домашний телефон</span>
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        </div>
                        <div class="show_block" *ngIf="contact?.phoneBlock?.other">
                            <span>Другой телефон</span>
                            <span class="view-value link">{{ "+7" + contact?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
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
                            <ui-view-social [block]="contact?.socialBlock"></ui-view-social>
                        </div>
                        <div class="show_block">
                            <span>Источник</span>
                            <span class="view-value">{{ canEditable ? conClass.sourceCodeOptions[contact?.sourceCode]?.label : "Общая база"}}</span>
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
                            <span class="view-value">{{ reqClass.offerTypeCodeOptions[request.offerTypeCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Стадия заявки</span>
                            <span class="view-value">{{ reqClass.stageCodeOptions[request?.stageCode]?.label}}</span>
                        </div>
                        <div class="show_block">
                            <span>Ответственный</span>
                            <span class="view-value link">{{ request.agent?.name}}</span>
                        </div>
                        <ng-container *ngIf="block.getAsArray(request.contractBlock)?.length == 0">
                            <div class="show_block" >
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
                                <span class="view-value">{{ request.contractBlock?.begin}}-{{request.contractBlock?.end}}</span>
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
                        <sliding-menu [name] = "'Предложение'" [options]="conClass.typeOptions"
                                      [value]="contact?.type"
                                      (result) = "contact.type = $event"
                        ></sliding-menu>
                        <input-line [name]="contact.type == 'person' ? 'ФИО' : 'Название организации'" [value]="contact?.name"
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
                        <sliding-menu [name] = "'Ответственный'" [options]="agentOpts"
                                      [value]="request?.agentId"
                                      (result) = "agentChanged($event)"
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
                <ui-tab [title]="'УСЛОВИЯ'" *ngIf="request.offerTypeCode != 'rent'" (tabSelect)="update = {}">
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
                        <input-area [name]="'Дополнительно'" [value]="request?.description" [disabled]="true" [update]="update"></input-area>
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
                        <input-line [name]="'Год постройки'" [value]="request?.buildYear" (newValue)="request.buildYear = $event"></input-line>
                        <input-line [name]="'Рейтинг'" [value]="request?.rate" (newValue)="request.rate = $event"></input-line>
                        <input-area [name]="'Дополнительно'" [value]="request?.description" (newValue)="request.description = $event" [update]="update"></input-area>
                    </ng-container>
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
                        <input-area [name]="'Дополнительно'" [value]="request?.description" [disabled]="true" [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <conditions-switches [block]="request.conditions" [disabled]="false"></conditions-switches>
                        <input-line [name]="'Дата заезда'" [value]="request?.arrival_date" (newValue)="request.arrival_date = $event"></input-line>
                        <input-line [name]="'Период проживания'" [value]="request?.period" (newValue)="request.period = $event"></input-line>
                        <input-line [name]="'Рейтинг'" [value]="request?.rate" (newValue)="request.rate = $event"></input-line>
                        <input-area [name]="'Дополнительно'" [value]="request?.description" (newValue)="request.description = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode != 'rent'" (tabSelect)="update = {}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span class="view-value">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}} руб.</span>
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
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" [disabled]="true" [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <div class="show_block">
                            <span>Наличные</span>
                            <switch-button [value]="request?.cash" (newValue)="request.cash = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Ипотека</span>
                            <switch-button [value]="request?.mortgage" (newValue)="request.mortgage = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Сертификат</span>
                            <switch-button [value]="request?.certificate" (newValue)="request.certificate = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Материнский капитал</span>
                            <switch-button [value]="request?.maternalCapital" (newValue)="request.maternalCapital = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission" (newValue)="request.commission = $event"></switch-button>
                        </div>
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" (newValue)="request.costInfo = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <ui-tab [title]="'БЮДЖЕТ'" *ngIf="request.offerTypeCode == 'rent'" (tabSelect)="update={}">
                    <ng-container *ngIf="!editEnabled">
                        <div class="show_block">
                            <span>Бюджет</span>
                            <span class="view-value">{{utils.getNumWithWhitespace(valRange.getHuman(request?.budget, 1000))}} руб.</span>
                        </div>
                        <div class="show_block">
                            <span>Форма оплаты</span>
                            <span class="view-value">{{reqClass.paymentMethodOptions[request?.paymentMethod]?.label}}</span>
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
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" [disabled]="true" [update]="update"></input-area>
                    </ng-container>
                    <ng-container *ngIf="editEnabled">
                        <sliding-menu [name] = "'Форма оплаты'" [options]="reqClass.paymentMethodOptions"
                                      [value]="request?.paymentMethod"
                                      (result) = "request.paymentMethod = $event"
                        ></sliding-menu>
                        <div class="show_block">
                            <span>Комунальные платежи</span>
                            <switch-button [value]="request?.utilityBills" (newValue)="request.utilityBills = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Счетчики</span>
                            <switch-button [value]="request?.counters" (newValue)="request.counters = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Депозит</span>
                            <switch-button [value]="request?.deposit" (newValue)="request.deposit = $event"></switch-button>
                        </div>
                        <div class="show_block">
                            <span>Комиссия</span>
                            <switch-button [value]="request?.commission" (newValue)="request.commission = $event"></switch-button>
                        </div>
                        <input-area [name]="'Дополнительно'" [value]="request?.costInfo" (newValue)="request.costInfo = $event" [update]="update"></input-area>
                    </ng-container>
                </ui-tab>
                <div more class="more">ЕЩЁ...
                    <div>
                        <div (click)="workAreaMode = 'map'" [class.selected]="workAreaMode == 'map'">Карта</div>
                        <div (click)="workAreaMode = 'photo'" [class.selected]="workAreaMode == 'photo'">Фото</div>
                        <div (click)="workAreaMode = 'advert'" [class.selected]="workAreaMode == 'advert'">Реклама</div>
                        <div (click)="workAreaMode = 'mortgage'" [class.selected]="workAreaMode == 'mortgage'">Заявка на ипотеку</div>
                        <div (click)="workAreaMode = 'doc'" [class.selected]="workAreaMode == 'doc'">Документы</div>
                        <div (click)="workAreaMode = 'egrn'" [class.selected]="workAreaMode == 'egrn'">Выписка из ЕГРН</div>
                        <div (click)="openNotebook('notes', $event)" [class.selected]="workAreaMode == 'notes'">Заметки</div>
                        <div (click)="openNotebook('diary', $event)" [class.selected]="workAreaMode == 'diary'">Ежедневник</div>
                        <div (click)="openNotebook('chat', $event)" [class.selected]="workAreaMode == 'chat'">Чат</div>
                        <div (click)="openNotebook('phone', $event)" [class.selected]="workAreaMode == 'phone'">IP-телефония</div>
                        <div (click)="workAreaMode = 'summary'" [class.selected]="workAreaMode == 'summary'">Сводка</div>
                        <div (click)="workAreaMode = 'report'" [class.selected]="workAreaMode == 'report'">Отчет</div>
                        <div (click)="workAreaMode = 'history'" [class.selected]="workAreaMode == 'history'">История</div>
                        
                        <div class="delete" (click)="$event">Удалить заявку</div>
                    </div>
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
                        ></digest-offer>
                    </ui-tab>
                    <ui-tab [title]="'БАЗА КОМПАНИИ'" (tabSelect)="source = 1; getOffers();">
                        <digest-offer *ngFor="let offer of offers; let i = index" [offer]="offer"
                                      [class.selected]="selectedOffers.indexOf(offer) > -1"
                                      (click)="select($event, offer, i)"
                                      (contextmenu)="select($event, offer, i)"
                                      (dblclick)="openOffer(offer)"
                        ></digest-offer>
                    </ui-tab>
                </ui-tabs-menu>
            </div>
        </div> 

        <div class="work-area">
            <ng-container [ngSwitch]="workAreaMode">
                <yamap-view *ngSwitchCase="'map'" [drawMap] = "mapDrawAllowed"
                            (drawFinished) = "request.searchArea = $event.coords"
                    [searchArea] = "request.searchArea" [offers] = "offers"
                >
                </yamap-view>
                <adv-view *ngSwitchCase="'advert'"></adv-view>
                <files-view [full]="paneHidden" [type]="'image'" [object_id]="request.id" [editMode]="editEnabled" *ngSwitchCase="'photo'"></files-view>
            </ng-container>
        </div>
    `
})

export class TabRequestComponent implements OnInit{
    public tab: Tab;
    public request: Request = new Request();
    mode: number = 0;
    workAreaMode: string = 'map';
    canEditable: boolean = true;
    page: number = 0;
    source: OfferSource = OfferSource.LOCAL;
    offers: Offer[] = [];
    selectedOffers: Offer[] = [];
    contact: Contact = new Contact();
    update: any;

    hitsCount: number = 0;

    offClass = Offer;
    conClass = Contact;
    reqClass  = Request;
    block = ObjectBlock;
    utils = Utils;
    utilsObj = null;
    valRange = ValueRange;

    agentOpts: any = {
        null: {label: "Не назначено"}
    };

    filter: any = {
        agentId: 'all',
        stateCode: 'all',
        tag: 'all',
        offerTypeCode: 'sale',
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
        this.utilsObj = new Utils(_personService,_organisationService);
        this.agentOpts[this._sessionService.getUser().id] = {label: this._sessionService.getUser().name};
        for(let user of _userService.cacheUsers){
            this.agentOpts[user.value] = {label: user.label};
        }

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
        this.canEditable = this.tab.args.canEditable;
        if(this.request.id == null) {
            this.editEnabled = true;
        }

        if(this.request.person){
            this.contact = this.request.person;
            this.contact.type = "person";
        } else if(this.request.company){
            this.contact = this.request.company;
            this.contact.type = "organisation";
        }
    }

    agentChanged(event) {
        this.request.agentId = event;
        if(this.request.agentId != null) {
            this._userService.get(this.request.agentId).subscribe(agent => {
                this.request.agent = agent;
            });
        }
    }
    openNotebook(name, event) {
        let block = this._hubService.getProperty('notebook');

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

        if(this.contact.type == 'person'){
            this._personService.save(this.contact as Person).subscribe(person => {
                if(person) {
                    this.request.personId = person.id;
                    this.request.person = person;
                    delete this.request.company;
                    delete this.request.companyId;
                    this.contact = person;
                    this.contact.type = "person";
                    this._requestService.save(this.request).subscribe(request => {
                        setTimeout(() => {
                            this.request = request;
                        });
                        this.toggleEdit();
                    });
                }
            });
        } else{
            this._organisationService.save(this.contact as Organisation).subscribe(org => {
                if(org) {
                    this.request.companyId = org.id;
                    this.request.company = org;
                    delete this.request.person;
                    delete this.request.personId;
                    this.contact = org;
                    this.contact.type = "organisation";
                    this._requestService.save(this.request).subscribe(request => {
                        setTimeout(() => {
                            this.request = request;
                        });
                        this.toggleEdit();
                    });
                }
            });
       }
    }

    chechForm(){
        if (this.request.request.length < 1){
            alert("Введите текст запроса");
            return false;
        }
        if(PhoneBlock.getNotNullData(this.contact.phoneBlock) == ""){
            alert("Не указан контактный телефон");
            return false;
        }
        if(!PhoneBlock.check(PhoneBlock.removeSymb(this.contact.phoneBlock))){
            alert("Один из телефонов указан неверно");
            return false;
        }
        if(!this.contact.name || this.contact.name.length < 5){
            alert("Не указано имя контакта или имя слишком короткое");
            return false;
        }
        return true;
    }

    getOffers() {
        this.offers = [];
        this.selectedOffers = [];
        this._offerService.list(0, 100, this.source, this.filter,null, this.request.request, this.request.searchArea).subscribe(
            offers => {
                this.offers = offers.list;
            },
            err => console.log(err)
        );
    }



    showContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        //let users: User[] = this._userService.listCached("", 0, "");
        let uOpt = [{class:'entry', label: "На себя", disabled: false, callback: () => {
                this.clickMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
            }}];
        for (let op of this._userService.cacheUsers){
            op.callback = () => {
                this.clickMenu({event: "set_agent", agentId: op.value});
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
                        c.selectedOffers.forEach(o => {
                            o.stageCode = s.value;
                            c._offerService.save(o);
                        });
                    }
                }
            );
        });
        let tag = this.selectedOffers[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedOffers.length != 1, icon: "", label: 'Проверить', callback: () => {

                    }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                        let tab_sys = this._hubService.getProperty('tab_sys');
                        this.selectedOffers.forEach(o => {
                            let canEditable =  this._sessionService.getAccount().id == o.accountId;
                            tab_sys.addTab('offer', {offer: o, canEditable});
                        });
                    }},
                {class: "entry", disabled:  !Utils.canImpact(this.selectedOffers), icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickMenu({event: "del_obj"});
                    }
                },
                {class: "delimiter"},
                {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
                        {class: "entry", disabled: false, label: "Как Контакт",
                            callback: () => {
                                this.clickMenu({event: "add_to_person"});
                            }
                        },
                        {class: "entry", disabled: false, label: "Как Организацию",
                            callback: () => {
                                this.clickMenu({event: "add_to_company"});
                            }
                        },
                    ]},
                {class: "submenu", disabled: !Utils.canImpact(this.selectedOffers), icon: "", label: "Назначить", items: [
                        {class: "entry", disabled: false, label: "Не назначено",
                            callback: () => {
                                this.clickMenu({event: "del_agent", agent: null});
                            }
                        }
                    ].concat(uOpt)},
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

                    ]},
                {class: "delimiter"},
                {class: "submenu", disabled:  !Utils.canImpact(this.selectedOffers), icon: "", label: "Назначить тег", items: [
                        {class: "tag", icon: "", label: "", offer: this.selectedOffers.length == 1 ? this.selectedOffers[0] : null, tag,
                            callback: (new_tag) => {
                                this.clickMenu({event: "set_tag", tag: new_tag});
                            }}
                    ]}

            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    clickMenu(evt: any){
        this.selectedOffers.forEach(offer => {
            if(evt.event == "add_to_person"){
                if(!offer.person){
                     let pers: Person = new Person();
                     pers.phoneBlock = PhoneBlock.toFormat(offer.phoneBlock);
                     this._personService.save(pers).subscribe(
                         data => {
                             offer.person = data;
                             offer.personId = data.id;
                             let tabSys = this._hubService.getProperty('tab_sys');
                             tabSys.addTab('person', {person: offer.person, canEditable: true});
                         }
                     );
                }
            }
            else if(evt.event == "add_to_company"){
                if(!offer.person && !offer.company && offer.phoneBlock.main){
                    let org: Organisation = new Organisation();
                    org.phoneBlock = PhoneBlock.toFormat(offer.phoneBlock);

                    this._organisationService.save(org).subscribe(
                        data => {
                            offer.company = data;
                            offer.companyId = data.id;
                            let tabSys = this._hubService.getProperty('tab_sys');
                            tabSys.addTab('organisation', {organisation: offer.company, canEditable: true});
                        }
                    );
                }
            } else if(evt.event == "set_agent"){
                offer.agentId = evt.agentId;
                offer.agent = null;
                this._offerService.save(offer);
            } else if(evt.event == "del_agent"){
                offer.agentId = null;
                offer.agent = null;
                this._offerService.save(offer);
            } else if(evt.event == "del_obj"){
                /*this.subscription_offer = this._requestService.delete(o).subscribe(
                    data => {
                        this.selectedRequests.splice(this.selectedRequests.indexOf(o), 1);
                        this.requests.splice(this.requests.indexOf(o), 1);
                    }
                );*/
            } else if(evt.event == "check"){
                //this.openPopup = {visible: true, task: "check", value: PhoneBlock.getAsString(o.phoneBlock, " "), person: o.person};
            } else if(evt.event == "set_tag"){
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

    openOffer(offer: Offer){
        let tab_sys = this._hubService.getProperty('tab_sys');
        let canEditable = this.source == OfferSource.IMPORT ? false : (this._sessionService.getUser().accountId == offer.accountId);
        tab_sys.addTab('offer', {offer, canEditable });
    }

    public findContact(event) {
        this.utilsObj.findContact(event, this.contact).subscribe(data => this.contact = data);
    }
}
