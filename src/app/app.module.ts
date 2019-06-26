import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxMaskModule} from 'ngx-mask'
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import {FormsModule} from '@angular/forms';
import {HttpModule} from "@angular/http";
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from "./app.component";
import {AgmCoreModule } from '@agm/core';
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

//new ui
import {SlidingMenuComponent} from "./component/ui-elements/sliding-menu";
import {MultiSelectComponent} from "./component/ui-elements/multiselect";

import {UIHeaderComponent} from "./component/ui/ui-header.component";
import {UIConditionsComponent} from "./component/ui/ui-conditions.component";
import {UISelect} from "./component/ui/ui-select.component";
import {UIFilterSelect} from "./component/ui/ui-filter-select.component";
import {UIFilterTagSelect} from "./component/ui/ui-filter-tag-select.component";
import {UIMultiSelect} from "./component/ui/ui-multiselect.component";
import {UIInputLine} from "./component/ui/ui-input-line.component";
import {UIViewLine} from "./component/ui/ui-view-line.component";
import {UIViewTextComponent} from "./component/ui/ui-view-text.component";
import {UISlidingMenuComponent} from "./component/ui/ui-slidingMenu.component";
import {OfferTableComponent} from "./component/offer-table.component";
import {DigestOfferComponent} from "./component/digest/digest-offer.component";
import {DigestOfferMapComponent} from "./component/digest/digest-offer-map.component";
import {DigestOfferRowComponent} from "./component/digest/digest-offer-row.component";
import {DigestOfferLineComponent} from "./component/digest/digest-offer-line.component";
import {DigestOfferTableComponent} from "./component/digest/digest-offer-table.component";
import {DigestOfferTable2Component} from "./component/digest/digest-offer-table2.component";
import {DigestCommentComponent} from "./component/digest/digest-comment.component";
import {UITabs} from "./component/ui/ui-tabs.component";
import {UITabsMenu} from "./component/ui/ui-tabs-menu.component";
import {UITab} from "./component/ui/ui-tab.component";
import {DigestHistoryComponent} from "./component/digest/digest-history.component";
import {DigestUserComponent} from "./component/digest/digest-user.component";
import {DigestWindowComponent} from "./component/digest/digest-window.component";
import {DigestOrganisationComponent} from "./component/digest/digest-organisation.component";
import {DigestRequestComponent} from "./component/digest/digest-request.component";
import {DigestRequestSmallComponent} from "./component/digest/digest-request-small.component";
import {UILineChart} from "./component/ui/ui-line-chart.component";
import {UIBarChart} from "./component/ui/ui-bar-chart.component";
import {UIPieChart} from "./component/ui/ui-pie-chart.component";
import {UICarousel} from "./component/ui/ui-carousel.component";
import {UITagBlock} from "./component/ui/ui-tag-block.component";
import {DigestPersonComponent} from "./component/digest/digest-person.component";
import {UITag} from "./component/ui/ui-tag.component";
import {UIViewValue} from "./component/ui/ui-view-value";
import {UIUploadFile} from "./component/ui/ui-upload-file.component";
import {UIMultiView} from "./component/ui/ui-multi-view";
import {OffClickDirective} from "./component/ui/off-click";
import {UIDocument} from "./component/ui/ui-document.component";
import {UIStarViewComponent} from "./component/ui/ui-star-view.component";
import {UIAdvertising} from "./component/ui/ui-advertising.component";
import {UISwitchButton} from "./component/ui/ui-switch-button";
import {UIViewSocials} from "./component/ui/ui-view-socials";
import {DigestPieChartComponent} from "./component/digest/digest-pie-chart.component";
import {DigestColumnChartComponent} from "./component/digest/digest-column-chart.component";
import {DigestAreaChartComponent} from "./component/digest/digest-area-chart.component";
import {GmapView} from "./component/view/gmap-view.component";
import {YamapView} from "./component/view/yamap-view.component";
import {FilesView} from "./component/view/files-view.component";
import {AdvView} from "./component/view/adv-view.component";
import {RequestsView} from "./component/view/requests-view.component";
import {LoginScreenComponent} from "./login-screen.component";
//import {AdminPageComponent} from "./admin-page.component";
import {MainComponent} from "./main.component";
import {FormatDatePipe} from "./pipe/format-date.pipe";
import {StrNnPipe} from "./pipe/str-nn.pipe";
import {DigestTimelineChartComponent} from "./component/digest/digest-timeline-chart.component";

