import {Component, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnInit, ViewChild} from "@angular/core";
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'multiselect-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['name','params', 'block', 'addName'],
    template: `
        <div (click)="hidden=!hidden" class="menu_header" [class.active]="!hidden">
            <span>{{name}}</span>
        </div>
        <div [hidden]="hidden" class="hidden_menu">
            <div *ngFor="let code of selects_arr; let i = index" class="option">
                <div class="remove" (click)="remove(code,i)"></div>
                <selects [options] = "getOptions(code)"
                         [value]= "code"
                         (newValue) = "changeType(code, i, $event)"
                >
                </selects>
                <input [value]="vals_arr[i]" [mask]="params[code]?.mask" [prefix] = "params[code]?.prefix" [placeholder]="params[code]?.placeholder">

            </div>
            <div class="add_button green" (click)="add_field($event)" *ngIf="getOptions()?.length > 0">{{addName}}</div>
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
            background-color: #D3D5D6;
        }

        .hidden_menu{
            line-height: 25px;
            width: 100%;
            cursor: pointer;
            padding: 0 40px 0 25px;
        }

        .option{
            width: calc(100% - 30px);
            border-bottom: 1px solid #d3d5d6;
            display: inline-flex;
            justify-content: space-between;
            height: 22px;
            line-height: 22px;
            margin: 6px 0 0 35px;
            position: relative;
        }

        input{
            width: calc(100% - 85px);
        }

        .remove{
            width: 14px;
            height: 14px;
            border-radius: 14px;
            background-color: #D00020;
            margin-right: 15px;
            position: absolute;
            left: -35px;
            top: 3px;
        }

        .remove:after {
            content: "";
            width: 8px;
            height: 3px;
            background-color: #fff;
            display: block;
            position: relative;
            left: 3px;
            top: 5px;
        }

        .add_button{
            height: 12px;
            line-height: 12px;
            margin: 10px 0 20px;
            padding-left: 35px;
        }

    `]
})


export class MultiSelectComponent implements OnInit, OnChanges{
    public name: string = "";
    public params: any = {};
    public block: any;
    public addName: string = "Добавить";

    selects_arr: string[] = []; //массив заполненных
    vals_arr: string[] = []; //массив значений
    adds_arr: any[] = []; //массив для ui-select
    keys_arr: string[]; //массив всех ключей

    hidden: boolean = true;

    @Output() result: EventEmitter<any> = new EventEmitter();

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.vals_arr = [];
        if(changes.params){
            this.keys_arr = Object.keys(this.params);
        }
        if(changes.block && this.block && this.keys_arr){
            let block_keys = Object.keys(this.block);
            for (let key of block_keys) {
                if(this.block[key]){
                    let len = this.selects_arr.push(key);
                    this.vals_arr.push(this.block[this.selects_arr[len-1]]);
                }
            }
            this.adds_arr = this.keys_arr.filter(val => this.selects_arr.indexOf(val) == -1);
        }
    }

    getOptions(code?): any{
        let temp = [];
        let for_select;
        if(code)
            for_select = [this.keys_arr[this.keys_arr.indexOf(code)]].concat(this.adds_arr);
        else
            for_select = [].concat(this.adds_arr);
        for (let key of for_select) {
            temp.push({value: key, label: this.params[key].label});
        }
        return temp;
    }

    add_field(event){
        event.stopPropagation();
        let key = this.adds_arr.pop();
        this.selects_arr.push(key);
        this.vals_arr.push("");
    }

    remove(code: string, index: number){
        this.vals_arr.splice(index, 1);
        this.selects_arr.splice(index, 1);
        this.adds_arr.push(code);
    }

    select(opt: any) {
        this.hidden = true;
        this.result.emit(opt);
    }

    changeType(code: string, index: number, newVal: string){
        if(code != newVal){
            this.selects_arr[index] = newVal;
            this.adds_arr[this.adds_arr.indexOf(newVal)] = code;

        }
    }
}
