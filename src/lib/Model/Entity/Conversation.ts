import { Datetime } from '../Extention/Datetime';
import type { UserEntity } from './User';

export class ConversationEntity extends Datetime {
	id: number = 0;
	name: string = '';
	is_group?: boolean = false;
	temporary?: boolean = false;
	is_done?: boolean = false;
	participants?: number[] = [];
	users?: { user: UserEntity }[] = [];
}
