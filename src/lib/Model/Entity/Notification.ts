import { Datetime } from "../Extention/Datetime";
import type { UserEntity } from "./User";

export class NotificationEntity extends Datetime {
    id:number = 0;
    title:string = '';
    message?:string;
    image?:string;
    icon?:string;
    users?: {
        user:UserEntity
    }[] = [];
}