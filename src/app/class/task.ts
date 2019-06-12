export class Task {
    id: number;
    type: string;
    result_id: number;
    comment: string;
    date: any;
    priority: number;
    discride: string;
    title: string;
    user: any;
    place: string;
    route: string;
    end_date: any;
    old_date: number;
    scr_left: number;
    scr_top: number;

    public static getResultText(task) {
      switch (task.result_id) {
        case (0): {
          return 'Выполняется';
        }
        case (1): {
          return 'Успешно';
        }
        case (2): {
          return 'Не успешно';
        }
      }
      return '???';
    }
}
