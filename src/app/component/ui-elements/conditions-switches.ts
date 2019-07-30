import {Component, OnInit, OnChanges} from '@angular/core';
import {ConditionsBlock} from "../../class/conditionsBlock";

@Component({
    selector: 'conditions-switches',
    inputs: ['block', 'disabled', 'class'],
    template: `
        <div class="{{class}}">
            <span>Укомплектована полностью</span>
            <switch-button [value]="block.complete" [disabled]="disabled" (newValue)="block.complete = $event; setAll()"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Гостинная мебель</span>
            <switch-button [value]="block.living_room_furniture" [disabled]="disabled" (newValue)="block.living_room_furniture = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Кухонная мебель</span>
            <switch-button [value]="block.kitchen_furniture" [disabled]="disabled" (newValue)="block.kitchen_furniture = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Спальная мебель</span>
            <switch-button [value]="block.couchette" [disabled]="disabled" (newValue)="block.couchette = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Постельные принадлежности</span>
            <switch-button [value]="block.bedding" [disabled]="disabled" (newValue)="block.bedding = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Посуда</span>
            <switch-button [value]="block.dishes" [disabled]="disabled" (newValue)="block.dishes = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Холодильник</span>
            <switch-button [value]="block.refrigerator" [disabled]="disabled" (newValue)="block.refrigerator = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Стиральная машина</span>
            <switch-button [value]="block.washer" [disabled]="disabled" (newValue)="block.washer = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>СВЧ печь</span>
            <switch-button [value]="block.microwave_oven" [disabled]="disabled" (newValue)="block.microwave_oven = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Кондиционер</span>
            <switch-button [value]="block.air_conditioning" [disabled]="disabled" (newValue)="block.air_conditioning = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Посудомоечная машина</span>
            <switch-button [value]="block.dishwasher" [disabled]="disabled" (newValue)="block.dishwasher = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Телевизор</span>
            <switch-button [value]="block.tv" [disabled]="disabled" (newValue)="block.tv = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>Животные</span>
            <switch-button [value]="block.with_animals" [disabled]="disabled" (newValue)="block.with_animals = $event"></switch-button>
        </div>
        <div class="{{class}}">
            <span>С детьми</span>
            <switch-button [value]="block.with_children" [disabled]="disabled" (newValue)="block.with_children = $event"></switch-button>
        </div>
    `,
    styles: [``]
})


export class ConditionsSwitchesComponent{
    public block: ConditionsBlock;
    public disabled: boolean;
    public class: string = 'show_block';

    public setAll() {
        if(this.block.complete){
            this.block.living_room_furniture = true;
            this.block.kitchen_furniture = true;
            this.block.couchette = true;
            this.block.bedding = true;
            this.block.dishes = true;
            this.block.refrigerator = true;
            this.block.washer = true;
            this.block.microwave_oven = true;
            this.block.air_conditioning = true;
            this.block.dishwasher = true;
            this.block.tv = true;
        }
    }
}
