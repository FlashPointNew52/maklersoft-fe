import {AsyncSubject, BehaviorSubject, Subject} from "rxjs";
import {Rating} from "../entity/rating";

export class Tab {
    id: number;
    key: string;
    header: string;
    type: string;
    args: any;
    tabSys: any;
    public active: boolean;

    refreshRq: any;
    private event;

    constructor(tabSys, type, args) {
        this.header = 'Loading...';
        this.type = type;
        this.tabSys = tabSys;
        this.args = args;

        this.refreshRq = new Subject();

        this.active = false;
    }

    reborn(type, args) {
        this.header = 'Loading...';
        this.type = type;
        this.args = args;
    }

    refresh(sender: string) {
        //this.refreshRq.next(sender);
    }

    getEvent(){
        this.event = new BehaviorSubject({});
        return this.event;
    }

    setEvent(event: any){
        this.event.next(event);
    }

    sendEvent(){
        if(this.event)
            this.event.complete();
    }
}
