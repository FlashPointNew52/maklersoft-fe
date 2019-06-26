import {Component, OnInit, OnChanges} from '@angular/core';
import {Output,Input, EventEmitter} from '@angular/core';
import {SuggestionService} from "../../service/suggestion.service";
import {PersonService} from "../../service/person.service";
import {SessionService} from "../../service/session.service";
import {UserService} from "../../service/user.service";
import {OrganisationService} from '../../service/organisation.service';
import {HubService} from '../../service/hub.service';
import {Offer} from '../../entity/offer';
import {Tab} from '../../class/tab';
import {Person} from '../../entity/person';
import {Organisation} from '../../entity/organisation';
import {AddressBlock} from "../../class/addressBlock";
import {PhoneBlock} from "../../class/phoneBlock";

@Component({
    selector: 'input-line',
    inputs: ['name', 'queryTipe', 'type', 'value', 'filter'],
    styles: [`
        .input_line{
            border: 0;
            height: 19px;
            text-overflow: ellipsis;
            background-color: transparent;
            font-size: 12px;
            padding: 0;
            width: 100%;
        }

        .label{
            position: absolute;
            top: 0;
            height: 10px;
            left: 0;
            transition: 0.5s;
            z-index: -1;
        }

        .ng-untouched + .label{
        }

        .ng-touched + .label{

        }

        .focus + .label{
            font-size: 10px;
            top: -9px;
            transition: 0.5s;
        }

        .suggestions{
            position: absolute;
            z-index: 999;
            background-color: white;
            left: -47px;
            margin-top: 34px;
            font-size: 12px;
            top: 0;
            width: calc(100% + 101px);
            padding-left: 25px;
            box-sizing: border-box;
            min-height: 40px;
            text-transform: none;
        }

        .suggestions ul{
            list-style-type: none;
            padding: 0;
            text-align: left;
            margin: 0 0 10px 0;
        }

        .suggestions ul li{
            cursor: default;
        }
        .suggestions  ul:hover {
            background: #f7f7f7;
            cursor: default;
        }

        .suggestions a{
            text-decoration: none;
        }

        .suggestions a div{
            color: #3B5998;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
        }

        .suggestions a div span{
            color: #677578;
            font-size: 12px;
            font-weight: initial;
        }
    `],
    template: `
        <input type="{{type}}" [value] = "value" class = "input_line" [(ngModel)]="searchQuery" [class.focus]="searchQuery.length > 0" (focus)="setClass($event, 'focus')" (blur)="removeClass($event, 'focus')"
               (keyup) = "edit($event)" [class.short_field]="queryTipe"
        >
        <span class="label">{{name}}</span>

        <div class="suggestions" (document:click)="docClick()" *ngIf="queryTipe && sgList.length > 0">
                <ul *ngFor="let item of sgList; let i = index" >
                    <li >
                        <a (click)="select(item, $event)" *ngIf="this.queryTipe == 'address'">{{item}}</a>
                        <a (click)="select(item, $event)" *ngIf="this.queryTipe == 'organisation'">
                          <div>{{item.name}}</div>
                          <div><span>{{getAddress(item.addressBlock)}}</span></div>
                        </a>
                        <a (click)="select(item, $event)" *ngIf="this.queryTipe == 'person'">
                          <div>{{item.name}}</div>
                          <div>Тел: <span>{{getPhone(item.phoneBlock)}}</span></div>
                        </a>
                        <a (click)="select(item, $event)" *ngIf="this.queryTipe == 'user'">
                          <div>{{item.name}}</div>
                          <div>Тел: <span>{{getPhone(item.phoneBlock)}}</span></div>
                        </a>
                    </li>
                </ul>
        </div>
    `
})


export class InputLineComponent implements OnInit, OnChanges{
    public name: string;
    public value: string = "";
    public queryTipe: string;
    public type: string = "text";
    public filter: any = {};
    in_line: any;
    searchQuery: string = "";
    multiselect: HTMLElement;
    sgList: any[] = [];
    person: any;
    organisation: any;
    @Output() newValue: EventEmitter<any> = new EventEmitter();

    constructor(private _suggestionService: SuggestionService,
                private _personService: PersonService,
                private _userService: UserService,
                private _sessionService: SessionService,
                private _organisationService: OrganisationService,
                private _hubService: HubService,
    ){

    }

    ngOnInit() {
        this.searchQuery = this.value ? this.value.toString() : '';
    }

    ngOnChanges() {
        this.searchQuery = this.value ? this.value.toString() : '';
    }

    setClass(event, className) {
        let elem = event.currentTarget as HTMLElement;
        elem.classList.add(className);
    }

    removeClass(event, className) {
        if(!this.searchQuery ||  this.searchQuery.length == 0){
            let elem = event.currentTarget as HTMLElement;
            elem.classList.remove(className);
        }

    }

