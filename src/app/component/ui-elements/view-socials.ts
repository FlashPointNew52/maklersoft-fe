import {Component} from '@angular/core';
import {SocialBlock} from "../../class/socialBlock";

@Component({
    selector: 'view-social',
    inputs: ['block'],
    template: `
        <div [style.background-image]="'url(/assets/socials/vk'+ (block?.vk ? '_active': '') +'.png)'"></div>
        <div [style.background-image]="'url(/assets/socials/ok'+ (block?.ok ? '_active': '') +'.png)'"></div>
        <div [style.background-image]="'url(/assets/socials/facebook'+ (block?.facebook ? '_active': '') +'.png)'"></div>
<!--        <div [style.background-image]="'url(/assets/socials/insta'+ (block?.instagram ? '_active': '') +'.png)'"></div>-->
        <div [style.background-image]="'url(/assets/socials/twitter'+ (block?.twitter ? '_active': '') +'.png)'"></div>
    `,
    styles: [`
        div{
            width: 22px;
            height: 22px;
            float: left;
            background-position: center;
            background-size: 22px;
            background-repeat: no-repeat;
            margin-left: 8px;
        }
    `]
})


export class ViewSocialsComponent {
    public block: SocialBlock = new SocialBlock();

}
