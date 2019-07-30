import {ObjectBlock} from "./objectBlock";

export class AddressBlock extends ObjectBlock{
    region: string;
    city: string;
    admArea: string;
    area: string;
    street: string;
    building: string;
    apartment: string;
    station: string;
    busStop: string;

    public static check(block: AddressBlock){
        let ret = true;
        for (let key in block) {
          if (block[key] != null && key != "constructor"){
            let temp = block[key].toString().replace("\s", "");
            if(temp.length == 0)
                ret = false;
          }
        }

        return ret;
    }

    public static getAsString(block: AddressBlock){
        let address = "";
        if(block.city){
            address += block.city + ", ";
        }
        if(block.street){
          address += block.street + ", ";
        }
        if(block.building){
          address += block.building;
        }
        if(block.apartment){
          address += ", " + block.apartment;
        }
        if(address.length > 0)
            return address;
        else
            return "Адрес не указан";
    }
}
