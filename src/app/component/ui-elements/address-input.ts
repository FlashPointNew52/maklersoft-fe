import {Component, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnInit, ViewChild} from "@angular/core";
import {Output, EventEmitter} from '@angular/core';
import {AddressBlock} from "../../class/addressBlock";
import {SuggestionService} from "../../service/suggestion.service";

@Component({
    selector: 'address-input',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['name' ,'params', 'block', 'addressType'],
    template: `
        <div (click)="hidden=!hidden" class="menu_header" [class.active]="!hidden">
            <span>{{name}}</span>
        </div>
        <div [hidden]="hidden" class="hidden_menu">
            <div class="option">
                <div>Регион</div>
                <input [(ngModel)]="addressStructure.region.value" (keyup)="find('region', addressStructure.region.value, null); top=24">
            </div>
            <div class="option">
                <div>Нас. пункт</div>
                <input [(ngModel)]="addressStructure.city.value" (keyup)="find('city', addressStructure.city.value, null); top=49">
            </div>
            <div class="option">
                <div>Улица</div>
                <input [(ngModel)]="addressStructure.street.value" (keyup)="find('street', addressStructure.street.value, addressStructure.city.id); top=74">
            </div>
            <div class="option">
                <div>Дом</div>
                <input [(ngModel)]="addressStructure.building.value" (keyup)="find('building', addressStructure.building.value, addressStructure.street.id); top=99">
            </div>
            <div class="option">
                <div>Квартира</div>
                <input [(ngModel)]="addressStructure.apartment.value">
            </div>
            <div class="option">
                <div>Адм. район</div>
                <input [(ngModel)]="addressStructure.admArea.value">
            </div>
            <div class="option">
                <div>Микрорайон</div>
                <input [(ngModel)]="addressStructure.area.value">
            </div>
            <div class="option">
                <div>Остановка</div>
                <input [(ngModel)]="addressStructure.busStop.value">
            </div>
            <div class="option">
                <div>Станция</div>
                <input [(ngModel)]="addressStructure.station.value">
            </div>
            <div class="suggestion" *ngIf="sgList.length > 0" [style.top.px]="top">
                <span *ngFor="let sg of sgList" (click)="setKladr(sg)">{{sg?.typeShort}}. {{sg?.name}}{{typeAddress == 'city' ? 
                    ", "+ sg.parents[0]?.name + " " + sg.parents[0]?.typeShort : ""}}</span>
            </div>
        </div>
    `,
    styles: [`
        .menu_header{
            width: 100%;
            padding: 0 40px 0 25px;
            display: inline-flex;
            justify-content: space-between;
            cursor: pointer;
            margin-bottom: 4px;
        }

        .active {
            background-color: var(--selected-digest);
        }

        .hidden_menu{
            position: relative;
            line-height: 25px;
            width: 100%;
            cursor: pointer;
        }

        .option{
            width: 100%;
            display: inline-flex;
            justify-content: space-between;
            height: 30px;
            line-height: 30px;
            position: relative;
            padding: 0 40px 0 50px;
        }

        input{
            width: calc(100% - 85px);
            padding-left: 10px;
            border-bottom: 1px solid var(--bottom-border);
        }

        .option:hover,  .option:hover > input{
            background-color: var(--hover-menu);
        }
        
        .suggestion{
            position: absolute;
            padding: 10px 0;
            background-color: var(--box-backgroung);
            width: 100%;
            left: 0;
            box-shadow: 0 1px 6px 0 var(--box-shadow);
            z-index: 99;
        }

        .suggestion span{
            display: block;
            color: var(--color-blue);
            padding: 0 48px;
        }

        .suggestion span:hover{
            background-color: var(--box-hover-element);

        }

    `]
})

export class AddressInputComponent implements OnInit, OnChanges{
    public name: string = "Адрес";
    public block: AddressBlock;
    public addressType: string;

    typeAddress = null;

    addressStructure = {
        region: {label: 'Регион', value: null, id: null},
        city: {value: null, id: null},
        admArea: {label: 'Адм. район', value: null,id: null},
        area: {label: 'Район', value: null,id: null},
        street: {value: null, id: null},
        building: {label: 'Дом', value: null, id: null},
        apartment: {label: 'Квартира', value: null, id: null},
        station: {label: 'Станция', value: null},
        busStop: {label: 'Остановка', value: null}
    };

    sgList: any[] = [];

    hidden: boolean = true;
    top: number = 0;
    @Output() newData: EventEmitter<any> = new EventEmitter();
    constructor(private _suggestionService: SuggestionService){

    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(changes.block && changes.block.currentValue !== changes.block.previousValue){
            let fields = Object.keys(changes.block.currentValue);
            for (let key of fields) {
                if(changes.block.currentValue[key].value && changes.block.currentValue.length > 0)
                    this.addressStructure[key].value = this.block[key];
            }
        }
    }


    find(type, query, parent) {
        this.typeAddress = type;
        this.sgList = [];
        if(query && query.length > 0){
            this._suggestionService.kladr_list(query, type, parent).subscribe(data => {
                this.sgList = data;
            });
        }

    }

    public setKladr(sg: any) {
        this.addressStructure[this.typeAddress].value = sg.typeShort + ". " + sg.name;
        this.addressStructure[this.typeAddress].id = sg.id;
        if(this.typeAddress == 'city'){
            this.addressStructure.region.value = sg.parents[0].name + " " + sg.parents[0].typeShort;
            this.addressStructure.region.id = sg.parents[0].id;
        }
        if(this.typeAddress == 'building'){
            this.addressStructure.area.value = "";
            this.addressStructure.admArea.value = "";
            let fields = Object.keys(this.addressStructure);
            for (let key of fields) {
                if(this.addressStructure[key].value && this.addressStructure[key].value.length > 0)
                    this.block[key] = this.addressStructure[key].value;
            }
            this._suggestionService.latLonWithArea(this.block).subscribe(data => {
                this.block = data.addressBlock;
                this.addressStructure.area.value = this.block.area;
                this.addressStructure.admArea.value = this.block.admArea;
                this.newData.emit({address: this.block, location: data.latLon});
            });
        }
        this.sgList = [];
    }
}
