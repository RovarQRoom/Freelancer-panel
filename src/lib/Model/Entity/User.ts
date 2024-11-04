import { Datetime } from '../Extention/Datetime';

export class UserEntity extends Datetime {
	id: number = 0;
	email: string = '';
	phone: string = '';
	image?: string = '';
	auth?: string = '';
	role: number = 0;
}
