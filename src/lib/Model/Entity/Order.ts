import { Status } from '$lib/Supabase/Types/database.types';
import { Datetime } from '../Extention/Datetime';
import type { CartEntity } from './Cart';
import type { ExtraServiceEntity } from './ExtraService';
import type { ServiceEntity } from './Service';
import { UserEntity } from './User';

export class OrderEntity extends Datetime {
	id: number = 0;
	status: Status = Status.PENDING;
	overhaul_price: number = 0;
	fee: number = 0;
	user: UserEntity = new UserEntity();
	cart?: CartEntity;
	services?: { service: ServiceEntity, count?: number }[];
	extraServices?: { extraService: ExtraServiceEntity, count?: number }[];
}
