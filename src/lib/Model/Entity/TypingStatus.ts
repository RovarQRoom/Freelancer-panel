import { Datetime } from "../Extention/Datetime";
import { ConversationEntity } from "./Conversation";
import { UserEntity } from "./User";

export class TypingStatusEntity extends Datetime {
	id: number = 0;
	is_typing: boolean = false;
	user?: UserEntity = new UserEntity();
	conversation?: ConversationEntity = new ConversationEntity();
}
