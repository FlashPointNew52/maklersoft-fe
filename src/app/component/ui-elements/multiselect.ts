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
                <div class="red-circle" (click)="remove(code,i)"><div class="line-in-circle"></div></div> 
                <selects [options] = "getOptions(code)"
                         [value]= "code"
                         (newValue) = "changeType(code, i, $event)"
                >
                </selects>
                <input [(ngModel)]="vals_arr[i]" [mask]="params[code]?.mask" [prefix] = "params[code]?.prefix"
                       [placeholder]="params[code]?.placeholder" (keyup)="newValue(code, vals_arr[i])"
                       (paste)="onPaste($event, i, code)"
                >

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
            padding-left: 10px;
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

    @Output() newData: EventEmitter<any> = new EventEmitter();

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(changes.params && changes.block.currentValue){
            this.keys_arr = Object.keys(this.params);
        }
        if(changes.block && this.block && this.keys_arr && changes.block.currentValue && changes.block.currentValue !== changes.block.previousValue
        ){
            let block_keys = Object.keys(this.block);
            this.selects_arr = [];
            this.vals_arr = [];
            for (let key of block_keys) {
                if(this.block[key]){
                    let len = this.selects_arr.push(key);
                    this.vals_arr.push(this.maskConvert(this.block[this.selects_arr[len-1]], this.params[key] ? this.params[key].mask : ""));
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
            temp.push({value: key, label: this.params[key] ? this.params[key].label : null});
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
        delete this.block[code];
        this.newData.emit(this.block);
    }

    newValue(code: string, val: any) {
        this.block[code] = val;
        this.newData.emit(this.block);
    }

    changeType(code: string, index: number, newVal: string){
        if(code != newVal){
            this.selects_arr[index] = newVal;
            this.adds_arr[this.adds_arr.indexOf(newVal)] = code;
            delete this.block[code];
            this.block[newVal] = this.vals_arr[index];
            this.newData.emit(this.block);
        }
    }

    onPaste(event: ClipboardEvent, index: number, code: string){
        if(this.params[code].mask){
            let clipboardData = event.clipboardData;
            let pastedText = clipboardData.getData('text');
            let temp =  this.params[code].mask.replace(/\D/g,'').length;
            this.vals_arr[index] = pastedText.substr(pastedText.length - temp);
        }
    }

    maskConvert(value, mask){
        if(mask){
            let temp =  mask.replace(/\D/g,'').length;
            return value.substr(value.length - temp);
        } else
            return value;

    }
}
