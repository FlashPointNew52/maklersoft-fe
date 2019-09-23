import {
    Component
} from '@angular/core';
import {HubService} from "../service/hub.service";
import {SessionService} from "../service/session.service";


@Component({
    selector: 'modal-window',
    styles: [`
        :host{
            position: absolute;
            z-index: 9999;
            top: 0;
            left: 0;
        }
        .window{
            position: absolute;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.6);
            align-items: center;
            justify-content: center;
        }

        .window > div{
            width: 475px;
            min-height: 154px;
            background-color: white;
            box-shadow: 0 1px 50px 2px rgba(206,208,209,0.6);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .window > div > .label{
            color: #252F32;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 25px 7px;
            font-family: SFNS;
        }

        .window > div > .cross{
            position: absolute;
            right: 11px;
            top: 11px;
            width: 13px;
            height: 13px;
            background-image: url(../assets/cross.png);
            background-size: contain;
        }

        .window > div > hr{
            margin: 0;
            border-top: 1px solid #6a0316;
        }

        .window > div > .message{
            margin: 30px 75px;
            color: #252F32;
            font-size: 12px;
            line-height: 11px;
            white-space: pre-line;
        }

        .sendReport{
            align-self: flex-end;
            margin-right: 15px;
            cursor: pointer;
        }

        .sendReport:hover{
            color: var(--color-red);
        }
    `],
    template: `
        <div class="window" [style.display]="hidden ? 'none' : 'flex'">
            <div>
                <span class="label">maklersoft</span>
                <span class="cross" (click)="setHidden(true)"></span>
                <hr>
                <div class="message">{{message}}</div>
                <div *ngIf="error" (click)="sendMsg()" class="sendReport">Сообщить об ошибке</div>
            </div>
        </div>

    `
})

export class ModalWindowComponent {
    message = "";
    error: any = null;
    hidden = true;
    constructor(private _hubService: HubService,
                private _sessionService: SessionService) {
        _hubService.setProperty('modal-window', this);
    }

    public setHidden(value: boolean){
        this.hidden = value;
    }

    public setMessage(value: string){
        this.message = value;
    }
    public showMessage(value: string, err?: any){
        this.error = null;
        if(err)
            this.error = err;
        this.message = value;
        this.hidden = false;
    }

    public setError(error){
        this.error = error;
    }

    public sendMsg() {
        this._sessionService.sendMsg(this.error).subscribe(()=>{
            this.message = "Отчет об ошибке успешно направлен разработчикам";
            this.error = null;
        });
    }
}
