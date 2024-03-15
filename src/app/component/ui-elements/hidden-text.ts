import {
    Component,
    ViewChild,
    ElementRef, ChangeDetectorRef, AfterViewInit
} from "@angular/core";
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'hidden-text',
    inputs: ['name','value'],
    styles: [`        
        .label{
            position: absolute;
            top: -24px;
            height: 10px;
            left: 30px;
            z-index: -1;
        }

        .text {
            margin-top: 30px;
            color: #252F32;
            line-height: 14px;
            overflow: hidden;
            word-break: break-all;
            width: 100%;
        }
        
        .empty{
            margin: 0;
            max-height: 24px !important;
            line-height: 30px;
        }

        .more {
            color: #3F51B5;
            cursor: pointer;
            line-height: 15px;
            margin-right: 30px;
            width: 100%;
            display: block;
        }

        .more:hover {
            text-decoration: underline;
        }
        
    `],
    template: `
        <span class="label" *ngIf="value">{{name}}</span>
        <div [style.max-height]="height+'px'" class="text" [class.empty]="!value">
            <span #textElem>{{value || name}}</span>
        </div>
        <span (click)="more_less(textElem)" *ngIf="textElem.offsetHeight > baseHeight" class="more">{{textElem.parentElement.offsetHeight == baseHeight ? 'Подробнее...' : 'Свернуть'}}</span>
        
    `
})


export class HiddenTextComponent implements AfterViewInit{
    public name: string;
    public value: string = "";
    height: number = 44;
    baseHeight: number = 44;

    @ViewChild("textElem", { static: true }) textElement: ElementRef;
    @Output() newValue: EventEmitter<any> = new EventEmitter();

    constructor(private cdRef:ChangeDetectorRef){
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
        setTimeout(()=>{
            let elem = this.textElement.nativeElement as HTMLElement;
            if(elem.offsetHeight <= 31) {
                //this.baseHeight = elem.offsetHeight;
                this.height = this.baseHeight;
            }
        });
    }

    more_less(textElem: HTMLElement) {
        console.log(textElem.parentElement.offsetHeight, this.height, textElem.offsetHeight, this.baseHeight);
        if (textElem.parentElement.offsetHeight == this.baseHeight){

            this.height = textElem.offsetHeight;
        } else {
            this.height = this.baseHeight;
        }
    }

}
