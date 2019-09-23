import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {NgxMaskModule} from "ngx-mask";
import {ChartsModule} from "ng2-charts";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {DpDatePickerModule} from "ng2-date-picker";
import {AppComponent} from "./app.component";
import {AgmCoreModule} from "@agm/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {ChatViewComponent} from "./component/notebook/chat-view.component";
import {DailyPlannerViewComponent} from "./component/view/daily-planner-view.component";
import {NotificationViewComponent} from "./component/view/notification-view.component";
//import {YaCoreModule } from './component/ya-map-component/core.module';
import {ContextMenuComponent} from "./component/context-menu.component";
import {NotebookComponent} from "./component/notebook.component";
import {NotebookTask} from "./component/notebook/notebook-task.component";
import {Almanac} from "./component/notebook/almanac.component";
import {NotebookTaskDescribe} from "./component/notebook/notebook-task-describe.component";
import {TabRootComponent} from "./component/tab/tab-root.component";
import {TabMainComponent} from "./component/tab/tab-main.component";
import {TabListOfferComponent} from "./component/tab/tab-list-offer.component";
import {TabOfferComponent} from "./component/tab/tab-offer.component";
import {TabListPersonComponent} from "./component/tab/tab-list-person.component";
import {TabPersonComponent} from "./component/tab/tab-person.component";
import {TabListOrganisationComponent} from "./component/tab/tab-list-organisation.component";
import {TabOrganisationComponent} from "./component/tab/tab-organisation.component";
import {TabListRequestComponent} from "./component/tab/tab-list-request.component";
import {TabRequestComponent} from "./component/tab/tab-request.component";
import {TabListUserComponent} from "./component/tab/tab-list-user.component";
import {TabUserComponent} from "./component/tab/tab-user.component";
import {TabAdvertisingComponent} from "./component/tab/tab-advertising.component";
import {TabActivityComponent} from "./component/tab/tab-activity.component";
import {TabListActivityComponent} from "./component/tab/tab-list-activity.component";
import {TabDailyComponent} from "./component/tab/tab-daily.component";
import {TabConfigComponent} from "./component/tab/tab-config.component";
//new ui
import {StarMarkComponent} from "./component/ui-elements/star-mark";
import {SlidingMenuComponent} from "./component/ui-elements/sliding-menu";
import {MultiSelectComponent} from "./component/ui-elements/multiselect";
import {UISelect} from "./component/ui/ui-select.component";
import {UIInputLine} from "./component/ui/ui-input-line.component";
import {DigestOfferComponent} from "./component/digest/digest-offer.component";
import {DigestCommentComponent} from "./component/digest/digest-comment.component";
import {UITabsMenu} from "./component/ui/ui-tabs-menu.component";
import {UITab} from "./component/ui/ui-tab.component";
import {DigestHistoryComponent} from "./component/digest/digest-history.component";
import {DigestUserComponent} from "./component/digest/digest-user.component";
import {DigestOrganisationComponent} from "./component/digest/digest-organisation.component";
import {DigestRequestComponent} from "./component/digest/digest-request.component";
import {UITagBlock} from "./component/ui/ui-tag-block.component";
import {DigestPersonComponent} from "./component/digest/digest-person.component";
import {UITag} from "./component/ui/ui-tag.component";
import {UIUploadFile} from "./component/ui/ui-upload-file.component";
import {OffClickDirective} from "./component/ui/off-click";
import {YamapView} from "./component/view/yamap-view.component";
import {FilesView} from "./component/view/files-view.component";
import {AdvView} from "./component/view/adv-view.component";
import {LoginScreenComponent} from "./login-screen.component";
//import {AdminPageComponent} from "./admin-page.component";
import {MainComponent} from "./main.component";
import {FormatDatePipe} from "./pipe/format-date.pipe";
import {StrNnPipe} from "./pipe/str-nn.pipe";

import {phoneBlockAsStringPipe} from "./pipe/phone-block-as-string.pipe";
import {UiSliderLineComponent} from "./component/ui/ui-slider-line.component";
import {CommentsViewComponent} from "./component/view/comments-view.component";
import {RatingViewComponent} from "./component/view/rating-view.component";
import {SelectsComponent} from "./component/ui-elements/selects";
import {InputLineComponent} from "./component/ui-elements/input-line";
import {SwitchButtonComponent} from "./component/ui-elements/switch-button";
import {ConditionsSwitchesComponent} from "./component/ui-elements/conditions-switches";
import {HttpClientModule} from "@angular/common/http";
import {SlidingTagComponent} from "./component/ui-elements/sliding-tag";
import {InputAreaComponent} from "./component/ui-elements/input-area";
import {FilterSelectComponent} from "./component/ui-elements/filter-select";
import {FilterSelectTagComponent} from "./component/ui-elements/filter-select-tag";
import {TabSystemComponent} from "./component/tab-system.component";
import {ModalWindowComponent} from "./component/modal-window.component";
import {AddressInputComponent} from "./component/ui-elements/address-input";
import {ViewSocialsComponent} from "./component/ui-elements/view-socials";

const appRoutes: Routes = [
    {path: "admin", loadChildren: "src/app/admin.module#AdminModule"},
    {path: "main", component: MainComponent},
    {
        path: "",
        redirectTo: "/main",
        pathMatch: "full"
    }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        ViewSocialsComponent,
        DailyPlannerViewComponent,
        ChatViewComponent,
        NotificationViewComponent,
        AppComponent,
        FormatDatePipe,
        StrNnPipe,
        phoneBlockAsStringPipe,
        TabConfigComponent,
        TabSystemComponent,
        LoginScreenComponent,
        // AdminPageComponent,

        MainComponent,
        ContextMenuComponent,
        NotebookComponent,
        NotebookTask,
        Almanac,
        NotebookTaskDescribe,
        TabRootComponent,
        TabMainComponent,
        TabListOfferComponent,
        TabOfferComponent,
        TabListPersonComponent,
        TabPersonComponent,
        TabListOrganisationComponent,
        TabOrganisationComponent,
        TabListRequestComponent,
        TabRequestComponent,
        TabListUserComponent,
        TabUserComponent,
        TabAdvertisingComponent,
        TabListActivityComponent,
        TabActivityComponent,
        TabDailyComponent,
        DigestOfferComponent,
        DigestHistoryComponent,
        DigestUserComponent,
        DigestOrganisationComponent,
        DigestRequestComponent,
        DigestPersonComponent,
        DigestCommentComponent,
        YamapView,
        FilesView,
        AdvView,
        UISelect,
        UIInputLine,
        UITabsMenu,
        UITab,
        UITag,
        UITagBlock,
        UIUploadFile,
        UiSliderLineComponent,
        OffClickDirective,
        CommentsViewComponent,
        RatingViewComponent,

        StarMarkComponent,
        SlidingMenuComponent,
        MultiSelectComponent,
        SelectsComponent,
        InputLineComponent,
        SwitchButtonComponent,
        ConditionsSwitchesComponent,
        SlidingTagComponent,
        InputAreaComponent,
        FilterSelectComponent,
        FilterSelectTagComponent,
        ModalWindowComponent,
        AddressInputComponent
    ],
    imports: [
        MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
        BrowserAnimationsModule,
        BrowserModule,
        DpDatePickerModule,
        FormsModule,
        ChartsModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY"
        }),
        BrowserModule,
        FormsModule,
        //YaCoreModule.forRoot(),
        RouterModule.forRoot(appRoutes, {useHash: true}),
        NgxMaskModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
