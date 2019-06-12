import {Component} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Tags} from '../../class/tags';

@Component({
  selector: 'ui-tag-block',
  inputs: ['value', 'small'],
  template: `
    <div class="ui-tag-block">
        <div *ngFor="let tag of tags" (click)="select(tag)" class="tag_row" [class.small]="small" [class.selected]=" tag.id == value">
            <div [style.background-color]="tag.color"  class="tag"></div>
            <span>{{tag.label}}</span>
        </div>
    </div>
  `,
  styles: [`
    .ui-tag-block {
        overflow: hidden;
        margin: 6px 0;
    }

    .tag_row{
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 25px;
        box-sizing: border-box;
        padding: 0 25px;
        cursor: pointer;
    }

    .tag_row:hover{
        background-color: #dadada;
    }

    .tag {
        height: 12px;
        width: 32px;
        margin-right: 15px;
        min-width: 32px;
    }
    .selected{
        background-color: #dadada;
    }

    .small {
        padding: 0 20px;
        height: 20px;
    }

    .small .tag{
        margin-right: 15px;
    }
  `]
})

export class UITagBlock {
  tags: Array<any> = Tags.tagArray;
  public value: number;
  public style: any = {
      row: "{}",
      tag: "{}"
  };
  public selected: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].id == this.value) {
        this.selected = this.tags[i];
        return;
      }
    }
  }

  getBorderColor(tag) {
    var val = 'rgb(255,255,255)';
    if (this.selected == tag) {
      val = tag.selected_color;
    }
    return val;
  }

  select(tag: any) {
    /*var val = null;
    if (this.selected == tag) {
      this.selected = null;
    } else {
      this.selected = tag;
      val = tag.id;
  }*/
    this.valueChange.emit(tag.id);    // из за этого эмита не срабатывает [class.selected]="v === value"
  }

}
