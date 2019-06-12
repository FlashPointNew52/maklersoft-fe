import {Component, OnInit, OnChanges} from '@angular/core';

@Component({
    selector: 'ui-view-text',
    inputs: ['value'],
    template: `
        <div class="ui-view-text">
                {{ value || 'Не указано' }}
        </div>
    `,
    styles: [`
        .ui-view-text{
            text-overflow: ellipsis;
            overflow: auto;
            white-space: nowrap;
            width: 100%;
            height: 100%;
            resize: none;
        }
    `]
})


export class UIViewTextComponent implements OnInit {
    public value: any;

    ngOnInit() {

    }

    ngOnChanges() {
        this.ngOnInit();
    }

}
