import {Component, OnInit, OnChanges} from '@angular/core';
import {Output,Input, EventEmitter} from '@angular/core';
import {UserService} from '../../service/user.service';
import {UploadService} from '../../service/upload.service';
import {SessionService} from '../../service/session.service';
import {HubService} from '../../service/hub.service';


@Component({
    selector: 'ui-upload-file',
    inputs:['activeColor','baseColor','overlayColor', 'type', 'obj_id', 'obj_type', 'parent'],
    template: `
        <label class="ui-upload-file add-block"  ondragover="return false;"
            [class.loaded]="loaded"
            (dragenter)="handleDragEnter()"
            (dragleave)="handleDragLeave()"
            (drop)="handleDrop($event)"
        >

            <div class="plus" *ngIf="parent == 'photo' || parent == 'docs'">
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <div class="add-text" *ngIf="parent == 'photo' || parent == 'docs'">Добавить фотографию</div>
<!--            <div class="image_contain" *ngIf="type=='image'">-->
<!--                <div class='image' *ngFor="let image of fileSrc" (click)="remove(image.index)">-->
<!--                    <img  [src]="image.src" (load)="handleImageLoad()" [class.loaded]="imageLoaded"/>-->
<!--                    <div style="height: 4px; background-color: #54b947; border-radius: 10px; position: absolute; bottom: 0; left: 0;"-->
<!--                        [style.width]="image.load_pers"-->
<!--                    ></div>-->
<!--                </div>-->
<!--            </div>-->
            <!--<div class="doc_contain" *ngIf="type=='document'">
                <div class='document' *ngFor="let image of fileSrc">
                    <span style="position: relative;display: block;width: 100%;text-align: center;margin: 5px;"
                        >Идет загрузка файла...
                    </span>
                    <progress
                         [value]="image.load_pers" max="300"
                    ></progress>
                </div>
            </div>-->
            <input type="file" name="file" [accept]="format" [multiple]="multiple"
                (change)="handleInputChange($event)">
        </label>
    `,
    styles: [`
        .add-block{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 1px solid #D3D5d6;
        }
        .add-block:hover .plus .line{
            background-color: var(--color-blue);
        }
        .add-block:hover .add-text{
            color: var(--color-blue);
        }
        .plus{
            width: 120px;
            height: 100px;
        }
        .plus .line:first-child{
            width: 40px;
            height: 1px;
            background-color: #252F32;
            position: relative;
            top: 50%;
            left: calc(50% - 20px);
        }
        .plus .line:last-child{
            width: 40px;
            height: 1px;
            background-color: #252F32;
            position: relative;
            left: 40px;
            transform: rotate(90deg);
            top: 50%;
        } 
        .add-block input {
            display: none;
        }
        .add-block img {
            pointer-events: none;
        }

        .add-block img {
            opacity: 0;
            max-height: 100%;
            max-width: 100%;
            transition: all 300ms ease-in;
            z-index: -1;
        }

        .add-block img.loaded {
            opacity: 1;
        }

        .image_contain{
            width: calc(100% - 10px);
            height: calc(100% - 75px);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
        }

        .image_contain>.image{
            width: 175px;
            height: 130px;
            /* border: 2px solid silver; */
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .image_contain>.image:hover{
            transition: all 250ms linear;
            background-color: rgba(107, 107, 107, 0.79);
        }
        .image_contain>.image:hover:before{
            content: "Удалить";
            color: white;
            position: absolute;
            font-size: 12pt;
        }

        .doc_contain{
            width: calc(100% - 10px);
            height: calc(100% - 10px);
        }

        .doc_contain>.document{
            width: 100%;
            height: 100%;
        }

        .doc_contain>.document>progress:not([value]){

            background-image: url(assets/progress_bar.png);
            background-color: #ff9900;
        }

        .doc_contain>.document>progress {
	        width: 355px;
	        height: 20px;
            max-width: 100%;
        	display: block;
        	-webkit-appearance: none;
        	border: none;
            margin-left: 2px;
        }

        .doc_contain>.document>progress::-webkit-progress-bar {
            background: transparent;
        }

        .doc_contain>.document>progress::-webkit-progress-value {
            background-image:
                -webkit-linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .1) 33%, rgba(0,0, 0, .1) 66%, transparent 66%),
                -webkit-linear-gradient(top, rgba(255, 255, 255, .25), rgba(0, 0, 0, .25)),
                -webkit-linear-gradient(left, #338c4e, #0dce00);
            background-size: 35px 20px, 100% 100%, 100% 100%;
            background-repeat: repeat-x;
            -webkit-animation: animate-stripes 5s linear infinite;
            animation: animate-stripes 5s linear infinite;
        }

        @-webkit-keyframes animate-stripes {
            from { background-position: 0px 0px; }
            to { background-position: -100px 0px; }
        }

        @keyframes animate-stripes {
            from { background-position: 0px 0px; }
            to { background-position: -100px 0px; }
        }

        .load_buttom{
            width: 118px;
            height: 30px;
            background-color: #008cdb;
            color: white;
            line-height: 30px;
            text-align: center;
        }
    `]
})


