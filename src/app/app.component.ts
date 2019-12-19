import { Component } from '@angular/core';
import {HubService} from './service/hub.service';
import {RequestService} from "./service/request.service";
import {ConfigService} from "./service/config.service";
import {PersonService} from "./service/person.service";
import {UserService} from "./service/user.service";
import {OfferService} from "./service/offer.service";
import {OrganisationService} from "./service/organisation.service";
import {TaskService} from "./service/task.service";
import {AnalysisService} from "./service/analysis.service";
import {HistoryService} from "./service/history.service";
import {AccountService} from "./service/account.service";
import {SessionService} from "./service/session.service";
import {UploadService} from "./service/upload.service";
import {SuggestionService} from "./service/suggestion.service";
import {NotebookService} from "./service/notebook.service";
import {CommentService} from "./service/comment.service";
import {RatingService} from "./service/rating.service";
import {SocialService} from "./service/social.service";

@Component({
  selector: 'app-root',
  template: `
      <modal-window></modal-window>
      <login-screen></login-screen>
      <context-menu
          [menu]="_hubService.shared_var['cm']"
          [hidden]="_hubService.shared_var['cm_hidden']"
      >
      </context-menu>
      <router-outlet></router-outlet>
  `,
  styles: [``],
  providers: [HubService, ConfigService, SuggestionService, UserService, OrganisationService, PersonService, CommentService, RatingService,
      RequestService, OfferService, TaskService, AnalysisService, HistoryService, AccountService,
      SessionService, UploadService, NotebookService, SocialService]
})
export class AppComponent {
    constructor(protected _hubService: HubService) {
        this._hubService.shared_var['cm'] = {};
        this._hubService.shared_var['cm_hidden'] = true;
        if (localStorage.getItem('vk_time') != undefined) {
            if (Date.now()/1000 - Number.parseInt(localStorage.getItem('vk_time'),10) > 86400) {
                localStorage.setItem('vk_counter', '0');
            }
        } else {
            localStorage.setItem('vk_counter', '0');
        }
        if (localStorage.getItem('ok_time') != undefined) {
            if (Date.now()/1000 - Number.parseInt(localStorage.getItem('ok_time'),10) > 86400) {
                localStorage.setItem('ok_counter', '0');
            }
        } else {
            localStorage.setItem('ok_counter', '0');
        }
        if (localStorage.getItem('facebook_time') != undefined) {
            if (Date.now()/1000 - Number.parseInt(localStorage.getItem('facebook_time'),10) > 86400) {
                localStorage.setItem('facebook_counter', '0');
            }
        } else {
            localStorage.setItem('facebook_counter', '0');
        }
        if (localStorage.getItem('twitter_time') != undefined) {
            if (Date.now()/1000 - Number.parseInt(localStorage.getItem('twitter_time'),10) > 86400) {
                localStorage.setItem('twitter_counter', '0');
            }
        } else {
            localStorage.setItem('twitter_counter', '0');
        }
    }

}
