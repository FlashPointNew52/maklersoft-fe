import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {HubService} from "../../service/hub.service";
import {Utils} from "../../class/utils";

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
            height: calc(100vh - 230px);
            overflow-y: scroll;
            background-color: #f2f3f4;
            padding: 0 20px 15px;
        }

        .contact-block, .contact-info-block {
            min-height: 80px;
            padding: 0 20px;
            border-bottom: 1px solid #D3D5D6;
            display: flex;
            align-items: center;
        }

        .contact-block {
            height: 80px;
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
            display: none;
            width: 30px;
            justify-content: center;
            align-items: center;
            height: 30px;
            position: relative;
            top: -20px;
            right: -20px;
        }

        .contact-block:hover .more-button {
            display: flex;
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
            font-size: 28px;
        }

        .back {
            position: absolute;
            top: 15px;
            margin-left: 25px;
        }

        .chat .msg-container {
            width: 100%;
        }

        .chat .msg-container.me-msg {
            align-items: flex-end;
        }

        .chat .somebody, .chat .me {
            padding: 10px 20px 10px 10px;
            display: flex;
            width: fit-content;
        }

        .chat .somebody {
            background-color: white;
        }

        .chat .me {
            background-color: #3B5998;
        }

        .me div {
            color: white;
        }

        .chat-time {
            margin-top: 8px;
            color: #32323d;
            margin-bottom: 2px;
        }

        .send {
            background-color: #D3D5D6;
            min-height: 100px;
            height: auto;
            padding: 13px 20px;
            position: fixed;
            width: 400px;
            bottom: 0;
        }

        .textarea {
            margin-bottom: 10px;
        }

        .send-button-block {
            display: flex;
        }

        .attachment {
            flex-grow: 1;
        }

        .send-button {
            background-color: #E96508;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 30px;
            color: white;
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
        .triangle{
            background-color: unset !important;
            padding: 0 !important;
        }
        .triangle::after {
            content: '';
            border: 10px solid transparent; /* Прозрачные границы */
        }
        .triangle.me::after{
            border-top: 0 solid #3B5998;
            border-right: 12px solid #3b5998;
            
        }
        .triangle.somebody::after{
            border-top: 0 solid white; /* Добавляем треугольник */
            border-left: 10px solid white; /* Добавляем треугольник */
        }
        textarea{
            max-height: 126px !important;
            overflow-y: auto !important;
            min-height: 26px !important;
            border: none !important;
            resize: none !important;
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
    `],
    template: `
        <div class="back" (click)="this.mode_block = 'contacts-list'" *ngIf="mode_block == 'chat'">Назад</div>
        <div class="back" (click)="this.mode_block = 'chat'" *ngIf="mode_block == 'contact-info'">Назад</div>
        <div (offClick)="closeChat()" class="flex-col close" [class.open]="this.mode_block != 'chat' && this.mode_block != 'contact-info'" (scroll)="_hubService.shared_var['cm_hidden'] = true" (wheel)="_hubService.shared_var['cm_hidden'] = true">
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
            <div class="flex-col contacts">
                <div *ngFor="let contact of contacts, let i = index" class="contact-block"
                     (dblclick)="this.mode_block = 'chat'; curUser = i;" (offClick)="removeSel()" (click)="selectItem(i)">
                    <img [src]="contact.pic" alt="изображение контакта">
                    <div class="flex-col person" >
                        <div class="name">{{contact.name}}</div>
                        <div class="job">{{contact.job}}</div>
                    </div>
                    <div class="more-button" (offClick)="_hubService.shared_var['cm_hidden'] = true" (click)="tableContextMenu($event)">
                        <div class="point"></div> 
                        <div class="point"></div>
                        <div class="point"></div>
                    </div>
                    <div class="msg-count">{{messages.length}}</div>
                </div>
            </div>
        </div>
        <div  class="flex-col close" [class.open]="this.mode_block == 'chat'" (offClick)="this.mode_block = 'contacts-list'; closeChat()">
            <div class="contact-block" (dblclick)="this.mode_block = 'contact-info'; openChat()">
                <img [src]="contacts[curUser].pic" alt="изображение контакта">
                <div class="flex-col person">
                    <div class="name">{{contacts[curUser].name}}</div>
                    <div class="job marg">{{contacts[curUser].job}}</div>
                    <div class="job">{{contacts[curUser].organisation}}</div>
                </div>
                <div class="rating">3.8</div>

            </div>
            <div class="flex-col chat" id="chat" #showChat (load)=" openChat()">
                <div *ngFor="let msg of messages" class="flex-col msg-container" [class.me-msg]="msg.user == 'me'">
                    <div class="chat-time" [style.align-items.flex-end]="msg.user == 'me'">{{msg.time}}</div>
                    <div [class.somebody]="msg.user == 'somebody'" [class.me]="msg.user == 'me'">
                        <div>{{msg.message}}</div>
                    </div>
                    <div class="triangle" [class.somebody]="msg.user == 'somebody'" [class.me]="msg.user == 'me'"></div>
                </div>
            </div>
            <div class="flex-col send">
                <textarea class="textarea" autosize 
                         [(ngModel)]="message"></textarea>
                <div class="send-button-block">
                    <div class="attachment">Прикрепить</div>
                    <div class="send-button" (click)="sendMsg()">Отправить</div>
                </div>
            </div>
        </div>
        <div class="flex-col close" [class.open]="this.mode_block == 'contact-info'" (offClick)="closeChat()">
            <div class="contact-info-block">
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
    `
})

export class ChatViewComponent{
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    menu_mode: string;
    message: any;
    button = 'docs';
    consel = 999999;
    messages = [
      {user: 'somebody', message: 'hello!', time: '10.22'},
      {user: 'me', message: 'hello!', time: '10.25'},
      {user: 'somebody', message: 'how are you?', time: '10.27'},
      {user: 'me', message: 'Great, you?', time: '10.28'},
      {user: 'somebody', message: 'same! :)', time: '10.30'},
        {user: 'somebody', message: '5G в России обязательно будет. Когда операторы договорятся с военными по поводу частот, используемых ', time: '10.32'},
        {user: 'me', message: 'Звучит очень здорово! А ты знаешь, что Netflix представил первые фотографии, постеры и логотип «Ведьмака»?', time: '10.35'},
        {user: 'somebody', message: 'Надеюсь, что сериал получится таким же удачным, как и книга(и) с серией игр.', time: '10.40'},
        {user: 'me', message: 'Я готов простить им каст актёров, если при этом все остальное в частности сюжет будет на высоте! Ведь согласитесь не кто же не плакал что некоторые персонажи ИП не похожи на своих книжных аналогов.', time: '10.42'},
        {user: 'somebody', message: 'В игре престолов северянок не изображали мулатки. Происхождение Йеннифер в книге не описано, но и обратного не говорилось - если бы она была "смугленькой", то это упомянулось бы в тексте.', time: '10.47'},
        {user: 'me', message: 'Судя по медальону это не Геральт из Ривии, а Геральт из дома Старков!', time: '10.54'},
    ];
    mode_block = 'contacts_list';
    curUser: any;
    contacts = [
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']},
        {name: 'ИВАНОВ Иван Иванович', job: 'Менеджер по продажам', pic: '../../../assets/photo%20(2).PNG', organisation: 'Центр оценки и продажи недвижимости', city: 'Хабаровский край, г.Хабаровск', phone: '+7 (914) 544-81-00', email: 'centrdv@mail.ru', pics: ['https://cdn6.roomble.com/wp-content/uploads/2018/02/Gostinaya-final_001-1200x800.jpg','https://media.decorateme.com/images/da/3a/9f/loft-kitchen.jpg','http://mydesigngroup.ru/wp-content/uploads/2017/01/dizayn-interera-v-stile-loft-4.jpg', 'https://polygonphoto.ru/wp-content/uploads/2016/12/FU7A4567.jpg', 'https://www.chado.pro/uploads/gallery_item/photo/556/1.jpg', 'https://www.ivd.ru/uploads/5992b88d5388a.jpg']}
    ];
    constructor(private _hubService: HubService) {
        this.mode_block = 'contacts_list';
        this.curUser = 0;
    }
    @ViewChild('showChat', {static: true}) div: ElementRef;
    closeChat() {
        this.closeEvent.emit();
    }
    openChat() {
        let elem  = document.documentElement.getElementsByClassName('msg-container') as HTMLCollectionOf<HTMLElement>;;
        console.log('chat', elem);
    }
    removeSel(){
        let elems = document.documentElement.getElementsByClassName('contact-block') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < elems.length; i++) {
            elems.item(i).classList.remove('selected');
        }
    }
    selectItem(index) {
        console.log('click! ', index, this.consel);
        let elems = document.documentElement.getElementsByClassName('contact-block') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < elems.length; i++) {
            elems.item(i).classList.remove('selected');
        }
        elems.item(index).classList.add('selected');
    }
    sendMsg() {
        let date: any;
        date = new Date();
        this.messages.push({user: 'me', message: this.message, time: Utils.getCurrentTime(date)});
        // let elem  = document.documentElement.getElementsByClassName('msg-container') as HTMLCollectionOf<HTMLElement>;
        // elem.item(elem.length - 1).scrollIntoView({block: "end"});
        this.message = '';
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
