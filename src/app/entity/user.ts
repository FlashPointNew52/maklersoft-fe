import {Organisation} from "./organisation";
import {Contact} from "./contact";

export class User extends Contact{
    position: string;
    department: string;
    specialization: string;
    category: string;
    photo: string;
    photoMini: string;

    public User () {
        Contact.apply(this, arguments);
    }

    public static getData(arr: Array<any>): any{
        for(let item of arr){
            if(item.value !== null)
                return item;
        }
        return {type: "", value: "Не указан"};
    }

    public static departmentOptions = [
        {value: 'management', label: 'Управление'},
        {value: 'sale', label: 'Отдел продаж'},
        {value: 'evaluation', label: 'Отдел оценки'},
        {value: 'advertising', label: 'Отдел рекламы'},
        {value: 'marketing', label: 'Отдел маркетинга'},
        {value: 'legal', label: 'Юридический отдел'},
        {value: 'mortgage', label: 'Отдел ипотеки'},
        {value: 'hr', label: 'HR-отдел'}
    ];

    public static positionOptionsByDepart = {
        'management' : [
            {value: 'top_manager', label: 'Топ-менеджер'},
            {value: 'director', label: 'Директор'},
            {value: 'commercial_director', label: 'Коммерческий директор'},
            {value: 'general_director', label: 'Генеральный директор'}
        ],
        'sale' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'sale_agent', label: 'Агент по продажам'},
            {value: 'sale_manager', label: 'Менеджер по продажам'},
            {value: 'sale_director', label: 'Директор отдела продаж'}
        ],
        'evaluation' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'appraiser', label: 'Оценщик'},
            {value: 'eval_manager', label: 'Менеджер отдела оценки'},
            {value: 'eval_director', label: 'Директор отдела оценки'}
        ],
        'advertising' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'pr_manager', label: 'PR-менеджер'},
            {value: 'adv_manager', label: 'Менеджер по рекламе'},
            {value: 'adv_web_manager', label: 'Менеджер по интернет-рекламе'},
            {value: 'adv_director', label: 'Директор отдела рекламы'}
        ],
        'marketing' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'marketer', label: 'Маркетолог'},
            {value: 'market_manager', label: 'Менеджер отдела маркетинга'},
            {value: 'market_director', label: 'Директор отдела маркетинга'}
        ],
        'legal' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'legal_assistant', label: 'Помощник юриста'},
            {value: 'lawyer', label: 'Юрист'},
            {value: 'lawyer_director', label: 'Директор юридического отдела'}
        ],
        'mortgage' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'broker', label: 'Брокер'},
            {value: 'mortgage_manager', label: 'Менеджер отдела ипотеки'},
            {value: 'mortgage_director', label: 'Директор отдела ипотеки'}
        ],
        'hr' : [
            {value: 'trainee', label: 'Стажер'},
            {value: 'specialist', label: 'Специалист'},
            {value: 'hr_manager', label: 'Менеджер по персоналу'},
            {value: 'hr_director', label: 'Директор HR-отдела'}
        ]
    };

    public static positionOptionsHash = {
      'trainee': 'Стажер',
      'specialist': 'Специалист',
      'sale_agent': 'Агент по продажам',
      'sale_manager': 'Менеджер по продажам',
      'sale_director': 'Директор отдела продаж',
      'appraiser': 'Оценщик',
      'eval_manager': 'Менеджер отдела оценки',
      'eval_director': 'Директор отдела оценки',
      'pr_manager': 'PR-менеджер',
      'adv_manager': 'Менеджер по рекламе',
      'adv_web_manager': 'Менеджер по интернет-рекламе',
      'adv_director': 'Директор отдела рекламы',
      'marketer': 'Маркетолог',
      'market_manager': 'Менеджер отдела маркетинга',
      'market_director': 'Директор отдела маркетинга',
      'legal_assistant': 'Помощник юриста',
      'lawyer': 'Юрист',
      'lawyer_director': 'Директор юридического отдела',
      'broker': 'Брокер',
      'mortgage_manager': 'Менеджер отдела ипотеки',
      'mortgage_director': 'Директор отдела ипотеки',
      'hr_manager': 'Менеджер по персоналу',
      'hr_director': 'Менеджер HR-отдела',
      'top_manager': 'Топ-менеджер',
      'director': 'Директор',
      'commercial_director': 'Коммерческий директор',
      'general_director': 'Генеральный директор'
    };

    public static stateUserCodeOptions = [
        {value: 'active', label: 'Активно'},
        {value: 'vacation', label: 'Отпуск'},
        {value: 'sick_leave', label: 'Больничный'},
        {value: 'other', label: 'Другое'},
        {value: 'archive', label: 'Архив'}
    ];

    public static specializationOptionsByDepart = {
        'sale' : [
            {value: 'all', label: 'Всё'},
            {value: 'rent', label: 'Аренда'},
            {value: 'sale', label: 'Продажа'}
        ],
        'evaluation' : [
            {value: 'all', label: 'Всё'},
            {value: 'trainee', label: 'Жилая недвижимость'},
            {value: 'specialist', label: 'Коммерческая недвижимость'},
            {value: 'land', label: 'Земля'}
        ],
        'advertising' : [
            {value: 'all', label: 'Всё'},
            {value: 'creation', label: 'Творчество'},
            {value: 'production', label: 'Прозводство'},
            {value: 'media_planning', label: 'Медиапланирование'}
        ],
        'marketing' : [
            {value: 'all', label: 'Всё'},
            {value: 'research', label: 'Исследования'},
            {value: 'analysis', label: 'Анализ и планирование'},
            {value: 'promotion', label: 'Продвижение'}
        ],
        'legal' : [
            {value: 'all', label: 'Всё'},
            {value: 'main', label: 'Правовое сопровождение основной деятельности'},
            {value: 'corporate', label: 'Корпоративно-правовая'},
            {value: 'claim', label: 'Судебно-претензионная'},
            {value: 'economic', label: 'Хозяйственная деятельность'}
        ],
        'mortgage' : [
            {value: 'all', label: 'Всё'},
            {value: 'trainee', label: 'Жилая недвижимость'},
            {value: 'specialist', label: 'Коммерческая недвижимость'},
            {value: 'land', label: 'Земля'}
        ],
        'hr' : [
            {value: 'all', label: 'Всё'},
            {value: 'recruiting', label: 'Служба рекрутинга'},
            {value: 'staff', label: 'Служба кадров'},
            {value: 'развития', label: 'Служба развития'},
            {value: 'evaluation', label: 'Служба оценки'},
        ]
    };

    public static typeMarketCodeOptions = [
        {value: 'all', label: 'Все'},
        {value: 'first', label: 'Первичный рынок'},
        {value: 'second', label: 'Вторичный рынок'}
    ];

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
