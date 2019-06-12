import {Pipe, PipeTransform} from '@angular/core';

import {PhoneBlock} from "../class/phoneBlock";

@Pipe({name: 'phoneBlockAsString'})
export class phoneBlockAsStringPipe implements PipeTransform {
    transform(phoneBlock: PhoneBlock) : string {

        let result = "";

        let t = [];

        if (phoneBlock.office) t.push(phoneBlock.office);
        if (phoneBlock.home) t.push(phoneBlock.home);
        if (phoneBlock.cellphone) t.push(phoneBlock.cellphone);
        if (phoneBlock.fax) t.push(phoneBlock.fax);
        if (phoneBlock.main) t.push(phoneBlock.main);
        if (phoneBlock.other) t.push(phoneBlock.other);

        result = t.join(", ");

        return result;
    }
}
