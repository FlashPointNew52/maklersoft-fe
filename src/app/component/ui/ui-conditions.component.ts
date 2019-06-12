import {Component, OnInit, OnChanges} from '@angular/core';
import {ConditionsBlock} from "../../class/conditionsBlock";

@Component({
    selector: 'ui-conditions',
    inputs: ['block', 'disabled', 'class'],
    template: `
        <div class="{{class}}">
            <span>Укомплектована полностью</span>
            <ui-switch-button [value]="block.complete" [disabled]="disabled" (newValue)="block.complete = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Гостинная мебель</span>
            <ui-switch-button [value]="block.living_room_furniture" [disabled]="disabled" (newValue)="block.living_room_furniture = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Кухонная мебель</span>
            <ui-switch-button [value]="block.kitchen_furniture" [disabled]="disabled" (newValue)="block.kitchen_furniture = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Спальная мебель</span>
            <ui-switch-button [value]="block.couchette" [disabled]="disabled" (newValue)="block.couchette = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Постельные принадлежности</span>
            <ui-switch-button [value]="block.bedding" [disabled]="disabled" (newValue)="block.bedding = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Посуда</span>
            <ui-switch-button [value]="block.dishes" [disabled]="disabled" (newValue)="block.dishes = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Холодильник</span>
            <ui-switch-button [value]="block.refrigerator" [disabled]="disabled" (newValue)="block.refrigerator = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Стиральная машина</span>
            <ui-switch-button [value]="block.washer" [disabled]="disabled" (newValue)="block.washer = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>СВЧ печь</span>
            <ui-switch-button [value]="block.microwave_oven" [disabled]="disabled" (newValue)="block.microwave_oven = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Кондиционер</span>
            <ui-switch-button [value]="block.air_conditioning" [disabled]="disabled" (newValue)="block.air_conditioning = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Посудомоечная машина</span>
            <ui-switch-button [value]="block.dishwasher" [disabled]="disabled" (newValue)="block.dishwasher = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Телевизор</span>
            <ui-switch-button [value]="block.tv" [disabled]="disabled" (newValue)="block.tv = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>Животные</span>
            <ui-switch-button [value]="block.with_animals" [disabled]="disabled" (newValue)="block.with_animals = $event"></ui-switch-button>
        </div>
        <div class="{{class}}">
            <span>С детьми</span>
            <ui-switch-button [value]="block.with_children" [disabled]="disabled" (newValue)="block.with_children = $event"></ui-switch-button>
        </div>
    `,
    styles: [``]
})


export class UIConditionsComponent{
    public block: ConditionsBlock;
    public disabled: boolean;
    public class: string = 'show_block';
}
