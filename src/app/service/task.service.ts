import {Injectable} from '@angular/core';

import {Task} from '../class/task';


@Injectable()
export class TaskService {

    getTasks(page: number, per_page: number) {
        return [];
    }

    getRandomTask() {
        return new Task();
    }
}
