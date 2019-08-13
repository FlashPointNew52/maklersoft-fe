import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    OnChanges,
    Output,
    ViewChild
} from "@angular/core";
import {HubService} from "../../service/hub.service";
import {Utils} from "../../class/utils";

@Component({
    selector: 'notification-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['mode'],
    styles: [`
        *{
            cursor: default;
        }
        .flex-center{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .flex-col {
            display: flex;
            flex-direction: column;
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
        .chat-word{
            position: absolute;
            top: 14px;
            left: calc(50% - 50px);
            font-size: 14px;
            width: 105px;
        }
        .buttons-block{
            display: flex;
            padding: 0 20px;
            margin-top: 15px;
        }
        .buttons-block > div{
            height: 35px;
            width: 50%;
            display: flex;
            align-items: center;
            font-size: 14px;
            justify-content: center;
            border: 1px solid var(--color-dark-blue);
            color: var(--color-dark-blue);
        }
        .buttons-block > div:hover, .buttons-block > .active{
            background-color: var(--color-dark-blue);
            color: white;
        }
        .buttons-block > div:first-child{
            border-right: none;
        }
        .buttons-block > div:last-child{
            border-left-color: white;
        }
        .search-block{
            height: 46px;
            border-bottom: 1px solid var(--bottom-border);
            display: flex;
            align-items: center;
        }
        .search-block > input{
            line-height: 25px;
            width: 100%;
            padding: 0 20px;
        }
        .search-block > input::placeholder{
            color: #677578;
            font-style: italic;
        }
        .magnifier{
            position: absolute;
            right: 25px;
            height: 18px;
            width: 18px;
            top: 108px;
        }
        .pane-head{
            height: 30px;
            display: flex;
            justify-content: center;
            padding: 0 15px;
        } 
        .head-time{
            width: 100%;
            height: 30px;
            color: #7D7D7A;
        }
        .parentName{
            text-transform: uppercase;
            color: #4D4D49;
            font-weight: bold;
        }
        .contact-block{
            display: flex;
            width: 100%;
            background-color: var(--color-notif);
            border: 1px solid var(--notif-border);
            padding: 30px 20px;
            border-radius: 5px;
        }
        .contact-block > div:first-child > img{
            height: 46px;
            width: 46px;
            border-radius: 23px;
            margin-right: 10px;
        }
        .name{
            font-weight: bold;
        }
        .event-block{
            padding: 10px 20px 0 20px;
        }
        .event{
            margin-top: 15px;
        }
        .out-scroll{
            height: calc(100vh - 136px);
            width: 100%;
            overflow-y: auto;
            padding-bottom: 30px;
        }
    `],
    template: `
        <div class="flex-col" (mousewheel)="_hubService.shared_var['cm_hidden'] = true">
            
            <div class="back">Назад</div>
            <div class="chat-word" >УВЕДОМЛЕНИЯ</div>
            <div class="flex-col">
                <div class="buttons-block">
                    <div [class.active]="button_active == 'my'" (click)="button_active = 'my'">Мои ({{events.length}})</div>
                    <div [class.active]="button_active == 'all'" (click)="button_active = 'all'">Все ({{events.length}})</div>
                </div>
                <div class="search-block"><input placeholder="Введите текст для поиска"><img src="../assets/лупа.png" class="magnifier"></div>
            </div>
            <div class="out-scroll">
                <div *ngFor="let event of events" class="flex-col event-block">
                    <div class="contact-block flex-col">
                        <div class="pane-head">
                            <div class="parentName">{{event.parentName}}</div>
                            <div class="head-time">{{event.time}}</div>
                        </div>
                        <div style="display: flex">
                            <img [src]="event.pic" alt="изображение контакта">
                            <div class="flex-col">
                                <div class="name">{{event.user}}</div>
                                <div class="job">{{event.company}}</div>
                                <div class="job">{{event.human_type}}</div>
                            </div>
                        </div>
                        <div class="flex-col event">
                            <div>{{event.event.type}}</div>
                            <div>{{event.event.address}}</div>
                            <div>{{event.event.request}}</div>
                            <div>{{event.event.price}}</div>
                            <div>{{event.event.props}}</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    `
})

export class NotificationViewComponent implements AfterViewInit, OnChanges{
    public mode: boolean = false;
    button_active = 'all';
    @Output() closeEvent: EventEmitter<any> = new EventEmitter();
    events = [
        {parentName: "Ежедневник", user: 'ИВАНОВ Иван Иванович', company: 'Центр оценки и продажи недвижимости', human_type: 'Постоянный клиент', eventType: 'Сообщение', pic: '../../assets/photo (2).PNG',time: Utils.getDateInCalendar(1565351610),
            event: {type: "ЗАЯВКА (НОВАЯ)", address: "Хабаровск", request: "Квартира 3 комнатная", price: "Бюджет до 35 000 руб", props: "Кухонная мебель, Гостинная мебель"}},
        {parentName: "IP-Телефония", user: 'ИВАНОВ Иван Иванович', company: 'MaklerOnline', eventType: 'Сообщение', human_type: 'Потенциальный клиент', pic: '../../assets/photo (2).PNG', time: Utils.getDateInCalendar(1563004572),
            event: {type: "ЗАЯВКА (НОВАЯ)", address: "Хабаровск", request: "Квартира 3 комнатная", price: "Бюджет до 35 000 руб", props: "Кухонная мебель, Гостинная мебель"}},
        {parentName: "Чат", user: 'ИВАНОВ Иван Иванович', company: 'Центр оценки и продажи недвижимости', eventType: 'Сообщение', human_type: 'Потенциальный клиент', pic: '../../assets/photo (2).PNG', time: Utils.getDateInCalendar(1563020052),
            event: {type: "ЗАЯВКА (НОВАЯ)", address: "Хабаровск", request: "Квартира 3 комнатная", price: "Бюджет до 35 000 руб", props: "Кухонная мебель, Гостинная мебель"}},
          ];
    constructor(private _hubService: HubService) {

    }
    ngOnChanges() {

    }
    ngAfterViewInit() {

    }

    closeNotification(event) {
        console.log(event.target.classList);
        if (!event.target.classList.contains('button') && !event.target.classList.contains('back') && !event.target.classList.contains('tab-button') && !event.target.classList.contains('head-notebook') && !event.target.classList.contains('curr_date')) {
            this.closeEvent.emit();
        }
    }
    openNotification() {
        setTimeout( event => {
            let elems = document.documentElement.getElementsByClassName('ntf-container') as HTMLCollectionOf<HTMLElement>;
            elems.item(elems.length - 1).scrollIntoView({block: "end"});
        }, 50);
    }

    ntfContextMenu(event) {
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
