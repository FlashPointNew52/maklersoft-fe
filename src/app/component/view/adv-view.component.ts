import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {OfferService} from '../../service/offer.service';
import {Offer} from '../../entity/offer';
import {Request} from '../../entity/request';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AsyncSubject, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import {Utils} from '../../class/utils';
import {User} from '../../entity/user';
import {SocialService} from "../../service/social.service";
declare var VK: any;

@Component({
    selector: 'adv-view',
    inputs: ['offers', 'editMode', 'mode', 'request'],
    styles: [`
        .block-title{
            position: absolute;
            left: calc(50% - 100px);
            top: -75px;
            display: flex;
        }
        .block-title div{
            margin-right: 15px;
            font-size: 20px;
        }
        .adv_header{
            color: #244f2e;
            background-color: #8bb18e;
            height: 40px;
            font-size: 12px;
            align-items: center;
            padding-left: 20px;
            display:none;
        }
        .adv_header.open{
            display: flex;
        }
        .adv_body{
            height: calc(100% - 117px);
            padding: 0 0 30px 0;
            width: 100%;
            display: none;
        }
        .adv_body.open{
            display: block
        }

        .adv_body > div{
            height: 40px;
            background-color: #5fa55a;
            color: white;
            font-size: 12px;
            padding-left: 20px;
            line-height: 45px;
        }

        .button{
            width: 18px;
            height: 18px;
            margin: 10px auto;
            border: 1px solid #BAD1BC;
        }

        .edit_button {
            border: 1px solid rgba(224, 224, 224, 1);
        }

        .button > div{
            display: none;
            width: 25px;
            height: 25px;
            background-image: url(../../../assets/check.png);
            background-size: 100% 100%;
            position: relative;
            top: -7px;
            left: 1px;
        }
        .button > div.clicked{
            display: block;
        }
        .name{
            font-size: 12px;
            color: var(--color-adv-gr1);
            text-align: left;
        }

        table{
            width: 100%;
            display: block;
            height: 100%;
        }

        thead, tbody{
            display: block;
        }

        tbody tr:nth-child(odd){
            background-color: #ffffff;
        }

        tbody tr:nth-child(even){

        }

        tr{
            display: flex;
            height: 35px;
            padding: 0 10px 0 20px;
            line-height: 35px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f7f7f7;
        }

        tbody{
            overflow: auto;
            height: calc(100% - 35px);
        }

        thead tr{
            color: #516B52;
            font-size: 10px;
            background-color: #BAD1BC;
        }

        thead tr td {
            font-size: 12px;
            color: var(--color-adv-gr1);
        }

        tr td  {
            flex: 0 0 15%;
            text-align: center;
        }

        tr td:first-child {
            flex: 0 0 25%;
            text-align: left;
        }
        .change{
            width: calc(100vw - 370px - 30px);
            padding-right: 30px;
            margin-left: 370px;
            text-align: end;
            color: var(--color-adv-gr1);
            margin-bottom: 21px;
        }
        .adv-buttons-mode{
            display: flex;
            margin-bottom: 30px;
        }
        .adv-button{
            flex: 0 0 25%;
            border: 1px solid var(--color-adv-gr);
            color: var(--color-adv-gr1);
            height: 35px;
            line-height: 35px;
            text-align: center;
            cursor: pointer;
        }
        .adv-button.selected, .adv-button:hover{
            background-color: var(--color-adv-gr);
            color: white;
            border-right: 1px solid white !important;
        }

        .adv-button:first-child{
            border-right: 1px solid var(--color-adv-gr);
        }

        .adv-button:nth-child(2n){
            border-left: none;
        }
        .adv-button:last-child{
            border-left: none;
            border-right: 1px solid var(--color-adv-gr);
        }
        .adv-button.soc{
            border-left: none !important;
        }
        /*.adv-button.soc.selected{*/
        /*    border-right: 1px solid white !important;*/
        /*}*/
        /* .adv-button.soc:hover{*/
        /*    border-right: 1px solid var(--color-adv-gr) !important;*/
        /*}*/
        .block-title{
            position: absolute;
            left: calc(50% - 100px);
            top: -75px;
            display: flex;
        }
        .block-title div:first-child{
            margin-right: 15px;
        }
        .block-title div{
            font-size: 20px;
        }
        .soc_block{
            height: 40px;
            width: 100%;
            display: flex;
            padding: 0 15px 0 20px;
            align-items: center;
        }
        .socs > .back{
            background-color: white;
        }
        .back.sticked{
            position: sticky;
            position: -webkit-sticky;
            top: 0;
        }
        .socs > .back:nth-child(2n){
            background-color: #f6f8f7;
        }
        .soc_block img{
            width: 22px;
            height: 22px;
            border-radius: 11px;
            margin-right: 20px;
        }
        .soc_block > div {
            color: #244f2e;
        }
        .soc_block:hover, .soc_block > div:hover{
            cursor: pointer;
        }
        .name { width: 150px;}
        .date { width: 190px;}
        .arrow{
            width: 30px;
            height: 20px;
            display: none;
        }
        .back:hover .arrow, .arrow.selected{
            display: block;
        }
        .arrow > .line:first-child{
            height: 2px;
            width: 13px;
             background-color: #8DA390;
            transform: rotate(47deg) translate(10px, 5px);
        }
        .arrow > .line:last-child{
            height: 2px;
            width: 13px;
            background-color: #8DA390;
            transform: rotate(-47deg) translate(2px, 15px);
        }
         .line.first-active{
            transform: rotate(-47deg) translate(-6px, 10px) !important;
        }
        .line.last-active{
            transform: rotate(47deg) translate(15px, -2px) !important;
        }
        .more-adv{
            height: calc(120px + 60px * 8);
            background-color: white;
            overflow: hidden;
            display: none;
        }
        .more-adv.open{
            display: unset;
        }
        .socs{
            display: none;
            flex-direction: column;
            width: 100%;
            height: calc(100% - 100px);
            overflow-y: auto;
        }
        .socs.open{
            display: flex;
        }
        .main-adv{
            height: 100%;
            width: calc(100% - 370px);
            margin-left: 370px;
            padding: 20px 30px 0 30px;
        }
        .carousel-block{
            height: 120px;
            display: flex;
            align-items: center;
            width: 100%;
        }
        .objects {
            overflow: hidden;
            flex: 0 0 calc(100% - 122px);
            height: 95px;
        }
        .carousel {
            display: none;
            transform-origin: 0 0;
            width: 100%;
            height: auto;
                background-color: white;
        }

        .carousel.open {
            display: flex;
            align-items: center;
            -webkit-animation: fade ease-in 0.3s;
            animation: fade ease-in 0.3s;
        }
        .carousel ul {
            width: 9999px;
            margin: 0;
            padding: 0;
            list-style: none;
            transition: margin-left 250ms;
            font-size: 0;
        }

        .carousel li {
            display: inline-block;
        }
        li div:hover, .radio-button:hover{
            cursor: pointer;
        }
        .carousel-arrowL, .carousel-arrowR{
            width: 61px;
            height: 120px;
        }
        .car-line{
            width: 40px;
            height: 2px;
            background-color: #D8E0D9;
        }
        .carousel-arrowL:hover > .car-line, .carousel-arrowR:hover > .car-line{
            background-color: #8DA390;
        }
        .carousel-arrowL > .car-line:first-child{
            transform: rotate(60deg) translate(67px,33px);
        }
        .carousel-arrowL > .car-line:last-child{
            transform: rotate(-60deg) translate(-30px,23px);
        }
        .carousel-arrowR > .car-line:first-child{
            transform: rotate(-60deg) translate(-56px,58px);
        }
        .carousel-arrowR > .car-line:last-child{
            transform: rotate(60deg) translate(46px,1px);
        }
        .groups{
            height: calc(60px * 8);
                background-color: white;
        }
        .head-groups{
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 30px 0 60px;
            border-top: 1px solid #D8E0D9;
        }
        .radio-button{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 10px;
            border: 1px solid #b2c1b4;
            margin-left: 20px;
            margin-right: 15px;
        }
        .radio-button:first-child{
            margin-left: 0;
        }
        .radio-circle{
            background-color: #69866d;
            width: 10px;
            height: 10px;
            border-radius: 6px;
        }
        .group-box{
            height: 55px;
            display: flex;
            width: 100%;
            align-items: center;
            font-size: 14px;
        }
        .group-box:nth-child(2n+1){
            background-color: #F6f8f7;
        }
        /*.group-box.posted{*/
        /*    background-color: #F3F7F4;*/
        /*}*/

        .group-pic{
            width: 35px;
            height: 35px;
            border-radius: 25px;
            margin-left: 15px;
        }

        .head-groups > .title{
            color: #244F2E;
            margin-right: 30px;
            display: flex;
        }
        .input-groups{
            height: 30px;
            background-color: var(--box-backgroung);
            box-sizing: border-box;
            padding-left: 10px;
            font-size: 12px;
            margin-left: auto;
            border: 1px solid #D8E0D9;
            color: #244F2E;
            width: 380px;
        }
        .input-groups::placeholder{
            color: #8DA390;
            font-style: italic;
        }
        .groups-container{
            width: 100%;
            max-height: calc(60px * 8);
            height: 100%;
            overflow-y: auto;
            display: none;
        }
        .groups-container.open{
            display: unset;
        }
        .groups-container.loading{
            display:flex;
            align-items: center;
            justify-content: center;
            font-family: Helvetica, sans-serif;
            font-size: 26px;
            color: #72727d;
            height: 500px;
        }
        .group-type{
            color: #69866d
        }
        .group-type:first-letter{
            text-transform: capitalize;
        }
        .group-name{
            color: #244F2E;
            font-weight: bold;
        }
        .group-type.posted, .group-name.posted,  .stamps.posted{
            color: #B2c1b4;
        }
        .stamps{
            width: 410px;
            color: #244F2E;
            display: flex;
        }
        .publish, .published{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 135px;
            height: 30px;
            color: white;
            margin: 0 30px 0 80px;
            cursor: pointer;
        }
        .publish{
            background-color: #307742;
        }
        .published{
            background-color: #b2c1b4;
        }
        .carousel-li > .block{
            height: 95px;
            width: 300px;
            margin-right: 15px;
            background-color: #d8e0d9;
        }
        
        .carousel-li > .block.selected{
            background-color: #577d60;
        }

        .car-img{
            float: left;
            width: 50px;
            line-height: 90px;
            height: 90px;
            font-size: 36px;
            text-align: center;
        }
        
        .description{
            display: flex;
            flex-direction: column;
            padding: 15px 12px 0 0;
            z-index: 6;
        }
        
        .description > div:first-child{
            height: 12px;
            line-height: 12px;
            font-weight: bold;
            color: #244F2E;
        }

        .description > div:last-child{
            color: #69866D;
            margin-top: 3px;
        }

        .block.selected .description > div:first-child, .block.selected .car-img{
            color: #f3f7f4;
        }

        .block.selected .description > div:last-child{
            color: #DCE8DD;
        }
        
        .filter-block{
            width: 300px;
            height: 80px;
            background-color: #D8E0D9;
            opacity: 0.7;
            position: absolute;
            z-index: 5;
        }
        .main-socs{
            display: none;
        }
        .main-socs.open{
            display: block;
        }

    `],
    template: `
        <div class="main-adv">
            <div class="block-title" >
                <div>ЭКСПОРТ ПРЕДЛОЖЕНИЯ В...</div>
            </div>
            <div class="block-title">
                <div *ngIf="mode == 'offer'">ЭКСПОРТ ПРЕДЛОЖЕНИЯ В...</div>
                <div *ngIf="mode == 'offer'">({{offers.length}})</div>
                <div *ngIf="mode == 'request'">ЭКСПОРТ ЗАЯВКИ В...</div>
                <div *ngIf="mode == 'request'">(1)</div>
            </div>
            <div class="adv-buttons-mode">
                <div class="adv-button" (click)="button_mode = 'adv_areas';cur_arr = platforms"
                     [class.selected]="button_mode == 'adv_areas'">{{button_names.adv_areas}}</div>
                <div class="adv-button" (click)="button_mode = 'adv_social'; "
                     [class.selected]="button_mode == 'adv_social'">{{button_names.adv_social}}</div>
                <div class="adv-button soc" (click)="button_mode = 'adv_messenger';cur_arr = messengers"
                     [class.selected]="button_mode == 'adv_messenger'">{{button_names.adv_messenger}}</div>
                <div class="adv-button" (click)="button_mode = 'adv_email'; "
                     [class.selected]="button_mode == 'adv_email'">{{button_names.adv_email}}</div>
            </div>
            <div class="adv_body" [class.open]="button_mode == 'adv_areas' || button_mode == 'adv_messenger'">
                <table cellspacing="0">
                    <thead>
                    <tr>
                        <td width='25%'>ИСТОЧНИКИ</td>
                        <td width='15%'>НЕДЕЛЯ</td>
                        <td width='15%'>2 НЕДЕЛИ</td>
                        <td width='15%'>3 НЕДЕЛИ</td>
                        <td width='15%'>МЕСЯЦ</td>
                        <td width='15%'>РУЧНОЙ РЕЖИМ</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let platform of cur_arr; let i=index">
                        <td width='25%'>
                            <div class="name">{{platform.name}}</div>
                        </td>
                        <td width='15%' (click)="platform.select = !platform.select">
                            <div class='button' [class.edit_button]="editMode">
                                <div [class.clicked]="platform.select"></div>
                            </div>
                        </td>
                        <td width='15%' (click)="platform.select2 = !platform.select2">
                            <div class='button' [class.edit_button]="editMode">
                                <div [class.clicked]="platform.select2"></div>
                            </div>
                        </td>
                        <td width='15%' (click)="platform.select3 = !platform.select3">
                            <div class='button' [class.edit_button]="editMode">
                                <div [class.clicked]="platform.select3"></div>
                            </div>
                        </td>
                        <td width='15%' (click)="platform.select4 = !platform.select4">
                            <div class='button' [class.edit_button]="editMode">
                                <div [class.clicked]="platform.select4"></div>
                            </div>
                        </td>
                        <td width='15%' (click)="platform.select5 = !platform.select5">
                            <div class='button' [class.edit_button]="editMode">
                                <div [class.clicked]="platform.select5"></div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="adv_header"
                 [class.open]="button_mode == 'adv_social'">                  {{button_names[button_mode]}}              </div>
            <div class="socs" [class.open]="button_mode == 'adv_social'">
                <div *ngFor="let group of soc_pages; let i = index" class="back" [class.sticked]="soc_active_num == i">
                    <div class="soc_block" (click)="group.active = !group.active; checklast();get_user_info_vk(i); group_mode = 1;" [ngStyle]="!group.active ? {'background-color':''} : {'background-color': '#BAD1BC'}"><img src="{{group.img}}"/>
                        <div class="name">{{group.name}}</div>
                        <div class="date">{{cur_date}}</div>
                        <div style="flex-grow: 1">Опубликовано постов:  {{group.counter}} из 50</div>
                        <div class="arrow" [class.selected]="group.active">
                            <div class="line" [class.first-active]="group.active"></div>
                            <div class="line" [class.last-active]="group.active"></div>
                        </div>
                    </div>
                    <div class="more-adv" [class.open]="group.active">
                        <div class="carousel open" id="carousel">
                            <div class="carousel-arrowL" (click)="prev(i)">
                                <div class="car-line"></div>
                                <div class="car-line"></div>
                            </div>
                            <div class="objects">
                                <ul id="carousel-ul{{i}}" *ngIf="stampsArr.length != 0">
                                    <li *ngFor="let stamp_block of stampsArr; let q = index" class="carousel-li carousel-li{{i}}" (click)="stamp = q+1">
                                        <div class="block" [class.selected]="stamp == q+1" >
                                            <div class="car-img">{{q+1}}</div>
                                            <div class="description">
                                                <div>{{stamp_block.name}}</div>
                                                <div>{{stamp_block.description}}</div>
                                            </div>
                                        </div>

                                    </li>
                                </ul>
                            </div>
                            <div class="carousel-arrowR" (click)="next(i)">
                                <div class="car-line"></div>
                                <div class="car-line"></div>
                            </div>
                        </div>
                        <div class="groups">
                            <div class="head-groups">
                                <div class="radio-button" (click)="group_mode = 1;loading();get_user_info_vk(i);stamp = 0;">
                                    <div class="radio-circle" *ngIf="group_mode == 1"></div>
                                </div>
                                <div class="title">МОЯ СТРАНИЦА</div>
                                <div class="radio-button" (click)=" group_mode = 2;loading();get_groups_vk(i);stamp = 0;">
                                    <div class="radio-circle" *ngIf="group_mode == 2"></div>
                                </div>
                                <div class="title" *ngIf="i != 3">МОИ ГРУППЫ <div style="margin-left: 10px"></div></div>
                                <div class="title" *ngIf="i == 3">МОИ ГРУППЫ <div style="margin-left: 10px">{{groups.length == 0 ? '' : '(' + groups.length + ')'}}</div></div>
                                <div class="radio-button" (click)="group_mode = 3;loading();stamp = 0;">
                                    <div class="radio-circle" *ngIf="group_mode == 3"></div>
                                </div>
                                <div class="title" *ngIf="i != 3">ОПУБЛИКОВАНО <div style="margin-left: 10px"></div></div>
                                <div class="title" *ngIf="i == 3">ОПУБЛИКОВАНО <div style="margin-left: 10px">{{group.counter == 0 ? '' : '(' + group.counter + ')'}}</div></div>

                                <input type="text" class="input-groups" placeholder="Введите запрос" [style.width]="'380px'"
                                       style="margin-left: auto"><span class="find_icon" style="position: relative; top: -15px;"></span>
                            </div>
                            <div class="groups-container" [class.loading]="groups.length == 0 && group_mode == 2 && i == 3">
                                {{load_text}}
                            </div>
                            <div class="groups-container" [class.open]="groups.length != 0 && group_mode == 2 && i == 3">
                                <div *ngFor="let gr of groups" class="group-box"
                                     [class.posted]="gr?.stamps.indexOf(this.stamp) != -1">
                                    <div class="group-pic"
                                         [ngStyle]="gr?.stamps.indexOf(this.stamp) != -1 ? {'background-image' : 'linear-gradient(45deg,  rgba(117, 128, 119, 0.65), rgba(117, 128, 119, 0.65)), url(' + gr?.href + ')', 'opacity' : '0.55'} : {'background-image' : 'url(' + gr?.href + ')'}"
                                         ></div>
                                    <div style="display: flex; flex-direction: column;     padding-left: 40px; flex-grow: 1">
                                        <span class="group-type" [class.posted]="gr?.stamps.indexOf(this.stamp) != -1">{{gr.type}}</span> <span class="group-name" [class.posted]="gr?.stamps.indexOf(this.stamp) != -1">{{gr.name}}</span>
                                    </div>
                                    <div class="stamps"><div [ngStyle]="gr?.stamps.indexOf(this.stamp) != -1 ? {'color' : '#BAD1BC'} : { 'color': ''}">{{gr.stamp_names}}</div></div>
                                    <div class="publish" (click)="sendInGroup(gr, i)" *ngIf="gr?.stamps.indexOf(this.stamp) == -1">
                                        ОПУБЛИКОВАТЬ
                                    </div>
                                    <div class="published" *ngIf="gr?.stamps.indexOf(this.stamp) != -1">ОПУБЛИКОВАНО</div>
                                </div>
                            </div>
                            <div class="groups-container open" *ngIf="user_info_vk.id != 0 && group_mode == 1 && i == 3">
                                <div class="group-box" [class.posted]="user_info_vk.stamps.indexOf(this.stamp) != -1">
                                    <div class="group-pic" [ngStyle]="user_info_vk.stamps.indexOf(this.stamp) != -1 ? {'background-image' : 'linear-gradient(45deg,  #307742a6, #307742a6), url(' + user_info_vk.href + ')', 'opacity' : '0.55'} : {'background-image' : 'url(' + user_info_vk.href + ')'} "></div>
                                    <div style="display: flex; flex-direction: column;     padding-left: 40px; flex-grow: 1"><span
                                            class="group-type" [class.posted]="user_info_vk.stamps.indexOf(this.stamp) != -1">Моя страница</span> <span
                                            class="group-name" [class.posted]="user_info_vk.stamps.indexOf(this.stamp) != -1">{{user_info_vk?.last_name}} {{user_info_vk.first_name}}</span></div>
                                   <div class="stamps"><div [ngStyle]="user_info_vk.stamps.indexOf(this.stamp) != -1 ? {'color' : '#BAD1BC'} : { 'color': ''}">{{user_info_vk.stamp_names}}</div></div>
                                    <div class="publish" (click)="user_info_vk.published = true"
                                         *ngIf="user_info_vk.stamps.indexOf(this.stamp) == -1" (click)="sendToPage(user_info_vk, i)">
                                        ОПУБЛИКОВАТЬ
                                    </div>
                                    <div class="published" *ngIf="user_info_vk.stamps.indexOf(this.stamp) != -1">ОПУБЛИКОВАНО</div>
                                </div>
                            </div>
                            <div class="groups-container" [class.loading]="group_mode == 3 && i == 3">
                                Ничего не найдено
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>      `
})

