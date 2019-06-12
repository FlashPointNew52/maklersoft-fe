import {
    Component, OnInit, AfterViewInit,
} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {UserService} from '../../service/user.service';

import {Tab} from '../../class/tab';
import {User} from '../../entity/user';
import {Observable} from "rxjs";
import {Person} from "../../entity/person";


@Component({
    selector: 'tab-list-user',
    inputs: ['tab'],
    styles: [`
        .search-form {
            position: absolute;
            width: calc(75% - 685px);
            margin-left: 570px;
            margin-top: 27px;
            z-index: 1;
        }

        .tool-box {
            height: 21px;
            margin: 2px 12px;
            padding-top: 1px;
        }

        .search-box {
            display: flex;
            position: relative;
            height: 30px;
            margin: 15px 12px 0px 12px;
        }

        .user-list{
           display: flex;
        }

        .work-area {
            float: left;
            height: calc(100vh - 175px);
            padding: 30px 0;
            min-width: 1150px;
            max-width: 1300px;
            margin: 115px auto 0;
            display: flex;
            flex-direction: column;
            overflow: auto;
        }

        digest-user{
            height: 57px;
            min-height: 57px;
            padding-top: 6px;
            box-sizing: border-box;
            cursor: pointer;
        }

        digest-user:hover{
            background-color: #f3f3f3;
        }

        digest-user.selected{
            background-color: #b5b5b5;
        }

        .inline-select {
            display: inline-block;
            height: 20px;
            padding: 0 15px;
            font-size: 14px;
            color: #666;
        }

        .button {
            height: 44px;
            width: 44px;
            border-radius: 40px;
            cursor: pointer;
            font-size: 11px;
            line-height: 110px;
            background-size: 39px;
            background-position: center;
            background-color: #9e9e9e;
            color: #9e9e9e;
            border: 1px solid #42424200;
            text-indent: -3px;
        }

        .button_active, .button:hover{
            background-color: #424242;
            color: #424242;
            border: 1px solid #424242;
        }

        .input_line{
            height: 23px;
            background-color: rgb(247, 247, 247);
            border: 1px solid rgba(204, 204, 204, 0.47);
        }

    `],
    template: `
        <div class = "round_menu">
            <div class="button" [style.background-image]="'url(assets/plus.png)'" (click) ="addUser()">Добавить</div>
        </div>
        <div class="search-form">
            <div class="search-box">
              <input type="text" class="input_line" placeholder="" [style.width]="'100%'"
                     [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
              >
              <span class="icon-search" style= "position: absolute; top: 7px; right: 10px"></span>
            </div>

            <div class="tool-box">
              <div style="width: 100%;float: left;">
                <div class="inline-select">
                  <ui-filter-select class="view-value edit-value"
                                    [options]="usrOptions"
                                    [value]="{'option' : filter.agentId}"
                                    (onChange)="setUsrId($event)"
                  >
                  </ui-filter-select>
                </div>
                <div class="inline-select">
                  <ui-filter-select class="view-value edit-value"
                                    [options]="departmentOptions"
                                    [value]="{'option' : filter.department}"
                                    (onChange)="filter.department = $event.option; searchParamChanged();"
                  >
                  </ui-filter-select>
                </div>
                <div class="inline-select">
                  <ui-filter-tag-select class="view-value edit-value"
                                        [value]="filter?.tag"
                                        (onChange)="filter.tag = $event; searchParamChanged();"
                  >
                  </ui-filter-tag-select>
                </div>
                <div class="inline-select">
                    <ui-filter-select class="view-value edit-value"
                               [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: '1', label: '1 день'},
                                  {value: '3', label: '3 дня'},
                                  {value: '7', label: 'Неделя'},
                                  {value: '17', label: '2 недели'},
                                  {value: '30', label: 'Месяц'},
                                  {value: '90', label: '3 месяца'}
                              ]"
                              [value]="{'option' : filter.changeDate}"
                               (onChange)="filter.changeDate = $event.option; searchParamChanged();"
                    >
                    </ui-filter-select>
                </div>
                <div class="inline-select">
                  <ui-filter-select class="view-value edit-value"
                                    [options]="sortOptions"
                                    [value]="getSort()"
                                    (onChange)="setSort($event.option, $event.subvalue); searchParamChanged();"
                  >
                  </ui-filter-select>
                </div>
                <div style="float: right;font-size: 12px;color: #324158;margin-top: 3px;">
                  Найдено: <span>{{hitsCount+" "}}</span>/<span>{{" "+ users?.length }}</span>
                </div>
              </div>
            </div>

        </div>

        <hr class='underline'>
        <div class="user-list"
        >
            <div class="pane" style = "width: 370px;height: 115px;">
                <div class="head"><span>{{tab.header}}</span></div>
            </div>
            <div class="work-area" (contextmenu)="contextMenu($event)" (offClick)="selectedUser = []" (scroll)="scroll($event)">
                <digest-user *ngFor="let u of users; let i = index"
                    [user]="u"
                    (click)="clickUser($event, u, i)"
                    (dblclick)="openUser(u)"
                    [class.selected]="selectedUser.indexOf(u) > -1"
                    [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                    (contextmenu)="clickUser($event, u, i)"
                >
                </digest-user>
            </div>
        </div>
    `
})

