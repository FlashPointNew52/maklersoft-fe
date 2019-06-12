import {Component, OnInit, AfterViewInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {OfferService, OfferSource} from '../../service/offer.service';
import {TaskService} from '../../service/task.service';
import {HistoryService} from '../../service/history.service';
import {UserService} from '../../service/user.service';
import {AnalysisService} from '../../service/analysis.service';
import {PersonService} from "../../service/person.service";
import {OrganisationService} from "../../service/organisation.service";
import {SuggestionService} from "../../service/suggestion.service";
import {SessionService} from "../../service/session.service";

import {Tab} from '../../class/tab';
import {Utils} from '../../class/utils';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {Task} from '../../class/task';
import {PhoneBlock} from "../../class/phoneBlock";
import {Rating} from "../../class/rating";
import {HistoryRecord} from '../../class/historyRecord';
import {Photo} from '../../class/photo';
import {User} from '../../entity/user';

import {Person} from "../../entity/person";
import {Organisation} from "../../entity/organisation";
import {UploadService} from "../../service/upload.service";
import {AddressBlock} from "../../class/addressBlock";
import {MaskService} from "ngx-mask";
@Component({
    selector: 'tab-offer',
    inputs: ['tab'],
    styles: [`

    .progress_bar {
        background-color: #0093ff;
    }

    .work-area {
        height: calc(100vh - 115px);
        width: calc(100vw - 30px);
        float: right;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: flex-end;
    }

    gmap-view {
        width: calc(100% - 370px);
        height: 100%;
        display: block;
        position: relative;
    }

    .right_pane {
        width: 370px;
        height: 100%;
    }

    .main_info > .type {
        display: inline-flex;
        margin: 30px 0 0;
        width: calc(100% - 35px);
        line-height: 15px;
        height: 15px;
    }

    .main_info > .type > ui-view-value{
        text-transform: uppercase;
        margin-right: 8px;
    }

    .main_info > .street {
        font-size: 16px;
        text-transform: uppercase;
        height: 18px;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .main_info > .district {
        margin: 0 0 15px;
        color: #757575;
    }

    .main_info > .price {
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        font-weight: bold;
        position: absolute;
        top: 23px;
        right: 0;
    }

    .main_info > .price:after {
        content: " ";
        background-image: url(/assets/ruble1.png);
        width: 24px;
        height: 24px;
        background-size: 24px;
        display: block;
        float: right;
        filter: grayscale(1);
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
      <digest-window *ngIf="tab.active"
                     [open]="openPopup"
      ></digest-window>
      <div class="main_info">
          <div class="type">
              <ui-view-value
                [options]="typeCodeOptions"
                [value]="offer.typeCode"
              >
              </ui-view-value>
              <span *ngIf="offer?.roomsCount">{{offer?.roomsCount}} комн.</span>
          </div>
          <div class="street">
                {{ (offer.addressBlock?.street || " ") + (offer.addressBlock.house === undefined ? " " : (", " + offer.addressBlock.house))}}
          </div>
          <div class="district">
                {{ (offer.addressBlock?.city || " ") + (offer.addressBlock.admArea === undefined ? " " : (", " + offer.addressBlock.admArea))
              + (offer.addressBlock.area === undefined ? " " : (", " + offer.addressBlock.area))}}
          </div>
          <div class="price">{{utils.getNumWithDellimet((offer?.ownerPrice || 0) * 1000)}}</div>
  
          <ui-tag [value]="offer.tag"></ui-tag>
      </div>
      <hr class='underline'>
      <hr class='underline progress_bar' [style.width]="progressWidth+'vw'">
      <div (window:resize)="onResize($event)">

        <div class="pane" [style.width.px]="paneWidth">
            <div class="fixed-button" (click)="toggleLeftPane()">
                <div class="arrow" [ngClass]="{'arrow-right': paneHidden, 'arrow-left': !paneHidden}"></div>
            </div>
            <div class="property" style="overflow-x: hidden;">
                <div class="edit_ready">
                    <a href="#" *ngIf="!editEnabled && canEditable" (click)="toggleEdit()">Изменить</a>
                    <a href="#" *ngIf="editEnabled && canEditable" (click)="save()">Готово</a>
                    <div *ngIf="!canEditable" class="pointer_menu" (click)="contextMenu($event)">...</div>
                </div>
            <div class="property_body" *ngIf="!editEnabled">
              <ul>
                <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                <li>
                  <span class="view-label">Телефон {{offer.company ? 'контрагента' : 'контакта'}}</span>
                  <span class="view-value"
                        *ngIf="get_length(offer?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.phoneBlock?.main">
                  <span class="view-label">Основной</span>
                  <span class="view-value link">{{offer?.phoneBlock?.main | mask: "+0 " + phoneMasks.main}}</span>
                </li>
                <li class="subpar" *ngIf="offer.phoneBlock?.cellphone">
                  <span class="view-label">Личный</span>
                  <span class="view-value link">{{offer?.phoneBlock?.cellphone | mask: "+0 " + phoneMasks.cellphone}}</span>
                </li>
                <li class="subpar" *ngIf="offer.phoneBlock?.office">
                  <span class="view-label">Рабочий</span>
                  <span class="view-value link">{{offer?.phoneBlock?.office | mask: "+0 " + phoneMasks.office}}</span>
                </li>
                <li class="subpar" *ngIf="offer.phoneBlock?.fax">
                  <span class="view-label">Рабочий</span>
                  <span class="view-value link">{{offer?.phoneBlock?.fax | mask: "+0 " + phoneMasks.fax}}</span>
                </li>
                <li class="subpar" *ngIf="offer?.phoneBlock?.ip">
                  <span class="view-label">Внутренний</span>
                  <span class="view-value link">{{offer?.phoneBlock?.ip | mask: phoneMasks.ip}}</span>
                </li>
                <li class="subpar" *ngIf="offer?.phoneBlock?.home">
                  <span class="view-label">Домашний</span>
                  <span class="view-value link">{{offer?.phoneBlock?.home | mask: "+0 " + phoneMasks.home}}</span>
                </li>
                <li class="subpar" *ngIf="offer?.phoneBlock?.other">
                  <span class="view-label">Другой</span>
                  <span class="view-value link">{{offer?.phoneBlock?.other | mask: "+0 " + phoneMasks.other}}</span>
                </li>
                
                <li>
                  <span class="view-label">Предложение</span>
                  <span class="view-value">{{isNotContact ? "Контрагент" : "Контакт"}}</span>
                </li>
                <li *ngIf="!offer.companyId">
                  <span class="view-label">ФИО</span>
                  <span class="view-value" [class.link]="offer.person?.id"
                        (click)="openPerson()">{{offer.person?.name || 'Неизвестно'}}</span>
                </li>
                <li *ngIf="offer.companyId">
                  <span class="view-label">Организация</span>
                  <span class="view-value" [class.link]="offer.company?.id"
                        (click)="openOrganisation()">{{offer.company?.name || 'Неизвестно'}}</span>
                </li>
                <li>
                  <span class="view-label">Статус</span>
                  <span class="view-value">{{offer.person?.isMiddleman ? "Посредник" : "Принципал"}}</span>
                </li>
                <li>
                    <span class="view-label">Тип {{offer.company ? 'контрагента' : 'контакта'}}</span>
                    <ui-view-value
                      [options]="personTypeCodeOptions"
                      [value]="offer.person?.typeCode"
                    >
                    </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Лояльность</span>
                  <ui-view-value
                    [options]="personStateCodeOptions"
                    [value]="offer.person?.stateCode"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Сделка</span>
                  <ui-view-value
                    [options]="offerTypeCodeOptions"
                    [value]="offer.offerTypeCode"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">E-mail</span>
                  <span class="view-value"
                        *ngIf="get_length(agentOrCompany?.emailBlock)==0">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="agentOrCompany?.emailBlock?.main">
                  <span class="view-label">Основной</span>
                  <span class="view-value link">{{agentOrCompany?.emailBlock?.main}}</span>
                </li>
                <li class="subpar" *ngIf="agentOrCompany?.emailBlock?.work">
                  <span class="view-label">Рабочий</span>
                  <span class="view-value link">{{agentOrCompany?.emailBlock?.work}}</span>
                </li>
                <li class="subpar" *ngIf="agentOrCompany?.emailBlock?.other">
                  <span class="view-label">Другой</span>
                  <span class="view-value link">{{agentOrCompany?.emailBlock?.other}}</span>
                </li>

                <li><span class="view-label">Web-сайт</span> <span class="view-value"
                        *ngIf="get_length(agentOrCompany?.siteBlock)==0">{{ "Неизвестно"}}</span>
                </li>
                <li *ngIf="agentOrCompany?.siteBlock?.main" class="subpar"><span class="view-label">Основной</span> <a
                  [href]="'http://'+agentOrCompany?.siteBlock?.main" target="_blank">{{agentOrCompany?.siteBlock?.main}}</a></li>
                <li *ngIf="agentOrCompany?.siteBlock?.work" class="subpar"><span class="view-label">Рабочий</span> <a
                  [href]="'http://'+agentOrCompany?.siteBlock?.work" target="_blank">{{agentOrCompany?.siteBlock?.work}}</a></li>
                <li *ngIf="agentOrCompany?.siteBlock?.other" class="subpar"><span class="view-label">Другой</span> <a
                  [href]="'http://'+agentOrCompany?.siteBlock?.other" target="_blank">{{agentOrCompany?.siteBlock?.other}}</a></li>
                <li><span class="view-label">Соцсети</span> <span class="view-value"
                                                                  *ngIf="get_length(agentOrCompany?.socialBlock)==0">{{ "Неизвестно"}}</span>
                </li>
                <li *ngIf="agentOrCompany?.socialBlock?.vk" class="subpar"><span class="view-label">Вконтакте</span> <span
                  class="view-value link">{{agentOrCompany?.socialBlock?.vk}}</span></li>
                <li *ngIf="agentOrCompany?.socialBlock?.ok" class="subpar"><span class="view-label">Одноклассники</span> <span
                  class="view-value link">{{agentOrCompany?.socialBlock?.ok}}</span></li>
                <li *ngIf="agentOrCompany?.socialBlock?.twitter" class="subpar"><span class="view-label">Twitter</span> <span
                  class="view-value link">{{agentOrCompany?.socialBlock?.twitter}}</span></li>
                <li *ngIf="agentOrCompany?.socialBlock?.facebook" class="subpar"><span class="view-label">Facebook</span> <span
                  class="view-value link">{{agentOrCompany?.socialBlock?.facebook}}</span></li>
                <li *ngIf="agentOrCompany?.socialBlock?.google" class="subpar"><span class="view-label">Google+</span> <span
                  class="view-value link">{{agentOrCompany?.socialBlock?.google}}</span></li>

                <li><span class="view-label">Мессенджеры</span> <span class="view-value"
                       *ngIf="get_length(agentOrCompany?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                </li>
                <li *ngIf="agentOrCompany?.messengerBlock?.whatsapp" class="subpar"><span class="view-label">WhatsApp</span> <span
                  class="view-value link">{{agentOrCompany?.messengerBlock?.whatsapp}}</span></li>
                <li *ngIf="agentOrCompany?.messengerBlock?.telegram" class="subpar"><span class="view-label">Telegram</span> <span
                  class="view-value link">{{agentOrCompany?.messengerBlock?.telegram}}</span></li>
                <li *ngIf="agentOrCompany?.messengerBlock?.viber" class="subpar"><span class="view-label">Viber</span> <span
                  class="view-value link">{{agentOrCompany?.messengerBlock?.viber}}</span></li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                <li>
                  <span class="view-label">Дата {{offer?.changeDate ? "изменения" : "добавления"}}</span>
                  <span class="view-value">{{ utils.getDateInCalendar(offer?.changeDate || offer.addDate)}}</span>
                </li>

                <li style="height: auto;">
                  <span class="view-label">Источник:</span>
                  <span class="view-value" *ngIf="offer.sourceMedia && offer.sourceUrl">
                        <a href="{{offer.sourceUrl}}" target="_blank">{{sourceMediaOptions[offer.sourceMedia]}}</a>
                  </span>
                  <span class="view-value" *ngIf="offer.sourceMedia && !offer.sourceUrl">
                        {{sourceMediaOptions[offer.sourceMedia]}}
                  </span>
                  <ui-view-value *ngIf="!offer.sourceMedia && !offer.sourceUrl"
                                 [options]="sourceOptions"
                                 [value]="offer.sourceCode"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Ответственный</span>
                  <span class="view-value" [class.link]="offer.agent?.id"
                        (click)="openUser()">{{ offer.agent?.name || 'Неизвестно'}}</span>
                </li>
                <li>
                  <span class="view-label">Договор</span>
                  <span class="view-value" *ngIf="!offer.contractBlock">Неизвестно</span>
                </li>
                <li class="subpar" *ngIf="offer.contractBlock?.number">
                  <span class="view-label">Номер</span>
                  <span class="view-value">{{offer.contractBlock.number}}</span>
                </li>
                <li class="subpar" *ngIf="offer.contractBlock?.begin">
                  <span class="view-label">Начало</span>
                  <span class="view-value">{{offer.contractBlock.begin}}</span>
                </li>
                <li class="subpar" *ngIf="offer.contractBlock?.end">
                  <span class="view-label">Окончание</span>
                  <span class="view-value">{{offer.contractBlock.end}}</span>
                </li>
                <li class="subpar" *ngIf="offer.contractBlock?.contined">
                  <span class="view-label">Продлён</span>
                  <span class="view-value">{{offer.contractBlock.contined}}</span>
                </li>
                <li class="subpar" *ngIf="offer.contractBlock?.terminated">
                  <span class="view-label">Расторгнут</span>
                  <span class="view-value">{{offer.contractBlock.terminated}}</span>
                </li>
                <li>
                  <span class="view-label">Стадия</span>
                  <ui-view-value
                    [options]="stateCodeOptions"
                    [value]="offer.stateCode"
                  >
                  </ui-view-value>
                </li>
               
                <li>
                  <span class="view-label">Категория</span>
                  <ui-view-value
                    [options]="categoryOptions"
                    [value]="offer.categoryCode"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">{{offer.categoryCode != 'land' ? 'Тип дома' : 'Назначение земель'}}</span>
                  <ui-view-value style="max-width: 126px;"
                                 [options]="buildingTypeOptions"
                                 [value]="offer.buildingType"
                  >
                  </ui-view-value>
                </li>
                <li *ngIf="offer.categoryCode != 'land'">
                  <span
                    class="view-label">{{offer.categoryCode == 'rezidential' ? "Тип недвижимости" : "Класс здания"}}</span>
                  <ui-view-value
                    [options]="buildingClassOptions"
                    [value]="offer.buildingClass"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Тип объекта</span>
                  <ui-view-value
                    [options]="typeCodeOptions"
                    [value]="offer.typeCode"
                  >
                  </ui-view-value>
                </li>
                <li *ngIf="offer.categoryCode != 'land'">
                  <span class="view-label">Новостройка:</span>
                  <ui-switch-button [value]="offer?.newBuilding" [disabled]="true"></ui-switch-button>
                </li>
                <li *ngIf="offer.newBuilding && offer.categoryCode != 'land'">
                  <span class="view-label">Стадия объекта:</span>
                  <ui-view-value
                    [options]="objectStageOptions"
                    [value]="offer.objectStage"
                  >
                  </ui-view-value>
                </li>
                <li *ngIf="offer.categoryCode != 'land'">
                  <span class="view-label">{{offer?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'}}</span>
                  <span class="view-value"> {{ offer.buildYear || 'Неизвестно'}} </span>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Удаленность</span>
                  <span class="view-value"> {{ offer?.distance || "Неизвестно"}} </span>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Наименование поселения</span>
                  <span class="view-value"> {{ offer?.settlement || "Неизвестно"}} </span>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Охрана</span>
                  <ui-switch-button [value]="offer?.guard" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Адрес объекта</span>
                  <span class="view-value" *ngIf="!offer.addressBlock">Неизвестно</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.region">
                  <span class="view-label">Регион</span>
                  <span class="view-value">{{offer.addressBlock.region}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.city">
                  <span class="view-label">Населённый пункт</span>
                  <span class="view-value">{{offer.addressBlock.city}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.admArea">
                  <span class="view-label">Административный район</span>
                  <span class="view-value">{{offer.addressBlock.admArea}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.area">
                  <span class="view-label">Район</span>
                  <span class="view-value">{{offer.addressBlock.area}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.street">
                  <span class="view-label">Улица</span>
                  <span class="view-value">{{offer.addressBlock.street}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.house">
                  <span class="view-label">Дом</span>
                  <span class="view-value">{{offer.addressBlock.house}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.housing">
                  <span class="view-label">Корпус</span>
                  <span class="view-value">{{offer.addressBlock.housing}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.apartment">
                  <span class="view-label">{{offer.categoryCode =='commersial' ? 'Офис':'Квартира'}}</span>
                  <span class="view-value">{{offer.addressBlock.apartment}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.metro">
                  <span class="view-label">Метро</span>
                  <span class="view-value">{{offer.addressBlock.metro}}</span>
                </li>
                <li class="subpar" *ngIf="offer.addressBlock?.bus_stop">
                  <span class="view-label">Остановка</span>
                  <span class="view-value">{{offer.addressBlock.bus_stop}}</span>
                </li>
                <li *ngIf="offer.offerTypeCode != 'rent'">
                  <span class="view-label">Обременение</span>
                  <ui-switch-button [value]="offer?.encumbrance" [disabled]="true"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode != 'rent'">
                  <span class="view-label">Подходит под ипотеку</span>
                  <ui-switch-button [value]="offer?.mortgages" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room' || offer.typeCode == 'share'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li>
                  <span class="view-label">Материал стен:</span>
                  <ui-view-value
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Количество комнат:</span>
                  <span class="view-value"> {{ offer.roomsCount }} </span>
                </li>
                <li *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'">
                  <span class="view-label">Тип комнат:</span>
                  <ui-view-value
                    [options]="roomSchemeOptions"
                    [value]="offer.roomScheme"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Этаж/Этажность</span>
                  <span class="view-value" *ngIf="get_length(offerFloor)==0">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floor">
                  <span class="view-label">Этаж</span>
                  <span class="view-value">{{offer.floor}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floorsCount">
                  <span class="view-label">Этажность</span>
                  <span class="view-value">{{offer.floorsCount}}</span>
                </li>
                <li class="subpar" *ngIf="offer.levelsCount">
                  <span class="view-label">Уровень</span>
                  <span class="view-value">{{offer.levelsCount}}</span>
                </li>
                <li>
                  <span class="view-label">Площадь объекта</span>
                  <span class="view-value" *ngIf="get_length(offerSquare)==0">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareTotal">
                  <span class="view-label">Общая</span>
                  <span class="view-value">{{offer.squareTotal}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareLiving">
                  <span class="view-label">Жилая</span>
                  <span class="view-value">{{offer.squareLiving}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareKitchen">
                  <span class="view-label">Кухня</span>
                  <span class="view-value">{{offer.squareKitchen}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareLand && offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Участка</span>
                  <span class="view-value"> {{ offer?.squareLand + " " + (offer?.squareLandType == 0 ? "cот" : "га") }} </span>
                </li>
                <li>
                  <span class="view-label pull-left">Лоджия</span>
                  <ui-switch-button [value]="offer?.loggia" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label pull-left">Балкон</span>
                  <ui-switch-button [value]="offer?.balcony" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label pull-left">Санузел</span>
                  <ui-view-value
                    [options]="bathroomOptions"
                    [value]="offer.bathroom"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label pull-left">Состояние:</span>
                  <ui-view-value
                    [options]="conditionOptions"
                    [value]="offer.condition"
                  >
                  </ui-view-value>
                </li>
              </ul>

              <ul
                *ngIf="offer.typeCode == 'house' || offer.typeCode == 'cottage' || offer.typeCode == 'dacha' || offer.typeCode == 'townhouse' || offer.typeCode == 'duplex'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>

                <li>
                  <span class="view-label">Этаж/Этажность</span>
                  <span class="view-value"
                        *ngIf="!(offer.squareTotal && offer.floorsCount && offer.levelsCount)">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floor">
                  <span class="view-label">Этаж</span>
                  <span class="view-value">{{offer.floor}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floorsCount">
                  <span class="view-label">Этажность</span>
                  <span class="view-value">{{offer.floorsCount}}</span>
                </li>
                <li class="subpar" *ngIf="offer.levelsCount">
                  <span class="view-label">Уровень</span>
                  <span class="view-value">{{offer.levelsCount}}</span>
                </li>

                <li>
                  <span class="view-label">Количество комнат:</span>
                  <span class="view-value"> {{ offer?.roomsCount || "Неизвестно"}} </span>
                </li>
                <li *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'">
                  <span class="view-label">Тип комнат:</span>
                  <ui-view-value
                    [options]="roomSchemeOptions"
                    [value]="offer.roomScheme"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Площадь объекта</span>
                  <span class="view-value"
                        *ngIf="!(offer.squareTotal && offer.squareLiving && offer.squareKitchen && offer.squareLand)">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareTotal">
                  <span class="view-label">Общая</span>
                  <span class="view-value">{{offer.squareTotal}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareLiving">
                  <span class="view-label">Жилая</span>
                  <span class="view-value">{{offer.squareLiving}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareKitchen">
                  <span class="view-label">Кухня</span>
                  <span class="view-value">{{offer.squareKitchen}}</span>
                </li>
                <li class="subpar" *ngIf="offer.squareLand">
                  <span class="view-label">Участка</span>
                  <span class="view-value"> {{ offer?.squareLand + " " + (offer?.squareLandType == 0 ? "cот" : "га")
                    }} </span>
                </li>
                <li>
                  <span class="view-label">Состояние:</span>
                  <ui-view-value
                    [options]="conditionOptions"
                    [value]="offer.condition"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Материал:</span>
                  <ui-view-value
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Лоджия:</span>
                  <ui-switch-button [value]="offer?.loggia" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Балкон:</span>
                  <ui-switch-button [value]="offer?.balcony" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Санузел:</span>
                  <ui-view-value
                    [options]="bathroomOptions"
                    [value]="offer.bathroom"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Водоснабжение:</span>
                  <ui-switch-button [value]="offer?.waterSupply" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация:</span>
                  <ui-switch-button [value]="offer?.gasification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение:</span>
                  <ui-switch-button [value]="offer?.electrification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация:</span>
                  <ui-switch-button [value]="offer?.sewerage" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление:</span>
                  <ui-switch-button [value]="offer?.centralHeating" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.categoryCode == 'land'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li>
                  <span class="view-label">Площадь участка</span>
                  <span class="view-value"> {{ offer?.squareLand + " " + (offer.squareLandType == 0 ? "cот" : "га")
                    }} </span>
                </li>
                <li>
                  <span class="view-label">Водоснабжение</span>
                  <ui-switch-button [value]="offer?.waterSupply" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация</span>
                  <ui-switch-button [value]="offer?.gasification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение</span>
                  <ui-switch-button [value]="offer?.electrification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация</span>
                  <ui-switch-button [value]="offer?.sewerage" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление</span>
                  <ui-switch-button [value]="offer?.centralHeating" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.categoryCode == 'commersial'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li>
                  <span class="view-label">Название</span>
                  <span class="view-value"> {{ offer?.objectName || "Неизвестно"}} </span>
                </li>
                <li>
                  <span class="view-label">Материал здания</span>
                  <ui-view-value
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Этаж/Этажность</span>
                  <span class="view-value"
                        *ngIf="!(offer.squareTotal && offer.floorsCount && offer.levelsCount)">{{ "Неизвестно"}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floor">
                  <span class="view-label">Этаж</span>
                  <span class="view-value">{{offer.floor}}</span>
                </li>
                <li class="subpar" *ngIf="offer.floorsCount">
                  <span class="view-label">Этажность</span>
                  <span class="view-value">{{offer.floorsCount}}</span>
                </li>
                <li class="subpar" *ngIf="offer.levelsCount">
                  <span class="view-label">Уровень</span>
                  <span class="view-value">{{offer.levelsCount}}</span>
                </li>
                <li>
                  <span class="view-label">Водоснабжение</span>
                  <ui-switch-button [value]="offer?.waterSupply" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация</span>
                  <ui-switch-button [value]="offer?.gasification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение</span>
                  <ui-switch-button [value]="offer?.electrification" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация</span>
                  <ui-switch-button [value]="offer?.sewerage" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление</span>
                  <ui-switch-button [value]="offer?.centralHeating" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Площадь помещения</span>
                  <span class="view-value"> {{ offer?.squareTotal || "Неизвестно"}} </span>
                </li>
                <li>
                  <span class="view-label">Высота потолков</span>
                  <span class="view-value"> {{ offer?.ceilingHeight || "Неизвестно"}} </span>
                </li>
                <li>
                  <span class="view-label">Состояние</span>
                  <ui-view-value
                    [options]="conditionOptions"
                    [value]="offer.condition"
                  >
                  </ui-view-value>
                </li>
                <li>
                  <span class="view-label">Охрана</span>
                  <ui-switch-button [value]="offer?.guard" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Лифт</span>
                  <ui-switch-button [value]="offer?.lift" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Парковка:</span>
                  <ui-switch-button [value]="offer?.parking" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.offerTypeCode == 'rent'">
                <div (click)="show_hide($event)">КОМПЛЕКТАЦИЯ ОБЪЕКТА</div>
                <li>
                  <span class="view-label">Укомплектована полностью</span>
                  <ui-switch-button [value]="offer.complete" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Гостиная мебель</span>
                  <ui-switch-button [value]="offer.living_room_furniture" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Кухонная мебель</span>
                  <ui-switch-button [value]="offer.kitchen_furniture" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Спальная мебель</span>
                  <ui-switch-button [value]="offer.couchette" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Постельные принадлежности</span>
                  <ui-switch-button [value]="offer.bedding" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Посуда</span>
                  <ui-switch-button [value]="offer.dishes" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Холодильник</span>
                  <ui-switch-button [value]="offer.refrigerator" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Стиральная машина</span>
                  <ui-switch-button [value]="offer.washer" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">СВЧ печь</span>
                  <ui-switch-button [value]="offer.microwave_oven" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Кондиционер</span>
                  <ui-switch-button [value]="offer.air_conditioning" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Посудомоечная машина</span>
                  <ui-switch-button [value]="offer.dishwasher" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Телевизор</span>
                  <ui-switch-button [value]="offer.tv" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.offerTypeCode == 'rent'">
                <div (click)="show_hide($event)">УСЛОВИЯ НАЙМА</div>
                <li>
                  <span class="view-label">Животные</span>
                  <ui-switch-button [value]="offer.with_animals" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">С детьми</span>
                  <ui-switch-button [value]="offer.with_children" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Курить</span>
                  <ui-switch-button [value]="offer.can_smoke" [disabled]="true"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Мероприятия</span>
                  <ui-switch-button [value]="offer.activities" [disabled]="true"></ui-switch-button>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li style="height:auto" class="describe">
                  <div>{{offer?.description || 'Неизвестно'}}</div>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">РЕЙТИНГ</div>
                <span class="rait_header">Расскажите, что вы думаете о районе, используя эти категории.
                                Пять звезд соответвуют высшей оценки.</span>
                <li class="rating" style="height: auto;line-height: 30px;">
                  <span class="view-label">Месторасположение</span>
                  <ui-star-view [value]="this.offer.locRating?.map['remoteness'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Транспортная доступность</span>
                  <ui-star-view [value]="this.offer.locRating?.map['transport'] || 0" [editable]="false"></ui-star-view>
                  <span class="view-label">Престижность района</span>
                  <ui-star-view [value]="this.offer.locRating?.map['prestigious'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Экология</span>
                  <ui-star-view [value]="this.offer.locRating?.map['ecology'] || 0" [editable]="false"></ui-star-view>
                  <span class="view-label">Инфраструктура</span>
                  <ui-star-view [value]="this.offer.locRating?.map['infrastructure'] || 0"
                                [editable]="false"></ui-star-view>
                </li>
                <li class="rating" style="height: auto;line-height: 30px;"
                    *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room'">
                  <span class="view-label">Придомовая территория</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['home_nearest'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Наличие парковки</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['parking_available'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Общие помещения</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['shared_facilities'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Средства безопасности</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['security_tools'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Вид из окон</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['window_view'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Ремонт / состояние</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['condition'] || 0"
                                [editable]="false"></ui-star-view>
                  <span class="view-label">Сантехника</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['sanitary'] || 0"
                                [editable]="false"></ui-star-view>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">СТОИМОСТЬ</div>
                <li>
                  <span class="view-label">Цена объекта:</span>
                  <span class="view-value">{{ offer.ownerPrice ? offer.ownerPrice + " тыс. руб." : "Неизвестно"}}</span>
                </li>
                <li>
                  <span class="view-label">Комиссия:</span>
                  <span class="view-value">
                                    {{ offer.comission ? offer.comission + " руб." :
                    (offer.comissionPerc ? offer.comissionPerc + " %" : "Неизвестно")}}
                                </span>
                </li>
                <li *ngIf="offer.offerTypeCode != 'rent'">
                  <span class="view-label">MLS:</span>
                  <span class="view-value">{{ offer.mlsPrice ? offer.mlsPrice + " тыс. руб." : "Неизвестно"}}</span>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Депозит</span>
                  <ui-switch-button [value]="offer.prepayment" [disabled]="true"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Электроэнергия</span>
                  <ui-switch-button [value]="offer.electrific_pay" [disabled]="true"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Вода</span>
                  <ui-switch-button [value]="offer.water_pay" [disabled]="true"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Газ</span>
                  <ui-switch-button [value]="offer.gas_pay" [disabled]="true"></ui-switch-button>
                </li>
              </ul>
            </div>

            <div class="property_body editable" *ngIf="editEnabled">
              <ul>
                <div (click)="show_hide($event)">КОНТАКТНАЯ ИНФОРМАЦИЯ</div>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Предложение</span>
                  <ui-slidingMenu
                    [options]="[ {value: 'contact', label: 'Контакт'},
                                 {value: 'organisation', label: 'Контрагент'}
                               ]"
                    [value]="isNotContact ? 'contact' : 'organisation'"
                    (onChange)="changeContact($event.selected.value == 'contact' ? false : true)"
                  >
                  </ui-slidingMenu>
                </li>
                
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Телефон {{!isNotContact ? "контакта" : "контрагента"}}</span>
                  <span class="view-value" *ngIf="get_length(agentOrCompany?.phoneBlock)==0">{{ "Неизвестно"}}</span>
                  <ui-multiselect
                                  [params]="{
                                        'main': {label: 'Основной', placeholder: 'Введите номер телефона'},
                                        'office': {label: 'Рабочий', placeholder: 'Введите номер телефона'},
                                        'cellphone' : {label: 'Мобильный', placeholder: 'Введите номер телефона'},
                                        'home': {label: 'Домашний', placeholder: 'Введите номер телефона'},
                                        'fax': {label: 'Факс', placeholder: 'Введите номер телефона'},
                                        'other': {label: 'Другой', placeholder: 'Введите номер телефона'},
                                        'ip': {label: 'Другой', placeholder: 'Введите номер телефона'}
                                    }"
                                  [masks]="phoneMasks"
                                  [field]="agentOrCompany?.phoneBlock"
                                  [width]="'53%'" [prefix]="'+7'"
                                  (onChange)="find_contact($event)">
                  </ui-multiselect>
                </li>

                <li>
                  <ui-input-line [placeholder]="!isNotContact ? 'ФИО:' : 'Название организации'" [value]="agentOrCompany?.name || ''"
                                 (onChange)="agentOrCompany.name = $event">
                  </ui-input-line>
                </li>
                <li style="height: auto;"><span class="view-label sliding-label">Статус</span>
                  <ui-slidingMenu [options]="middlemanOptions" [value]="agentOrCompany?.isMiddleman ? 'middleman' : 'owner'"
                                  (onChange)="agentOrCompany.isMiddleman = $event.selected.value == 'owner' ? false : true"></ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Тип {{offer.company ? 'контрагента' : 'контакта'}}</span>
                  <ui-slidingMenu
                    [options]="personTypeCodeOptions"
                    [value]="agentOrCompany?.typeCode"
                    (onChange)="agentOrCompany.typeCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Лояльность</span>
                  <ui-slidingMenu
                    [options]="personStateCodeOptions"
                    [value]="agentOrCompany?.stateCode"
                    (onChange)="agentOrCompany.stateCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Сделка</span>
                  <ui-slidingMenu
                    [options]="offerTypeCodeOptions"
                    [value]="offer.offerTypeCode"
                    (onChange)="changeOfferTypeCode($event.selected.value)"
                  >
                  </ui-slidingMenu>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">E-mail:</span>
                  <span class="view-value"
                        *ngIf="get_length(agentOrCompany?.emailBlock)==0">{{ "Неизвестно"}}</span>
                  <ui-multiselect
                                  [params]="{
                                        'work' : {label: 'Рабочий', placeholder: 'Введите E-mail'},
                                        'main' : {label: 'Основной', placeholder: 'Введите E-mail'},
                                        'other' : {label: 'Другой', placeholder: 'Введите E-mail'}
                                    }"
                                  [masks]="['','','','','','','']"
                                  [field]="agentOrCompany?.emailBlock"
                                  [width]="'53%'"
                                  (onChange)="agentOrCompany.emailBlock = $event">
                  </ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Web-сайт:</span>
                  <span class="view-value"
                        *ngIf="get_length(agentOrCompany?.siteBlock)==0">{{ "Неизвестно"}}</span>
                  <ui-multiselect
                                  [params]="{
                                        'work' : {label: 'Рабочий', placeholder: 'Введите название сайта'},
                                        'main' : {label: 'Основной', placeholder: 'Введите название сайта'},
                                        'other' : {label: 'Другой', placeholder: 'Введите название сайта'}
                                    }"
                                  [masks]="['','','','','','','']"
                                  [field]="agentOrCompany?.siteBlock"
                                  [width]="'53%'"
                                  (onChange)="agentOrCompany.siteBlock = $event">
                  </ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Соцсети</span> <span
                  class="view-value unknown" *ngIf="get_length(agentOrCompany?.socialBlock)==0">{{ "Неизвестно"}}</span>
                  <ui-multiselect style="display: none;"
                                  [params]="{
                                            'vk' : {label: 'Вконтакте', placeholder: 'Введите адрес страницы'},
                                            'ok' : {label: 'Одноклассники', placeholder: 'Введите адрес страницы'},
                                            'facebook' : {label: 'Facebook', placeholder: 'Введите адрес страницы'},
                                            'google' : {label: 'Google+', placeholder: 'Введите адрес страницы'},
                                            'twitter' : {label: 'Twitter', placeholder: 'Введите адрес страницы'}
                                        }"
                                  [masks]="['','','','','','','']" [field]="agentOrCompany?.socialBlock" [width]="'36%'"
                                  (onChange)="agentOrCompany.socialBlock = $event"></ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)"><span class="view-label">Мессенджеры</span> <span
                  class="view-value unknown" *ngIf="get_length(agentOrCompany?.messengerBlock)==0">{{ "Неизвестно"}}</span>
                  <ui-multiselect style="display: none;"
                                  [params]="{
                                            'whatsapp' : {label: 'WhatsApp', placeholder: 'Введите номер телефона'},
                                            'telegram' : {label: 'Telegram', placeholder: 'Введите номер телефона'},
                                            'viber' : {label: 'Viber', placeholder: 'Введите номер телефона'}
                                        }"
                                  [masks]="['','','','','','','']" [field]="agentOrCompany?.messengerBlock" [width]="'36%'"
                                  (onChange)="agentOrCompany.messengerBlock = $event"></ui-multiselect>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">СОПРОВОДИТЕЛЬНАЯ ИНФОРМАЦИЯ</div>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Ответственный</span>
                  <ui-slidingMenu
                    [options]="agentOpts"
                    [value]="offer.agent?.id"
                    (onChange)="agentChanged($event)"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;" [style.flex-wrap]="offer.sourceUrl ? 'wrap' :''">
                  <span class="view-label sliding-label">Источник</span>
                  <ui-slidingMenu *ngIf="!offer.sourceUrl"
                                  [options]="sourceOptions"
                                  [value]="offer.sourceCode"
                                  (onChange)="offer.sourceCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                  <span class="view-value" *ngIf="offer.sourceUrl">
                        <a href="{{offer.sourceUrl}}" target="_blank">{{offer.sourceMedia}}</a>
                  </span>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Договор</span>
                  <span class="view-value" *ngIf="get_length(offer.contractBlock)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="{
                                        'number': {label: 'Номер', placeholder: 'Введите номер договора'},
                                        'begin': {label: 'Начало', placeholder: 'Введите название сайта'},
                                        'end': {label: 'Окончание', placeholder: 'Введите название сайта'},
                                        'contined': {label: 'Продлён', placeholder: 'Введите название сайта'},
                                        'terminated': {label: 'Расторгнут', placeholder: 'Введите название сайта'}
                                    }"
                                  [masks]="['','','']"
                                  [field]="offer.contractBlock"
                                  [width]="'53%'"
                                  (onChange)="offer.contractBlock = $event">
                  </ui-multiselect>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Стадия</span>
                  <ui-slidingMenu
                    [options]="stateCodeOptions"
                    [value]="offer.stateCode"
                    (onChange)="offer.stateCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
               
                <li style="height: auto;">
                  <span class="view-label sliding-label">Категория</span>
                  <ui-slidingMenu
                    [options]="categoryOptions"
                    [value]="offer.categoryCode"
                    (onChange)="offer.categoryCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span
                    class="view-label sliding-label">{{offer.categoryCode != 'land' ? (offer.categoryCode == 'rezidential' ? 'Тип дома' : 'Тип недвижимости') : 'Назначение земель'}}</span>
                  <ui-slidingMenu
                    [options]="getBuildingOptions()"
                    [value]="offer.buildingType"
                    (onChange)="offer.buildingType = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;" *ngIf="offer.categoryCode != 'land'">
                  <span
                    class="view-label sliding-label">{{offer.categoryCode == 'rezidential' ? "Тип недвижимости" : "Класс здания"}}</span>
                  <ui-slidingMenu
                    [options]="getBuildingClassOptions()"
                    [value]="offer.buildingClass"
                    (onChange)="offer.buildingClass = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>

                <li style="height: auto;">
                  <span class="view-label sliding-label">Тип объекта</span>
                  <ui-slidingMenu
                    [options]="getTypeCodeOptions()"
                    [value]="offer.typeCode"
                    (onChange)="offer.typeCode = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <ui-input-line [placeholder]="'Удаленность'" [value]="offer.distance"
                                 (onChange)="offer.distance = $event">
                  </ui-input-line>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <ui-input-line [placeholder]="'Наименование поселения'" [value]="offer.settlement"
                                 (onChange)="offer.settlement = $event">
                  </ui-input-line>
                </li>
                <li *ngIf="offer.categoryCode == 'land' || offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Охрана</span>
                  <ui-switch-button [value]="offer.guard" (newValue)="offer.guard = $event"></ui-switch-button>
                </li>
                <li class="multiselect">
                  <ui-input-line [placeholder]="'Адрес объекта:'" [value]="''" style="height: 42px"
                                 [width]="'225px'" (onChange)="offer.addressBlock = $event" [queryTipe]="'address'">
                  </ui-input-line>
                  <ui-multiselect
                                  [params]="{
                                        'region': {label: 'Регион', placeholder: 'Введите название сайта'},
                                        'city': {label: 'Нас. пункт', placeholder: 'Введите название сайта'},
                                        'admArea': {label: 'Адм. район', placeholder: 'Введите название сайта'},
                                        'area': {label: 'Район', placeholder: 'Введите название сайта'},
                                        'street': {label: 'Улица', placeholder: 'Введите название сайта'},
                                        'house': {label: 'Дом', placeholder: 'Введите название сайта'},
                                        'housing': {label: 'Корпус', placeholder: 'Введите название сайта'},
                                        'apartment': {label: (offer.categoryCode == 'commersial' ? 'Офис': 'Квартира'), placeholder: 'Введите название сайта'},
                                        'metro': {label: 'Метро', placeholder: 'Введите название сайта'},
                                        'bus_stop': {label: 'Остановка', placeholder: 'Введите название сайта'}
                                    }"
                                  [masks]="['','','','','','','']"
                                  [field]="offer.addressBlock"
                                  [width]="'53%'"
                                  (onChange)="offer.addressBlock = $event">
                  </ui-multiselect>
                </li>
                <li *ngIf="offer.categoryCode != 'land'">
                  <span class="view-label">Новостройка:</span>
                  <ui-switch-button [value]="offer.newBuilding"
                                    (newValue)="offer.newBuilding = $event"></ui-switch-button>
                </li>
                <li *ngIf="offer.newBuilding" style="height: auto;">
                  <span class="view-label sliding-label">Стадия объекта:</span>
                  <ui-slidingMenu
                    [options]="objectStageOptions"
                    [value]="offer.objectStage"
                    (onChange)="offer.objectStage = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li *ngIf="offer.categoryCode != 'land'">
                  <ui-input-line [placeholder]="offer?.newBuilding ? 'Дата сдачи объекта' : 'Год постройки'"
                                 [value]="offer.buildYear"
                                 [width]="'225px'" (onChange)="offer.buildYear = $event">
                  </ui-input-line>
                </li>
                <li *ngIf="offer.offerTypeCode != 'rent'">
                  <span class="view-label">Обременение:</span>
                  <ui-switch-button [value]="offer.encumbrance"
                                    (newValue)="offer.encumbrance = $event"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode != 'rent'">
                  <span class="view-label">Подходит под ипотеку:</span>
                  <ui-switch-button [value]="offer.mortgages" (newValue)="offer.mortgages = $event"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room' || offer.typeCode == 'share'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Материал стен</span>
                  <ui-slidingMenu
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                    (onChange)="offer.houseType = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li>
                  <ui-input-line [placeholder]="'Количество комнат'" [value]="offer.roomsCount"
                                 [width]="'225px'" (onChange)="offer.roomsCount = ParseInt($event)">
                  </ui-input-line>
                </li>
                <li style="height: auto;" *ngIf="offer.roomsCount != 1 && offer.typeCode != 'room'">
                  <span class="view-label sliding-label">Тип комнат</span>
                  <ui-slidingMenu
                    [options]="roomSchemeOptions"
                    [value]="offer.roomScheme"
                    (onChange)="offer.roomScheme = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Этажи:</span>
                  <span class="view-value" *ngIf="get_length(offerFloor)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="floors_params"
                                  [masks]="['','','']"
                                  [field]="offerFloor"
                                  [width]="'53%'"
                                  (onChange)="offerFloor = $event">
                  </ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Площадь объекта:</span>
                  <span class="view-value" *ngIf="get_length(offerSquare)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="square_params"
                                  [masks]="['','','','']"
                                  [field]="offerSquare"
                                  [width]="'53%'"
                                  (onChange)="offerSquare = $event">
                  </ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)" *ngIf="offer.buildingType == 'lowrise_house'">
                  <span class="view-label">Площадь участка:</span>
                  <span class="view-value" *ngIf="get_length(landSquare)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="square_land_params"
                                  [masks]="['','']"
                                  [field]="landSquare"
                                  [width]="'53%'"
                                  (onChange)="landSquare = $event">
                  </ui-multiselect>
                </li>
                <li>
                  <span class="view-label">Лоджия:</span>
                  <ui-switch-button [value]="offer.loggia" (newValue)="offer.loggia = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Балкон:</span>
                  <ui-switch-button [value]="offer.balcony" (newValue)="offer.balcony = $event"></ui-switch-button>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Санузел:</span>
                  <ui-slidingMenu
                    [options]="bathroomOptions"
                    [value]="offer.bathroom"
                    (onChange)="offer.bathroom = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Состояние:</span>
                  <ui-slidingMenu
                    [options]="conditionOptions"
                    [value]="offer.condition"
                    (onChange)="offer.condition = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
              </ul>

              <ul
                *ngIf="offer.typeCode == 'house' || offer.typeCode == 'cottage' || offer.typeCode == 'dacha' || offer.typeCode == 'townhouse' || offer.typeCode == 'duplex'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Этаж/Этажность:</span>
                  <span class="view-value" *ngIf="get_length(offerFloor)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="floors_params"
                                  [masks]="['','','']"
                                  [field]="offerFloor"
                                  [width]="'53%'"
                                  (onChange)="offerFloor = $event">
                  </ui-multiselect>
                </li>
                <li>
                  <ui-input-line [placeholder]="'Количество комнат'" [value]="offer.roomsCount"
                                 (onChange)="offer.roomsCount = ParseInt($event)">
                  </ui-input-line>
                </li>
                <li style="height: auto;" *ngIf="offer.roomsCount != 1">
                  <span class="view-label sliding-label">Тип комнат:</span>
                  <ui-slidingMenu
                    [options]="roomSchemeOptions"
                    [value]="offer.roomScheme"
                    (onChange)="offer.roomScheme = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Площадь объекта:</span>
                  <span class="view-value" *ngIf="get_length(offerSquare)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="square_params"
                                  [masks]="['','','','']"
                                  [field]="offerSquare"
                                  [width]="'53%'"
                                  (onChange)="offerSquare = $event">
                  </ui-multiselect>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Площадь участка:</span>
                  <span class="view-value" *ngIf="get_length(landSquare)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="square_land_params"
                                  [masks]="['','']"
                                  [field]="landSquare"
                                  [width]="'53%'"
                                  (onChange)="landSquare = $event">
                  </ui-multiselect>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Состояние:</span>
                  <ui-slidingMenu
                    [options]="conditionOptions"
                    [value]="offer.condition"
                    (onChange)="offer.condition = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Материал:</span>
                  <ui-slidingMenu
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                    (onChange)="offer.houseType = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li>
                  <span class="view-label">Лоджия:</span>
                  <ui-switch-button [value]="offer.loggia" (newValue)="offer.loggia = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Балкон:</span>
                  <ui-switch-button [value]="offer?.balcony" (newValue)="offer.balcony = $event"></ui-switch-button>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Санузел:</span>
                  <ui-slidingMenu
                    [options]="bathroomOptions"
                    [value]="offer.bathroom"
                    (onChange)="offer.bathroom = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li>
                  <span class="view-label">Водоснабжение:</span>
                  <ui-switch-button [value]="offer?.waterSupply"
                                    (newValue)="offer.waterSupply = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация:</span>
                  <ui-switch-button [value]="offer?.gasification"
                                    (newValue)="offer.gasification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение:</span>
                  <ui-switch-button [value]="offer?.electrification"
                                    (newValue)="offer.electrification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация:</span>
                  <ui-switch-button [value]="offer?.sewerage" (newValue)="offer.sewerage = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление:</span>
                  <ui-switch-button [value]="offer?.centralHeating"
                                    (newValue)="offer.centralHeating = $event"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.categoryCode == 'land'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Площадь участка</span>
                  <span class="view-value" *ngIf="get_length(landSquare)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="square_land_params"
                                  [masks]="['','']"
                                  [field]="landSquare"
                                  [width]="'53%'"
                                  (onChange)="landSquare = $event">
                  </ui-multiselect>
                </li>
                <li>
                  <span class="view-label">Водоснабжение</span>
                  <ui-switch-button [value]="offer?.waterSupply"
                                    (newValue)="offer.waterSupply = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация</span>
                  <ui-switch-button [value]="offer.gasification"
                                    (newValue)="offer.gasification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение</span>
                  <ui-switch-button [value]="offer.electrification"
                                    (newValue)="offer.electrification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация</span>
                  <ui-switch-button [value]="offer.sewerage" (newValue)="offer.sewerage = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление</span>
                  <ui-switch-button [value]="offer.centralHeating"
                                    (newValue)="offer.centralHeating = $event"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.categoryCode == 'commersial'">
                <div (click)="show_hide($event)">ТЕХНИЧЕСКОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li>
                  <ui-input-line [placeholder]="'Название'" [value]="offer.objectName"
                                 (onChange)="offer.objectName = $event">
                  </ui-input-line>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Материал здания</span>
                  <ui-slidingMenu
                    [options]="houseTypeOptions"
                    [value]="offer.houseType"
                    (onChange)="offer.houseType = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Этаж/Этажность:</span>
                  <span class="view-value" *ngIf="get_length(offerFloor)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="floors_params"
                                  [masks]="['','','']"
                                  [field]="offerFloor"
                                  [width]="'53%'"
                                  (onChange)="offerFloor = $event">
                  </ui-multiselect>
                </li>
                <li>
                  <span class="view-label">Водоснабжение</span>
                  <ui-switch-button [value]="offer.waterSupply"
                                    (newValue)="offer.waterSupply = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Газификация</span>
                  <ui-switch-button [value]="offer.gasification"
                                    (newValue)="offer.gasification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Электроснабжение</span>
                  <ui-switch-button [value]="offer.electrification"
                                    (newValue)="offer.electrification = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Канализация</span>
                  <ui-switch-button [value]="offer.sewerage" (newValue)="offer.sewerage = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Отопление</span>
                  <ui-switch-button [value]="offer.centralHeating"
                                    (newValue)="offer.centralHeating = $event"></ui-switch-button>
                </li>
                <li>
                  <ui-input-line [placeholder]="'Площадь помещения'" [value]="offerSquare['TOTAL']"
                                 (onChange)="offerSquare['TOTAL'] = ParseFloat($event)">
                  </ui-input-line>
                </li>
                <li>
                  <ui-input-line [placeholder]="'Высота потолков'" [value]="offer.ceilingHeight"
                                 (onChange)="offer.ceilingHeight = ParseFloat($event)">
                  </ui-input-line>
                </li>
                <li style="height: auto;">
                  <span class="view-label sliding-label">Состояние:</span>
                  <ui-slidingMenu
                    [options]="conditionOptions"
                    [value]="offer.condition"
                    (onChange)="offer.condition = $event.selected.value"
                  >
                  </ui-slidingMenu>
                </li>
                <li>
                  <span class="view-label">Охрана</span>
                  <ui-switch-button [value]="offer.guard" (newValue)="offer.guard = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Лифт</span>
                  <ui-switch-button [value]="offer.lift" (newValue)="offer.lift = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Парковка:</span>
                  <ui-switch-button [value]="offer.parking" (newValue)="offer.parking = $event"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.offerTypeCode == 'rent'">
                <div (click)="show_hide($event)">КОМПЛЕКТАЦИЯ ОБЪЕКТА</div>
                <li>
                  <span class="view-label">Укомплектована полностью</span>
                  <ui-switch-button [value]="offer.complete" (newValue)="completeAll($event)"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Гостиная мебель</span>
                  <ui-switch-button [value]="offer.living_room_furniture"
                                    (newValue)="offer.living_room_furniture = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Кухонная мебель</span>
                  <ui-switch-button [value]="offer.kitchen_furniture"
                                    (newValue)="offer.kitchen_furniture = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Спальная мебель</span>
                  <ui-switch-button [value]="offer.couchette" (newValue)="offer.couchette = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Постельные принадлежности</span>
                  <ui-switch-button [value]="offer.bedding" (newValue)="offer.bedding = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Посуда</span>
                  <ui-switch-button [value]="offer.dishes" (newValue)="offer.dishes = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Холодильник</span>
                  <ui-switch-button [value]="offer.refrigerator"
                                    (newValue)="offer.refrigerator = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Стиральная машина</span>
                  <ui-switch-button [value]="offer.washer" (newValue)="offer.washer = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">СВЧ печь</span>
                  <ui-switch-button [value]="offer.microwave_oven"
                                    (newValue)="offer.microwave_oven = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Кондиционер</span>
                  <ui-switch-button [value]="offer.air_conditioning"
                                    (newValue)="offer.air_conditioning = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Посудомоечная машина</span>
                  <ui-switch-button [value]="offer.dishwasher"
                                    (newValue)="offer.dishwasher = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Телевизор</span>
                  <ui-switch-button [value]="offer.tv" (newValue)="offer.tv = $event"></ui-switch-button>
                </li>
              </ul>

              <ul *ngIf="offer.offerTypeCode == 'rent'">
                <div (click)="show_hide($event)">УСЛОВИЯ НАЙМА</div>
                <li>
                  <span class="view-label">Животные</span>
                  <ui-switch-button [value]="offer.with_animals"
                                    (newValue)="offer.with_animals = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">С детьми</span>
                  <ui-switch-button [value]="offer.with_children"
                                    (newValue)="offer.with_children = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Курить</span>
                  <ui-switch-button [value]="offer.can_smoke" (newValue)="offer.can_smoke = $event"></ui-switch-button>
                </li>
                <li>
                  <span class="view-label">Мероприятия</span>
                  <ui-switch-button [value]="offer.activities"
                                    (newValue)="offer.activities = $event"></ui-switch-button>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">ДОПОЛНИТЕЛЬНОЕ ОПИСАНИЕ ОБЪЕКТА</div>
                <li style="height: auto;">
                  <textarea placeholder="Введите текст дополнительного описания"
                            [(ngModel)]="offer.description"></textarea>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">РЕЙТИНГ ОБЪЕКТА</div>
                <span class="rait_header">Расскажите, что вы думаете о районе, используя эти категории.
                                Пять звезд соответвуют высшей оценки.</span>
                <li class="rating">
                  <span class="view-label">Месторасположение</span>
                  <ui-star-view [value]="this.offer.locRating?.map['remoteness']"
                                (estimate)="this.offer.locRating.map['remoteness']=$event"></ui-star-view>
                  <span class="view-label">Транспортная доступность</span>
                  <ui-star-view [value]="this.offer.locRating?.map['transport']"
                                (estimate)="this.offer.locRating.map['transport']=$event"></ui-star-view>
                  <span class="view-label">Престижность района</span>
                  <ui-star-view [value]="this.offer.locRating?.map['prestigious']"
                                (estimate)="this.offer.locRating.map['prestigious']=$event"></ui-star-view>
                  <span class="view-label">Экология</span>
                  <ui-star-view [value]="this.offer.locRating?.map['ecology']"
                                (estimate)="this.offer.locRating.map['ecology']=$event"></ui-star-view>
                  <span class="view-label">Инфраструктура</span>
                  <ui-star-view [value]="this.offer.locRating?.map['infrastructure']"
                                (estimate)="this.offer.locRating.map['infrastructure']=$event"></ui-star-view>
                </li>
                <li class="rating" *ngIf="offer.typeCode == 'apartment' || offer.typeCode == 'room'">
                  <span class="view-label">Придомовая территория</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['home_nearest']"
                                (estimate)="this.offer.locRating.map['home_nearest']=$event"></ui-star-view>
                  <span class="view-label">Наличие парковки</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['parking_available']"
                                (estimate)="this.offer.locRating.map['parking_available']=$event"></ui-star-view>
                  <span class="view-label">Общие помещения</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['shared_facilities']"
                                (estimate)="this.offer.locRating.map['shared_facilities']=$event"></ui-star-view>
                  <span class="view-label">Средства безопасности</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['security_tools']"
                                (estimate)="this.offer.locRating.map['security_tools']=$event"></ui-star-view>
                  <span class="view-label">Вид из окон</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['window_view']"
                                (estimate)="this.offer.locRating.map['window_view']=$event"></ui-star-view>
                  <span class="view-label">Ремонт / состояние</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['condition']"
                                (estimate)="this.offer.locRating.map['condition']=$event"></ui-star-view>
                  <span class="view-label">Сантехника</span>
                  <ui-star-view [value]="this.offer.offerRaiting?.map['sanitary']"
                                (estimate)="this.offer.locRating.map['sanitary']=$event"></ui-star-view>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">СТОИМОСТЬ</div>
                <li class="multiselect" (click)="showMenu($event)">
                  <span class="view-label">Стоимость:</span>
                  <span class="view-value" *ngIf="get_length(offerPrice)==0">Неизвестно</span>
                  <ui-multiselect
                                  [params]="price_params"
                                  [masks]="['','','']"
                                  [field]="offerPrice"
                                  [width]="'53%'"
                                  (onChange)="offerPrice = $event">
                  </ui-multiselect>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Депозит</span>
                  <ui-switch-button [value]="offer.prepayment"
                                    (newValue)="offer.prepayment = $event"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Электроэнергия</span>
                  <ui-switch-button [value]="offer.electrific_pay"
                                    (newValue)="offer.electrific_pay = $event"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Вода</span>
                  <ui-switch-button [value]="offer.water_pay" (newValue)="offer.water_pay = $event"></ui-switch-button>
                </li>
                <li *ngIf="offer.offerTypeCode == 'rent'">
                  <span class="view-label">Газ</span>
                  <ui-switch-button [value]="offer.gas_pay" (newValue)="offer.gas_pay = $event"></ui-switch-button>
                </li>
              </ul>

              <ul>
                <div (click)="show_hide($event)">ТЭГИ</div>
                <li style="height: auto; padding: 0;">
                  <ui-tag-block
                    [value]="offer?.tag"
                    (valueChange)="offer.tag = $event"
                  ></ui-tag-block>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ПРАВАЯ СТВОРКА: КОНЕЦ -->
        <!-- РАБОЧАЯ ОБЛАСТЬ: НАЧАЛО -->

        <div class="work-area">
          <yamap-view
            style="width: calc(100% - 370px); height: 100%;display: block;position: relative;"
            [offers]="[offer]"
            [same_offers]="[]"
            [selected_offers]="[offer]"
            [with_menu]="true"
            (showSameOffers)="similarObjSelected()"
          >

          </yamap-view>
          <div class="right_pane">
            <ui-tabs-menu>
              <ui-tab [title]="'ФОТО'">
                <files-view
                  style="display: flex;height: 100%; flex-direction: column;"
                  [type]="'image'"
                  [object_id]="offer.id"
                  [files]="offer.photoUrl"
                  [editMode]="editEnabled"
                  (fileIndexClick)="openPopup = {visible: true, task: 'photo', offer: offer, value: 0, index: $event};"
                  (progressLoad)="displayProgress($event)"
                  (add)="addFile($event, 'photo')"
                >
                </files-view>
              </ui-tab>
              <ui-tab [title]="'ДОКУМЕНТЫ'">
                <files-view
                  style="display: flex;height: 100%; flex-direction: column;"
                  [type]="'document'"
                  [editMode]="editEnabled"
                  [files]="offer.docUrl"
                  [object_id]="offer.id"
                  (progressLoad)="displayProgress($event)"
                  (add)="addFile($event, 'doc')"
                >
                </files-view>
              </ui-tab>
              <ui-tab [title]="'РЕКЛАМА'">
                <adv-view [offer]="offer" [editMode]="editEnabled">
                </adv-view>
              </ui-tab>
              <ui-tab [title]="'ЗАЯВКИ'">
                <requests-view [offer]="offer">
                </requests-view>
              </ui-tab>
              <ui-tab [title]="'ИСТОРИЯ'">
              </ui-tab>
            </ui-tabs-menu>
          </div>
        </div>
      </div>
    `,
    providers: [OfferService]
})

export class TabOfferComponent implements OnInit {
    public tab: Tab;
    public offer: Offer = new Offer();
    public photos: Photo[];
    canEditable: boolean = true;
    selected_offer: any[];
    openPopup: any = {visible: false};
    utils = Utils;
    agentOpts: any[] = [{class:'entry', value: null, label: "Не назначено"},
                        {class:'entry', value: this._sessionService.getUser().id, label: this._sessionService.getUser().name}
    ];
    similarOffers: Offer[] = [];
    isNotContact: boolean = false;
    paneHidden: boolean = false;
    paneWidth: number;

    editEnabled: boolean = false;

    progressWidth: number = 0;
    progressTimer: number;

    offerFloor: any;
    offerSquare: any;
    offerPrice: any;
    landSquare: any;

    agentOrCompany: any = new Person();

    offerTypeCodeOptions = Offer.offerTypeCodeOptions;
    personTypeCodeOptions = Person.typeCodeOptions;
    personStateCodeOptions = [];//Person.stateCodeOptions;
    middlemanOptions = Person.middlemanOptions;
    typeCodeOptions = Offer.typeCodeOptions;
    categoryOptions = Offer.categoryOptions;
    buildingTypeOptions = Offer.buildingTypeOptions;
    stateCodeOptions = Offer.stateCodeOptions;
    objectStageOptions = Offer.objectStageOptions;
    houseTypeOptions = Offer.houseTypeOptions;
    buildingClassOptions = Offer.buildingClassOptions;
    roomSchemeOptions = Offer.roomSchemeOptions;
    conditionOptions = Offer.conditionOptions;
    bathroomOptions = Offer.bathroomOptions;
    sourceOptions = Offer.sourceOptions;
    sourceMediaOptions = Offer.sourceMediaOptions;

    phoneMasks = PhoneBlock.phoneFormats;

    floors_params = {
        'FLOOR': { label: 'Этаж'},
        'FLOORS': {label: 'Этажность'},
        'LEVELS': {label: 'Уровней'}
    };
    square_params = {
        'TOTAL': {label: 'Общая'},
        'LIVING': {label: 'Жилая'},
        'KITCHEN': {label: 'Кухня'}
    };
    square_land_params = {
        0: {label: 'Соток'},
        1: {label: 'Гектар'}
    };

    sameObject: boolean = false;

    price_params = {
        'OWNER': {label: 'Цена объекта'},
        'RUBLES': {label: 'Комиссия (руб)'},
        'PERSENT': {label: 'Комиссия (%)'},
        'MLS': {label: 'MLS'}
    };

    userSubscribe: any;
    offerSubscribe: any;
    personSubscribe: any;
    orgSubscribe: any;

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
        setTimeout(() => {
            if (this.offer.id) {
                this.tab.header = 'Предложение ';
            } else {
                this.tab.header = 'Новый Объект';
            }
        });
    }

    ngOnInit() {
        this.offer = this.tab.args.offer;
        this.canEditable = this.tab.args.canEditable;
        this.updateSelected();
        if(!this.offer.locRating){
            this.offer.locRating = new Rating();
            this.offer.locRating.map = {};
            this.offer.locRating.map = {'average' : 0};
        }

        this.offer.openDate = Math.round((Date.now() / 1000));
        if(!this.offer.person && !this.offer.company){
            if(this.offer.mediatorCompany){
                this.offer.company = new Organisation(this.offer.mediatorCompany);
            } else{
                this.offer.person = new Person();
            }
        }
        let c = this._configService.getConfig();
        let loc = null;//this._sessionService.getAccount().location;

        this.offerFloor= {
            'FLOOR': this.offer.floor,
            'FLOORS':  this.offer.floorsCount,
            'LEVELS':  this.offer.levelsCount
        };

        this.offerSquare={
            'TOTAL': this.offer.squareTotal,
            'LIVING': this.offer.squareLiving,
            'KITCHEN': this.offer.squareKitchen
        };

        this.offerPrice={
            'OWNER': this.offer.ownerPrice,
            'RUBLES': this.offer.comission,
            'PERSENT': this.offer.comissionPerc,
            'MLS': this.offer.mlsPrice
        };
        this.changeOfferTypeCode(this.offer.offerTypeCode);

        if (!this.offer.buildingType){
            this.offer.buildingType = Offer.typeCodeOptionsToBuilding[this.offer.typeCode];
        }

        if (!this.offer.categoryCode){
            this.offer.categoryCode = Offer.buildingTypeOptionsToCategory[this.offer.buildingType];
        }

        if(this.offer.squareLandType = 1){
            this.landSquare={
                1 : this.offer.squareLand
            };
        } else{
            this.landSquare={
                0 : this.offer.squareLand
            };
        }

        if (this.offer.id == null && this.offer.sourceMedia == null) {
            this.offer = new Offer();

            if (this.tab.args.person) {
                this.offer.personId = this.tab.args.person.id;
            }
            this.editEnabled = true;

        }
        if(this.offer.personId)
            this.agentOrCompany = this.offer.person;
        else if(this.offer.companyId)
            this.agentOrCompany = this.offer.company;
        else{
            this.agentOrCompany = new Person();
            this.agentOrCompany.phoneBlock = this.offer.phoneBlock;
            this.offer.person = this.agentOrCompany;
        }

        this.calcSize();
    }

    /*ngOnDestroy() {
        this.userSubscribe.unsubscribe();
        this.offerSubscribe ? this.offerSubscribe.unsubscribe(): null;
        this.personSubscribe.unsubscribe();
        this.orgSubscribe.unsubscribe();
        this.suggestionSubscribe.unsubscribe();
    }*/

    show_hide(event: MouseEvent){
        let ul = (<HTMLElement>event.currentTarget).parentElement;
        if(ul.offsetHeight == 42){
            ul.style.setProperty('height', 'auto');
            ul.style.setProperty('overflow', 'visible');
        }
        else{
            ul.style.setProperty('height', '42px');
            ul.style.setProperty('overflow', 'hidden');
        }
    }

    onResize(e) {
        this.calcSize();
    }

    changeContact(event){
        this.isNotContact = event;
        this.offer.companyId = null;
        this.offer.company = null;
        this.offer.personId = null;
        this.offer.person = null;
    }

    calcSize() {
        if (this.paneHidden)
            this.paneWidth = 0;
         else
            this.paneWidth = 370;
    }

    toggleLeftPane() {
        this.paneHidden = !this.paneHidden;
        this.calcSize();
    }

    toggleEdit() {
        this.editEnabled = !this.editEnabled;
    }

    agentChanged(e) {
        this.offer.agentId = e.selected.value;
        if (this.offer.agentId != null) {
            this.userSubscribe = this._userService.get(this.offer.agentId).subscribe(agent => {
                this.offer.agent = agent;
            });
        }
    }

    updateSelected(){
        setTimeout(()=>{
            this.selected_offer=[this.offer];
        },2000);
    }

    save() {
        if (!this.chechForm())
            return;
        this.offer.squareTotal =  parseFloat(this.offerSquare["TOTAL"]);
        this.offer.squareKitchen =  parseFloat(this.offerSquare["KITCHEN"]);
        this.offer.squareLiving =  parseFloat(this.offerSquare["LIVING"]);

        this.offer.floor = parseInt(this.offerFloor["FLOOR"], 10);
        this.offer.floorsCount =  parseInt(this.offerFloor["FLOORS"],10);
        this.offer.levelsCount =  parseInt(this.offerFloor["LEVELS"],10);

        this.offer.ownerPrice =   parseFloat(this.offerPrice["OWNER"]);
        this.offer.comission =  parseFloat(this.offerPrice["RUBLES"]);
        this.offer.comissionPerc =  parseFloat(this.offerPrice["PERSENT"]);
        this.offer.mlsPrice = parseFloat(this.offerPrice["MLS"]);

        this.offer.squareLand = parseFloat(this.landSquare[0]) || parseFloat(this.landSquare[1]) ;
        this.offer.squareLandType = this.landSquare[0] ? 0 : (this.landSquare[1] ? 1 : null) ;

        let middleRat = {count: 0, value: 0};
        for(let ratCat in this.offer.locRating.map){
            if(this.offer.locRating.map[ratCat] > 0){
                middleRat.count++;
                middleRat.value += this.offer.locRating.map[ratCat];
            }
        }
        this.offer.locRating.map['average'] = middleRat.count > 0 ? middleRat.value/middleRat.count : 0;

        middleRat = {count: 0, value: 0};
        for(let ratCat in this.offer.offerRaiting.map){
            if(this.offer.offerRaiting.map[ratCat] > 0){
                middleRat.count++;
                middleRat.value += this.offer.offerRaiting.map[ratCat];
            }
        }

        this.offer.offerRaiting.map['average'] = middleRat.count > 0 ? middleRat.value/middleRat.count : 0;
        if(!this.agentOrCompany.id && PhoneBlock.getNotNullData(this.agentOrCompany.phoneBlock) != ""){
            if(!this.isNotContact){
                this.personSubscribe = this._personService.save(this.agentOrCompany).subscribe(person => {
                    setTimeout(() => {
                        this.offer.personId = person.id;
                        delete this.offer.person;
                        delete this.offer.company;
                        delete this.offer.companyId;
                        this.agentOrCompany = person;
                        this.offerSubscribe = this._offerService.save(this.offer).subscribe(offer => {
                            setTimeout(() => {
                                this.offer = offer;
                                this.updateSelected();
                                this.toggleEdit();
                            });

                        });
                    });
                });
            } else{
                this._organisationService.save(this.agentOrCompany).subscribe(org => {
                  setTimeout(() => {
                      this.offer.companyId = org.id;
                      delete this.offer.company;
                      delete this.offer.person;
                      delete this.offer.personId;
                      this.agentOrCompany = org;
                      this.offerSubscribe = this._offerService.save(this.offer).subscribe(offer => {
                          setTimeout(() => {
                              this.offer = offer;
                              this.updateSelected();
                              this.toggleEdit();
                          });

                      });
                  });
                });
            }

        } else{
            this.offerSubscribe = this._offerService.save(this.offer).subscribe(offer => {
                setTimeout(() => {
                    this.offer = offer;
                    this.updateSelected();
                    this.toggleEdit();
                });

            });
        }
    }

    chechForm(){
        if(!PhoneBlock.check(this.agentOrCompany.phoneBlock)){
            alert("Неверный формат телефона или телефон не заполнен");
            return false;
        }

        if(!AddressBlock.check(this.offer.addressBlock)){
            alert("Адрес не заполнен. Сохранение невозможно!");
            return false;
        }

        return true;
    }

    similarObjSelected() {
        this.sameObject = !this.sameObject;
        if(this.sameObject){
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
        if(this.offer.person.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('person', {person: this.offer.person});
        }
    }

    openUser() {
        if(this.offer.agent.id){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('user', {user: this.offer.agent});
        }
    }

    openOrganisation(){
        if(this.offer.companyId){
            let tab_sys = this._hubService.getProperty('tab_sys');
            tab_sys.addTab('organisation', {organisation: this.offer.company});
        }
    }

    showMenu(event){
        let elem = <HTMLElement>((<HTMLElement>event.currentTarget).getElementsByTagName('UI-MULTISELECT').item(0));
        if(elem.style.display != 'none'){
            elem.style.setProperty('display', 'none');
        }else {
            elem.style.removeProperty('display');
        }
    }

    getBuildingOptions(){
        return Offer.buildindTypeByCategory[this.offer.categoryCode] || [];
    }

    getTypeCodeOptions(){
        if(this.offer.buildingType != 'lowrise_house')
            return Offer.typeCodeByBuildingType[this.offer.buildingType] || [];
         else
            return Offer.typeCodeByBuildingClass[this.offer.buildingClass] || [];
    }

    getBuildingClassOptions(){
        return Offer.buildindClassByBuildingType[this.offer.buildingType] || [];
    }

    ParseInt(val){
        if(isNaN(parseInt(val,10)))
            return null;
        else
            return parseInt(val,10);
    }

    ParseFloat(val){
        if(isNaN(parseFloat(val)))
            return null;
        else
            return parseFloat(val);
    }

    get_length(obj: any){
        let count = 0;
        for (let prop in obj) {
            if(obj[prop])
                count++;
        }
        return count;
    }

    completeAll(value: boolean){
        this.offer.complete = value;
        if(this.offer.complete){
            this.offer.living_room_furniture = true;
            this.offer.kitchen_furniture = true;
            this.offer.couchette = true;
            this.offer.bedding = true;
            this.offer.dishes = true;
            this.offer.refrigerator = true;
            this.offer.washer = true;
            this.offer.microwave_oven = true;
            this.offer.air_conditioning = true;
            this.offer.dishwasher = true;
            this.offer.tv = true;
        }
    }

    changeOfferTypeCode(value){
        this.offer.offerTypeCode = value;
        if(value == 'rent'){
            delete this.offerPrice['MLS'];
            delete this.price_params['MLS'];
        } else{
            this.price_params['MLS'] = {label: 'MLS'};
        }
    }

    find_contact(structure: any){
        let phones = PhoneBlock.removeSymb(structure);
        if(PhoneBlock.check(phones)) {
            if(!this.isNotContact)
                this._personService.findByPhone(phones).subscribe((data)=>{
                    if(data != null){
                        this.offer.person = data;
                        this.offer.personId = this.offer.person.id;
                        this.agentOrCompany = this.offer.person;
                    } else{
                        this.offer.person = null;
                        this.offer.personId = null;
                    }
                });
            else
                this._organisationService.findByPhone(phones).subscribe((data)=>{
                    if(data != null){
                        this.offer.company = data;
                        this.offer.companyId = this.offer.company.id;
                        this.agentOrCompany = this.offer.company;
                    } else{
                        this.offer.company = null;
                        this.offer.companyId = null;
                    }
                });
        }

    }

    displayProgress(event){
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

    addFile(event, array){
        if(array == 'photo')
            this.offer.photoUrl ? this.offer.photoUrl.unshift(event) : this.offer.photoUrl = [event];
        else if(array == 'doc')
            this.offer.docUrl ? this.offer.docUrl.unshift(event) : this.offer.docUrl = [event];
    }

  contextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    let c = this;
    let users: User[] = this._userService.listCached("", 0, "");
    let uOpt = [];

    users.forEach(u => {
      if(u.id != this._sessionService.getUser().id)
        uOpt.push(
          {class: "entry", disabled: false, label: u.name, callback: () => {
              this.clickMenu({event: "add_to_local", agent: u});
            }},
        );
    });

    let stateOpt = [];
    let states = [
      {value: 'raw', label: 'Не активен'},
      {value: 'active', label: 'Активен'},
      {value: 'work', label: 'В работе'},
      {value: 'suspended', label: 'Приостановлен'},
      {value: 'archive', label: 'Архив'}
    ];
    let stageOpt = [];
    let stages = [
      {value: 'contact', label: 'Первичный контакт'},
      {value: 'pre_deal', label: 'Заключение договора'},
      {value: 'show', label: 'Показ'},
      {value: 'prep_deal', label: 'Подготовка договора'},
      {value: 'decision', label: 'Принятие решения'},
      {value: 'negs', label: 'Переговоры'},
      {value: 'deal', label: 'Сделка'}
    ];
    states.forEach(s => {
      stateOpt.push(
        {class: "entry", disabled: false, label: s.label, callback: function() {
              this.offer.stateCode = s.value;
              this.save();
          }}
      );
    });
    stages.forEach(s => {
      stageOpt.push(
        {class: "entry", disabled: false, label: s.label, callback: function() {
            this.offer.stageCode = s.value;
            this.save();
          }}
      );
    });
    let menu = {
      pX: e.pageX,
      pY: e.pageY,
      scrollable: false,
      items: [
        {class: "entry", disabled: false, icon: "", label: 'Проверить', callback: () => {
            this.openPopup = {visible: true, task: "check"};
          }},
        {class: "entry", disabled: false, icon: "", label: "Показать фото",
          callback: () => {
            this.clickMenu({event: "photo"});
          }
        },
        {class: "delimiter"},
        {class: "submenu", disabled: false, icon: "", label: "Добавить", items: [
            {class: "entry", disabled: !this.tab.args.canEditable, label: "В базу компании",
              callback: () => {
                this.clickMenu({event: "add_to_local"});
              }
            },
            {class: "entry", disabled: false, label: "В контакты",
              callback: () => {
                this.clickMenu({event: "add_to_person"});
              }
            },
            {class: "entry", disabled: false, label: "В контрагенты",
              callback: () => {
                this.clickMenu({event: "add_to_company"});
              }
            },
          ]},
        {class: "submenu", disabled: false, icon: "", label: "Назначить", items: [
            {class: "entry", disabled: this.tab.args.canEditable, label: "Не назначено",
              callback: () => {
                this.clickMenu({event: "del_agent", agent: null});
              }
            },
            {class: "entry", disabled: false, label: "",
              callback: () => {
                this.clickMenu({event: "add_to_local", agent: this._sessionService.getUser()});
              }
            },
            {class: "delimiter"}
          ].concat(uOpt)},
        {class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: [

          ]},
        {class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: [

          ]},
        {class: "delimiter"},
        {class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
            {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!');}},
            {class: "entry", disabled: false, label: "Шаблон 1", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 2", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 3", callback: function() {alert('yay s2!');}},
          ]},
        {class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
            {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!');}},
            {class: "entry", disabled: false, label: "Шаблон 1", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 2", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 3", callback: function() {alert('yay s2!');}},
          ]},
        {class: "submenu", disabled: false, icon: "", label: "Позвонить",  items: [
            {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!');}},
            {class: "delimiter"},
            {class: "entry", disabled: false, label: "На основной", callback: function() {alert('yay s1!');}},
            {class: "entry", disabled: false, label: "На рабочий", callback: function() {alert('yay s1!');}},
            {class: "entry", disabled: false, label: "На мобильный", callback: function() {alert('yay s2!');}},
          ]},
        {class: "submenu", disabled: false, icon: "", label: "Написать в чат", items: [
            {class: "entry", disabled: false, label: "Произвольно", callback: function() {alert('yay s1!');}},
            {class: "entry", disabled: false, label: "Шаблон 1", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 2", callback: function() {alert('yay s2!');}},
            {class: "entry", disabled: false, label: "Шаблон 3", callback: function() {alert('yay s2!');}},
          ]},
      ]
    };

    this._hubService.shared_var['cm'] = menu;
    this._hubService.shared_var['cm_hidden'] = false;
  }

  clickMenu(evt: any){
      if(evt.event == "add_to_local"){

        this.offer.stageCode = 'raw';
        if(evt.agent){
          this.offer.agentId = evt.agent.id;
          this.offer.agent = evt.agent;
        } else {
          this.offer.agentId = null;
          this.offer.agent = null;
        }
        if(!this.offer.person && this.offer.phoneBlock.main){
          let pers: Person = new Person();
          pers.phoneBlock =  this.offer.phoneBlock;

          if(evt.agent) {
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
        } else{
          this.offer.personId = this.offer.person.id;
          this._offerService.save(this.offer);
        }
      } else if(evt.event == "add_to_person"){
        if(!this.offer.person  && this.offer.phoneBlock.main){
          let pers: Person = new Person();
          pers.phoneBlock.main =  "+"+ this.offer.phoneBlock;
          this._personService.save(pers).subscribe(
            data => {
              this.offer.person = data;
              this.offer.personId = data.id;
              let tabSys = this._hubService.getProperty('tab_sys');
              tabSys.addTab('person', {person: this.offer.person});
            }
          );
        }
      }
      else if(evt.event == "add_to_company"){
        if(!this.offer.person && !this.offer.company && this.offer.phoneBlock.main){
          let org: Organisation = new Organisation();
          org.phoneBlock =  this.offer.phoneBlock;

          this._organisationService.save(org).subscribe(
            data => {
              this.offer.company = data;
              this.offer.companyId = data.id;
              let tabSys = this._hubService.getProperty('tab_sys');
              tabSys.addTab('organisation', {organisation: this.offer.company});
            }
          );
        }
      } else if(evt.event == "del_agent"){
        this.offer.agentId = null;
        this.offer.agent = null;
        this._offerService.save(this.offer);
      } else if(evt.event == "del_obj"){

      } else if(evt.event == "check"){

      } else {
        this._offerService.save(this.offer);
      }
  }

}
