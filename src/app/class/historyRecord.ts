export interface HistoryRecord {
    id: number;
    ts: number;

    type_id: number;
    type: string;
    text: string;

    user_id: number;
    _user_name: string;

    object_type: string;
    object_id: number;

    property_name: string;
    property_id: number;
    old_val: any;
    new_val: any;
}
