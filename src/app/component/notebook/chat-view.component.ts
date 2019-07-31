import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {HubService} from "../../service/hub.service";
import {Utils} from "../../class/utils";
import * as moment from 'moment/moment';

@Component({
    selector: 'chat-view',
    styles: [`
        *{
            cursor: default;
        }
        .flex-col {
            display: flex;
            flex-direction: column;
        }

        .chat-header {
            height: 90px;
            border-bottom: 1px solid #d3d5d6;
            padding: 20px 15px 0 25px;
        }

        .search-block {
            height: 30px;
        }

        .search {
            width: 100%;
            height: 30px;
            background-color: #f2f3f4;
        }

        .magnifier {
            position: relative;
            height: 18px;
            left: calc(100% - 30px);
            width: 18px;
            top: -23px;
        }

        .chat-menu {
            padding-top: 10px;
            display: flex;
        }

        .chat-menu .contacts {
            flex: 0 0 auto;
            margin-right: 15px;
            padding-bottom: 7px;
        }

        .chat-menu .contacts:hover, .chat-menu .contacts.clicked {
            border-bottom: 5px solid #3b5998;
        }

        .chat-menu .more {
            flex: 1 1 60%;
        }

        .flex-col.contacts {
            height: calc(100vh - 140px);
            overflow-y: auto;
        }

        .flex-col.chat {
            height: calc(100vh - 251px);
            overflow-y: scroll; 
            padding: 0 20px;
        }

        .contact-block, .contact-info-block {
            min-height: 80px;
            padding: 0 20px 0 25px;
            border-bottom: 1px solid var(--bottom-border);
            display: flex;
        }
        .contact-block.list, .contact-info-block.list{
            align-items: center;
        }

        .contact-block {
            height: 80px;
        }
        .contact-block.inner{
            min-height: 104px !important;
            height: 104px !important;
            border-bottom: 1px solid var(--selected-digest);
            padding: 25px 30px 0 30px;
        }  
        .contact-block.selected{
            background-color: #d3d5d6 !important;
            border: none;
        }

        .contact-info-block {
            height: 134px;
            padding: 20px 20px 25px 25px;
        }

        .contact-block:hover {
            background-color: #f6f6f6;
        }

        .name {
            color: #252F32;
            font-weight: bold;
        }
        .job.marg{
            margin-bottom: 4px;
        }
        .name.open{
            max-width: 140px;
        }

        .city {
            margin-top: 5px;
        }

        .flex-col.person {
            padding-left: 20px;
            flex-grow: 1;
            height: 100%;
            display: flex;
            justify-content: center;
        }
        .flex-col.person.inner{
            justify-content: normal;
        }
        .contact-info-block img {
            width: 90px;
            height: 90px;
            border-radius: 45px;
        }

        .contact-block img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
        }

        .more-button {
            display: flex;
            width: 30px;
            justify-content: center;
            align-items: center;
            height: 30px;
            position: relative;
            top: -13px;
            right: -13px;
            opacity: 0;
        }

        .contact-block:hover .more-button, .msg-container:hover .more-button {
            opacity: 1;
        }

        .point {
            width: 3px;
            height: 3px;
            background-color: #32323d;
            border-radius: 50%;
            margin-right: 3px;
        }

        .point:last-child {
            margin-left: 0;
        }

        .more-button:hover .context-menu, .more:hover .context-menu {
            display: flex;
        }

        .context-menu {
            position: absolute;
            right: 30px;
            margin-top: 10px;
            background-color: white;
            display: none;
            box-shadow: #bdc0c1 0px 2px 10px 0px;
            width: 140px;
            height: 160px;
            padding-top: 10px;
        }

        .context-menu .item {
            height: 20px;
            width: 100%;
            padding-left: 15px;
        }

        .context-menu .item:hover {
            background-color: #f6f6f6;
        }

        .rating {
            font-size: 24px;
            position: relative;
            top: -5px;
        }

        .back {
            position: absolute;
            top: -2px;
            align-items: center;
            display: flex;
            padding-left: 25px;
            height: 50px;
            width: 90px;
            background-color: white;
        }

        .chat .msg-container {
            width: 100%;
        }

        .chat .msg-container.me-msg {
            align-items: flex-end;
        }
        .msg-container:last-child{
            padding-bottom: 20px;
         }
        .me div, .somebody div{
                word-break: break-word;
         }
        .chat .somebody, .chat .me {
            padding: 10px 20px;
            display: flex;
            width: fit-content;
            color: #32323D;
        }

        .chat .somebody {
            background-color: #F5F3EB;
            border-radius: 0 15px 15px 15px;
            border: 1px solid #EEEBDD;
        }

        .chat .me {
            background-color: #E0E4E4;
            border-radius: 15px 0 15px 15px;
            border: 1px solid #D9DEDE;
        }

        .chat-time {
            margin-top: 27px;
            color: var(--color-inactive);
            margin-bottom: 2px;
        }
        .chat-time:first-child{
            margin-top: 10px;
        }
        .send {
            background-color: #D3D5D6;
            min-height: 90px;
            height: auto;
            position: fixed;
            width: 400px;
            bottom: 0;
            border-top: 1px solid var(--selected-digest);
        }

        .textarea {
            padding: 10px 90px 2px 20px;
            line-height: normal;
        }

        .send-button-block {
            display: flex;
            padding: 5px 0 5px 30px;
        }

        .attachment {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
        }
        .attachment:first-child{
            margin-right: 10px;
        }
        .attachment:hover{
            background-color: #F5F3EB;
        }
        .attachment img:first-child{
            width: 24px;
            height: 24px;
        }
        .attachment img:last-child{ 
            width: 25px;
            height: 25px;
        }
        .info{
            padding: 10px 20px 25px;
            border-bottom: 1px solid #D3D5D6;
        }
        .data-title{
            font-weight: bolder;
            margin-top: 10px;
        }
        .data-type{
            width: 130px;
        }
        .data{
            color: #3B5998;
        }
        .carousel-outer{
            height: 126px;
        }
        .car-header{
            display: flex;
            height: 40px;
            padding: 0 20px;
        }
        .car-title, .car-more{
            font-weight: bolder;
            display: flex;
            align-items: center;
        }
        .car-title{
            flex-grow: 1;
        }  
        .buttons{
            display: flex;
            height: 40px;
        }
        .buttons .one, .buttons .two{
            width: 50%;
            color: #252F32;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 1px solid #D3D5D6;
            border-bottom: 1px solid #D3D5D6;
        }
        .buttons .two{
          border-left: 1px solid white;
        }
        .buttons .one.clicked, .buttons .two.clicked, .buttons .one:hover, .buttons .two:hover{
            background-color: #252F32;
            color: white;
            border-top: 1px solid #252F32;
            border-bottom: 1px solid #252F32;
        }
        .gallery{
            height: 372px;
            width: 100%;
            overflow-y: auto;
            padding: 20px 10px 25px 20px;
        }
        .pic{
            width: calc(50% - 10px);
            margin-right: 10px;
            margin-bottom: 5px;
            height: 100px;
        }
        .bottom-buttons{
            padding: 0 20px 20px;
            display: flex;
        }
        .bottom-buttons .one, .bottom-buttons .two{
            color: white;     
            width: 180px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bottom-buttons .one{
            background-color: #7B736F;
            margin-right: 3px;
        }
        .bottom-buttons .two{
            background-color: #8B0000;
        }
        .close{
            display: none;
        }
        .close.open{
            display: flex !important;
        }
       
        textarea{
            max-height: 126px !important;
            overflow-y: auto !important;
            min-height: 30px !important;
            border: none !important;
            resize: none !important;
            padding: 0;
        }
        .msg-count{
            position: relative;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background-color: #3B5998;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            right: 5px;
            top: 10px;
        }
        .send-button{
                width: 60px;
                height: 25px;
                position: absolute;
            right: 20px;
            top: 10px;
                background-color: #f5f3eb;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #32323D;
        }
        .name-icon{
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
            border-radius: 20px;
            border: 1px solid #98968F;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #98968F;
            font-size: 18px;
        }
        .name-icon.me-icon{
            margin-left: 15px;
        }
        .name-icon.somebody-icon{
            margin-right: 15px;
        }
        .right-chat{
            justify-content: flex-end;
        }
    `],
    template: `
        <div class="flex-col">
        
        <div class="back" (click)="this.mode_block = 'contacts-list'" *ngIf="mode_block == 'chat'">Назад</div>
        <div class="back" (click)="this.mode_block = 'chat'" *ngIf="mode_block == 'contact-info'">Назад</div>
        <div class="flex-col close" [class.open]="this.mode_block != 'chat' && this.mode_block != 'contact-info'" (scroll)="_hubService.shared_var['cm_hidden'] = true"
             (wheel)="_hubService.shared_var['cm_hidden'] = true">
            <div class="flex-col chat-header">
                <div class="search-block">
                    <input class="search">
                    <img alt="поиск" class="magnifier" src="../assets/лупа.png">
                </div>
                <div class="chat-menu">
                    <div class="contacts" (click)="menu_mode = 'company'" [class.clicked]="menu_mode == 'company'">НАША
                        КОМПАНИЯ
                    </div>
                    <div class="contacts" (click)="menu_mode = 'group'" [class.clicked]="menu_mode == 'group'">ГРУППЫ
                    </div>
                    <div class="contacts" (click)="menu_mode = 'contacts'" [class.clicked]="menu_mode == 'contacts'">
                        КОНТАКТЫ
                    </div>
                    <div class="more" (offClick)="_hubService.shared_var['cm_hidden'] = true" (click)="tableContextMenu($event)">ЕЩЕ</div>
                </div>

            </div>
            <div class="flex-col contacts" (offClick)="consel = 999999">
                <div *ngFor="let contact of contacts, let i = index" class="contact-block list" [class.selected]="consel == i"
                     (dblclick)="this.mode_block = 'chat'; curUser = i;" (click)="consel = i; openChat()">
                    <img [src]="contact.pic" alt="изображение контакта">
                    <div class="flex-col person" >
                        <div class="name">{{contact.surname}} {{contact.name}} {{contact.father}}</div>
                        <div class="job">{{contact.job}}</div>
                    </div>
                    <div class="more-button" (offClick)="_hubService.shared_var['cm_hidden'] = true" (click)="consel = i;tableContextMenu($event)">
                        <div class="point"></div> 
                        <div class="point"></div>
                        <div class="point"></div>
                    </div>
                    <div class="msg-count">{{messages.length}}</div>
                </div>
            </div>
        </div>
        <div  class="flex-col close" [class.open]="this.mode_block == 'chat'" >
            <div class="contact-block inner"  (dblclick)="this.mode_block = 'contact-info'">
                <img [src]="contacts[curUser].pic" alt="изображение контакта">
                <div class="flex-col person inner">
                    <div class="name">{{contacts[curUser].surname}}</div>
                    <div class="name">{{contacts[curUser].name}} {{contacts[curUser].father}}</div>
                    <div class="job marg">{{contacts[curUser].job}}</div>
                </div>
                <div class="rating">3.8</div>

            </div> 
            <div class="flex-col chat" id="chat" #showChat >
                <div *ngFor="let msg of messages" class="flex-col msg-container" [class.me-msg]="msg.user == cur_user">
                    <div class="chat-time" [style.align-items.flex-end]="msg.user == cur_user">{{msg.time}}</div>
                    <div style="display: flex;" [class.left-chat]="msg.user != cur_user" [class.right-chat]="msg.user == cur_user">
                        <div class="name-icon somebody-icon" *ngIf="msg.user != cur_user">{{msg.user[0]}}</div>
                        <div class="msg-block" [class.somebody]="msg.user != cur_user" [class.me]="msg.user == cur_user">
                            <div>{{msg.message}}</div>
                            <div class="more-button" (offClick)="_hubService.shared_var['cm_hidden'] = true" (click)="msgContextMenu($event)">
                                <div class="point"></div>
                                <div class="point"></div>
                                <div class="point"></div>
                            </div>
                        </div>
                        
                        <div class="name-icon me-icon" *ngIf="msg.user == cur_user">{{msg.user[0]}}</div>
                    </div>
                    
                </div>
            </div>
            <div class="flex-col send"> 
                <textarea class="textarea" autosize 
                         [(ngModel)]="message" (keydown)="checkKeyPress($event)">
                       
                </textarea>
                <div class="send-button" (click)="sendMsg()" >В ЧАТ</div>
                <div class="send-button-block">
                    <div class="attachment"><img src="../../../assets/ph.png"/></div>
                    <div class="attachment"><img src="../../../assets/skr.png"/></div>
                </div>
            </div>
        </div>
        <div class="flex-col close" [class.open]="this.mode_block == 'contact-info'">
            <div class="contact-info-block list">
                <img [src]="contacts[curUser].pic" alt="изображение контакта">
                <div class="flex-col person">
                    <div class="name open">{{contacts[curUser].name}}</div>
                    <div class="job">{{contacts[curUser].job}}</div>
                    <div class="city">{{contacts[curUser].city}}</div>
                </div>
                <div class="rating">3.8</div>
            </div>
            <div class="flex-col info">
                <div class="data-title">ОРГАНИЗАЦИЯ</div>
                <div class="data">{{contacts[curUser].organisation}}</div>
                <div class="data-title">ДАННЫЕ КОНТАКТА</div>
                <div style="display: flex">
                    <div class="data-type">Телефон личный</div>
                    <div class="data">{{contacts[curUser].phone}}</div>
                </div>
                <div style="display: flex">
                    <div class="data-type">Мессенджеры</div>
                    <div class="data"></div>
                </div>
                <div style="display: flex">
                    <div class="data-type">E-mail</div>
                    <div class="data">{{contacts[curUser].email}}</div>
                </div>
                <div style="display: flex">
                    <div class="data-type">Web-сайт</div>
                    <div class="data"></div>
                </div>
                <div style="display: flex">
                    <div class="data-type">Соцсети</div>
                    <div class="data"></div>
                </div>
            </div>
            <div class="flex-col carousel-outer">
                <div class="car-header">
                    <div class="car-title">УЧАСТИЕ В ГРУППАХ</div>
                    <div class="car-more">ЕЩЕ</div>
                </div>
            </div>
            <div class="buttons">
                <div class="one" (click)="button = 'docs'" [class.clicked]="button == 'docs'">Документы, фото..</div>
                <div class="two" (click)="button = 'fav'" [class.clicked]="button == 'fav'">Избранное</div>
            </div>
            <div class="gallery">
                <img *ngFor="let pic of contacts[curUser].pics" class="pic" [src]="pic">
            </div>
            <div class="bottom-buttons">
                <div class="one">Заблокировать</div>
                <div class="two">Удалить чат</div> 
            </div>
        </div>
        </div>
    `
})

