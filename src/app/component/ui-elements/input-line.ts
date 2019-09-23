import {Component, OnInit, OnChanges} from "@angular/core";
import {Output, Input, EventEmitter} from "@angular/core";
import {SuggestionService} from "../../service/suggestion.service";
import {PersonService} from "../../service/person.service";
import {SessionService} from "../../service/session.service";
import {UserService} from "../../service/user.service";
import {OrganisationService} from "../../service/organisation.service";
import {PhoneBlock} from "../../class/phoneBlock";

@Component({
    selector: "input-line",
    inputs: ["name", "value", "query"],
    styles: [`
        .input_line {
            border: 0;
            height: 19px;
            text-overflow: ellipsis;
            background-color: transparent;
            font-size: 12px;
            padding: 0;
            width: 100%;
        }

        .label {
            position: absolute;
            top: 0;
            height: 10px;
            left: 0;
            transition: 0.5s;
            z-index: -1;
        }

        .ng-untouched + .label {
        }

        .ng-touched + .label {

        }

        .focus + .label {
            font-size: 10px;
            top: -9px;
            transition: 0.5s;
        }

        .suggestion {
            position: absolute;
            padding: 10px 0;
            background-color: var(--box-backgroung);
            width: calc(100% + 50px);
            left: -25px;
            box-shadow: 2px 5px 5px 0 var(--color-grey);
            z-index: 99;
        }

        .suggestion > span {
            display: block;
            color: var(--color-blue);
            padding: 0 48px;
            cursor: pointer;
        }

        .suggestion > span:hover {
            background-color: var(--box-hover-element);

        }

        .suggestion > span > span{
            color: inherit;
            display: block; 
        }

        .suggestion > span > div > span{
            display: block;
        }
    `],
    template: `
        <input [value]="value" class="input_line" [(ngModel)]="searchQuery"
               [class.focus]="searchQuery.length > 0" (focus)="setClass($event, 'focus')"
               (blur)="removeClass($event, 'focus')" (keyup)="edit()">
        <span class="label">{{name}}</span>
        <div class="suggestion" *ngIf="query && sgList.length > 0">
            <ng-container *ngFor="let item of sgList; let i = index">
                <span (click)="select(item)">
                    <span>{{item.name}}</span>
                    <div *ngIf="this.query.type == 'person' || this.query.type == 'user'">
                        <span class="view-value" *ngIf="item?.phoneBlock?.main">{{ "+7" + item?.phoneBlock?.main | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.cellphone">{{ "+7" + item?.phoneBlock?.cellphone | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.office">{{ "+7" + item?.phoneBlock?.office | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.fax">{{ "+7" + item?.phoneBlock?.fax | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.home">{{ "+7" + item?.phoneBlock?.home | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.other">{{ "+7" + item?.phoneBlock?.other | mask: "+0 (000) 000-00-00"}}</span>
                        <span class="view-value" *ngIf="item?.phoneBlock?.ip">{{ "+7" + item?.phoneBlock?.ip | mask: "+0 (000) 000-00-00"}}</span>
                    </div>
                </span>
            </ng-container>

        </div>
    `
})


export class InputLineComponent implements OnInit, OnChanges {
    public name: string;
    public value: string = "";
    public query: any;

    searchQuery: string = "";
    sgList: any[] = [];
    timer = null;

    @Output() newValue: EventEmitter<any> = new EventEmitter();

    constructor(private _suggestionService: SuggestionService,
                private _personService: PersonService,
                private _userService: UserService,
                private _sessionService: SessionService,
                private _organisationService: OrganisationService
    ) {
    }

    ngOnInit() {
        this.searchQuery = this.value ? this.value.toString() : "";
    }

    ngOnChanges() {
        this.searchQuery = this.value ? this.value.toString() : "";
    }

    setClass(event, className) {
        let elem = event.currentTarget as HTMLElement;
        elem.classList.add(className);
    }

    removeClass(event, className) {
        if (!this.searchQuery || this.searchQuery.length == 0) {
            let elem = event.currentTarget as HTMLElement;
            elem.classList.remove(className);
        }
    }

    edit() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.query) {
                console.log(this.query, this.searchQuery);
                if (this.searchQuery && this.searchQuery.trim().length > 2) {
                    if (this.query.type) {
                        this.sgList = [];
                        this.searchParamChanged();
                    }
                } else if (!this.searchQuery || this.searchQuery && this.searchQuery.trim().length == 0) {
                    if (this.query.type) {
                        this.newValue.emit({name: "", id: null});
                        this.sgList = [];
                    } else {
                        this.newValue.emit("");
                    }
                }
            } else {
                this.newValue.emit(this.searchQuery);
            }
        }, 500);
    }

    searchParamChanged() {
        if (this.query.type == "person") {
            this._personService.list(0, 10, "local", this.query.filter, {}, this.searchQuery).subscribe(sgs => {
                this.sgList = sgs;
            });
        } else if (this.query.type == "org") {
            this._organisationService.list(0, 10, "local", this.query.filter, {}, this.searchQuery).subscribe(sgs => {
                this.sgList = sgs;
            });
        } else if (this.query.type == "user") {
            this._userService.list(0, 10, this.query.filter, {}, this.searchQuery).subscribe(sgs => {
                this.sgList = sgs;
            });
        }
    }

    select(itm: any) {
        this.searchQuery = itm.name;
        this.newValue.emit(itm);
        this.sgList = [];
    }

    public getPhone(phoneBlock: any) {
        return PhoneBlock.getNotNullData(phoneBlock);
    }
}
