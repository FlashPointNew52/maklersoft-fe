import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    selector: '[offClick]'
})

export class OffClickDirective {

    constructor(private _elementRef : ElementRef) {
    }

    @Output()
    public offClick = new EventEmitter();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {

        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.offClick.emit(event);
        }
    }
}