export class AdvView implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('canvas', { static: true })
    timer: any;
    canvas: ElementRef<HTMLCanvasElement>;
    cur_date =  Utils.getDateForPhoto(Date.now()/1000);
    groups = [];
    group_mode = 0;
    ctx: any;
    downloadedImg: any;
    offers: Offer[] = [];
    user: User;
    request: Request;
    mode: any;
    stamp = 0;
    cur_arr: any;
    widthStamp = 315; // ширина отзыва
    countStamp = 1; // количество отзывов
    positionStamp = 0;
    stampsArr = [];
    soc_pages = [
        {
            name: "Одноклассники",
            img: "../../../assets/socials/ok.png",
            active: false,
            counter: Number.parseInt(localStorage.getItem('ok_counter'), 10),
            stampsPos: 0
        },
        {
            name: "Фейсбук",
            img: "../../../assets/socials/facebook.png",
            active: false,
            counter: Number.parseInt(localStorage.getItem('facebook_counter'), 10),
            stampsPos: 0
        },
        {
            name: "Твиттер",
            img: "../../../assets/socials/twitter.png",
            active: false,
            counter: Number.parseInt(localStorage.getItem('twitter_counter'), 10),
            stampsPos: 0
        },
        {
            name: "Вконтакте",
            img: "../../../assets/socials/vk.png",
            active: false,
            counter: Number.parseInt(localStorage.getItem('vk_counter'), 10),
            stampsPos: 0
        },
    ];
    messengers: any[]=[
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'WhatsApp'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Viber'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Telegram'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Skype'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Facebook Messenger'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Hangouts Google'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Veon'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'ICQ'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Google Talk'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Mail.Ru Агент'},
    ];
    platforms: any[]=[
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Авито'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Презент'},
        {select: false, select1: false, select2: false, select3: false, select5: false, name: 'Из рук в руки'},
    ];
    public editMode: boolean = false;
    button_mode = 'adv_areas';
    button_names= {
        "adv_areas": "РЕКЛАМНЫЕ ПЛОЩАДКИ",
        "adv_social": "СОЦИАЛЬНЫЕ СЕТИ",
        "adv_messenger": "МЕССЕНДЖЕРЫ",
        "adv_email": "EMAIL"
    };
    soc_active_num = -1;
    load_text = "";
    load_counter = 0;
    user_info_vk = {
        id:0,
        first_name: "",
        href: "",
        last_name: "",
        published: false,
        stamps: [],
        stamp_names: ""
    };
    constructor(
        private _http: HttpClient,
        private _sessionService: SessionService,
        private _configService: ConfigService,
        private _socialService: SocialService
    ){

    }

    ngOnInit() {
        this.cur_arr = this.platforms;
        if (this.mode == 'offer') {
            this.stampsArr = [
                {
                    href: '',
                    name: "ПРЕЗЕНТАЦИЯ ОБЪЕКТА",
                    description: "Полное опиание объекта, условия, фотографии..."
                },
                {
                    href: '',
                    name: "СВОДНАЯ ИНФОРМАЦИЯ",
                    description: "Аналогичные предложения, от принципалов от посредников, сравнение по критериям..."
                },
                {
                    href: '',
                    name: "ИНФРАСТРУКТУРА",
                    description: "Наличие и расположение объекта относительно инфраструктуры... "
                },
                {
                    href: '',
                    name: "СПРОС В ЛОКАЦИИ",
                    description:"Количество показов, Отказов, Причины, Конверсия,аналогичные объекты и их цены"
                },
                {
                    href: '',
                    name: "МОЯ ПРЕЗЕНТАЦИЯ",
                    description:"Количество показов, Отказов, Причины, Конверсия,аналогичные объекты и их цены"
                },
                {
                    href: '',
                    name: "ПРЕЗЕНТАЦИЯ КОМПАНИИ",
                    description:"Количество показов, Отказов, Причины, Конверсия,аналогичные объекты и их цены"
                }
            ];
        }
        if (this.mode == 'request') {
            this.stampsArr = [
                {
                    href: '',
                    name: "Публичная страница",
                    description:"Презентация объекта "
                },
                {
                    href: '',
                    name: "Публичная страница",
                    description:"Сводная информация "
                },
                {
                    href: '',
                    name: "Публичная страница",
                    description:"Инфраструктура "
                },
                {
                    href: '',
                    name: "Публичная страница",
                    description:"Спрос в этой локации "
                },
                {
                    href: '../../../../assets/adv_img2.png',
                    name: "Публичная страница",
                    description:"Моя презентация"
                },
                {
                    href: '../../../../assets/adv_img3.png',
                    name: "Публичная страница",
                    description:"Презентация нашей компании"
                }
            ];
        }

    }
    ngAfterViewInit() {

    }

    ngOnChanges(changes: SimpleChanges) {

    }
    checklast(){
        this.soc_active_num = -1;
        for( let i = 0; i < this.soc_pages.length; i++) {
            if (this.soc_pages[i].active) {
                this.soc_active_num = i;
            }
        }
    }
    prev(index) {
        const list = document.getElementById('carousel-ul'+index) as HTMLElement;
        this.soc_pages[index].stampsPos = Math.min(this.soc_pages[index].stampsPos + this.widthStamp * this.countStamp, 0);
        list.style.setProperty('margin-left', this.soc_pages[index].stampsPos + 'px');
    }
    next(index) {
        const listElems = document.getElementsByClassName('carousel-li'+index) as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul'+index) as HTMLElement;
        this.soc_pages[index].stampsPos = Math.max(this.soc_pages[index].stampsPos - this.widthStamp * this.countStamp, -this.widthStamp * (listElems.length - this.countStamp - 1));
        list.style.setProperty('margin-left', this.soc_pages[index].stampsPos + 'px');
    }
    loading(){
        let temp;
        clearInterval(this.timer);
        if (this.group_mode == 2){
            temp = "Подождите, идет загрузка групп";
        }
        if (this.group_mode == 1){
            temp = "Подождите, идет загрузка данных страницы";
        }
        if (this.group_mode == 3){
            temp = "Подождите, идет загрузка опубликованных постов";
        }
        this.load_text = temp;
        this.timer = setInterval(event => {
            this.load_counter++;
            switch (this.load_counter) {
                case 1: this.load_text = temp;break;
                case 2: this.load_text = temp + ".";break;
                case 3: this.load_text = temp + "..";break;
                case 4: this.load_text = temp + "..."; this.load_counter = 0;break;
            }
        }, 500);
    }
    sendToPage(user, soc){
        if (this.stamp != 0) {
            if (soc == 3) {
                if (Date.now()/1000 - Number.parseInt(localStorage.getItem('vk_time'), 10) > 86400) {
                    localStorage.setItem('vk_time', (Date.now()/1000).toString());
                }
                this.soc_pages[3].counter++;
                localStorage.setItem('vk_counter', this.soc_pages[3].counter.toString());
                let stamp_name;
                switch (this.stamp) {
                    case 1: stamp_name = "Презентация объекта"; break;
                    case 2: stamp_name = "Сводная информация";break;
                    case 3: stamp_name = "Инфраструктура"; break;
                    case 4: stamp_name = "Спрос в этой локации"; break;
                    case 5: stamp_name = "Моя презентация"; break;
                    case 6: stamp_name = "Презентация нашей компании"; break;
                }
                if (this.user_info_vk.stamps.indexOf(this.stamp) == -1) {
                    if(this.user_info_vk.stamp_names.length == 0) {
                        this.user_info_vk.stamp_names = stamp_name;
                    } else {
                        this.user_info_vk.stamp_names = this.user_info_vk.stamp_names + ", " + stamp_name ;
                    }
                    this.user_info_vk.stamps.push(this.stamp);
                }
            }
        } else {
            alert("Не выбран шаблон для публикации!")
        }

    }
    sendInGroup(group, soc) {
        group.published = true;
        if (this.stamp != 0) {
            if (soc == 3) {
                let stamp_name;
                if (localStorage.getItem('vk_time') != undefined) {
                    if (Date.now()/1000 - Number.parseInt(localStorage.getItem('vk_time'), 10) > 86400) {
                        localStorage.setItem('vk_time', (Date.now()/1000).toString());
                    }
                } else {
                    localStorage.setItem('vk_time', (Date.now()/1000).toString());
                }

                this.soc_pages[3].counter++;
                localStorage.setItem('vk_counter', this.soc_pages[3].counter.toString());
                switch (this.stamp) {
                    case 1: stamp_name = "Презентация объекта"; break;
                    case 2: stamp_name = "Сводная информация";break;
                    case 3: stamp_name = "Инфраструктура"; break;
                    case 4: stamp_name = "Спрос в этой локации"; break;
                    case 5: stamp_name = "Моя презентация"; break;
                    case 6: stamp_name = "Презентация нашей компании"; break;
                }
                console.log(stamp_name);
                console.log("stamps: ",group.stamps, " cur_stamp: ", this.stamp);
                if (group.stamps.indexOf(this.stamp) == -1) {
                    if(group.stamp_names.length == 0) {
                        group.stamp_names = stamp_name;
                    } else {
                        group.stamp_names = group.stamp_names + ", " + stamp_name ;
                    }

                    group.stamps.push(this.stamp);
                }
                console.log(group);

                VK.Auth.getLoginStatus(response => {
                    if (response.status != 'connected') {
                        VK.Auth.login(response => {
                            if (response.session) {
                                console.log('expire: ' + response.session.expire);
                                console.log('mid: ' + response.session.mid);
                                console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name);
                                console.log('userDomain: ' + response.session.user.domain);

                                if (response.settings) {
                                    console.log(response.settings);
                                    // Выбранные настройки доступа пользователя если они были запрошены
                                }
                            } else {
                                // Пользователь нажал кнопку Отмена в окне авторизации
                            }
                        }, VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS);
                    } else {
                        console.log(response);
                        if (response.session) {
                            let post_text;
                            let obj: any;
                            if (this.mode == 'offer') {
                                obj = this.offers[0];
                                let apart_type = '', rooms = '', square = '', conveniencesShort = '', floor = '', price = '';
                                switch (obj.typeCode) {
                                    case 'room':
                                        apart_type = 'Комната ';
                                        break;
                                    case 'apartment':
                                        apart_type = 'Квартира ';
                                        break;
                                    case 'house':
                                        apart_type = 'Дом ';
                                        break;
                                    case 'dacha':
                                        apart_type = 'Дача ';
                                        break;
                                    case 'cottage':
                                        apart_type = 'Коттедж ';
                                        break;
                                }
                                if (obj.roomsCount != undefined) {
                                    rooms = obj.roomsCount + ' комнатная';
                                }
                                if (obj.squareTotal != undefined) {
                                    square = 'Площадь ' + obj.squareTotal + ' кв.м \n';
                                }

                                if (obj.conditions.bedding && obj.conditions.kitchen_furniture && obj.conditions.living_room_furniture) {
                                    conveniencesShort += 'Мебель да\n';
                                } else if (obj.conditions.bedding || obj.conditions.kitchen_furniture || obj.conditions.living_room_furniture) {
                                    conveniencesShort += 'Мебель частично\n';
                                } else {
                                    conveniencesShort += 'Мебель нет\n';
                                }

                                if (obj.conditions.refrigerator && obj.conditions.washer &&
                                    obj.conditions.dishwasher && obj.conditions.microwave_oven &&
                                    obj.conditions.air_conditioning && obj.conditions.tv) {
                                    conveniencesShort += 'Бытовая техника да\n';
                                } else if (obj.conditions.refrigerator || obj.conditions.washer ||
                                    obj.conditions.dishwasher || obj.conditions.microwave_oven ||
                                    obj.conditions.air_conditioning || obj.conditions.tv) {
                                    conveniencesShort += 'Бытовая техника частично\n';
                                } else {
                                    conveniencesShort += 'Бытовая техника нет\n';
                                }

                                if (obj.floor != undefined && obj.floorsCount == undefined) {
                                    floor = 'Этаж ' + obj.floor + '\n';
                                }
                                if (obj.floor != undefined && obj.floorsCount != undefined) {
                                    floor = 'Этаж ' + obj.floor + '\\' + obj.floorsCount + '\n';
                                }
                                if (obj.price != undefined) {
                                    price = obj.price + '/мес ';
                                }

                                post_text = obj.addressBlock.street + ' ' + obj.addressBlock.building + '\n' +
                                    obj.addressBlock.city + ', ' + obj.addressBlock.admArea + price + '\n' +
                                    'ОПИСАНИЕ ПРЕДЛОЖЕНИЯ\n' +
                                    apart_type + ' ' + rooms + '\n' +
                                    floor +
                                    square +
                                    'УСЛОВИЯ ПРОЖИВАНИЯ\n' +
                                    conveniencesShort +
                                    '\n' +
                                    // "http://dev.makleronline.net/#/d" + "\n" +
                                    '#арендаквартирХабаровск#сдамквартирувХабаровске#недвижимостьХабаровск#сдамснимуквартируХабаровск#арендаkhv#аренданедвижимости\n'
                                ;
                            }
                            if (this.mode == 'request') {
                                post_text = '';
                            }



                            console.log('photos: ', obj.photos);
                            console.log('post_text: ', post_text);
                            if (this.mode == 'offer' && obj.photos != undefined && obj.photos.length != 0) {
                                VK.Api.call('photos.getWallUploadServer', {uid: response.session.mid, v: '5.101'}, answer => {
                                    console.log('get answer: ', answer);
                                    let attachs = [];
                                    let phlen = 0;
                                    if (obj.photos.length < 6) {
                                        phlen = obj.photos.length;
                                    } else {
                                        phlen = 6;
                                    }
                                    for (let i = 0; i < phlen; i++) {
                                        console.log(i, ' photo ', obj.photos[i].href);
                                        this._socialService.publish(obj.photos[i].href, answer.response.upload_url, i).pipe(
                                            map((res: Response) => res)).subscribe(
                                            raw => {
                                                let data = JSON.parse(JSON.stringify(raw));
                                                console.log(data);
                                                if (data.server != undefined) {
                                                    let server = JSON.parse(JSON.stringify(data.server));
                                                    let photo = JSON.parse(JSON.stringify(data.photo));
                                                    let hash = JSON.parse(JSON.stringify(data.hash));
                                                    VK.Api.call('photos.saveWallPhoto', {
                                                        server: server,
                                                        photo: photo,
                                                        hash: hash,
                                                        v: '5.101'
                                                    }, (d) => {
                                                        console.log(d);
                                                        let data = JSON.parse(JSON.stringify(d));
                                                        attachs.push('photo' + response.session.mid + '_' + data.response[0].id);
                                                        console.log('attachs: ', attachs.length, ' objs: ', phlen);
                                                        if (attachs.length == phlen) {
                                                            let attachsStr = '';
                                                            for (let i = 0; i < attachs.length; i++) {
                                                                if (i < 9) {
                                                                    attachsStr += attachs[i] + ',';
                                                                }
                                                            }
                                                            attachsStr += 'http://dev.makleronline.net:8089/#/main';
                                                            console.log(attachsStr);
                                                            attachsStr = attachsStr.slice(0, attachsStr.length - 1);
                                                            VK.Api.call('wall.post', {
                                                                owner_id: response.session.mid,
                                                                message: post_text,
                                                                v: '5.101',
                                                                attachments: attachsStr
                                                            }, () => {
                                                                // alert("Post ID:" + data.response.post_id);
                                                            });
                                                        }
                                                    });
                                                }
                                            },
                                            err => console.log(err)
                                        );
                                    }
                                }, onerror);
                            } else {
                                VK.Api.call('wall.post', {
                                    owner_id: response.session.mid,
                                    message: post_text,
                                    v: '5.101'
                                }, (data) => {
                                    alert('Post ID:' + data.response.post_id);
                                });
                            }
                        } else {
                            alert('Для публикации записи необходимо авторизоваться через вк');
                        }
                    }
                });
            }
            console.log(group);
        } else {
            alert("Не выбран шаблон для публикации!")
        }
    }
    get_user_info_vk(soc){
        this.user_info_vk = {
            id:0,
            first_name: "",
            href: "",
            last_name: "",
            published: false,
            stamps: [],
            stamp_names: ""
        };
        if (soc == 3) {

            VK.Auth.getLoginStatus(response => {
                if (response.status != 'connected') {
                    VK.Auth.login(response => {
                        if (response.session) {
                            console.log('expire: ' + response.session.expire);
                            console.log('mid: ' + response.session.mid);
                            console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name);
                            console.log('userDomain: ' + response.session.user.domain);

                            if (response.settings) {
                                console.log(response.settings);
                                // Выбранные настройки доступа пользователя если они были запрошены
                            }
                        } else {
                            // Пользователь нажал кнопку Отмена в окне авторизации
                        }
                    }, VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS);
                } else {
                    if (response.session) {
                        VK.Api.call('users.get', {
                            user_ids: response.session.mid,
                            v: '5.101',
                            fields: 'id,first_name,last_name,photo_50'
                        }, (ans) => {
                            let its = JSON.parse(JSON.stringify(ans));
                            let dataAns = its.response;
                            console.log(dataAns);
                            this.groups = [];
                            this.user_info_vk = {
                                id: dataAns[0].id,
                                first_name: dataAns[0].first_name,
                                href: dataAns[0].photo_50,
                                last_name: dataAns[0].last_name,
                                published: false,
                                stamps: [],
                                stamp_names: ""
                            };
                            console.log(this.user_info_vk);
                        });
                    } else {
                        alert('Для публикации записи необходимо авторизоваться через вк');
                    }
                }
            });
        }

    }
    get_groups_vk(soc){
        console.log(soc);
        if (soc == 3) {
            this.groups = [];
            VK.Auth.getLoginStatus(response => {
                if (response.status != 'connected') {
                    VK.Auth.login(response => {
                        if (response.session) {
                            console.log('expire: ' + response.session.expire);
                            console.log('mid: ' + response.session.mid);
                            console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name);
                            console.log('userDomain: ' + response.session.user.domain);

                            if (response.settings) {
                                console.log(response.settings);
                                // Выбранные настройки доступа пользователя если они были запрошены
                            }
                        } else {
                            // Пользователь нажал кнопку Отмена в окне авторизации
                        }
                    }, VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS);
                } else {
                    if (response.session) {
                        VK.Api.call('groups.get', {
                            user_id: response.session.mid,
                            extended: 1,
                            v: '5.101',
                            fields: 'id,name,type,photo_50'
                        }, (ans) => {
                            let its = JSON.parse(JSON.stringify(ans));
                            let dataAns = its.response;
                            console.log(dataAns);
                            console.log(dataAns.items);
                            this.groups = [];
                            if (dataAns.items.length == 0) {
                                clearInterval(this.timer);
                                this.load_text = "Ничего не найдено"
                            }
                            for (let q = 0; q < dataAns.items.length; q++) {
                                let type = '', closed = '';
                                switch (dataAns.items[q].type) {
                                    case 'group':
                                        type = 'группа';
                                        break;
                                    case 'page' :
                                        type = 'публичная страница';
                                        break;
                                    case 'event':
                                        type = 'мероприятие';
                                        break;
                                }
                                switch (dataAns.items[q].is_closed) {
                                    case 0:
                                        closed = 'oткрытое';
                                        break;
                                    case 1:
                                        closed = 'закрытое';
                                        break;
                                    case 2:
                                        closed = 'частное';
                                        break;
                                }
                                this.groups.push({
                                    id: -dataAns.items[q].id,
                                    type: type,
                                    name: dataAns.items[q].name,
                                    href: dataAns.items[q].photo_50,
                                    is_closed: closed,
                                    published: false,
                                    stamps: [],
                                    stamp_names: ""
                                });
                            }
                            console.log(this.groups);
                        });
                    } else {
                        alert('Для публикации записи необходимо авторизоваться через вк');
                    }
                }
            });
        }

    }
    change_mode(){
        this.editMode = !this.editMode;
    }
    downloadFile(url, upload) {
        return this._http.get(url, { responseType: 'blob', reportProgress: false}).subscribe(
            raw => {
                // console.log('You received data', raw);
                let formData = new FormData();
                let file = new File([raw], "qwerty.txt");
                formData.append('photo', file);
                this._http.post(upload, formData, {withCredentials: true, headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })}).pipe(
                    map((res: Response) => res)).subscribe(
                    raw => {
                        let data = JSON.parse(JSON.stringify(raw));
                        console.log(data);

                    },
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    }

    publishVk() {
        console.log(VK);
        VK.Auth.login(response => {
            if (response.session) {
                console.log('expire: ' + response.session.expire);
                console.log('mid: ' + response.session.mid);
                console.log('fio: ' + response.session.user.first_name + ' ' + response.session.user.last_name );
                console.log('userDomain: ' + response.session.user.domain);

                if (response.settings) {
                    console.log(response.settings);
                    // Выбранные настройки доступа пользователя если они были запрошены
                }
            } else {
                // Пользователь нажал кнопку Отмена в окне авторизации
            }
        },  VK.access.FRIENDS | VK.access.PHOTOS | VK.access.WALL | VK.access.ADS | VK.access.GROUPS  );

        VK.Auth.getLoginStatus( response => {
            console.log(response);
            if(response.session)
            {
                for (let i = 0; i < this.offers.length; i++) {
                    let obj = this.offers[i];
                    let apart_type = '', rooms = '', square = '', conveniencesShort = '', floor = '', price = '';
                    switch (obj.typeCode) {
                        case "room": apart_type = "Комната "; break;
                        case "apartment": apart_type = "Квартира "; break;
                        case "house": apart_type = "Дом "; break;
                        case "dacha": apart_type = "Дача "; break;
                        case "cottage": apart_type = "Коттедж "; break;
                    }
                    if (obj.roomsCount != undefined) { rooms = obj.roomsCount + " комнатная" }
                    if (obj.squareTotal != undefined) { square = "Площадь " + obj.squareTotal + " кв.м \n"}

                    if (obj.conditions.bedding && obj.conditions.kitchen_furniture && obj.conditions.living_room_furniture) {
                        conveniencesShort += "Мебель да\n";
                    } else if (obj.conditions.bedding || obj.conditions.kitchen_furniture || obj.conditions.living_room_furniture) {
                        conveniencesShort += "Мебель частично\n";
                    } else {
                        conveniencesShort += "Мебель нет\n";
                    }

                    if (obj.conditions.refrigerator && obj.conditions.washer &&
                        obj.conditions.dishwasher && obj.conditions.microwave_oven &&
                        obj.conditions.air_conditioning && obj.conditions.tv) {
                        conveniencesShort += "Бытовая техника да\n";
                    } else if (obj.conditions.refrigerator || obj.conditions.washer ||
                        obj.conditions.dishwasher || obj.conditions.microwave_oven ||
                        obj.conditions.air_conditioning || obj.conditions.tv) {
                        conveniencesShort += "Бытовая техника частично\n";
                    } else {
                        conveniencesShort += "Бытовая техника нет\n";
                    }

                    if (obj.floor != undefined && obj.floorsCount == undefined) {
                       floor = "Этаж " + obj.floor + "\n";
                    }
                    if (obj.floor != undefined && obj.floorsCount != undefined) {
                        floor = "Этаж " + obj.floor + "\\" + obj.floorsCount + "\n";
                    }
                    if (obj.price != undefined) {
                        price = obj.price + "/мес ";
                    }

                    let post_text = obj.addressBlock.street + " " + obj.addressBlock.building + "\n" +
                                    obj.addressBlock.city + ", " + obj.addressBlock.admArea + price + "\n" +
                                    "ОПИСАНИЕ ПРЕДЛОЖЕНИЯ\n" +
                                    apart_type + " " + rooms + "\n" +
                                    floor +
                                    square +
                                    "УСЛОВИЯ ПРОЖИВАНИЯ\n" +
                                    conveniencesShort +
                                    "\n" +
                                    "http://dev.makleronline.net/#/d" + "\n" +
                                    "#арендаквартирХабаровск#сдамквартирувХабаровске#недвижимостьХабаровск#сдамснимуквартируХабаровск#арендаkhv#аренданедвижимости\n"
                                    ;

                    console.log('photos: ', obj.photos);
                    if (obj.photos!= undefined && obj.photos.length != 0) {
                        VK.api('photos.getWallUploadServer',{ uid:  response.session.mid, v: "5.101" }, answer =>{
                            console.log("get answer: ", answer);
                            for (let i = 0; i < obj.photos.length; i++) {

                                // let formData = new FormData();
                                let imageURL = obj.photos[i].href;
                                this.downloadFile(imageURL,answer.response.upload_url);
                                // formData.append('photo', this.downloadFile(imageURL));
                                // this._http.post(answer.response.upload_url, formData, {withCredentials: true, headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })}).pipe(
                                //     map((res: Response) => res)).subscribe(
                                //     raw => {
                                //         let data = JSON.parse(JSON.stringify(raw));
                                //         console.log(data);
                                //
                                //     },
                                //     err => console.log(err)
                                // );

                                // this.downloadedImg = new Image;
                                // this.downloadedImg.crossOrigin = "Anonymous";
                                // this.downloadedImg.src = imageURL;
                                // this.downloadedImg.addEventListener("load", () => {
                                //     let canvas = document.createElement("canvas");
                                //     let context = canvas.getContext("2d");
                                //
                                //     canvas.width = this.downloadedImg.width;
                                //     canvas.height = this.downloadedImg.height;
                                //
                                //     context.drawImage(this.downloadedImg, 0, 0);
                                //     canvas.toBlob(((blob) => {
                                //             formData.append('photo', blob);
                                //             this._http.post(answer.response.upload_url, formData, {withCredentials: true, headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })}).pipe(
                                //                 map((res: Response) => res)).subscribe(
                                //                 raw => {
                                //                     let data = JSON.parse(JSON.stringify(raw));
                                //                     console.log(data);
                                //
                                //                 },
                                //                 err => console.log(err)
                                //             );
                                //         }
                                //     ));
                                // }, false);

                                // this.loadXHR(obj.photos[i].href).then((blob: Blob) => {
                                //     formData.append('photo', blob);
                                // });

                            }

                        }, onerror);
                    } else {
                        VK.Api.call("wall.post", {owner_id: response.session.mid, message: post_text, v: "5.101"}, (data) => {
                            alert("Post ID:" + data.response.post_id);
                        });
                    }
                }

            }
            else
            {
                alert("Для публикации записи необходимо авторизоваться через вк")
            }
        });
    }
}
