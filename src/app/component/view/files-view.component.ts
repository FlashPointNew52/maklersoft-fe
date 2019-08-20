import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {UploadService} from '../../service/upload.service';
import * as moment from 'moment/moment';
import 'moment/locale/ru.js';
import {Utils} from "../../class/utils";
import {UploadFile} from "../../class/uploadFile";

@Component({
    selector: 'files-view',
    inputs: ['files', 'type', 'editMode', 'full'],
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
            display: none;
        }
        .photo-style.open{
            display: block;
        }
        .photo{
            width: 100%;
            height: 175px;
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
            height: 45px;
            width: 45px;
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
            display: flex;
        }
        .block-title div:first-child{
            margin-right: 15px;
        }
        .block-title div{
            font-size: 20px;
        }
        .edit-photos{
            display: none;
            flex-direction: column;
            width: 100%;
        }
        .edit-photos.open{
            display: flex;
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
            height: calc(100vh - 122px - 155px - 16px);
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
            background-image: url(../../../assets/arrow.png);
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
            width: 46px;
            height: 46px;
            top: -542px;
            left: calc(100% - 75px);
            background-size: 100% 100%;
            border-radius: 23px;
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
            transform: rotate(-45deg) translate(-10px, 22px);
        }
        .exit .line:last-child{
            transform: rotate(45deg) translate(20px, 9px);
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
        .doc{
            background-size: 62px 62px;
            background-repeat: no-repeat;
            background-position: unset;
            background-position-x: 20px;
            background-position-y: 20px;
        }
        .doc-bord{
            border: 1px solid #D3D5d6;
        }
        .filename{
            position: relative;
            top: 65px;
            left: 95px;
            color: #252F32;
            max-width: 260px;
        }
    `],
    template: `
        <div class="block-title" >
            <div *ngIf="type == 'photo'">ФОТО ПРЕДЛОЖЕНИЯ</div><div *ngIf="type == 'doc'">ДОКУМЕНТЫ ПРЕДЛОЖЕНИЯ</div><div>({{files?.length}})</div>
            
        </div>
        <div class="files_body_new" [class.full]="full">
            <ul>
                <li *ngIf="editMode">
                    <ui-upload-file [type]="type"
                                    (addNewFile) = "addFile($event)"
                                    (progressState) = "progressEvent($event)"
                                    [parent]="'photo'"
                    ></ui-upload-file>
                </li>
          
                <li *ngFor="let file of files, let i = index" class="photo-style" [class.open]="editMode" [class.doc-bord]="type == 'doc'">
                    <div class="photo" *ngIf="type == 'photo'" [style.background-image]="file.href ? 'url(' + file?.href + ')' : ''"></div>
                    <div class="photo doc" *ngIf="type == 'doc'" [style.background-image]="file.ext ? 'url(assets/' + file?.ext + '.png)' : ''"><a class="filename">{{file?.name}}</a></div>
                    <div class="tools">
                        <div style= "background-image: url('../../../assets/photo_icon/zoom.png');" (click) = "galleryOpenFunc(file.href)"></div>
                        <div style= "background-image: url('../../../assets/photo_icon/check.png');" ></div>
                        <div style= "background-image: url('../../../assets/photo_icon/cross.png');" (click) = "file_delete(i)"></div>
                        
                    </div>  
                </li> 
 
                <div *ngFor="let obj of new_struct, let i = index" class="edit-photos" [class.open]="!editMode">
                    <div class="title-block">{{obj?.convert}} <div class="add_author">{{obj?.author}}</div></div>
                    <ul>
                        <li *ngFor="let url of obj.urls, let j = index" class="photo-style" [class.open]="!editMode"  [class.doc-bord]="type == 'doc'">
                            <ng-container *ngIf="type == 'photo'">
                                <div class="photo" [style.background-image]="'url(' + url?.href + ')'"></div> 
                                <div class="tools">
                                    <div style= "background-image: url('../../../assets/photo_icon/zoom.png');height: 50px; width: 50px" (click) = "galleryOpenFunc(url.href)"></div>
                                </div>
                            </ng-container> 
                            
                            <ng-container *ngIf="type == 'doc'"> 
                                <div class="photo doc" [style.background-image]="'url(assets/' + url?.ext + '.png)'"><a class="filename">{{url?.name}}</a></div>
                                <div class="tools">
                                    <div style= "background-image: url('../../../assets/photo_icon/zoom.png');" (click) = "printInfo(url)"></div>
                                </div>
                            </ng-container>
                        </li>
                    </ul> 
                </div> 
            </ul>
        </div> 
        <!-- TODO: убрать просмотр фотографии в глобальный компонент -->
        <div class="gallery" [class.full]="full" [class.open]="galleryOpen">
            <div class="gal-top"> 
                <div class="arrow-block" (click)="prev_photo()"><div class="arrow-left"></div></div>
                <div class="big-photo-block"><div class="big-photo" [style.background-image]="'url(' + cur_photo + ')'"></div></div>
                <div class="arrow-block" (click)="next_photo()"><div class="arrow-right"></div></div>
            </div>
            <div class="exit" (click)="galleryOpen = false"><div class="line"></div><div class="line"></div></div>
            <div class="bottom-gal">
                <ul id="carousel-ul">
                    <li *ngFor="let photo of files, let i = index" class="carousel-li" [class.clicked]="photo.href == cur_photo">
                        <div class="photo" [style.background-image]="photo.href ? 'url(' + photo?.href + ')' : ''" (click) = "galleryOpenFunc(photo?.href)"></div>
                    </li>
                </ul> 
            </div>
        </div>
    `
})

export class FilesView implements OnInit, OnChanges {
    public files: UploadFile[] = [];
    public galleryOpen: boolean = false;
    public type: string;
    public editMode: boolean = false;
    public full: boolean = false;
    cur_photo : any;
    widthReview = 214;
    count = 1;
    position = 0;
    cur_index: any;
    users: any= {};
    new_struct = [];

    //days = [];
    //displayFiles: UploadFile[] = [];

    @Output() add: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() fileIndexClick: EventEmitter<any> = new EventEmitter();
    @Output() progressLoad: EventEmitter<any> = new EventEmitter();

    constructor(private _uploadService: UploadService,
                private _sessionService: SessionService,
                private _configService: ConfigService,
                private _userService: UserService,
                private ref: ChangeDetectorRef
    ){
        moment.locale("ru");
    }

    ngOnInit(){
        //this.displayFiles = [].concat(this.files);
        //this.sortFiles(this.files);
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.files && changes.files.currentValue && changes.files.currentValue !== changes.files.previousValue) {
           // this.displayFiles = [].concat(changes.files.currentValue);

            this.sortFiles(changes.files.currentValue);
        }

    }
    info(file){
       console.log(file)
    }
    printInfo(obj){
        console.log(obj);
        window.open(obj.href);
    }
    galleryOpenFunc( url){
        this.galleryOpen = true;
        this.cur_photo = url;
        this.cur_index = 0;
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].href == url)  this.cur_index = i;
        }
        this.position = 0;
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;

        if ( this.files.length - this.cur_index < 4) this.cur_index = this.files.length - 3;
        if (this.cur_index <= 0) this.cur_index = 1;
        this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count - 3)) * this.cur_index - 1;
        list.style.setProperty('margin-left', this.position + 'px');
    }

    prev_photo() {
        if (this.cur_index != 0) {
            this.cur_index--;
        }
        this.cur_photo = this.files[this.cur_index].href;
        console.log(this.cur_photo);
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.min(this.position + this.widthReview * this.count, 0);
        list.style.setProperty('margin-left', this.position + 'px');
    }

    next_photo() {
        if (this.cur_index != this.files.length - 1) {
            this.cur_index++;
        }
        this.cur_photo = this.files[this.cur_index].href;
        console.log(this.cur_photo);
        const listElems = document.getElementsByClassName('carousel-li') as HTMLCollectionOf<HTMLElement>;
        const list = document.getElementById('carousel-ul') as HTMLElement;
        this.position = Math.max(this.position - this.widthReview * this.count, -this.widthReview * (listElems.length - this.count - 3));
        list.style.setProperty('margin-left', this.position + 'px');
    }

    sortFiles(photo_arr: any[]){
        /*this.files.sort((val1, val2) => {
            if(val1.addDate > val2.addDate) return 1;
            if(val1.addDate < val2.addDate) return -1;
            return 0;
        });
        this.days = [];
        //заполним массив дней уникальными значениями
        this.files.forEach((file) => {
            let floatDate = Utils.getDateInCalendar(file.addDate);
            if(!this.days.includes(floatDate))
                this.days.push(floatDate);
        });*/
        this.new_struct = [{date: -1, urls: [{href: "", ext: ""}], convert: "", author: "", ext: "", name: ""}];
        let check: boolean;
        for (let i = 0; i < photo_arr.length; i++) {
            check = false;
            for (let j = 0; j < this.new_struct.length; j++) {
                if (Utils.getDateForPhoto(this.new_struct[j].date) == Utils.getDateForPhoto(photo_arr[i].addDate) && this.new_struct[j].author == photo_arr[i].userName){
                    this.new_struct[j].urls.push({href: photo_arr[i].href, ext: photo_arr[i].ext, name: photo_arr[i].name});
                    check = true;
                }
            }
            if (!check) {
                this.new_struct.unshift({date:photo_arr[i].addDate, urls: [{href: photo_arr[i].href, ext: photo_arr[i].ext, name: photo_arr[i].name}], convert: "Добавлено: " + Utils.getDateForPhoto(photo_arr[i].addDate), author: photo_arr[i].userName});
            }
        }
        this.new_struct.splice(this.new_struct.length - 1,1);
        console.log(this.new_struct);
    }

    addFile(ev){
        this.add.emit(ev);
    }

    file_show(i :number){
        this.fileIndexClick.emit(i);
    }

    file_delete(i){
        this._uploadService.delete(this.files[i].href).subscribe(result => {
            this.files.splice(i, 1);
            this.delete.emit(this.files);
        });

    }

    file_main(i){
        let temp = this.files[i];
        this.file_delete(i);
        this.files.unshift(temp);
    }

    progressEvent(ev){
        this.progressLoad.emit(ev);
    }

    // getAddUser(){
    //     this.users={};
    //     for(let i = 0; i< this.files.length; ++i){
    //         let ext = this.files[i].ext;
    //         let new_url = this.files[i].href;
    //         let id = this.files[i].userId;
    //         this._userService.get(id).subscribe(data => {
    //             // this.users[this.files[i]] = data;
    //             this.ref.detach();
    //             setTimeout(() => {
    //                 this.ref.detectChanges();
    //         }, 100);
    //         });
    //     }
    // }
}
