import { Datetime } from '../Extention/Datetime';
import type { PolicyEntity } from './Policy';

export class RoleEntity extends Datetime {
	id: number = 0;
	name: string = '';
	policies?: { policy: PolicyEntity }[] = [];
}
