import {ObjectBlock} from "./objectBlock";

export class PhoneBlock extends ObjectBlock{
    main: string;
    office: string;
    home: string;
    cellphone: string;
    fax: string;
    ip: string;
    other: string;

    public static phoneFormats = {
        main: " (000) 000-00-00",
        office: " (000) 000-00-00",
        home: " (000) 000-00-00",
        cellphone: " (000) 000-00-00",
        fax: " (000) 000-00-00",
        other: " (000) 000-0000",
        ip: "0000"
    };

    public static phoneSyfix = "+7";

    public static get(phones: PhoneBlock, index: number){

        let phoneType = Object.keys(phones)[index];
        if(phoneType)
            return {mask: PhoneBlock.phoneFormats[phoneType], phone: phones[phoneType]}
        else return null;
    }

    public static formatNumberArray(data: string[]){
        let t: string[] = [];
        data.forEach(dt => {
            let match = dt.match(/(7|8)(\d{3})(\d{3})(\d{2})(\d{2})/);
            if(match != null && match.length){
                t.push( "+7(" + match[2] + ")" + match[3] +"-"+ match[4] +"-" + match[5]);
            }
        });
        return t;
    }

    public static toFormat(block: PhoneBlock){
        for (let key in block ) {
            if (block[key] != null && key != "constructor"){
                let match = block[key].match(/(7|8)(\d{3})(\d{3})(\d{2})(\d{2})/);
                if(match != null && match.length){
                    block[key] = ( "+7 (" + match[2] + ") " + match[3] +"-"+ match[4] +"-" + match[5]);
                }
            }
        }
        return block;
    }

    public static removeSymb(block: PhoneBlock){
        let copy = Object.assign({}, block);
        for (let key in copy ) {
            if (copy[key] != null && key != "constructor"){
              copy[key] = copy[key].toString().replace("[^\d]", "");
            }
        }

        return copy;
    }

    public static check(block: PhoneBlock){
        let ret = true;
        for (let key in block) {
            if (block[key] != null && key != "constructor"){
                let temp = block[key].toString().replace(/[^\d]/g, "");
                if(temp.length != 11)
                    ret = false;
            }
        }

        return ret;
    }
}
