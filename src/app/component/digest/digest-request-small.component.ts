import {Component, OnInit} from '@angular/core';

import {HubService} from '../../service/hub.service'
import {PersonService} from '../../service/person.service'
import {TaskService} from '../../service/task.service'

import {Request} from '../../entity/request';
import {Person} from '../../entity/person';
import {Task} from '../../class/task';
import {User} from "../../entity/user";
import {UserService} from "../../service/user.service";

@Component({
    selector: 'digest-request-small',
    inputs: ['request'],
    styles: [`
        .req_body{
            height: 95px;
            background-color: white;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-bottom: 5px;
            padding: 10px 0;
            box-sizing: border-box;
        }
        .req_body > div{
            margin: 0 20px;
        }

        .req_body > .row1{
            display: inline-flex;
            flex: 0 0 20px;
            color: #5D75B3;
            justify-content: space-between;
        }

        .req_body > .row1 div{

        }

        .req_body > .row1 hr{
            margin: 0 5px;
            border-left: 1px solid rgb(224, 224, 224);
            height: 100%;
        }

        .req_body > .row1 .req_date{
            color: #9E9E9E;
            font-size: 10px;
            line-height: 20px;
        }

        .req_body > .row2{
            color: #616161;
            flex: 0 0 25%;
            font-weight: 700;
        }

        .req_body > .row3{
            color: #BDBDBD;
            flex: 1 1 25%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .req_body > .row4{
            flex: 0 0 25%;
        }
    `],
    template: `
        <div class="req_body" (click)="open()">
            <div class="row1">
                <div>{{ person?.name ? (person.phoneBlock | phoneBlockAsString) : "Нет контакта" }}</div>
                <hr>
                <div>{{ person?.organisation ? person.organisation.name : "Частное лицо" }}</div>
                <hr>
                <div class="req_date">{{ request.addDate ? (request.addDate | formatDate).toString().split(" ")[0] : "Нет даты"}}</div>
            </div>
            <div class="row2">{{ request.request }}</div>
            <div class="row3">{{"Нет назначенных задач"}}</div>
            <div class="row4" *ngIf="task"></div>
        </div>

    `
})

export class DigestRequestSmallComponent implements OnInit {

    public request: Request;

    private selected = false;
    person: Person = new Person();
    agent: User = new User();
    resultText: string;
    task: Task = null;
    to: any;

    constructor(private _hubService: HubService, private _userService: UserService, private _taskService: TaskService, private _personService: PersonService) { };

    ngOnInit() {
        //this.task = this._taskService.getRandomTask();
        this.resultText = this.getResultText();

        if (this.request.personId != null) {
            this._personService.get(this.request.personId).subscribe(person => {
                this.person = person;
            });
        }

        if (this.request.agentId != null) {
            this._userService.get(this.request.agentId).subscribe(agent => {
                this.agent = agent;
            });
        }

    }

    open() {
        this.selected = true;
        var tabSys = this._hubService.getProperty('tab_sys');
        tabSys.addTab('request', {request: this.request});
    }

    getResultText() {
        return Task.getResultText(this.task);
    }
}
