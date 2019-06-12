import {Component, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef , AfterViewInit,
  AfterViewChecked, ElementRef} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {UserService} from '../../service/user.service';
import {Utils} from '../../class/utils';
import {Comment} from '../../entity/comment';
import {User} from '../../entity/user';
import {CommentService} from "../../service/comment.service";
import {SessionService} from "../../service/session.service";

@Component({
    selector: 'digest-comment',
    inputs: ['comment'],
    styles: [`
      .comment_body {
          width: 100%;
          height: 100%;
          display: inline-block;
          font-size: 12px;
          position: relative;
          min-height: 111px;
          line-height: 10px;
      }

      .photo {
          width: 35px;
          height: 35px;
          margin: 15px 25px 0 30px;
          float: left;
          background-image: url(/assets/user_icon/no-user-photo.png);
          background-size: cover;
          background-position: center;
          border-radius: 35px;
      }

      .name {
          margin-top: 20px;
          color: #3B4345;
          font-weight: bold;
          margin-right: 15px;
          float: left;
          height: 13px;
          max-width: calc(100% - 261px);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
      }

      .name > span{
          text-transform: uppercase;
      }

      .date {
          margin-top: 20px;
          color: #677578;
          height: 13px;
      }

      .menu {
          position: absolute;
          top: 10px;
          right: 20px;
          width: 20px;
          height: 20px;
          font-size: 25px;
          line-height: 6px;
          width: 20px;
          height: 20px;
          color: #252f32;
          cursor: pointer;
      }

      .company {
          color: #677578;
          font-style: italic;
          height: 10px;
          margin-top: 5px;
      }

      .text {
          margin-top: 12px;
          color: #252F32;
          line-height: 14px;
          overflow: hidden;
          width: calc(100% - 132px);
          word-break: break-all;
          margin-left: 90px;
      }

      .more{
          color: #3F51B5;
          cursor: pointer;
          line-height: 15px;
          margin-left: 90px;
      }

      .more:hover{
          text-decoration: underline;
      }

      .estimate {
          width: 50px;
          height: 15px;
          position: absolute;
          bottom: 5px;
          right: 128px;
          line-height: 15px;
      }

      .estimate div:first-child {
          width: 15px;
          height: 15px;
          float: right;
          display: block;
          margin-top: -3px;
          background: url(/assets/person_icon/like.png) center;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          margin-left: 10px;
          background-color: #c8c8c8;
      }

      .estimate div:last-child {
          color: #677578;
          width: calc(100% - 20px);
          height: 15px;
          text-align: right;
      }

      .estimate .selected {
          background-color: #8c8c8c  !important;
      }
    `],

    template: `
          <div class="comment_body" [style.height]="height+94+'px'">
            <div class="photo" [style.background-image]= "user?.photoMini ? 'url('+ user?.photoMini +')' : null"></div>

              <div class="name"><span>{{utils.getSurname(user.name) || "Неизвестно"}}</span>{{" "+utils.getFirstName(user.name)}}</div>
              <div class="date">{{utils.getDateInCalendar(this.comment.add_date)}}</div>
              <div class="menu" (click)="contextMenu($event)">...</div>
              <div class="company">{{user?.organisation?.name || "Не известно"}}</div>
              <div class="text" [style.max-height]="height+'px'">
                    <span #textElem>{{comment.text}}</span>

              </div>
                <span (click)="more_less(textElem)" *ngIf="textElem.offsetHeight > baseHeight" class="more">
                      {{textElem.parentElement.offsetHeight == baseHeight ? 'Подробнее...' : 'Свернуть'}}
                </span>
              <div class="estimate">
                  <div (click)="estimate(true)" [class.selected]="comment.like_users.indexOf(ses_agent.id) > -1"
                  ></div>
                  <div>{{comment.like_count}}</div>
              </div>
              <div class="estimate" style="right: 70px">
                  <div (click)="estimate(false)" style="margin-top: 0px; transform: rotate(180deg);"
                       [class.selected]="comment.dislike_users.indexOf(ses_agent.id) > -1"
                  ></div>
                    <div>{{comment.dislike_count}}</div>
              </div>
          </div>
      `
})

export class DigestCommentComponent implements OnInit, AfterViewInit {
    public comment: Comment;
    @Output() edit_comment: EventEmitter<any> = new EventEmitter();
    @Output() delete_event: EventEmitter<any> = new EventEmitter();
    @ViewChild('textElem') textElement: ElementRef;
    user: User = new User();
    ses_agent: User = new User();
    show_menu: boolean = false;
    height: number = 30;
    baseHeight: number = 30;
    utils =  Utils;
    constructor(private _hubService: HubService,
                private _userService: UserService,
                private _commentService: CommentService,
                private _sessionService: SessionService,
                private cdRef:ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        this._userService.get(this.comment.agentId).subscribe(user => {
          this.user = user;
        });

        this.ses_agent = this._sessionService.getUser();
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
        setTimeout(()=>{
            let elem = this.textElement.nativeElement as HTMLElement;
            if(elem.offsetHeight <= 31) {
              this.baseHeight = elem.offsetHeight;
              this.height = this.baseHeight;
            }
        });

    }

    openUser() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('user', {user: this.user});
    }

    edit() {
        this.edit_comment.emit('edit');
        this.show_menu = false;
    }

    delete() {
        this._commentService.delete(this.comment).subscribe(data => {
            if(data == "ОК"){
                this.delete_event.emit(true);
            }
        });
      this.show_menu = false;
    }

    estimate(like: boolean) {
        this._commentService.estimate(this.comment, like).subscribe(data => {
            if(data){
                setTimeout(() => {
                    this._commentService.get(this.comment.id).subscribe(comment => {
                        this.comment = comment;
                    });
                }, 100);
            }
        });
    }

    clickedOutside() {
        if(this.show_menu){
            this.show_menu = false;
        }
    }

    more_less(textElem: HTMLElement) {
        if (textElem.parentElement.offsetHeight == this.baseHeight){
            this.height = textElem.offsetHeight;
        } else {
          this.height = this.baseHeight;
        }
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let uOpt = [];

        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.ses_agent.id != this.comment.agentId || !this.utils.inLastDay(this.comment.add_date), icon: "", label: 'Изменить', callback: () => {
                    this.edit();
                }},

                {class: "entry", disabled: this.ses_agent.id != this.comment.agentId, icon: "", label: "Удалить", callback: () => {
                    this.delete();
                }},
                {class: "delimiter", disabled: this.ses_agent.id != this.comment.agentId},
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

                ]}
            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }
}