export class ChatViewComponent implements AfterViewInit{
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    menu_mode = 'contacts';
    message: any;
    button = 'docs';
    cur_user = 'ПИРОЖКОВ';
    consel = 999999;
    messages = [
      {user: 'ИВАНОВ Иван Иванович', message: 'hello!', time: Utils.getCurrentTime(1562933592000)},
      {user: 'ПИРОЖКОВ', message: 'hello!', time: Utils.getCurrentTime(1562949912000)},
      {user: 'ИВАНОВ Иван Иванович', message: 'how are you?', time: Utils.getCurrentTime(1563004572000)},
      {user: 'ПИРОЖКОВ', message: 'Great, you?', time: Utils.getCurrentTime(1563020052000)},
      {user: 'ИВАНОВ Иван Иванович', message: 'same! :)', time: Utils.getCurrentTime(1563029412000)},
        {user: 'ИВАНОВ Иван Иванович', message: '5G в России обязательно будет. Когда операторы договорятся с военными по поводу частот, используемых ', time: Utils.getCurrentTime(1563047832000)},
        {user: 'ПИРОЖКОВ', message: 'Звучит очень здорово! А ты знаешь, что Netflix представил первые фотографии, постеры и логотип «Ведьмака»?', time: Utils.getCurrentTime(1563106332000)},
        {user: 'ИВАНОВ Иван Иванович', message: 'Надеюсь, что сериал получится таким же удачным, как и книга(и) с серией игр.', time: Utils.getCurrentTime(1563129432000)},
        {user: 'ПИРОЖКОВ', message: 'Я готов простить им каст актёров, если при этом все остальное в частности сюжет будет на высоте! Ведь согласитесь не кто же не плакал что некоторые персонажи ИП не похожи на своих книжных аналогов.', time: Utils.getCurrentTime(1563185712000)},
        {user: 'ИВАНОВ Иван Иванович', message: 'В игре престолов северянок не изображали мулатки. Происхождение Йеннифер в книге не описано, но и обратного не говорилось - если бы она была "смугленькой", то это упомянулось бы в тексте.', time: Utils.getCurrentTime(1563188412000)},
        {user: 'ПИРОЖКОВ', message: 'Судя по медальону это не Геральт из Ривии, а Геральт из дома Старков!', time: Utils.getCurrentTime(1563188832000)},
    ];
    mode_block = 'contacts_list';
    curUser: any;
    contacts = [
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'Иван', surname: 'ИВАНОВ', father: 'Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']}
    ];
    constructor(private _hubService: HubService) {
        this.mode_block = 'contacts_list';
        this.curUser = 0;
        // document.documentElement.addEventListener('click', () => {
        //     this.closeChat();
        // })
    }
    ngAfterViewInit() {
        this.menu_mode = 'contacts';
    }
    @ViewChild('showChat', {static: true}) div: ElementRef;

    closeChat(event) {
        console.log(event.target.classList);
        if (!event.target.classList.contains('button') && !event.target.classList.contains('back') && !event.target.classList.contains('tab-button') && !event.target.classList.contains('head-notebook') && !event.target.classList.contains('curr_date')) {
            this.closeEvent.emit();
        }
    }
    openChat() {
        setTimeout( event => {
          // let div = document.getElementById('chat');
          // div.scrollTop = 99999999;
          // console.log('timeout!');

          let elems = document.documentElement.getElementsByClassName('msg-container') as HTMLCollectionOf<HTMLElement>;
          elems.item(elems.length - 1).scrollIntoView({block: "end"});
        }, 50);
    }
    // removeSel(){
    //     let elems = document.documentElement.getElementsByClassName('contact-block') as HTMLCollectionOf<HTMLElement>;
    //     for (let i = 0; i < elems.length; i++) {
    //         elems.item(i).classList.remove('selected');
    //     }
    // }
    // selectItem(index) {
    //     console.log('click! ', index, this.consel);
    //     let elems = document.documentElement.getElementsByClassName('contact-block') as HTMLCollectionOf<HTMLElement>;
    //     for (let i = 0; i < elems.length; i++) {
    //         elems.item(i).classList.remove('selected');
    //     }
    //     elems.item(index).classList.add('selected');
    // }
  checkKeyPress(event) {
    let date: any;
    date = new Date();
    let key = event.keyCode;
    console.log(event.keyCode);
    if (key === 13) {
      event.preventDefault();
      this.messages.push({user: this.cur_user, message: this.message, time: moment(new Date().getTime()).format('HH:mm')});
      this.message = '';
      setTimeout(() => {
        let elems = document.documentElement.getElementsByClassName('msg-container') as HTMLCollectionOf<HTMLElement>;
        elems.item(elems.length - 1).scrollIntoView({block: "end"});
      }, 50);
      return false;
    }
    else {
      return true;
    }
  }
    sendMsg() {
        let date: any;
        date = new Date();
        this.messages.push({user: this.cur_user, message: this.message, time: moment(new Date().getTime()).format('HH:mm')});
        this.message = '';
        setTimeout(() => {
          let elems = document.documentElement.getElementsByClassName('msg-container') as HTMLCollectionOf<HTMLElement>;
          elems.item(elems.length - 1).scrollIntoView({block: "end", behavior: "smooth"});
        }, 100);

    }
    msgContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this._hubService.shared_var['cm'] = {
            pX: event.pageX,
            pY: event.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: 'Инфо', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Избранное', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Ответить', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Ответить лично', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Скопировать', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Удалить', callback: () => {
                    }
                },
            ]
        };
        this._hubService.shared_var['cm_hidden'] = false;
    }
    tableContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        this._hubService.shared_var['cm'] = {
            pX: event.pageX,
            pY: event.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry", disabled: false, icon: "", label: 'Телефон', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'E-mail', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Web-сайт', callback: () => {
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: 'Соцсети', callback: () => {
                    }
                },
            ]
        };
        this._hubService.shared_var['cm_hidden'] = false;
    }

}
