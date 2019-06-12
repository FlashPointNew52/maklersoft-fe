import {Injectable} from '@angular/core';

@Injectable()
export class HubService {

  public shared_var = {};

  private stash = {
      some_prop: 'some_val',
      seenOffers: [],
      modifiedOffers: []
  }

  getProperty(name: string) {
      return this.stash[name];
  }

  setProperty(name: string, val: any) {
      this.stash[name] = val;
  }
}
