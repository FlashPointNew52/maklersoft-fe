import {Component, OnInit, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {Output, Input, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-multiselect',
    changeDetection: ChangeDetectionStrategy.OnPush,
    inputs: ['params', 'field', 'masks', 'width', 'prefix'],
    styles: [`
      .add_button {
        color: #3bb24b;
        text-align: left;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
      }

      .remove {
        width: 15px;
        height: 15px;
        background: url(/assets/cross.png) no-repeat center;
        background-size: contain;
      }

      .input_field {
        width: 110px;
        border: 0;
        background: transparent;
        margin-left: 5px;
        color: #677578;
        font-size: 12px;
      }

      .input_field::placeholder {
        color: #9E9E9E;
        font-size: 10px;
        font-style: italic;
      }

      .ui-multiselect {
        padding: 0;
        margin: 10px 0;
      }

      .option_field {
        height: 42px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .value {
        width: 40%;
        height: 30px;
        padding-right: 10px;
        border-right: 1px solid silver;
      }

      .dropdown-menu > li > label {
        display: block;
        padding: 3px 20px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
      }

      .dropdown-menu > li:hover {
        background-color: #efefef;
      }

      .dropdown-menu > li.selected > label {
        background-color: #3366CC;
        color: #fff;
      }
    `],
    template: `
        <ul class="ui-multiselect">
            <li class="option_field" *ngFor="let code of values_array; let i = index" >
                <ui-select class="value" [style.width] = "width"
                    [options] = "getOptions(code)"
                    [value]= "code"
                    [config] = "{icon: 'select_arrow', drawArrow: false}"
                    (onChange) = "changeType(code, i, $event.selected.value)">
                </ui-select>
                <input class = "input_field" type="text" (keyup)="changed($event, code, i)" [mask]="masks != null ? masks[code] : ''" [prefix] = "prefix"
                    [placeholder]="params[code]?.placeholder || 'Введите значение'" [value]="field[code] || ''" 
                       (click)="$event.stopPropagation()">
                <div class="remove" (click)="delete($event, code)"></div>
            </li>
            <div class="add_button" (click)="add_field($event)" *ngIf="getOptions()?.length > 0">Добавить</div>
        </ul>
    `
})


export class UIMultiSelect implements OnChanges, OnInit {
    public params: any;
    public masks: any = null;
    public field: any = {};
    public width: any = "250";
    public prefix: string ="";
    values_array: any[] = [];

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        /*for(let i=0; i< this.values.length; ++i){
            this.values[i].placeholder = this.options[i].placeholder;
            if(!this.values[i].value && this.values[i].value != ""){
                this.values.splice(i,1);
                i--;
            }

        }
        if(this.values.length == 1 && this.values[0].value === undefined){
            this.values.pop();
        }
        if(this.values.length == 0){
            this.values.push({value:"", placeholder: this.options[0].placeholder, type: this.options[0].value});
        }*/
    }

    ngOnChanges() {
        this.values_array = [];
        if(this.field)
          var fields = Object.keys(this.field);
          for (let ind in fields) {
              if(this.field[fields[ind]]){
                  this.values_array.push(fields[ind]);
              }

          }
    }

    add_field(event){
        event.stopPropagation();
        for (let key in this.params) {
            if(this.values_array.indexOf(key) < 0){
                this.values_array.push(key);
                if(this.field)
                  delete this.field[key];
                return;
            }
        }
    }

    selectValue(event,i ){
        //event.selected.value + '&' +
    }
    changed(event, key, i) {
        let field = <HTMLInputElement>event.target;
        this.field[key] = field.value;
        this.onChange.emit(this.field);
    }


    delete(event, key){
        event.stopPropagation();
        this.values_array.splice(this.values_array.indexOf(key),1);
        this.field[key] = null;
    }


    getOptions(code?): any{
        let temp = [];
        for (let key in this.params) {
            if(this.values_array.indexOf(key) < 0)
                temp.push({value: key, label: this.params[key].label});
            else if(code == key)
                temp.push({value: key, label: this.params[key].label});
        }

        return temp;
    }

    changeType(code, i, value){
        delete this.field[code];
        this.values_array[i] = value;
    }
}
