import {
    Component,
    ViewChild,
    ElementRef, OnChanges, SimpleChanges
} from "@angular/core";
import {Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'input-area',
    inputs: ['name','value', 'disabled', 'update'],
    styles: [`
        textarea{
            border: 0;
            background-color: transparent;
            font-size: 12px;
            padding: 0;
            width: 100%;
            overflow: hidden;
            outline: none;
            resize: none;
        }

        .label{
            position: absolute;
            top: 0;
            height: 10px;
            left: 0;
            transition: 0.5s;
            z-index: -1;
        }
        
        .focus + .label{
            font-size: 10px;
            top: -9px;
            transition: 0.5s;
        }
        
    `],
    template: `
        <textarea [class.focus]="value?.length > 0" (focus)="setClass($event, 'focus')" #textarea [(ngModel)]="value"
                  (blur)="removeClass($event, 'focus')" (keyup) = "edit()"
                  (change)="resize()" (cut)="delayedResize()" (paste)="delayedResize()" (drop)="delayedResize()" (keydown)="delayedResize()"
                  [readOnly]="disabled"
                  
        ></textarea>
        <span class="label">{{name}}</span>
    `
})


export class InputAreaComponent implements OnChanges{
    public name: string;
    public value: string = "";
    public disabled: boolean = false;

    @ViewChild("textarea") textarea: ElementRef;
    @Output() newValue: EventEmitter<any> = new EventEmitter();

    public ngOnChanges(changes: SimpleChanges): void {
        setTimeout(() => this.resize(), 100);
    }

    setClass(event, className) {
        let elem = event.currentTarget as HTMLElement;
        elem.classList.add(className);
    }

    removeClass(event, className) {
        if(!this.value || this.value.length == 0){
            let elem = event.currentTarget as HTMLElement;
            elem.classList.remove(className);
        }
    }

    edit() {
        this.newValue.emit(this.textarea.nativeElement.value);
    }

    resize () {
        console.log("tratata");
        let textarea = <HTMLAreaElement>this.textarea.nativeElement;
        let borderHeight = textarea.offsetHeight - textarea.clientHeight;
        console.log(textarea.offsetHeight, textarea.clientHeight);
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + borderHeight + "px";
    }

    delayedResize () {
        setTimeout(() => this.resize(), 0);
    }

}
