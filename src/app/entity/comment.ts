export class Comment {

  id: number;
  agentId: number;
  objId: number;
  objType: number;
  add_date: number;

  text: string;
  phone: string;

  like_count: number;
  like_users: number[];

  dislike_count: number;
  dislike_users: number[];

  constructor (text: string, pers_id: number) {
      this.text = text;
      this.objId = pers_id;
  }

}
