import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {PersonService} from '../../service/person.service';

import {Tab} from '../../class/tab';
import {Person} from '../../entity/person';

import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";

@Component({
    selector: 'tab-list-person',
    inputs: ['tab', 'dateType'],
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

        .person-list{
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

        digest-person{
            height: 57px;
            min-height: 57px;
            padding-top: 6px;
            box-sizing: border-box;
            cursor: pointer;
        }

        digest-person:hover{
            background-color: #f3f3f3;
        }

        digest-person.selected{
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
            <div class="button" [style.background-image]="'url(assets/plus.png)'" (click) ="addPerson()">Добавить</div>
            <div (click)="toggleSource('all')" class="button" [class.button_active]="this.source != 'local'" [style.background-image]="'url(assets/base_new.png)'">Общая</div>
            <div (click)="toggleSource('local')"  class="button" [class.button_active]="this.source == 'local'" [style.background-image]="'url(assets/company_new.png)'">Компания</div>
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
                    <div class="inline-select" *ngIf="source == 'local'">
                        <ui-filter-select class="view-value edit-value"
                            [options]="usrOptions"
                            [value]="{'option' : filter.agentId}"
                            (onChange)="setUsrId($event)"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source != 'local'">
                        <ui-filter-select class="view-value edit-value"
                                          [options]="orgOptions"
                                          [value]="{'option' : filter.organisationId}"
                                          (onChange)="setType($event)"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source == 'local'">
                      <ui-filter-select class="view-value edit-value"
                                        [options]="middlemanOptions"
                                        [value]="{'option' : filter.isMiddleman}"
                                        (onChange)="filter.isMiddleman = $event.option; searchParamChanged();"
                      >
                      </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source == 'local'">
                        <ui-filter-select class="view-value edit-value"
                                          [options]="typeCodeOptions"
                                          [value]="{'option' : filter.typeCode}"
                                          (onChange)="filter.typeCode = $event.option; searchParamChanged();"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select" *ngIf="source == 'local'">
                      <ui-filter-select class="view-value edit-value"
                                        [options]="stateCodeOptions"
                                        [value]="{'option' : filter.stateCode}"
                                        (onChange)="filter.stateCode = $event.option; searchParamChanged();"
                      >
                      </ui-filter-select>
                    </div>


                    <div class="inline-select" *ngIf="source == 'local'">
                        <ui-filter-tag-select class="view-value edit-value"
                            [value]="filter?.tag"
                            (onChange)="filter.tag = $event; searchParamChanged();"
                        >
                        </ui-filter-tag-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]="dateFilter"
                            [value]="{'option' : filter.changeDate || filter.addDate}"
                            (onChange)="setDateFilter($event)"
                        >
                        </ui-filter-select>
                    </div>
                    <div class="inline-select">
                        <ui-filter-select class="view-value edit-value"
                            [options]=" this.source == 'local' ? localSort : allSort"
                            [value]="getSort()"
                            (onChange)="setSort($event.option, $event.subvalue); searchParamChanged();"
                        >
                        </ui-filter-select>
                    </div>
                    <div style="float: right;font-size: 12px;color: #324158;margin-top: 3px;">
                        Найдено: <span>{{hitsCount+" "}}</span>/<span>{{" "+ persons?.length }}</span>
                    </div>
                </div>
            </div>

        </div>

        <hr class='underline'>

        <div class="person-list"
        >
            <div class="pane" style = "width: 370px;height: 115px;">
                <div class="head"><span>{{tab.header}}</span></div>
            </div>
            <div class="work-area" (contextmenu)="contextMenu($event)" (offClick)="selectedPerson = []" (scroll)="scroll($event)">
                <digest-person *ngFor="let p of persons; let i = index"
                    [person]="p"
                    (click)="clickPerson($event, p, i)"
                    (dblclick)="openPerson(p)"
                    [class.selected]="selectedPerson.indexOf(p) > -1"
                    [class.alreadyAdd]="p.userRef && source != 'local'"
                    [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                    [dataType]="source == 'local' ? 'person': 'user'"
                    (contextmenu)="clickPerson($event, p, null)"
                >
                </digest-person>
            </div>
        </div>
    `
})

export class TabListPersonComponent implements OnInit {
    public tab: Tab;
    source = 'local';

    persons: Person[] = [];
    searchQuery: string = "";

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
    localSort = Person.localSort;
    allSort = Person.allSort;
    dateFilter = [{value: 'all', label: 'Все', class: "entry", items: []},
                  {value: 'addDate', label: 'Добавлено', class: "submenu", items: [
                      {value: '1', label: '1 день', class: "entry", items: []},
                      {value: '3', label: '3 дня', class: "entry", items: []},
                      {value: '7', label: 'Неделя', class: "entry", items: []},
                      {value: '17', label: '2 недели', class: "entry", items: []},
                      {value: '30', label: 'Месяц', class: "entry", items: []},
                      {value: '90', label: '3 месяца', class: "entry", items: []}
                  ]},
                  {value: 'changeDate', label: 'Изменено', class: "submenu", items: [
                      {value: '1', label: '1 день', class: "entry", items: []},
                      {value: '3', label: '3 дня', class: "entry", items: []},
                      {value: '7', label: 'Неделя', class: "entry", items: []},
                      {value: '17', label: '2 недели', class: "entry", items: []},
                      {value: '30', label: 'Месяц', class: "entry", items: []},
                      {value: '90', label: '3 месяца', class: "entry", items: []}
                  ]}
    ];
    middlemanOptions = [{value: 'all', label: 'Все'}];
    typeCodeOptions = [{value: 'all', label: 'Все'}];
    stateCodeOptions = [{value: 'all', label: 'Все'}];
    usrOptions = [{value: 'all', label: 'Все', class: "entry", items: []},
                  {value: 'my', label: 'Мои контакты', class: "entry", items: []}
    ];
    orgOptions = [{value: 'all', label: 'Все', class: "entry", items: []},
                  {value: 'company', label: 'Наша компания', class: "submenu", items: []}];
    selectedPerson: Person[] = [];

    lastClckIdx: number = 0;

    constructor(private _configService: ConfigService,
        private _hubService: HubService,
        private _personService: PersonService,
        private _userService: UserService,
        private _sessionService: SessionService,
    ) {
        setTimeout(() => {
            this.tab.header = 'Контакты';
        });
    }

    ngOnInit() {
        /*this.middlemanOptions = this.middlemanOptions.concat(Person.middlemanOptions);
        this.stateCodeOptions = this.stateCodeOptions.concat(Person.stateCodeOptions);
        this.typeCodeOptions = this.typeCodeOptions.concat(Person.typeCodeOptions);
        this.usrOptions = this.usrOptions.concat(this._userService.cacheOrgAndUser);
        this.orgOptions[1].items = this._userService.cacheOrgs;*/
        this.listPersons();
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight ) {
                this.page += 1;
                this.listPersons();
        }
    }

    toggleSource(s: string) {
        this.source = s;
        this.persons = [];
        this.selectedPerson = [];
        this.page = 0;
        this.searchParamChanged();
    }

    listPersons() {
        if(this.page == 0){
          this.persons = [];
        }
        this._personService.list(this.page, 50 ,this.source, this.filter,  this.sort, this.searchQuery).subscribe(
            data => {
                if (this.page == 0) {
                    this.persons = data;
                } else {
                    data.forEach(i => {
                        this.persons.push(i);
                    });
                }
            },
            err => console.log(err)
        );
    }

    addPerson() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        tab_sys.addTab('person', {person: new Person(), canEditable: true});
    }

    openPerson(pers: Person) {
        let tabSys = this._hubService.getProperty('tab_sys');
        let canEditable = this.source == 'local' && (this._sessionService.getUser().accountId == pers.accountId);
        tabSys.addTab('person', {person: pers, canEditable: canEditable});
    }

    searchParamChanged() {
        if(this.source == 'local'){
            delete this.filter.organisationId;
            delete this.filter.accountId;
        } else{
            delete this.filter.agentId;
        }
        this.persons = [];
        this.selectedPerson = [];
        this.page = 0;
        this.listPersons();
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

    clickPerson(event: MouseEvent, person: Person, i: number) {
        if (event.button == 2) {
            if (this.selectedPerson.indexOf(person) == -1) {
                this.lastClckIdx = i;
                this.selectedPerson = [person];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedPerson.push(person);
            } else if (event.shiftKey) {
                this.selectedPerson = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.persons[idx++];
                    this.selectedPerson.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedPerson = [person];
            }
        }
    }

    setUsrId(event){
        if(event.option == "all") {
            delete this.filter.agentId;
        } else if(event.option == "my")
            this.filter.agentId = this._sessionService.getUser().id;
        else{
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

    setType(event){
        console.log(event);
        if(event.option == "company"){
            if(event.subvalue != null){
                this.filter.organisationId = event.subvalue;
                delete this.filter.accountId;
            } else {
                delete this.filter.organisationId;
                this.filter.accountId = this._sessionService.getUser().accountId;
            }
        } else{
            delete this.filter.organisationId;
            delete this.filter.accountId;
        }
        this.searchParamChanged();
    }

    setDateFilter(event){
        delete this.filter.changeDate;
        delete this.filter.addDate;
        if(event.option != "all"){
            this.filter[event.option] = event.subvalue;
        }
        this.searchParamChanged();
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        let uOpt = [{class:'entry', label: "На себя", disabled: false, callback: () => {
                    this.clickContextMenu({event: "set_agent", agentId: this._sessionService.getUser().id});
        }}];
        for (let op of this._userService.cacheUsers){
            op.callback = () => {
                this.clickContextMenu({event: "set_agent", agentId: op.value});
            };
            uOpt.push(op);
        }
        let stateOpt = [];

        let tag = this.selectedPerson[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {class: "entry", disabled: this.selectedPerson.length == 1 ? false : true, icon: "", label: 'Проверить', callback: () => {
                    //this.openPopup = {visible: true, task: "check"};
                }},
                {class: "entry", disabled: false, icon: "", label: 'Открыть', callback: () => {
                    let tab_sys = this._hubService.getProperty('tab_sys');
                    this.selectedPerson.forEach(o => {
                        let canEditable = this.source == 'all' ? false : true && (this._sessionService.getUser().accountId() == o.accountId);
                        tab_sys.addTab('person', {person: o, canEditable: canEditable});
                    });
                }},
                {class: "entry", disabled: this.source == 'local' && this.canImpact() ? false : true, icon: "", label: 'Удалить',
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                },
                {class: "delimiter"},

                {class: "entry", disabled: this.selectedPerson.length == 1 ? false : true, icon: "", label: "Просмотреть фото",
                    callback: () => {
                        this.clickContextMenu({event: "photo"});
                    }
                },
                {class: "delimiter"},
                {class: "entry", disabled: this.canImpactAmongAdd(), icon: "", label: "Добавить в контакты", callback: () => {
                    this.clickContextMenu({event: "add_to_local"});
                }},
                {class: "submenu", disabled: this.source == 'local' && this.canImpact() ? false : true, icon: "", label: "Назначить", items: [
                    {class: "entry", disabled: false, label: "Не назначено",
                        callback: () => {
                            this.clickContextMenu({event: "del_agent", agent: null});
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
                {class: "delimiter", disabled: this.source == 'local' && this.canImpact() ? false : true},
                {class: "submenu", disabled: this.source == 'local' && this.canImpact() ? false : true, icon: "", label: "Назначить тег", items: [
                    {class: "tag", icon: "", label: "", offer: this.selectedPerson.length == 1 ? this.selectedPerson[0] : null, tag: tag,
                        callback: (new_tag) => {
                          this.clickContextMenu({event: "set_tag", tag: new_tag});
                    }}
                ]}

            ]
        };

        this._hubService.shared_var['cm'] = menu;
        this._hubService.shared_var['cm_hidden'] = false;
    }

    canImpact() {
        for (let psn of this.selectedPerson) {
           if(psn.accountId != this._sessionService.getUser().accountId)
              return false;
        }
        return true;
    }

    canImpactAmongAdd() {
        if(this.source != 'local'){
            for (let psn of this.selectedPerson) {
               if(psn.userRef != null)
                  return true;
            }
            return false;
        } else return true;

    }

    clickContextMenu(evt: any){
        this.selectedPerson.forEach(o => {
            if(evt.event == "add_to_local"){
                o.changeDate = Math.round((Date.now() / 1000));
                o.addDate = o.changeDate;
                o.stateCode = 'raw';
                o.typeCode = "realtor";
                o.id = null;
                if(evt.agent){
                        o.agentId = evt.agent.id;
                        o.agent = evt.agent;
                } else {
                        o.agentId = null;
                        o.agent = null;
                }
                this._personService.save(o);
            } else if(evt.event == "del_agent"){
                    o.agentId = null;
                    o.agent = null;
                    this._personService.save(o);
              } else if(evt.event == "set_agent"){
                    o.agentId = evt.agentId;
                    o.agent = null;
                    this._personService.save(o);
              } else if(evt.event == "del_obj"){

              } else if(evt.event == "check"){

              } else if(evt.event == "photo"){

              } else if(evt.event = "set_tag"){
                    o.tag = evt.tag;
                    this._personService.save(o);
              } else {

              }
        });
    }
}
