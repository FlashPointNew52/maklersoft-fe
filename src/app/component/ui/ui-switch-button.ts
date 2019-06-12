
import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ui-switch-button',
    inputs: ['value', 'disabled'],
    template: `
        <div class="ui-switch" (click)="reverse()" [class.on]='value'>
            <div [class.reverse]='value'>   </div>
        </div>

    `,
    styles: [`
        .ui-switch{
            width: 33px;
            height: 14px;
            background-color: silver;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.5s;
        }

        .ui-switch > div{
            width: 14px;
            height: 14px;
            background-color: white;
            border-radius: 20px;
            position: relative;
            transform: translate(10%, 0);
            transition: all 0.5s;
        }

        .ui-switch > .reverse{
            position: relative;
            transform: translate(133%, 0);
        }
        .on{
            background-color: #3d9be9;
            transition: all 0.5s;
        }
    `]
})


export class UISwitchButton implements OnInit, OnChanges {
    public value: boolean = false;
    public disabled: boolean = false;
    @Output() newValue: EventEmitter<any> = new EventEmitter();

    ngOnInit() {}

    ngOnChanges() {}

    reverse(){
        if(!this.disabled){
            this.value = !this.value;
            this.newValue.emit(this.value);
        }
    }
}
