import { Datetime } from '../Extention/Datetime';
import type { ConversationEntity } from './Conversation';
import type { RatingEntity } from './Rating';
import { RoleEntity } from './Role';
import type { ServiceEntity } from './Service';

export class UserEntity extends Datetime {
	id: number = 0;
	name?: string = '';
	email: string = '';
	phone: string = '';
	image?: string = '';
	auth?: string = '';
	role?: RoleEntity = new RoleEntity();
	services?: { service: ServiceEntity }[] = [];
	ratings?: { rating: RatingEntity }[] = [];
	conversations?: { conversation: ConversationEntity }[] = [];
}
