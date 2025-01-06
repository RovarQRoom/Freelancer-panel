import { Datetime } from '../Extention/Datetime';
import { ConversationEntity } from './Conversation';
import { UserEntity } from './User';

export class MessageEntity extends Datetime {
	id: number = 0;
	content: string = '';
	is_read: boolean = false;
	file?: string = '';
	file_type?: string = '';
	conversation?: ConversationEntity = new ConversationEntity();
	sender?: UserEntity = new UserEntity();
}
