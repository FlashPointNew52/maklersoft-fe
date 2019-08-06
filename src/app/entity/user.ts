import {Organisation} from "./organisation";
import {Contact} from "./contact";

export class User extends Contact{
    position: string;
    department: string;
    specialization: string;
    category: string;
    photo: string;
    photoMini: string;

    public User() {
        Contact.apply(this, arguments);
    }

    public static getData(arr: Array<any>): any{
        for(let item of arr){
            if(item.value !== null)
                return item;
        }
        return {type: "", value: "Не указан"};
    }

    public static departmentOptions = {
        management: {label: 'Управление'},
        sale: {label: 'Отдел продаж'},
        evaluation: {label: 'Отдел оценки'},
        advertising: {label: 'Отдел рекламы'},
        marketing: {label: 'Отдел маркетинга'},
        legal: {label: 'Юридический отдел'},
        mortgage: {label: 'Отдел ипотеки'},
        quality: {label: 'Отдел контроля качества'},
        it: {label: 'Отдел IT'},
        hr: {label: 'HR-отдел'}
    };

    public static positionOptionsByDepart = {
        management: {
            top_manager: {label: 'Топ-менеджер'},
            director: {label: 'Директор'},
            commercial_director: {label: 'Коммерческий директор'},
            general_director: {label: 'Генеральный директор'}
        },
        sale: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            sale_agent: {label: 'Агент по продажам'},
            sale_manager: {label: 'Менеджер по продажам'},
            sale_director: {label: 'Директор отдела продаж'}
        },
        evaluation: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            appraiser: {label: 'Оценщик'},
            eval_manager: {label: 'Менеджер отдела оценки'},
            eval_director: {label: 'Директор отдела оценки'}
        },
        advertising: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            pr_manager: {label: 'PR-менеджер'},
            adv_manager: {label: 'Менеджер по рекламе'},
            adv_web_manager: {label: 'Менеджер по интернет-рекламе'},
            adv_director: {label: 'Директор отдела рекламы'}
        },
        marketing: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            marketer: {label: 'Маркетолог'},
            market_manager: {label: 'Менеджер отдела маркетинга'},
            market_director: {label: 'Директор отдела маркетинга'}
        },
        legal: {
            trainee: {label: 'Стажер'},
            legal_assistant: {label: 'Помощник юриста'},
            lawyer: {label: 'Юрист'},
            lawyer_director: {label: 'Директор юридического отдела'}
        },
        mortgage: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            broker: {label: 'Брокер'},
            mortgage_manager: {label: 'Менеджер отдела ипотеки'},
            mortgage_director: {label: 'Директор отдела ипотеки'}
        },
        quality: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            quality_manager: {label: 'Менеджер'},
            quality_director: {label: 'Начальник отдела'}
        },
        it: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            it_manager: {label: 'Менеджер'},
            it_director: {label: 'Начальник отдела'}
        },
        hr: {
            trainee: {label: 'Стажер'},
            specialist: {label: 'Специалист'},
            hr_manager: {label: 'Менеджер по персоналу'},
            hr_director: {label: 'Директор HR-отдела'}
        }
    };

    public static positionOptionsHash = {
        trainee: 'Стажер',
        specialist: 'Специалист',
        sale_agent: 'Агент по продажам',
        sale_manager: 'Менеджер по продажам',
        sale_director: 'Директор отдела продаж',
        appraiser: 'Оценщик',
        eval_manager: 'Менеджер отдела оценки',
        eval_director: 'Директор отдела оценки',
        pr_manager: 'PR-менеджер',
        adv_manager: 'Менеджер по рекламе',
        adv_web_manager: 'Менеджер по интернет-рекламе',
        adv_director: 'Директор отдела рекламы',
        marketer: 'Маркетолог',
        market_manager: 'Менеджер отдела маркетинга',
        market_director: 'Директор отдела маркетинга',
        legal_assistant: 'Помощник юриста',
        lawyer: 'Юрист',
        lawyer_director: 'Директор юридического отдела',
        broker: 'Брокер',
        mortgage_manager: 'Менеджер отдела ипотеки',
        mortgage_director: 'Директор отдела ипотеки',
        hr_manager: 'Менеджер по персоналу',
        hr_director: 'Менеджер HR-отдела',
        top_manager: 'Топ-менеджер',
        director: 'Директор',
        commercial_director: 'Коммерческий директор',
        general_director: 'Генеральный директор'
    };

    public static stateUserCodeOptions = {
        active: {label: 'Активно'},
        vacation: {label: 'Отпуск'},
        sick_leave: {label: 'Больничный'},
        other: {label: 'Другое'},
        archive: {label: 'Архив'}
    };

    public static specializationOptionsByDepart = {
        sale: {
            all: {label: 'Всё'},
            rent: {label: 'Аренда'},
            sale: {label: 'Продажа'}
        },
        evaluation: {
            all: {label: 'Всё'},
            trainee: {label: 'Жилая недвижимость'},
            specialist: {label: 'Коммерческая недвижимость'},
            land: {label: 'Земля'}
        },
        advertising: {
            all: {label: 'Всё'},
            creation: {label: 'Творчество'},
            production: {label: 'Прозводство'},
            media_planning: {label: 'Медиапланирование'}
        },
        marketing: {
            all: {label: 'Всё'},
            research: {label: 'Исследования'},
            analysis: {label: 'Анализ и планирование'},
            promotion: {label: 'Продвижение'}
        },
        legal: {
            all: {label: 'Всё'},
            main: {label: 'Правовое сопровождение основной деятельности'},
            corporate: {label: 'Корпоративно-правовая'},
            claim: {label: 'Судебно-претензионная'},
            economic: {label: 'Хозяйственная деятельность'}
        },
        mortgage: {
            all: {label: 'Всё'},
            trainee: {label: 'Жилая недвижимость'},
            specialist: {label: 'Коммерческая недвижимость'},
            land: {label: 'Земля'}
        },
        hr: {
            all: {label: 'Всё'},
            recruiting: {label: 'Служба рекрутинга'},
            staff: {label: 'Служба кадров'},
            развития: {label: 'Служба развития'},
            evaluation: {label: 'Служба оценки'},
        }
    };

    public static typeMarketCodeOptions = {
        all: {label: 'Все'},
        first: {label: 'Первичный рынок'},
        second: {label: 'Вторичный рынок'}
    };

    public static sort = [
        {class:'submenu', value: 'addDate', label: 'Добавлено', items:  [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
        {class:'submenu', value: 'assignDate', label: 'Назначено', items:  [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
        {class:'submenu', value: 'changeDate', label: 'Изменено' , items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]},
        {class:'submenu', value: 'rate', label: 'Рейтингу', items: [
            {class: 'entry', value: 'ASC', label: 'По возрастанию'},
            {class: 'entry', value: 'DESC', label: 'По убыванию'}
        ]}
    ];
}
