import {Component, OnInit, AfterViewInit} from "@angular/core";

import {HubService} from "../../service/hub.service";
import {ConfigService} from "../../service/config.service";
import {OrganisationService} from "../../service/organisation.service";

import {Tab} from "../../class/tab";
import {Organisation} from "../../entity/organisation";
import {Person} from "../../entity/person";
import {UserService} from "../../service/user.service";
import {SessionService} from "../../service/session.service";

@Component({
    selector: "tab-list-organisation",
    inputs: ["tab"],
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

        digest-organisation {
            height: 57px;
            min-height: 57px;
            padding-top: 6px;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
        }

        digest-organisation:hover {
            background-color: var(--bottom-border);
        }

        digest-organisation.selected {
            background-color: var(--color-blue);
        }
    `],
    template: `
        <div class="round_menu">
            <div class="button" (click)="addOrganisation()">Добавить</div>
            <div (click)="toggleSource('all')" class="button" [class.button_active]="this.source != 'local'">Общая</div>
            <div (click)="toggleSource('local')" class="button" [class.button_active]="this.source == 'local'">
                Компания
            </div>
        </div>
        <div class="search-form">
            <input type="text" class="input_line" placeholder="Введите поисковый запрос" [style.width]="'100%'"
                   [(ngModel)]="searchQuery" (keyup)="searchParamChanged()"
            ><span class="find_icon_right"></span>

            <div class="tool-box">
                <filter-select *ngIf="source == 'local'"
                               [name]="'Статус'"
                               [options]="middlemanOptions"
                               [value]="{'option' : filter.isMiddleman}"
                               (newValue)="filter.isMiddleman = $event.option; searchParamChanged();"
                >
                </filter-select>
                <filter-select
                    [name]="'Тип'" [firstAsName]="true"
                    [options]="typeCodeOptions"
                    [value]="{'option' : filter.typeCode}"
                    (newValue)="filter.typeCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                               [name]="'Стадия'" [firstAsName]="true"
                               [options]="stageCodeOptions"
                               [value]="{'option' : filter.stageCode}"
                               (newValue)="filter.stageCode = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select *ngIf="source == 'local'"
                               [name]="'Подразделение'" [firstAsName]="true"
                               [options]="goverTypeOptions"
                               [value]="{'option' : filter.goverType}"
                               (newValue)="filter.goverType = $event; searchParamChanged();"
                >
                </filter-select>
                <filter-select-tag *ngIf="source == 'local'" [value]="filter?.tag"
                                   (newValue)="filter.tag = $event; searchParamChanged();"></filter-select-tag>
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
                    [options]="this.source == 'local' ? localSort : allSort"
                    [value]="getSort()"
                    (newValue)="setSort($event.option, $event.subvalue); searchParamChanged();"
                >
                </filter-select>
                <div class="found">Найдено: {{hitsCount + " "}}/{{" " + persons?.length }}</div>
            </div>
        </div>

        <hr class='underline'>
        <div class="head"><span>{{tab.header}}</span></div>

        <div class="work-area" (contextmenu)="contextMenu($event)" (offClick)="selectedOrg = []"
             (scroll)="scroll($event)">
            <digest-organisation *ngFor="let org of organisations; let i = index"
                                 [organisation]="org"
                                 (click)="clickOrganisation($event, org, i)"
                                 (dblclick)="openOrganisation(org)"
                                 [class.selected]="selectedOrg.indexOf(org) > -1"
                                 [class.alreadyAdd]="org.orgRef && source != 'local'"
                                 [dateType]="sort.changeDate ? 'changeDate' : sort.assignDate ? 'assignDate' : 'addDate'"
                                 (contextmenu)="clickOrganisation($event, org)"
            >
            </digest-organisation>
        </div>
    `
})

export class TabListOrganisationComponent implements OnInit {
    public tab: Tab;

    organisations: Organisation[] = [];
    selectedOrg: Organisation[] = [];
    source = "local";
    persons: Person[] = [];
    searchQuery: string = "";
    hitsCount: number = 0;
    page = 0;
    localSort = Organisation.localSort;
    allSort = Organisation.allSort;
    filter: any = {
        tag: null,
        typeCode: "all",
        changeDate: "all",
        stateCode: "all",
        goverType: "all",
        ourCompany: "all"
    };
    sort: any = {
        addDate: "DESC"
    };

    typeCodeOptions = [{value: "all", label: "Все"},
        {value: "our", label: "Наша компания"}];
    stageCodeOptions = [{value: "all", label: "Все"}];
    goverTypeOptions = [{value: "all", label: "Все"}];
    middlemanOptions = [{value: "all", label: "Все"}];
    usrOptions = [{value: "all", label: "Все", class: "entry", items: []}
    ];

    lastClckIdx: number = 0;

    dateFilter = [{value: "all", label: "Все", class: "entry", items: []},
        {
            value: "addDate", label: "Добавлено", class: "submenu", items: [
                {value: "1", label: "1 день", class: "entry", items: []},
                {value: "3", label: "3 дня", class: "entry", items: []},
                {value: "7", label: "Неделя", class: "entry", items: []},
                {value: "17", label: "2 недели", class: "entry", items: []},
                {value: "30", label: "Месяц", class: "entry", items: []},
                {value: "90", label: "3 месяца", class: "entry", items: []}
            ]
        },
        {
            value: "changeDate", label: "Изменено", class: "submenu", items: [
                {value: "1", label: "1 день", class: "entry", items: []},
                {value: "3", label: "3 дня", class: "entry", items: []},
                {value: "7", label: "Неделя", class: "entry", items: []},
                {value: "17", label: "2 недели", class: "entry", items: []},
                {value: "30", label: "Месяц", class: "entry", items: []},
                {value: "90", label: "3 месяца", class: "entry", items: []}
            ]
        }
    ];

    constructor(private _configService: ConfigService,
                private _hubService: HubService,
                private _organisationService: OrganisationService,
                private _userService: UserService,
                private _sessionService: SessionService
    ) {
        setTimeout(() => {
            this.tab.header = "Контрагенты";
        });
    }

    ngOnInit() {
        /*this.middlemanOptions = this.middlemanOptions.concat(Organisation.middlemanOptions);
        this.stateCodeOptions = this.stateCodeOptions.concat(Organisation.stateCodeOptions);
        this.typeCodeOptions = this.typeCodeOptions.concat(Organisation.typeCodeOptions);
        this.goverTypeOptions = this.goverTypeOptions.concat(Organisation.goverTypeOptions);*/
        this.tab.refreshRq.subscribe(
            sender => {
                this.listOrganisation();
            }
        );
        this.usrOptions = this.usrOptions.concat(this._userService.cacheOrgAndUser);
        this.listOrganisation();
    }

    scroll(e) {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            this.page += 1;
            this.listOrganisation();
        }
    }

    toggleSource(s: string) {
        this.source = s;
        this.organisations = [];
        this.selectedOrg = [];
        this.page = 0;
        this.listOrganisation();
    }

    getSort() {
        for (let k in this.sort) {
            return {option: k, subvalue: this.sort[k]};
        }
    }

    setSort(val1, val2) {
        this.sort = {};
        this.sort[val1] = val2;
    }



    listOrganisation() {
        if (this.page == 0) {
            this.organisations = [];
        }
        this._organisationService.list(this.page, 50, this.source, this.filter, this.sort, this.searchQuery).subscribe(
            data => {
                if (this.page == 0) {
                    this.organisations = data;
                } else {
                    data.forEach(i => {
                        this.organisations.push(i);
                    });
                }
            },
            err => console.log(err)
        );
    }

    setTypeCode(event) {
        if (event == "all") {
            delete this.filter.typeCode;
            delete this.filter.ourCompany;
        } else {
            if (event == "our") {
                delete this.filter.typeCode;
                this.filter.ourCompany = 1;
            } else {
                this.filter.ourCompany = 0;
                this.filter.typeCode = event;
            }
        }
        this.searchParamChanged();
        this.filter.typeCode = event;
    }

    addOrganisation() {
        let tabSys = this._hubService.getProperty("tab_sys");
        tabSys.addTab("organisation", {organisation: new Organisation(), canEditable: true});
    }

    searchParamChanged() {
        this.organisations = [];
        this.selectedOrg = [];
        this.page = 0;
        this.listOrganisation();

    }

    openOrganisation(org: Organisation) {
        let tabSys = this._hubService.getProperty("tab_sys");
        let canEditable = this.source == "local" && (this._sessionService.getUser().accountId == org.accountId);
        tabSys.addTab("organisation", {organisation: org, canEditable: canEditable});
    }

    clickOrganisation(event: MouseEvent, org: Organisation, i: number) {
        if (event.button == 2) {
            if (this.selectedOrg.indexOf(org) == -1) {
                this.lastClckIdx = i;
                this.selectedOrg = [org];
            }
        } else {
            if (event.ctrlKey) {
                this.lastClckIdx = i;
                this.selectedOrg.push(org);
            } else if (event.shiftKey) {
                this.selectedOrg = [];
                let idx = i;
                let idx_e = this.lastClckIdx;
                if (i > this.lastClckIdx) {
                    idx = this.lastClckIdx;
                    idx_e = i;
                }
                while (idx <= idx_e) {
                    let oi = this.organisations[idx++];
                    this.selectedOrg.push(oi);
                }
            } else {
                this.lastClckIdx = i;
                this.selectedOrg = [org];
            }
        }
    }

    setDateFilter(event) {
        delete this.filter.changeDate;
        delete this.filter.addDate;
        if (event.option != "all") {
            this.filter[event.option] = event.subvalue;
        }
        this.searchParamChanged();
    }

    contextMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        let c = this;
        let uOpt = [];
        let stateOpt = [];

        let tag = this.selectedOrg[0].tag || null;
        let menu = {
            pX: e.pageX,
            pY: e.pageY,
            scrollable: false,
            items: [
                {
                    class: "entry",
                    disabled: this.selectedOrg.length == 1 ? false : true,
                    icon: "",
                    label: "Проверить",
                    callback: () => {
                        //this.openPopup = {visible: true, task: "check"};
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Открыть", callback: () => {
                        let tab_sys = this._hubService.getProperty("tab_sys");
                        this.selectedOrg.forEach(o => {
                            let canEditable = this.source == "all" ? false : true && (this._sessionService.getUser().accountId() == o.accountId);
                            tab_sys.addTab("organisation", {organisation: o, canEditable});
                        });
                    }
                },
                {
                    class: "entry", disabled: this.source != "local", icon: "", label: "Удалить",
                    callback: () => {
                        this.clickContextMenu({event: "del_obj"});
                    }
                },
                {class: "delimiter"},
                {
                    class: "entry",
                    disabled: this.canImpactAmongAdd(),
                    icon: "",
                    label: "Добавить в контрагенты",
                    callback: () => {
                        this.clickContextMenu({event: "add_to_local"});
                    }
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Добавить задачу", items: []
                },
                {
                    class: "entry", disabled: false, icon: "", label: "Добавить заметку", items: []
                },
                {class: "delimiter"},
                {
                    class: "submenu", disabled: false, icon: "", label: "Отправить E-mail", items: [
                        {class: "entry", disabled: false, label: "Email1"},
                        {class: "entry", disabled: false, label: "Email2"},
                        {class: "entry", disabled: false, label: "Email3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Отправить SMS", items: [
                        {class: "entry", disabled: false, label: "Номер1"},
                        {class: "entry", disabled: false, label: "Номер2"},
                        {class: "entry", disabled: false, label: "Номер3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Позвонить", items: [
                        {class: "entry", disabled: false, label: "Номер1"},
                        {class: "entry", disabled: false, label: "Номер2"},
                        {class: "entry", disabled: false, label: "Номер3"}
                    ]
                },
                {
                    class: "submenu", disabled: false, icon: "", label: "Написать в чат", items: []
                },
                {class: "delimiter", disabled: !(this.source == "local" && this.canImpact())},
                {
                    class: "submenu",
                    disabled: !(this.source == "local" && this.canImpact()),
                    icon: "",
                    label: "Назначить тег",
                    items: [
                        {
                            class: "tag",
                            icon: "",
                            label: "",
                            offer: this.selectedOrg.length == 1 ? this.selectedOrg[0] : null,
                            tag,
                            callback: (new_tag) => {
                                this.clickContextMenu({event: "set_tag", tag: new_tag});
                            }
                        }
                    ]
                }
            ]
        };

        this._hubService.shared_var["cm"] = menu;
        this._hubService.shared_var["cm_hidden"] = false;
    }

    canImpact() {
        for (let org of this.selectedOrg) {
            if (org.accountId != this._sessionService.getUser().accountId)
                return false;
        }
        return true;
    }

    canImpactAmongAdd() {
        if (this.source != "local") {
            for (let org of this.selectedOrg) {
                if (org.orgRef != null)
                    return true;
            }
            return false;
        } else return true;

    }

    clickContextMenu(evt: any) {
        this.selectedOrg.forEach(o => {
            if (evt.event == "add_to_local") {
                o.changeDate = Math.round((Date.now() / 1000));
                o.addDate = o.changeDate;
                o.stateCode = "raw";
                o.id = null;
                o.typeCode = "realtor";
                o.isAccount = false;
                this._organisationService.save(o);
            } else if (evt.event == "del_obj") {

            } else if (evt.event == "check") {

            } else if (evt.event == "set_tag") {
                o.tag = evt.tag;
                this._organisationService.save(o);
            } else {

            }
        });
    }
}
