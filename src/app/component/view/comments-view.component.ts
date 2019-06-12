import {Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit} from '@angular/core';

import {SessionService} from '../../service/session.service';
import {ConfigService} from '../../service/config.service';
import {RequestService} from '../../service/request.service';

import {Comment} from "../../entity/comment";
import {CommentService} from "../../service/comment.service";

@Component({
    selector: 'comments-view',
    inputs: ['obj', 'type'],
    styles: [`
      .comment_header {
        height: 50px;
        display: block;
        flex-direction: column;
        width: 100%;
        padding-top: 20px;
        box-sizing: border-box;
        position: relative;
      }

      .comment_header > span:first-child {
        margin: 0 20px 0 30px;
        font-size: 18px;
        color: #3b4345;
        height: 17px;
        line-height: 19px;
        float: left;
        width: 82px;
      }

    .comment_header > span:nth-child(2) {
        font-size: 11px;
        color: #677578;
        height: 20px;
        line-height: 18px;
        max-width: 275px;
        float: left;
        width: 120px;
    }

    .comment_header > div {
        height: 21px;
        width: 126px;
        font-size: 10px;
        line-height: 21px;
        text-align: center;
        color: #3F51B5;
        border: solid rgba(63, 81, 181, 1) 1px;
        cursor: pointer !important;
        border-radius: 10px;
        transition: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
        position: absolute;
        right: 20px;
        top: 17px;
      }

      .comment_header > div:hover {
        background-color: rgba(63, 81, 181, 1);
        color: #FFFFFF;
      }

      .comment_body {
        width: 100%;
        height: calc(100% - 50px);
        overflow: auto;
      }

      .comment_set {
        position: relative;
        transition: height 500ms;
        overflow: hidden;
        margin-bottom: 15px;
      }

      .comment_set .photo_user {
        background-image: url("/assets/user_icon/no-user-photo.png");
        width: 40px;
        height: 40px;
        margin: 0 15px 40px 30px;
        float: left;
        background-size: cover;
      }

      .comment_set textarea {
          height: 54px;
          margin-top: 5px;
          width: calc(100% - 104px);
          resize: none;
          color: #677578;
          padding: 3px 6px;
          box-sizing: border-box;
          word-break: break-all;
          border: 1px solid #d3d5d6;
          font-size: 12px;
      }

      .comment_set .triangle:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        left: 72px;
        transform: rotate(90deg);
        top: 5px;
        border: 7px solid;
        border-color: #d3d5d6 transparent transparent #d3d5d6;
      }

      .comment_set .triangle:after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        left: 74px;
        top: 6px;
        border: 6px solid;
        transform: rotate(90deg);
        border-color: #fff transparent transparent #fff;
      }

      .comment_set .back_bottom {
        float: right;
        font-size: 12px;
        color: #5D75B3;
        cursor: pointer;
      }

      .comment_set .ok_bottom {
        color: #5D75B3;
        font-size: 12px;
        margin: 0 20px;
        float: right;
        cursor: pointer;
      }

      .comment_set .ok_bottom:hover, .comment_set .back_bottom:hover {
        text-decoration: underline;
      }

      .comment_body digest-comment {
        width: 100%;
        display: block;
      }

      .comment_body hr {
        margin: 10px 25px;
        width: calc(100% - 50px);
        border-top: 1px solid rgba(230, 230, 230, 1);
      }

      .comment_body > div:last-child hr {
        display: none;
      }

    `],
    template: `
        <div class="comment_header"><span>ОТЗЫВЫ</span>
            <span>Всего отзывов: {{comment_hits}}</span>
            <div (click)="set_show_comment($event)">Добавить отзыв</div>
        </div>
        <div class="comment_body">
            <div class="comment_set" [style.height]="show_comment ? '85px' : '0px'">
                <div class="photo_user"></div>
                <div class="triangle"></div>
                <textarea [(ngModel)]="comment_text"
                          placeholder="Напишите свое мнение об этом контакте,и его узнают все пользователи системы MaklerSoft"></textarea>
                <div class="ok_bottom" (click)="send_comment()">{{isEditComment ? 'Изменить' : 'Готово'}}</div>
                <div class="back_bottom" (click)="clear_comment()" *ngIf="isEditComment">Отмена</div>
            </div>
            <div *ngFor="let com of comments; let i = index">
                <digest-comment  [comment]="com" (edit_comment)="edit(com)"
                                 (delete_event)="delete(i)"></digest-comment>
                <hr>
            </div>
        </div>
    `
})

export class CommentsViewComponent implements OnInit, AfterViewInit {
    public obj: any;
    public type: string;
    comments: Comment[] = [];
    comment_hits: number = 0;
    comment_text: string = "";
    isEditComment: boolean = false;
    sender_comment: Comment;
    show_comment: boolean = false;

    constructor(
        private _sessionService: SessionService,
        private _configService: ConfigService,
        private _requestService: RequestService,
        private _commentService: CommentService
    ){

    }

    ngOnInit(){

    }

    ngAfterViewInit(){
      if(this.obj && this.obj.id != null) {

        this._commentService.list(this.obj.id, this.type).subscribe(comments => {
            this.comment_hits = comments.hitsCount;
            this.comments = comments.list;
        });
      }
    }

    send_comment() {
      if(this.comment_text.length > 3) {
        let new_comment;
        if(!this.isEditComment) {
          console.warn("is NEW Comment");
          new_comment = new Comment(this.comment_text, this.obj.id);
        } else {
          console.warn("is OLD Comment");
          new_comment = this.sender_comment;
          new_comment.text = this.comment_text;
        }
        if(!new_comment.objType)
            new_comment.objType = this.type;
        let is_edit = false || this.isEditComment;
        this._commentService.save(new_comment).subscribe(comment => {
          if(is_edit) {
              this.comments[this.comments.indexOf(this.sender_comment)] = comment;
          } else {
              this.comments.unshift(comment);
              this.comment_hits++;
          }
          this.comment_text = "";
        });
        this.isEditComment = false;
        this.show_comment = false;
      }
    }

    edit(com: Comment) {
      this.isEditComment = true;
      this.sender_comment = com;
      this.comment_text = com.text;
      this.show_comment = true;
    }

    delete(i) {
      this.comments.splice(i, 1);
      this.comment_hits--;
    }

    clear_comment() {
      this.isEditComment = false;
      this.comment_text = "";
    }

    set_show_comment(event: MouseEvent) {
      this.show_comment = !this.show_comment;
      if(this.show_comment){
        (event.currentTarget as HTMLElement).parentElement.parentElement
        .getElementsByClassName("comment_body").item(0).scrollTop = 0;
      }
    }

}