import {GoogleChartComponent} from "./component/ui/chart/google-chart.component";
import {phoneBlockAsStringPipe} from "./pipe/phone-block-as-string.pipe";
import {UiSliderLineComponent} from "./component/ui/ui-slider-line.component";
import {DigestLineChartComponent} from "./component/digest/digest-line-chart.component";
import {CommentsViewComponent} from "./component/view/comments-view.component";
import {RatingViewComponent} from "./component/view/rating-view.component";
import {SelectsComponent} from "./component/ui-elements/selects";
import {InputLineComponent} from "./component/ui-elements/input-line";
import {SwitchButtonComponent} from "./component/ui-elements/switch-button";
import {ConditionsSwitchesComponent} from "./component/ui-elements/conditions-switches";
import {SlidingTagComponent} from "./component/ui-elements/sliding-tag";
import {InputAreaComponent} from "./component/ui-elements/input-area";
import {FilterSelectComponent} from "./component/ui-elements/filter-select";
import {FilterSelectTagComponent} from "./component/ui-elements/filter-select-tag";

const appRoutes: Routes = [
    { path: 'admin', loadChildren: 'app/admin.module#AdminModule' },
    { path: 'main', component: MainComponent },
    { path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        FormatDatePipe,
        StrNnPipe,
        phoneBlockAsStringPipe,

        LoginScreenComponent,
        //AdminPageComponent,

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
        OfferTableComponent,
        DigestOfferComponent,
        DigestOfferMapComponent,
        DigestOfferRowComponent,
        DigestOfferLineComponent,
        DigestOfferTableComponent,
        DigestOfferTable2Component,

        DigestHistoryComponent,
        DigestUserComponent,
        DigestWindowComponent,
        DigestOrganisationComponent,
        DigestRequestComponent,
        DigestRequestSmallComponent,
        DigestPersonComponent,
        DigestPieChartComponent,
        DigestColumnChartComponent,
        DigestAreaChartComponent,
        DigestCommentComponent,
        GmapView,
        YamapView,
        FilesView,
        AdvView,
        RequestsView,
        DigestTimelineChartComponent,
        DigestLineChartComponent,
        UIHeaderComponent,
        UISelect,
        UIFilterSelect,
        UIFilterTagSelect,
        UIMultiSelect,
        UISlidingMenuComponent,
        UIInputLine,
        UIViewValue,
        UIViewLine,
        UIViewTextComponent,
        UIMultiView,
        UITabs,
        UITabsMenu,
        UITab,
        UITag,
        UIConditionsComponent,
        UITagBlock,
        UILineChart,
        UIBarChart,
        UIPieChart,
        UICarousel,
        UIUploadFile,
        UIDocument,
        UiSliderLineComponent,
        UIStarViewComponent,
        GoogleChartComponent,
        UIAdvertising,
        UISwitchButton,
        UIViewSocials,
        OffClickDirective,
        CommentsViewComponent,
        RatingViewComponent,


        SlidingMenuComponent,
        MultiSelectComponent,
        SelectsComponent,
        InputLineComponent,
        SwitchButtonComponent,
        ConditionsSwitchesComponent,
        SlidingTagComponent,
        InputAreaComponent,
        FilterSelectComponent,
        FilterSelectTagComponent
    ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      TextareaAutosizeModule,
      AgmCoreModule.forRoot({
          apiKey: 'AIzaSyAi9zTbzWtEhLVZ8syBV6l7d3QMNLRokVY'
      }),
    //YaCoreModule.forRoot(),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgxMaskModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
