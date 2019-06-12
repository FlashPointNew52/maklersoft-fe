export class Tags {
    color: string;
    name: string;

    public static tagArray: any[] = [
        { id: null, color: 'transparent', selected_color: 'rgb(203, 73, 76)', label: 'Не назначен'},
        { id: 1, color: '#1e88e5', selected_color: 'rgb(203, 73, 76)', label: 'Голубой'},
        { id: 2, color: '#3f51b5', selected_color: 'rgb(204, 138, 20)', label: 'Синий'},
        { id: 3, color: '#8e24aa', selected_color: 'rgb(194, 179, 27)', label: 'Фиолетовый'},
        { id: 4, color: '#00897b', selected_color: 'rgb(130, 174, 16)', label: 'Зелёный'},
        { id: 5, color: '#fb8c00', selected_color: 'rgb(81, 151, 202)', label: 'Оранжевый'},
        { id: 6, color: '#e53935', selected_color: 'rgb(178, 116, 202)', label: 'Красный'}
    ];

    public static tagStructure: any = {
        null: { color: 'transparent', selected_color: 'rgb(203, 73, 76)', label: 'Не назначен'},
        1: { color: '#1e88e5', selected_color: 'rgb(203, 73, 76)', label: 'Голубой'},
        2: { color: '#3f51b5', selected_color: 'rgb(204, 138, 20)', label: 'Синий'},
        3: { color: '#8e24aa', selected_color: 'rgb(194, 179, 27)', label: 'Фиолетовый'},
        4: { color: '#00897b', selected_color: 'rgb(130, 174, 16)', label: 'Зелёный'},
        5: { color: '#fb8c00', selected_color: 'rgb(81, 151, 202)', label: 'Оранжевый'},
        6: { color: '#e53935', selected_color: 'rgb(178, 116, 202)', label: 'Красный'}
    };

    public static getLabel(id){
        this.tagStructure[id] ? this.tagStructure[id].label : null;
    }

}
