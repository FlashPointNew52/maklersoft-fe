import {Injectable} from '@angular/core';
import {Task} from '../class/task';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotebookService {

    private subject = new Subject<any>();
    private updater = new Subject<any>();

    set(data: any) {
        this.subject.next(data);
    }

    get(): Observable<any> {
        return this.subject.asObservable();
    }

    save(person: Task) {

    }

    update_field(dates: any){
        this.updater.next(dates);
    }

    is_update(): Observable<any>{
        return this.updater.asObservable();
    }
}
