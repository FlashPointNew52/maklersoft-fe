export abstract class ObjectBlock {

  public static getAsArray(objectBlock: ObjectBlock) {
      let t: string[] = [];
      for (let key in objectBlock) {
          if(objectBlock[key] && objectBlock[key].length > 0)
              t.push(objectBlock[key]);
      }

      return t;
  }

  public static getNotNullData(objectBlock: ObjectBlock){
      for (let key in objectBlock) {
          if(objectBlock[key] && objectBlock[key].length > 0)
              return objectBlock[key];
      }
      return null;
  }

  public getNotNullData(): string{
      return ObjectBlock.getNotNullData(this);
  }

  public static getAsString(objectBlock: ObjectBlock, delim: string = ", ") {
    let result = "";

    let t = [];
    for (let key in objectBlock) {
        if(objectBlock[key] && objectBlock[key].length > 0)
          t.push(objectBlock[key]);
    }
    result = t.join(delim);

    return result;
  }
}
