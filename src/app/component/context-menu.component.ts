import {
    Component,
    SimpleChange,
    Output,
    EventEmitter,
    OnChanges, OnInit, ElementRef
} from '@angular/core';


@Component({
    selector: 'context-menu',
    inputs: ['menu', 'hidden'],
    styles: [`
        .context-menu-wrapper {
            font-size: 12px;
            position: absolute;
            z-index: 9999;
            width: 170px;
            padding: 26px 0;
            border: 0px solid;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 0 0 0 0;
            box-shadow: 0px 1px 6px 0px rgba(189,192,193,1);
        }

        .context-menu-scrollable {
            overflow-y: auto;
        }

        .submenu-wrapper {
            display: none;
            position: absolute;
            top: 0px;
            left: 100%;
            border: 0px solid;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 0 0 0 0;
            box-shadow: 0px 1px 6px 0px rgba(189,192,193,1);
        }

        .submenu-sc:hover:not(.disabled) > .submenu-wrapper {
            display: block;
        }

        .submenu-sc:after {
            display: block;
            float: right;
            width: 0;
            height: 0;
            margin-top: 5px;
            margin-right: -10px;
            border-color: transparent;
            border-left-color: #666;
            border-style: solid;
            border-width: 5px 0 5px 5px;
            content: " ";
        }

        .entry {
            padding: 3px 24px;
            font-weight: normal;
            line-height: 21px;
            height: 25px;
            color: #424242;
            white-space: nowrap;
            min-width: 120px;
            cursor: pointer;

            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .tag{
            overflow: hidden;
            width: 167px;
            height: 165px;
            white-space: normal;
        }

        .entry_line {
            margin-left: -25px;
        }

        .entry:hover {
            background-color: #e0e0e0;
        }

        .disabled {
            /*background-color: #fff;
            color: #aaa;
            cursor: not-allowed;*/
            display: none;
        }

        .flip {
            left: -101%;
        }

        .vert_flip{
            top: -109px;
        }

        hr {
            margin: 4px 13px;
        }
    `],
    template: `
        <div class="context-menu-wrapper"
            [style.left]="menu?.pX + 'px'"
            [style.top]="menu?.pY + 'px'"
            [class.context-menu-scrollable]="menu?.scrollable"
            [hidden]="hidden"
            (offClick)="docClick()" 
        >
            <div
                *ngFor="let i of menu?.items"
                [ngSwitch]="i.class"
                (click)="click($event, i)"
            >
                <div *ngSwitchCase="'submenu'" class="entry submenu-sc" [class.disabled]="i.disabled" style="position: relative;" (mouseenter)="calc_tag()">
                    <span *ngIf="i.icon" class="icon-{{ i.icon }}"></span>
                    {{ i.label }}
                    <div class="submenu-wrapper" [class.flip]="flip" [class.vert_flip]="vert_flip">
                        <div
                            *ngFor="let si of i.items"
                            [ngSwitch]="si.class"
                            (click)="click($event, si)"
                        >
                            <div *ngSwitchCase="'entry'" class="entry" [class.disabled]="si.disabled">
                                <span *ngIf="si.icon" class="icon-{{ si.icon }}"></span>
                                {{ si.label }}
                            </div>
                            <div *ngSwitchCase="'entry_cb'" class="entry" [class.disabled]="si.disabled">
                                <span *ngIf="si.value" class="icon-check"></span>
                                <span *ngIf="!si.value" class="icon-none"></span>
                                {{ si.label }}
                            </div>
                            <div *ngSwitchCase="'tag'" class="tag">
                                <ui-tag-block
                                    [value] = "si.tag"
                                    [small] = "true"
                                    (valueChange) = "set_tag(si,$event)"
                                >
                                </ui-tag-block>
                            </div>
                            <hr *ngSwitchCase="'delimiter'" [class.disabled]="si.disabled">
                        </div>
                    </div>
                </div>
                <div *ngSwitchCase="'entry'" class="entry" [class.disabled]="i.disabled">
                    <span *ngIf="i.icon" class="icon-{{ i.icon }}"></span>
                    {{ i.label }}
                </div>
                <div *ngSwitchCase="'entry_cb'" class="entry" [class.disabled]="i.disabled">
                    <span *ngIf="i.value" class="icon-check"></span>
                    <span *ngIf="!i.value" class="icon-none"></span>
                    {{ i.label }}
                </div>

                <hr *ngSwitchCase="'delimiter'" [class.disabled]="i.disabled">
            </div>
        </div>
    `
})

export class ContextMenuComponent implements OnInit, OnChanges {

    hidden: boolean = true;
    menu: any = {
        pX: 0,
        pY: 0,
        scrollable: false,
        items: []
    };
    flip: boolean = false;
    vert_flip: boolean = false;

    @Output() dummy: EventEmitter<any> = new EventEmitter();

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        let cm_element = this.elementRef.nativeElement.querySelector('.context-menu-wrapper');

        if (this.menu && !this.hidden) {


            let pY = this.menu.pY;
            this.menu.pY = 1000;

            setTimeout(t => {
                this.menu.pY = pY;
                if (cm_element.offsetHeight + this.menu.pY > document.body.clientHeight) {
                    this.menu.pY -= cm_element.offsetHeight + this.menu.pY - document.body.clientHeight + 40;
                }
                if (cm_element.offsetWidth + this.menu.pX > document.body.clientWidth) {
                    this.menu.pX -= cm_element.offsetWidth;
                    this.flip = true;
                }
            }, 0);
        }

    }
    click(e: MouseEvent, item) {

        if (item.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (item.callback && item.class != "tag") {
            item.callback();
        }
        this.hidden = true;
    }

    scroll(){
        this.hidden = true;
    }
    docClick() {
        if(!this.hidden)
            this.hidden = true;
    }
    calc_tag(){
        let tag = this.elementRef.nativeElement.querySelector('.tag') as HTMLElement;
        if(tag.offsetHeight != 0){
            this.vert_flip = true;
        } else
          this.vert_flip = false;
    }

    set_tag(item, tag) {
        if (item.callback) {
              item.callback(tag);
        }
    }

}

/* example
 contextMenu(e) {
 e.preventDefault();
 e.stopPropagation();
 this._hubService.shared_var['cm_px'] = e.pageX;
 this._hubService.shared_var['cm_py'] = e.pageY;
 this._hubService.shared_var['cm_hidden'] = false;
 this._hubService.shared_var['cm_items'] = [
 {class: "entry_cb", disabled: true, value: true, label: "пункт 1", callback: function() {alert('yay 1!')}},
 {class: "submenu", disabled: true, label: "пункт x", items: [
    {class: "entry", disabled: false, label: "пункт x1", callback: function() {alert('yay s1!')}},
    {class: "entry", disabled: false, label: "пункт x2", callback: function() {alert('yay s2!')}},
 ]},
 {class: "entry_cb", disabled: false, value: false, label: "пункт 2", callback: function() {alert('yay 2!')}},
 {class: "entry_cb", disabled: true, value: true, label: "пункт 3", callback: function() {alert('yay 3!')}},
 {class: "entry", disabled: false, icon: "cancel", label: "пункт 4", callback: function() {alert('yay 4!')}},
 {class: "delimiter"},
 {class: "entry", icon: "add", label: "пункт 5", callback: function() {alert('yay 5!')}},
 ];
 }*/
