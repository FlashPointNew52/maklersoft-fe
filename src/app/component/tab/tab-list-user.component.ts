import {
    Component, OnInit
} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {UserService} from '../../service/user.service';

import {Tab} from '../../class/tab';
import {User} from '../../entity/user';

@Component({
    selector: 'tab-list-user',
    inputs: ['tab'],
    styles: [`
        .work-area {
            height: calc(100vh - 122px);
            padding: 30px 0;
            min-width: 1150px;
            max-width: 1300px;
            margin: 0 auto;
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
            display: flex;
        }

        digest-user:hover{
            background-color: var(--bottom-border);
        }

        digest-user.selected{
            background-color: var(--color-blue);
        }

    `],
    template: `
        <div class = "round_menu">
            <div class="button" (click) ="addUser()">Добавить</div>
        </div>
        <div class="search-form">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'100%'"
                   [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon_right"></span>
            <div class="tool-box">
                <filter-select
                    [name]="'Организация'"
                    [options]="usrOptions"
                    [value]="{'option' : filter.agentId}"
                    (newValue)="setUsrId($event)"
                >
                </filter-select>
                <filter-select
                    [name]="'Отдел'" [firstAsName]="true"
                    [options]="departmentOptions"
                    [value]="{'option' : filter.department}"
                    (newValue)="filter.department = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag [value]="filter?.tag" (newValue)="filter.tag = $event; searchParamChanged();"></filter-select-tag>
                <filter-select
                    [name]="'Период'" [firstAsName]="true"
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
                    (newValue)="filter.changeDate = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Сортировка'" [firstAsName]="true"
                    [options]="sortOptions"
                    [value]="getSort()"
                    (newValue)="setSort($event.option, $event.subvalue); searchParamChanged();"
                >
                </filter-select>
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+users?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>


        <div class="work-area" (contextmenu)="contextMenu($event)" (offClick)="selectedUser = []" (scroll)="scroll($event)">
            <digest-user *ngFor="let u of users; let i = index"
                [user]="u"
                (click)="clickUser($event, u, i)"
                (dblclick)="openUser(u)"
                [class.selected]="selectedUser.indexOf(u) > -1"
                         [selected]="selectedUser.indexOf(u) > -1"
                [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                (contextmenu)="clickUser($event, u, i)"
            >
            </digest-user>
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
        //this.departmentOptions = this.departmentOptions.concat(User.departmentOptions);
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
        let tab = tabSys.addTab('user', {user: usr, canEditable: true});
        this.eventTabs(tab);
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
        return {option: k, subvalue: this.sort[k]};
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
                {class: "tag", icon: "", label: "", offer: this.selectedUser.length == 1 ? this.selectedUser[0] : null, tag,
                  callback: (new_tag) => {
                    this.clickContextMenu({event: "set_tag", tag: new_tag});
                  }}
              ]},
              {class: "entry", disabled: false, icon: "", label: 'Удалить',
                  callback: () => {
                      this.clickContextMenu({event: "del_obj"});
                  }
              },
              {class: "delimiter"}

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
                this._userService.save(o).subscribe(user =>{
                    this.users[this.users.indexOf(o)] = user;
                    this.selectedUser[this.selectedUser.indexOf(o)] = user;
                });
            } else if(evt.event == "del_obj"){
                this._userService.delete(o).subscribe(
                    data => {
                        this.selectedUser.splice(this.selectedUser.indexOf(o), 1);
                        this.users.splice(this.users.indexOf(o), 1);
                    }
                );
            } else if(evt.event == "check"){

            } else if(evt.event == "photo"){

            } else if(evt.event == "set_tag"){
                o.tag = evt.tag;
                this._userService.save(o).subscribe(user =>{
                    this.users[this.users.indexOf(o)] = user;
                    this.selectedUser[this.selectedUser.indexOf(o)] = user;
                });
            } else {

            }
        });
    }

    private eventTabs(tab: any) {
        tab.getEvent().subscribe(event =>{
            if(event.type == "new"){

            } else if(event.type == "update"){
                for(let i = 0; i < this.users.length; ++i){
                    if(this.users[i].id == event.value.id){
                        this.selectedUser[this.selectedUser.indexOf(this.users[i])] = event.value;
                        this.users[i] = event.value;
                        break;
                    }
                }
            } else if(event.type == "delete"){
                for(let i = 0; i < this.users.length; ++i){
                    if(this.users[i].id == event.value){
                        this.selectedUser.splice(this.selectedUser.indexOf(this.users[i]), 1);
                        this.users.splice(i, 1);
                        break;
                    }
                }
            }
        });
    }
}
