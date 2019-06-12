import {Component} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Tags} from '../../class/tags';

@Component({
  selector: 'ui-tag',
  inputs: ['value'],
  template: `
    <div class="tag"
        [style.background-color]="getColor(value)"
    >
    </div>
  `,
  styles: [`
    .tag {
        height:inherit;
        width: inherit;
    }
  `]
})

export class UITag {
  tags: Array<any> = Tags.tagArray;
  public value: number;

  getColor(id: number) {
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].id == id) {
        return this.tags[i].color;
      }
    }
    return 'rgba(255, 255, 255, 0)';
  }
}
