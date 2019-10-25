import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service';
import {ConfigService} from '../../service/config.service';
import {PersonService} from '../../service/person.service';

import {Tab} from '../../class/tab';
import {Person} from '../../entity/person';

import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";
import {Contact} from "../../entity/contact";

@Component({
    selector: 'tab-list-person',
    inputs: ['tab', 'dateType'],
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

        digest-person{
            height: 57px;
            min-height: 57px;
            padding-top: 6px;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
        }

        digest-person:hover{
            background-color: var(--bottom-border);
        }

        digest-person.selected{
            background-color: var(--color-blue);
        }
    `],
    template: `
        <div class = "round_menu">
            <div class="button" (click)="addPerson()">Добавить</div>
            <div class="button" (click)="toggleSource('all')"   [class.button_active]="this.source != 'local'">Общая</div>
            <div class="button" (click)="toggleSource('local')" [class.button_active]="this.source == 'local'">Компания</div>
        </div>
        <div class="search-form">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'100%'"
                   [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon_right"></span>

            <div class="tool-box">
                <filter-select *ngIf="source == 'local'"
                    [name]="'Пользователь'"
                    [options]="usrOptions"
                    [value]="{'option' : filter.agentId}"
                    (newValue)="setUsrId($event)"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                               [name]="'Подразделение'"
                               [options]="orgOptions"
                               [value]="{'option' : filter.agentOrgId}"
                               (newValue)="filter.agentOrgId = $event; searchParamChanged()"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                               [name]="'Источник'"
                               [options]="[
                                  {value: 'all', label: 'Все'},
                                  {value: 'internet', label: 'Интернет площадки'},
                                  {value: 'print', label: 'Печатные издания'},
                                  {value: 'social', label: 'Социальные сети'},
                                  {value: 'messengers', label: 'Мессенджеры'},
                                  {value: 'email', label: 'E-mail-рассылка'},
                                  {value: 'recommendations', label: 'Рекомендации'},
                                  {value: 'other', label: 'Другое'}
                                ]"
                               [value]="{option : filter.sourceCode}"
                               (newValue)="filter.sourceCode = $event; searchParamChanged()"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                    [name]="'Посредничество'" [firstAsName]="true"
                    [options]="middlemanOptions"
                    [value]="{'option' : filter.isMiddleman}"
                    (newValue)="filter.isMiddleman = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                    [name]="'Тип контакта'" [firstAsName]="true"
                    [options]="typeCodeOptions"
                    [value]="{'option' : filter.typeCode}"
                    (newValue)="filter.typeCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                    [name]="'Стадия контакта'" [firstAsName]="true"
                    [options]="stageCodeOptions"
                    [value]="{'option' : filter.stageCode}"
                    (newValue)="filter.stageCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag *ngIf="source == 'local'" [value]="filter?.tag" (newValue)="filter.tag = $event; searchParamChanged();"></filter-select-tag>
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
                <div class="found">Найдено: {{hitsCount+" "}}/{{" "+persons?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>

        <div class="work-area" (contextmenu)="contextMenu($event)" (offClick)="selectedPerson = []" (scroll)="scroll($event)">
            <digest-person *ngFor="let p of persons; let i = index"
                [person]="p"
                (click)="clickPerson($event, p, i)"
                (dblclick)="openPerson(p)"
                [class.selected]="selectedPerson.indexOf(p) > -1"
                           [selected]="selectedPerson.indexOf(p) > -1"
                [class.alreadyAdd]="p.userRef && source != 'local'"
                [dateType] = "sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                [dataType]="source == 'local' ? 'person': 'user'"
                (contextmenu)="clickPerson($event, p, null)"
            >
            </digest-person>
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
        stateCode: 'all',
        sourceCode: "all",
        agentIdOrg: "all"
    };
    sort: any = {
        addDate: 'DESC'
    };
    localSort = Person.localSort;
    allSort = Person.allSort;

    middlemanOptions = [{value: 'all', label: 'Все'}];
    typeCodeOptions = [{value: 'all', label: 'Все'}];
    stateCodeOptions = [{value: 'all', label: 'Все'}];
    usrOptions = [{value: 'all', label: 'Все', class: "entry", items: []},
                  {value: 'my', label: 'Мои контакты', class: "entry", items: []}
    ];
    orgOptions = [{value: 'all', label: 'Все', class: "entry", items: []}];
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
        /*this.middlemanOptions = this.middlemanOptions.concat(Contact.middlemanOptions);
        this.stateCodeOptions = this.stateCodeOptions.concat(Person.stateCodeOptions);
        this.typeCodeOptions = this.typeCodeOptions.concat(Person.typeCodeOptions);*/
        //this.usrOptions = this.usrOptions.concat(this._userService.cacheOrgAndUser);
        this.orgOptions = this.orgOptions.concat(this._userService.cacheOrgs);
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
        let tab =  tabSys.addTab('person', {person: pers, canEditable: canEditable});
        this.eventTabs(tab);
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
                    this._personService.save(o).subscribe(person =>{
                        this.persons[this.persons.indexOf(o)] = person;
                        this.selectedPerson[this.selectedPerson.indexOf(o)] = person;
                    });
              } else if(evt.event == "set_agent"){
                    o.agentId = evt.agentId;
                    this._personService.save(o).subscribe(person =>{
                        this.persons[this.persons.indexOf(o)] = person;
                        this.selectedPerson[this.selectedPerson.indexOf(o)] = person;
                    });
              } else if(evt.event == "del_obj"){
                this._personService.delete(o).subscribe(
                    data => {
                        this.selectedPerson.splice(this.selectedPerson.indexOf(o), 1);
                        this.persons.splice(this.persons.indexOf(o), 1);
                    }
                );
              } else if(evt.event == "check"){

              } else if(evt.event == "photo"){

              } else if(evt.event = "set_tag"){
                    o.tag = evt.tag;
                    this._personService.save(o).subscribe(person =>{
                        this.persons[this.persons.indexOf(o)] = person;
                        this.selectedPerson[this.selectedPerson.indexOf(o)] = person;
                    });
              } else {

              }
        });
    }

    private eventTabs(tab: any) {
        tab.getEvent().subscribe(event =>{
            if(event.type == "update"){
                for(let i = 0; i < this.persons.length; ++i){
                    if(this.persons[i].id == event.value.id){
                        this.selectedPerson[this.selectedPerson.indexOf(this.persons[i])] = event.value;
                        this.persons[i] = event.value;
                        break;
                    }
                }
            } else if(event.type == "delete"){
                for(let i = 0; i < this.persons.length; ++i){
                    if(this.persons[i].id == event.value){
                        this.selectedPerson.splice(this.selectedPerson.indexOf(this.persons[i]), 1);
                        this.persons.splice(i, 1);
                        break;
                    }
                }
            }
        });
    }
}