    isClick(event){
        if(this.queryTipe && this.queryTipe == "address"){
            /*let parent: HTMLElement = (<HTMLElement>event.currentTarget).parentElement;
            while(parent.className.indexOf('view-group')== -1 && parent.className !== null){
                parent = parent.parentElement;
            }
            let field: HTMLElement = <HTMLElement>parent.getElementsByTagName('ui-multiselect').item(0);
            if(field.style.getPropertyValue('visibility') == 'hidden'){
                field.style.setProperty('visibility','visible');
            } else if(field.style.getPropertyValue('visibility') == ''){
                field.style.setProperty('visibility','hidden');
            }
            let height: number;
            if(parent.getElementsByTagName('input').length > 0)
                height = parent.getElementsByTagName('input').length * 35;
            else
                height = (parent.getElementsByTagName('input').length - 1) * 35;
            if(parent.offsetHeight == 30){
                //parent.style.setProperty('height', ""+(height+15)+'px');
                parent.style.setProperty('overflow', "visible");
            }*/
        }
    }

    isClick1(event){
        if(this.queryTipe && this.queryTipe == "address"){
            /*let parent: HTMLElement = (<HTMLElement>event.currentTarget).parentElement;
            while(parent.className.indexOf('view-group')== -1 && parent.className !== null){
                parent = parent.parentElement;
            }
            let field: HTMLElement = <HTMLElement>parent.getElementsByTagName('ui-multiselect').item(0);
            let inputs  = field.getElementsByTagName('input');
            if(inputs.length < 1){
                if(field.style.getPropertyValue('visibility') == ''){
                    field.style.setProperty('visibility','hidden');
                }
                let height: number;

                if(parent.getElementsByTagName('input').length > 0)
                    height = parent.getElementsByTagName('input').length * 35;
                    else
                    height = (parent.getElementsByTagName('input').length - 1) * 35;
                    if(parent.offsetHeight == 30){
                        //parent.style.setProperty('height', ""+(height+15)+'px');
                        parent.style.setProperty('overflow', "visible");
                    }
            }*/
        }
    }

    edit(event) {
        /*if(this.searchQuery.length > 2){
            this.in_line = (<HTMLElement>event.currentTarget).parentElement.parentElement;
            this.in_line.style.setProperty('z-index', '99');
            if(this.queryTipe){
                this.searchParamChanged(event);
            }
        } else if(!this.searchQuery || this.searchQuery.length == 0){
            if(this.queryTipe){
                this.onChange.emit({name: "Неизвестно", id: null});
                this.sgList = [];
            } else {
                this.onChange.emit("");
            }

        } else if(!this.queryTipe){
            this.onChange.emit(this.searchQuery);
        }*/
        this.newValue.emit(this.searchQuery);
    }



    docClick(){
        this.in_line.style.removeProperty('z-index');
        this.sgList = [];
    }

    searchParamChanged(e) {
        if (this.searchQuery && this.searchQuery.length > 0) {
            let sq = this.searchQuery.split(" ");
            let lp = sq.pop()
            let q = sq.join(" ");
            if (lp.length > 0) {
                if(this.queryTipe == "address"){
                    this._suggestionService.list(this.searchQuery).subscribe(sgs => {
                        this.sgList = sgs;
                    });
                } else if(this.queryTipe == "person"){
                    this._personService.list( 0, 10, 'local', this.filter, {}, this.searchQuery).subscribe(sgs => {
                        this.sgList = sgs;
                    });
                } else if(this.queryTipe == "organisation"){
                    this._organisationService.list(0, 10, 'local', this.filter,{}, this.searchQuery).subscribe(sgs => {
                        this.sgList = sgs;
                    });
                } else if(this.queryTipe == "user"){
                    this._userService.list(0, 10, this.filter,{}, this.searchQuery).subscribe(sgs => {
                        this.sgList = sgs;
                    });
                }
            }
        } else if(this.queryTipe == "address"){
            this.newValue.emit(new AddressBlock());
            this.multiselect.style.setProperty('display','none');
        }
    }

    select(itm: any, event) {

        if(this.queryTipe && this.queryTipe == "address"){
            this.searchQuery = itm;
            //this.isClick(event);
            let fullAddress: AddressBlock =  Offer.parseAddress(itm);
            this.newValue.emit(fullAddress);
            if(!this.multiselect)
                this.multiselect = <HTMLElement>(<HTMLElement>event.target).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("UI-MULTISELECT").item(0);
            this.multiselect.style.removeProperty('display');
        } else if(this.queryTipe && (this.queryTipe == "person" || this.queryTipe == "organisation" || this.queryTipe == "user")){
            this.searchQuery = itm.name;
            this.newValue.emit(itm);
        }
        this.sgList = [];
        this.in_line.style.removeProperty('z-index');
    }

    addPerson() {
        let tab_sys = this._hubService.getProperty('tab_sys');
        this.person = new Person();
        tab_sys.addTab('person', {person: this.person});
        setTimeout(() =>{
            this.newValue.emit(this.person);
        }, 10000);

    }

    addOrganisation(){
        let tab_sys = this._hubService.getProperty('tab_sys');
        this.organisation = new Organisation();
        tab_sys.addTab('organisation', {organisation: this.organisation});
        setTimeout(() =>{
            this.newValue.emit(this.organisation);
        }, 10000);
    }


    getAddress(addressBlock: AddressBlock) {
       return  AddressBlock.getAsString(addressBlock);
    }

    public getPhone(phoneBlock: any) {
      return  PhoneBlock.getNotNullData(phoneBlock);
    }
}
