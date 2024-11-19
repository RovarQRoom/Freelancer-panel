import { Datetime } from '../Extention/Datetime';
import type { ExtraServiceEntity } from './ExtraService';
import type { OrderEntity } from './Order';
import type { ServiceEntity } from './Service';
import { UserEntity } from './User';

export class CartEntity extends Datetime {
	id: number = 0;
	overhaul_price: number = 0;
	fee: number = 0;
	user?: UserEntity;
	order?: OrderEntity;
	extraServices?: { extraService: ExtraServiceEntity }[];
	services?: { service: ServiceEntity }[];
}
