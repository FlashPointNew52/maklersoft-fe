import {Subject} from "rxjs/Subject";

export class Tab {
    id: number;
    key: string;
    header: string;
    type: string;
    args: any;
    tabSys: any;
    public active: boolean;

    refreshRq: any;

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
}
