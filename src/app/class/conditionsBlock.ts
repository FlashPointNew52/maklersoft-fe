import {ObjectBlock} from "./objectBlock";

export class ConditionsBlock extends ObjectBlock{
    complete: boolean = false;
    living_room_furniture: boolean = false;
    kitchen_furniture: boolean = false;
    couchette: boolean = false;
    bedding: boolean = false;
    dishes: boolean = false;
    refrigerator: boolean = false;
    washer: boolean = false;
    microwave_oven: boolean = false;
    air_conditioning: boolean = false;
    dishwasher: boolean = false;
    tv: boolean = false;
    with_animals: boolean = false;
    with_children: boolean = false;
}
