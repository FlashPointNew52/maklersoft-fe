import {Contact} from "./contact";

export class Person extends Contact{
    isMiddleman: boolean;
    userRef: number;

    public Person(){
        Contact.apply(this, arguments);
        this.stateCode = "neutral";
        this.typeCode = "unknown";
        this.isMiddleman = false;

    }
}
