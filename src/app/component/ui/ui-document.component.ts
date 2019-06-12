import {Component, OnInit, OnChanges} from '@angular/core';
import {Output,Input, EventEmitter} from '@angular/core';


@Component({
    selector: 'ui-document',
    inputs:['doc'],
    template: `
        <div>
            <div class='icon'></div>
            <span class="label">{{doc}}</span>

        <div>
    `,
    styles: [`
        .icon{
            width: 87px;
            height: 55px;
            background-image: url(assets/document.png);
            background-size: contain;
            margin-top: 10px;
            background-repeat: no-repeat;
            background-position: center;
        }

        .label{
            font-size: 9pt;
            padding: 0 3px;
            text-align: center;
            width: 87px;
            display: block;
        }
    `]
})


export class UIDocument implements OnInit{

    @Output() fileChange: EventEmitter<any> = new EventEmitter();

    ngOnInit(){

    }
}
