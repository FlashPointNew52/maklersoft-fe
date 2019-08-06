import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {UploadService} from '../../service/upload.service';
import * as moment from 'moment/moment';
import 'moment/locale/ru.js';
import {Utils} from "../../class/utils";

@Component({
    selector: 'files-view',
    inputs: ['files', 'type', 'editMode', 'object_id', 'full'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .files_header{
            width: 100%;
            height: 55px;
            display: inline-flex;
            background-color: #fafafa;
        }

        .files_header ui-upload-file{
            width: 50%;
        }

        .files_header hr{
            margin: auto 0;
            width: 0px;
            height: 75%;
            border: 1px solid #e0e0e0;
        }

        .files_header div{
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #757575;
            box-sizing: content-box;
        }

        .files_header div span{
            height: 33px;
            font-size: 24px;
            width: 33px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin-right: 5px;
        }

        .files_body{
            background-color: whitesmoke;
            height: calc(100% - 167px);
            padding: 6px 0 0 10px;
        }

        .files_body ul, .files_body_new ul{
            list-style: none;
            padding: 0;
            margin: 0;
            overflow-y: auto;
            height: 100%;
            width: 100%;
            
        }

        .files_body ul > div{
            list-style: none;
            padding: 8px 0;
            margin: 0;
            overflow-y: auto;
            height: 100%;
        }

        .files_body ul li, .files_body_new ul li{
            width: 360px;
            height: 175px;
            float: left;
            margin: 7px;
            cursor: pointer;
            box-sizing: content-box;
        }
        .files_body ul li .container{
            height: 174px;
            width: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            overflow: hidden;
        }

        .files_body ul li .container .fog{
            filter: blur(4px);
            width: 100%;
            height: 100%;
            z-index: 0;
            position: absolute;
        }

        .files_body ul li .container img{
            height: 174px;
            object-fit: contain;
            z-index: 1;
            position: relative;
        }

        .files_body ul li > div .tools, .files_body ul li > div .tools_small{
            height: 100%;
            width: 100%;
            opacity: 0;
            background-color: rgba(66, 66, 66, 0.5);
            position: absolute;
            top: 0;
            left: 0;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
        }

        .files_body ul li > div .tools_small{
            background-color: rgba(66, 66, 66, 0);
        }

        .files_body ul li > div .tools div, .files_body ul li > div .tools_small div, .files_body ul li > div .tools a, .files_body ul li > div .tools_small a{
            height: 45px;
            width: 45px;
            background-color: rgba(66, 66, 66, 1);
            border-radius: 40px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            margin: 0 3px;
        }

        .files_body ul li > div .tools_small div, .files_body ul li > div .tools a, .files_body ul li > div .tools_small a{
            height: 60px;
            width: 60px;
        }


        .files_body ul li > div .tools_small div, .files_body ul li > div .tools_small a{
            background-color: rgb(0, 0, 0);
            filter: invert(5);
        }

        .files_body ul li > div .tools div:hover, .files_body ul li > div .tools_small div:hover, .files_body ul li > div .tools a:hover, .files_body ul li .container .tools_small a:hover{
            background-color: rgb(45, 45, 45);
        }

        .files_body ul li > div:hover .tools,  .files_body ul li > div:hover .tools_small{
            opacity: 1;
        }

        .files_body ul li span{
            color: #616161;
            font-size: 12px;
            display: block;
            width: 150px;
            margin-left: 30px;
        }
        .files_body ul li span span{
            font-size: 24px;
        }

        .files_body ul .empty_file{
            font-size: 16px;
            color: #757575;
            padding: 0;
            height: 30px;
            text-align: center;
        }

        .files_body ul li .doc_container{
            height: 100px;
            width: 306px;
            margin-left: 30px;
            position: relative;
            display: flex;
            flex-wrap: wrap;
            justify-content: left;
            overflow: hidden;
            align-items: flex-start;
        }

        .files_body ul li .doc_container span{
            color: #9E9E9E;
            font-size: 12px;
            margin-left: 0;
            width: 100%;
        }

        .files_body ul li .doc_container .time{
            height: 18px;
            margin-top: 5px;
        }

        .files_body ul li .doc_container img{
            height: 45px;
            z-index: 1;
            position: relative;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .files_body ul li .doc_container  .doc_decr{
            height: 45px;
            margin: 10px 0 0 10px;
            width: calc(100% - 55px);
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }

        .files_body ul li .doc_container  .doc_decr .file_name{
            color: #616161;
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .files_body ul li .doc_container  .doc_decr .user_name{
            color: #616161;
        }

        .files_body ul li .doc_container  .doc_decr .user_name span{
            width: calc(100% - 70px);
            float: right;
        }
        .files_body_new{
            background-color: #f2f3f4;
            height: calc(100vh - 122px);
            width: calc(100vw - 370px);
            margin-left: 370px;
            padding: 12px 30px 0 30px;
        }
        .files_body_new.full{
            width: 100vw;
            margin-left: 0;
        }
        .photo-style{
            width: 370px;
            height: 175px;
        }
        
        .photo{
            width: 100%;
            height: 175px;
            background-image: url("assets/ddd.png");
            background-size: cover;
            background-position: center;
        }
        
        .photo-style .tools{
            display: none; 
        }
        .photo-style:hover .tools{
            display: flex;
            position: relative; 
            top: -175px;
        }
        .tools{
            width: 100%;
            height: 100%;
            align-items: center; 
            justify-content: center;
        }
        .tools div{
            height: 60px;
            width: 60px;
            border-radius: 35px;
            background-color: rgba(0, 0, 0, 0.7);
            margin: 5px;
            background-size: 65% 65%;
            background-position: center;
            background-repeat: no-repeat;
        }
        .block-title{
            position: absolute;
            left: calc(50% - 100px);
            top: -75px;
        }
        .block-title div{
            font-size: 20px;
        }
        .edit-photos{
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .title-block{
            height: 30px;
            border-bottom: 1px solid var(--selected-digest);
            line-height: 30px;
            margin-top: 20px;
            margin-bottom: 13px;
            width: calc(100% - 37px);
            margin-left: 7px;
            color: var(--color-black);
            display: flex;
        }
        .title-block:first-child{
            margin-top: 13px;
        } 
        .add_author{
            margin-left: 10px;
            font-style: italic;
            color: var(--color-blue);
        }
        .gallery{
            display: none;
            position: absolute;
            width: calc(100% - 370px);
            height: calc(100vh - 122px);
            top: 0;
            left: 370px; 
            background-color: #f2f3f4; 
        }
        .gallery.open{
            display: block;
        }
        .gal-top{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 560px;
            width: 100%;
            padding: 20px 0;
        }
        .arrow-block{
            width: 120px;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .arrow-block:first-child{
            margin-left: 90px;
        }
        .arrow-block:last-child{
            margin-left: 90px;
        }
        .exit:hover, .arrow-block:hover{
            cursor: pointer;
        }
        .arrow-block .arrow-left, .arrow-block .arrow-right{
            background-image: url(/assets/arrow.png);
            width: 80px;
            height: 30px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .arrow-block .arrow-left{
            transform: rotate(90deg);
        }
        .arrow-block .arrow-right{
            transform: rotate(-90deg);
        }
        .big-photo-block{ 
            height: 100%;
            width: calc(100% - 360px);
            max-width: 950px;
        }
        .big-photo{
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;
            height: 100%;
            width: 100%;
        }
        .exit{
            position: relative;
            width: 30px;
            height: 30px;
            top: -542px;
            left: calc(100% - 60px);
            background-size: 100% 100%;
            border-radius: 15px;
        }
        .exit:hover{
            background-color: white;
        }
        .exit .line{
            width: 30px;
            height: 2px;
            background-color: #bdc0c1;
        }
        .exit .line:first-child{
            transform: rotate(-45deg) translate(-11px, 10px);
        }
        .exit .line:last-child{
            transform: rotate(45deg) translate(9px, 9px);
        }
        .bottom-gal{
            height: 135px;
            width: 856px;
            overflow: hidden;
            position: relative;
            left: calc(50% - 428px);
            top: -30px;
        }
        .bottom-gal ul{
            list-style: none; 
            padding: 0;
            margin: 0;
            height: 100%;
            width: 9999px;
            transition: margin-left 250ms;
        }
        .bottom-gal ul li{
            width: 200px;
            height: 120px;
            padding-top: 5px;
            float: left;
            margin: 7px;
            cursor: pointer;
            box-sizing: content-box;
            border-top: 6px solid #f2f3f4;
        }
        .bottom-gal ul li.clicked{
            border-top: 6px solid var(--color-blue);
        } 
        .bottom-gal .photo{
            background-size: 100%;
            width: 100% !important;
            height: 100% !important;
        }
        .gallery.full{
            width: 100%;
            left: 0;
        }
    `],
    template: `
        <div class="block-title" >
            <div>ФОТО ПРЕДЛОЖЕНИЯ {{photos.length}}</div>
        </div>
        <div class="files_body_new" [class.full]="full">
            <ul>
                <li *ngIf="editMode">
                    <ui-upload-file [type]="type"
                                    (addNewFile) = "addFile($event)" [obj_id]="object_id"
                                    (progressState) = "progressEvent($event)"
                                    [parent]="'photo'"
                    ></ui-upload-file>
                </li>
                <ng-container *ngIf="editMode">
                    <li *ngFor="let photo of photos, let i = index" class="photo-style">
                        <div class="photo" [style.background-image]="'url(' + photo.url + ')'"></div>
                        <div class="tools">
                            <div style= "background-image: url('assets/photo_icon/arrow.png');transform: rotate(180deg);" (click) = "move_up(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/arrow.png')" (click) = "move_bottom(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/cross.png');" (click) = "file_delete(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/check.png')" (click) = "file_main(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/zoom.png');" (click) = "file_show(i)"></div>
                        </div> 
                    </li>
                </ng-container>
                <div *ngIf="!editMode">
                    <div *ngFor="let obj of new_struct, let i = index" class="edit-photos">
                        <div class="title-block">{{obj.convert}} <div class="add_author">{{obj.author}}</div></div>
                        <ul>
                            <li *ngFor="let url of obj.urls, let j = index" class="photo-style">
                                <div class="photo" [style.background-image]="'url(' + url + ')'"></div>
                                <div class="tools">
                                    <div style= "background-image: url('assets/photo_icon/zoom.png');" (click) = "galleryOpenFunc(url)"></div>
                                </div>
                            </li>
                            
                        </ul>
                        
                    </div>
                </div>
            </ul>
            
        </div>
        <div class="gallery" [class.full]="full" [class.open]="galleryOpen">
            <div class="gal-top"> 
                <div class="arrow-block" (click)="prev_photo()"><div class="arrow-left"></div></div>
                <div class="big-photo-block"><div class="big-photo" [style.background-image]="'url(' + cur_photo + ')'"></div></div>
                <div class="arrow-block" (click)="next_photo()"><div class="arrow-right"></div></div>
            </div>
            <div class="exit" (click)="galleryOpen = false"><div class="line"></div><div class="line"></div></div>
            <div class="bottom-gal">
                <ul id="carousel-ul">
                    <li *ngFor="let photo of photos, let i = index" class="carousel-li" [class.clicked]="photo.url == cur_photo">
                        <div class="photo" [style.background-image]="'url(' + photo.url + ')'" (click) = "galleryOpenFunc(photo.url)"></div>
                    </li>
                </ul> 
            </div>
        </div>
<!--        <div class="files_header">-->
<!--            <ui-upload-file [type]="type" *ngIf="editMode"-->
<!--                            (addNewFile) = "addFile($event)" [obj_id]="object_id"-->
<!--                            (progressState) = "progressEvent($event)"-->
<!--            ></ui-upload-file>-->
<!--            <div *ngIf="!editMode" style= "font-size: 10px;padding-left: 18px; color: #9e9e9e;">-->
<!--                Для добавления, редактирования фотографий нажмите  "Изменить"-->
<!--            </div>-->
<!--            <hr>-->
<!--            <div>-->
<!--                <span [style.background-image]= "type == 'image' ? 'url(assets/photo.png)' : 'url(assets/docum.png)'"-->
<!--                ></span><span>{{files.length}}</span>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="files_body">-->
<!--            <ul>-->
<!--                <div *ngIf="files.length == 0" class="empty_file">-->
<!--                    {{type == 'image' ? "НЕТ ДОБАВЛЕННЫХ ФОТО" : "НЕТ ДОБАВЛЕННЫХ ДОКУМЕНТОВ"}}-->
<!--                </div>-->
<!--                <li *ngFor="let file of files; let i = index"-->
<!--                >-->
<!--                    <div class="container" *ngIf="type == 'image'">-->
<!--                        <div class="fog" [style.background-image]="'url('+file+')'"></div>-->
<!--                        <img [src]="file">-->
<!--                        <div class="tools" *ngIf="editMode">-->
<!--                            <div style= "background-image: url('assets/photo_icon/arrow.png');transform: rotate(180deg);" (click) = "move_up(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/arrow.png')" (click) = "move_bottom(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/cross.png');background-size: 70%;" (click) = "file_delete(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/check.png')" (click) = "file_main(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;" (click) = "file_show(i)"></div>-->
<!--                        </div>-->
<!--                        <div class="tools_small" *ngIf="!editMode">-->
<!--                            <div style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;" (click) = "file_show(i)"></div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <span *ngIf="type == 'image'" style= "font-size: 10px; margin-top: 5px;">Создано:</span>-->
<!--                    <span *ngIf="type == 'image'" >Вчера 13:00</span>-->
<!--                    <div class="doc_container" *ngIf="type == 'document'">-->
<!--                        <span class="time">{{getFileDate(file)}}</span>-->
<!--                        <img src="assets/docum_file.png">-->
<!--                        <div class="doc_decr">-->
<!--                            <span class="file_name">{{getFileName(file)}}</span>-->
<!--                            <span class="user_name">Добавлено-->
<!--                                <span class="link">{{users[file]?.name || 'Неизвестно'}}</span>-->
<!--                            </span>-->
<!--                        </div>-->
<!--                        <div class="tools" *ngIf="editMode">-->
<!--                            <div style= "background-image: url('assets/photo_icon/arrow.png');transform: rotate(180deg);" (click) = "move_up(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/arrow.png')" (click) = "move_bottom(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/cross.png');background-size: 70%;" (click) = "file_delete(i)"></div>-->
<!--                            <div style= "background-image: url('assets/photo_icon/check.png')" (click) = "file_main(i)"></div>-->
<!--                            <a [href]="file" target="_blank" style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;"></a>-->
<!--                        </div>-->
<!--                        <div class="tools_small" *ngIf="!editMode">-->
<!--                            <a [href]="file" target="_blank" style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;"></a>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
    `
})

export class FilesView implements OnInit, OnChanges {
    public files: any[] = [];
    public galleryOpen: boolean = false;
    public type: string = 'image';
    public editMode: boolean = false;
    public full: boolean = false;
    public object_id: Number;
    cur_photo : any;
    widthReview = 214;
    count = 1;
    position = 0;
    cur_index: any;
    users: any= {};
    new_struct = [{"date": Number, "urls": [], "convert": "", "author": ""}];
    photos: any = [ {"url": "https://avatars.mds.yandex.net/get-pdb/163339/7eaf6e1b-a165-42f5-845a-e413949391ae/s1200", "add_date": 1563877357, "author": "ИВАНОВ Иван Иванович"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/33827/a70114b9-834a-4e70-be18-31e81a1c4450/s1200", "add_date": 1563877357, "author": "ИВАНОВ Иван Иванович"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/34158/546eafd4-9d82-478e-8c33-763de0c27903/s1200", "add_date": 1563877156, "author": "ИВАНОВ Иван Иванович"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/163339/191ed1e0-2525-4b2c-ac25-2c47b1d93672/s1200", "add_date": 1563809436, "author": "ПИРОЖКОВ Сергей Андреевич"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/163339/fc4881b6-1222-402e-9137-e68d39fe5be1/s1200", "add_date": 1563809436, "author": "ИВАНОВ Иван Иванович"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/33827/b6f86116-a834-481f-8918-2b2945e7b626/s1200", "add_date": 1563809436, "author": "ИВАНОВ Иван Иванович"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/1412212/e96e89d1-5eff-4444-a0d8-96ea2600ca32/s1200", "add_date": 1563650196, "author": "ПИРОЖКОВ Сергей Андреевич"},
        {"url": "https://avatars.mds.yandex.net/get-pdb/251121/c9013acb-9834-43b0-8e8d-dab875f150b1/s1200", "add_date": 1563650196, "author": "ПИРОЖКОВ Сергей Андреевич"}];

    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() fileIndexClick: EventEmitter<any> = new EventEmitter();
    @Output() progressLoad: EventEmitter<any> = new EventEmitter();

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
        private _userService: UserService,
        private ref: ChangeDetectorRef
    ){
        moment.locale("ru");
    }

    ngOnInit(){
        if(!this.files)
            this.files=[];
        if(this.type != 'image'){
            this.getAddUser();
        }
        this.sortPhotos(this.photos);
    }

    ngOnChanges(changes: SimpleChanges) {
        if(!this.files)
            this.files=[];
        if(this.type != 'image'){
            this.getAddUser();
            console.log('Update');
        }
    }
    galleryOpenFunc( url){
        this.galleryOpen = true;
        this.cur_photo = url;
        this.cur_index = 0;
        for (let i = 0; i < this.photos.length; i++) {
            if (this.photos[i].url == url)  this.cur_index = i;
        }
        this.position = 0;
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;

        if ( this.photos.length - this.cur_index < 4) this.cur_index = this.photos.length - 3;
        if (this.cur_index <= 0) this.cur_index = 1;
        this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count - 3)) * this.cur_index - 1;
        list.style.setProperty('margin-left', this.position + 'px');
    }
    prev_photo() {
        if (this.cur_index != 0) {
            this.cur_index--;
        }
        this.cur_photo = this.photos[this.cur_index].url;
        console.log(this.cur_photo);
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.min(this.position + this.widthReview * this.count, 0);
        list.style.setProperty('margin-left', this.position + 'px');
    }
    next_photo() {
        if (this.cur_index != this.photos.length - 1) {
            this.cur_index++;
        }
        this.cur_photo = this.photos[this.cur_index].url;
        console.log(this.cur_photo);
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count - 3));
        list.style.setProperty('margin-left', this.position + 'px');
    }
    sortPhotos(photo_arr: any[]){
        let check: boolean;
        for (let i = 0; i < photo_arr.length; i++) {
            check = false;
            for (let j = 0; j < this.new_struct.length; j++) {
                if (this.new_struct[j].date == photo_arr[i].add_date && this.new_struct[j].author == photo_arr[i].author){
                    this.new_struct[j].urls.push(photo_arr[i].url);
                    check = true;
                }
            }
            if (!check) {
                this.new_struct.push({"date":photo_arr[i].add_date, "urls": [photo_arr[i].url], "convert": Utils.getDateInCalendar(photo_arr[i].add_date), "author": photo_arr[i].author});
            }
        }
        this.new_struct.splice(0,1);
    }
    addFile(ev){
        this.add.emit(ev);
    }

    file_show(i :number){
        this.fileIndexClick.emit(i);
    }

    file_delete(i){
        this.files.splice(i, 1);
    }

    move_up(i){
        if(i != 0){
            this.ref.detach();
            let temp = this.files[i-1];
            this.files[i-1] = this.files[i];
            this.files[i] = temp;
            let temp2 : HTMLElement;
            temp.style.removeProperty('backgroundColor');
            setTimeout(() => {
                this.ref.detectChanges();
            }, 100);
        }
    }

    move_bottom(i){
        if(i != this.files.length - 1){
            this.ref.detach();
            let temp = this.files[i+1];
            this.files[i+1] = this.files[i];
            this.files[i] = temp;
            setTimeout(() => {
                this.ref.detectChanges();
            }, 100);
        }
    }

    file_main(i){
        let temp = this.files[i];
        this.file_delete(i);
        this.files.unshift(temp);
    }

    progressEvent(ev){
        this.progressLoad.emit(ev);
    }

    getFileName(url){
        let ext = url.split(".").pop();
        let new_url = url.replace(ext, '');
        let data : string[] = new_url.split("/").pop().split("_");
        data.pop();
        data.pop();
        return data.join(" ") + '.' + ext;
    }

    getFileDate(url){
        let ext = url.split(".").pop();
        let new_url = url.replace(ext, '');
        let data : string[] = new_url.split("_");
        data.pop();
        let time = parseInt(data.pop(), 10)*1000;
        return moment(time).calendar();
    }

    getAddUser(){
        this.users={};
        for(let i = 0; i< this.files.length; ++i){
            let ext = this.files[i].split(".").pop();
            let new_url = this.files[i].replace("\."+ext, '');
            let data : string[] = new_url.split("_");
            let id= parseInt(data.pop(), 10);
            this._userService.get(id).subscribe(data => {
                this.users[this.files[i]] = data;
                this.ref.detach();
                setTimeout(() => {
                    this.ref.detectChanges();
                }, 100);
            });
        }
    }
}
