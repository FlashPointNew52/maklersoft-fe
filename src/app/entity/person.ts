import {Contact} from "./contact";


export class Person extends Contact{
    isMiddleman: boolean;
    photo: string;
    photoMini: string;
    userRef: number;

    public Person(){
        Contact.apply(this, arguments);
        this.stateCode = "neutral";
        this.typeCode = "unknown";
        this.isMiddleman = false;

    }

    public copyFields(person: Person){
        this.id = person.id;
        this.accountId = person.accountId;
        this.name = person.name;
        this.description = person.description;
        this.addDate = person.addDate;
        this.changeDate = person.changeDate;
        this.organisationId = person.organisationId;
        this.organisation = person.organisation;
        this.typeCode = person.typeCode;
        this.addressBlock = person.addressBlock;
        this.phoneBlock = person.phoneBlock;
        this.emailBlock = person.emailBlock;
        this.siteBlock = person.siteBlock;
        this.agentId = person.agentId;
        this.agent = person.agent;
        //this.contract = person.contract;
        this.stateCode = person.stateCode;
        this.sourceCode = person.sourceCode;
    }

}
