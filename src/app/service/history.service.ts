import {Injectable} from '@angular/core';

import {HistoryRecord} from '../class/historyRecord';


@Injectable()
export class HistoryService {
    getObjHistory() {
        return OBJ_HISTORY;
    }

    putRecord(r: HistoryRecord) {
        OBJ_HISTORY.push(r);
    }
}

var OBJ_HISTORY: HistoryRecord[] = [
    {
        id: 6511,
        ts: 0,

        type_id: 2,
        type: 'импорт',
        text: 'Объект импортирован, источник ???, ссылка ???',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: '',
        property_id: 0,
        old_val: null,
        new_val: null,
    }, {
        id: 6512,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'Описание',
        property_id: 0,
        old_val: 'Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности позволяет выполнять важные задания по разработке соответствующий условий активизации.',
        new_val: 'С другой стороны новая модель организационной деятельности требуют от нас анализа модели развития.',
    },{
        id: 6513,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '1100',
    },{
        id: 6514,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1100',
        new_val: '1200',
    },{
        id: 6515,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6516,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6517,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6518,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6519,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6520,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6521,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6522,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6523,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6524,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6525,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6526,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6527,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6528,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }, {
        id: 6529,
        ts: 0,

        type_id: 1,
        type: 'изменение значение',
        text: '',

        user_id: 0,
        _user_name: 'Агент 1',

        object_type: 'offer',
        object_id: 0,

        property_name: 'цена',
        property_id: 0,
        old_val: '1200',
        new_val: '900',
    }
];
