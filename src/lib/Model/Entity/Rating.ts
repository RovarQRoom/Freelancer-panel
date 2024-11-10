import { Datetime } from "../Extention/Datetime";
import { ServiceEntity } from "./Service";
import { UserEntity } from "./User";

export class RatingEntity extends Datetime {
	id: number = 0;
	rate: number = 0;
	review?: string = '';
	user?: UserEntity = new UserEntity();
	service?: ServiceEntity = new ServiceEntity();
}
