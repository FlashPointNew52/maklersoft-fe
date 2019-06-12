import {Injectable} from '@angular/core';

@Injectable()
export class AnalysisService {
    getObjAnalysis() {
        return OBJ_ANALYSIS;
    }
}

var OBJ_ANALYSIS = {
    ch1_data: [
        ['Задача', 'Значение'],
        ['Звонок', 42],
        ['Встреча', 28],
        ['Показ', 25],
        ['Задача А', 4],
        ['Задача Б', 2],
    ],
    ch1_data_v1: 101,
    ch2_data: [
        ['Дата', 'Запросы'],
        [0, 10],
        [1, 11],
        [2, 16],
        [3, 21],
        [4, 21],
        [5, 22],
        [6, 22],
        [7, 23],
    ],
    ch2_data_v1: 23,
    ch3_data: [
        ['День', 'успешно', 'не успешно'],
        [0, 1, 4],
        [1, 2, 8],
        [2, 2, 9],
        [3, 4, 16],
        [4, 4, 16],
        [5, 4, 17],
        [6, 5, 18],
        [7, 6, 19],
    ],
    ch3_data_v1: 6,
    ch3_data_v2: 19,
}