export class UIUploadFile implements OnInit{
    activeColor: string = 'green';
    public obj_id: any;
    public obj_type: string = "offers";
    public parent: any;
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(255,255,255,0.5)';
    type: string = 'image';
    dragging: boolean = false;
    loaded: boolean = false;
    imageLoaded: boolean = false;
    format:string;
    pattern: RegExp;
    multiple: boolean;

    @Output() fileChange: EventEmitter<any> = new EventEmitter();
    @Output() addNewFile: EventEmitter<any> = new EventEmitter();
    @Output() progressState: EventEmitter<any> = new EventEmitter();

    constructor(
        private _hubService: HubService,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _sessionService: SessionService
    ) { };

    ngOnInit(){
        if(this.type == 'image'){
            this.format='image/*';
            this.pattern=/image-*/;
            this.multiple= true;
        }else if(this.type == 'document'){
            this.format='application/pdf, .doc, .docx, .xls, .xlsx, .txt, .rtf, .odt';
            this.pattern=/(application\/pdf)|(application\/vnd\.openxmlformats-officedocument)|(application\/vnd\.ms-excel)|(text\/plain)|(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|(application\/vnd\.oasis\.opendocument\.text)|(application\/msword)/;
            this.multiple= true;
        }

    }

    handleDragEnter() {
        this.dragging = true;
    }

    handleDragLeave() {
        this.dragging = false;
    }

    handleDrop(e) {
        e.preventDefault();
        this.dragging = false;
        this.handleInputChange(e);
    }

    handleImageLoad() {
        this.imageLoaded = true;
    }

    handleInputChange(event) {
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        let pattern = this.pattern;
        let reader = new FileReader();
        let type = this.type;
        let objId = this.obj_id;
        let obj_type = this.obj_type;
        let _uploadService = this._uploadService;
        let addNewFile = this.addNewFile;
        let progressState = this.progressState;
        console.log(files);
        reader.onloadstart = ((event) => {
            this.progressState.emit(0);
        });
        reader.onprogress = ((event) => {

        });

        reader.onloadend = ((event) => {

        });

        function readFile(index) {
           if( index >= files.length )return;
           let file = files[index];
           if (!file.type.match(pattern))  {
               alert("Файл " + file.name + " не поддерживается");
               readFile(index+1);
               return;
           }
           if (file.size == 0)  {
               alert("Внимание! Файл " + file.name+" пустой");
               readFile(index+1);
               return;
           }
           reader.onload = (() =>{
               if(type == 'image'){

                   _uploadService.uploadPhoto(file, file, obj_type, objId, file.name).subscribe(data => {
                       progressState.emit(100);
                       addNewFile.emit(data);
                       readFile(index+1);
                   });
               } else if(type == 'document'){
                   _uploadService.uploadDoc(null, [file], obj_type, objId, file.name).subscribe(data => {
                       progressState.emit(100);
                       addNewFile.emit(data);
                       readFile(index+1);
                   });
               }

           });
           if(type == 'image')
              reader.readAsDataURL(file);
           else if(type == 'document')
              reader.readAsDataURL(file);
       }

       readFile(0);

    }

}
