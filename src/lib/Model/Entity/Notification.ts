import { Datetime } from "../Extention/Datetime";
import type { UserEntity } from "./User";

export class NotificationEntity extends Datetime {
    id:number = 0;
    title:string = '';
    message?:string;
    image?:string;
    icon?:string;
    users?: NotificationUserEntity[] = [];
}

export class NotificationUserEntity extends Datetime {
    id:number = 0;
    user?:UserEntity;
    notification?:NotificationEntity;
    seen:boolean = false;
}
