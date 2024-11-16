import { Datetime } from '../Extention/Datetime';
import type { RoleEntity } from './Role';

export class PolicyEntity extends Datetime {
	id: number = 0;
	name: string = '';
	roles?: { role: RoleEntity }[] = [];
}