export class TabListUserComponent implements OnInit {
    public tab: Tab;
    source = 0;
    users: User[] = [];
    searchQuery: string;
    selectedUser: User[] = [];
    hitsCount: number = 0;
    page = 0;
    filter: any = {
        tag: null,
        typeCode: 'all',
        changeDate: 'all',
        stateCode: 'all'
    };
    sort: any = {
        addDate: 'DESC'
    };

    stateCodeOptions = [{value: 'all', label: 'Все'}];
    departmentOptions = [{value: 'all', label: 'Все'}];
    usrOptions = [{value: 'all', label: 'Все', class: "entry", items: []}];

    sortOptions = User.sort;

    lastClckIdx: number = 0;

    constructor(private _configService: ConfigService, private _hubService: HubService, private _userService: UserService) {
        setTimeout(() => {this.tab.header = 'Пользователи';});
    }

    ngOnInit() {
        //this.stateCodeOptions = this.stateCodeOptions.concat(User.stateCodeOptions);
        this.departmentOptions = this.departmentOptions.concat(User.departmentOptions);
        this.usrOptions = this.usrOptions.concat(this._userService.cacheOrgAndUser);

        this.tab.refreshRq.subscribe(
            sender => {
                this.listUsers();
            }
        );

        this.listUsers();
    }

    setUsrId(event){
      if(event.option == "all") {
        delete this.filter.agentId;
      } else{
        if(event.subvalue != null){
          this.filter.agentId = event.subvalue;
        } else {
          for(let opt of this.usrOptions){
            if(opt.value == event.option){
              this.filter.agentId = "["+opt.items.map(a => a.value).join(",") + "]";
              break;
            }
          }
        }
      }
      this.searchParamChanged();
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight ) {
                this.page += 1;
                this.listUsers();
        }
    }

    listUsers() {
        if(this.page == 0){
          this.users = [];
        }
        this._userService.list(this.page, 50, this.filter,  this.sort, this.searchQuery).subscribe(
            data => {
                if (this.page == 0) {
                    this.users = data;
                } else {
                    data.forEach(i => {
                      this.users.push(i);
                    });
                }
            },
            err => console.log(err)
        );
    }


    openUser(usr: User) {
        let tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('user', {user: usr, canEditable: true});
    }

    addUser() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('user', {user: new User()});
    }

    searchParamChanged() {
        this.users = [];
        this.selectedUser = [];
        this.page = 0;
        this.listUsers();
    }

    getSort(){
      for(let k in this.sort) {
        return {"option" : k , "subvalue": this.sort[k]};
      }
    }

    setSort(val1, val2){
      this.sort = {};
      this.sort[val1] = val2;
    }

    clickUser(event: MouseEvent, user: User, i: number) {
        if (event.button == 2) {
            if (this.selectedUser.indexOf(user) == -1) {
                this.lastClckIdx = i;
                this.selectedUser = [user];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedUser.push(user);
            } else if (event.shiftKey) {
                this.selectedUser = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.users[idx++];
                    this.selectedUser.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedUser = [user];
            }
        }
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let uOpt = [];

        let tag = this.selectedUser[0].tag || null;
        let menu = {
          pX: e.pageX,
          pY: e.pageY,
          scrollable: false,
          items: [
            {class: "entry", disabled: this.selectedUser.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {
                //this.openPopup = {visible: true, task: "check"};
              }},
            {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                let tab_sys = this._hubService.getProperty('tab_sys');
                this.selectedUser.forEach(o => {
                    tab_sys.addTab('user', {user: o, canEditable: true});
                });
              }},
            {class: "entry", disabled: false, icon: "", label: 'Удалить',
              callback: () => {
                this.clickContextMenu({event: "del_obj"});
              }
            },
            {class: "delimiter"},

            {class: "entry", disabled: this.selectedUser.length == 1 ? false : true, icon: "", label: "Просмотреть фото",
              callback: () => {
                this.clickContextMenu({event: "photo"});
              }
            },
            {class: "delimiter"},
            {class: "submenu", disabled: false , icon: "", label: "Назначить", items: [
                {class: "entry", disabled: false, label: "Не назначено",
                  callback: () => {
                    this.clickContextMenu({event: "del_agent", agent: null});
                  }
                },
                {class: "entry", disabled: false, label: "",
                  callback: () => {
                    //this.clickContextMenu({event: "add_to_local", agent: this._sessionService.getUser()});
                  }
                }
              ].concat(uOpt)},
            {class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: [

              ]},
            {class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: [

              ]},
            {class: "delimiter"},
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

              ]},
            {class: "delimiter"},
            {class: "submenu", disabled: false, icon: "", label: "Назначить тег", items: [
                {class: "tag", icon: "", label: "", offer: this.selectedUser.length == 1 ? this.selectedUser[0] : null, tag: tag,
                  callback: (new_tag) => {
                    this.clickContextMenu({event: "set_tag", tag: new_tag});
                  }}
              ]}

          ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    clickContextMenu(evt: any){
        this.selectedUser.forEach(o => {
            if(evt.event == "del_agent"){
                o.agentId = null;
                o.agent = null;
                this._userService.save(o);
            } else if(evt.event == "del_obj"){

            } else if(evt.event == "check"){

            } else if(evt.event == "photo"){

            } else if(evt.event = "set_tag"){
                o.tag = evt.tag;
                this._userService.save(o);
            } else {

            }
        });
    }
}
