import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter,ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {UploadService} from '../../service/upload.service';
import * as moment from 'moment/moment';
import 'moment/locale/ru.js';

@Component({
    selector: 'files-view',
    inputs: ['files', 'type', 'editMode', 'object_id'],
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
            padding-top: 6px;
        }

        .files_body ul{
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

        .files_body ul li{
            width: 100%;
            margin-bottom: 3px;
            background-color: white;
            cursor: pointer;
            padding-top: 5px;
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

    `],
    template: `
        <div class="files_header">
            <ui-upload-file [type]="type" *ngIf="editMode"
                (addNewFile) = "addFile($event)" [obj_id]="object_id"
                (progressState) = "progressEvent($event)"
            ></ui-upload-file>
            <div *ngIf="!editMode" style= "font-size: 10px;padding-left: 18px; color: #9e9e9e;">
                Для добавления, редактирования фотографий нажмите  "Изменить"
            </div>
            <hr>
            <div>
                <span [style.background-image]= "type == 'image' ? 'url(assets/photo.png)' : 'url(assets/docum.png)'"
                ></span><span>{{files.length}}</span>
            </div>
        </div>
        <div class="files_body">
            <ul>
                <div *ngIf="files.length == 0" class="empty_file">
                    {{type == 'image' ? "НЕТ ДОБАВЛЕННЫХ ФОТО" : "НЕТ ДОБАВЛЕННЫХ ДОКУМЕНТОВ"}}
                </div>
                <li *ngFor="let file of files; let i = index"
                >
                    <div class="container" *ngIf="type == 'image'">
                        <div class="fog" [style.background-image]="'url('+file+')'"></div>
                        <img [src]="file">
                        <div class="tools" *ngIf="editMode">
                            <div style= "background-image: url('assets/photo_icon/arrow.png');transform: rotate(180deg);" (click) = "move_up(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/arrow.png')" (click) = "move_bottom(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/cross.png');background-size: 70%;" (click) = "file_delete(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/check.png')" (click) = "file_main(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;" (click) = "file_show(i)"></div>
                        </div>
                        <div class="tools_small" *ngIf="!editMode">
                            <div style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;" (click) = "file_show(i)"></div>
                        </div>
                    </div>
                    <span *ngIf="type == 'image'" style= "font-size: 10px; margin-top: 5px;">Создано:</span>
                    <span *ngIf="type == 'image'" >Вчера 13:00</span>
                    <div class="doc_container" *ngIf="type == 'document'">
                        <span class="time">{{getFileDate(file)}}</span>
                        <img src="assets/docum_file.png">
                        <div class="doc_decr">
                            <span class="file_name">{{getFileName(file)}}</span>
                            <span class="user_name">Добавлено
                                <span class="link">{{users[file]?.name || 'Неизвестно'}}</span>
                            </span>
                        </div>
                        <div class="tools" *ngIf="editMode">
                            <div style= "background-image: url('assets/photo_icon/arrow.png');transform: rotate(180deg);" (click) = "move_up(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/arrow.png')" (click) = "move_bottom(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/cross.png');background-size: 70%;" (click) = "file_delete(i)"></div>
                            <div style= "background-image: url('assets/photo_icon/check.png')" (click) = "file_main(i)"></div>
                            <a [href]="file" target="_blank" style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;"></a>
                        </div>
                        <div class="tools_small" *ngIf="!editMode">
                            <a [href]="file" target="_blank" style= "background-image: url('assets/photo_icon/zoom.png');background-size: 70%;"></a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    `
})

export class FilesView implements OnInit, OnChanges {
    public files: any[] = [];
    public type: string = 'image';
    public editMode: boolean = false;
    users: any= {};

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
    }

    ngOnChanges(changes: SimpleChanges) {
        if(!this.files)
            this.files=[];
        if(this.type != 'image'){
            this.getAddUser();
            console.log('Update');
        }

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
