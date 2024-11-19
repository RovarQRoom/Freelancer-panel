import { Datetime } from '../Extention/Datetime';
import { LanguageEntity } from './Language';
import { ServiceEntity } from './Service';

export class ExtraServiceEntity extends Datetime {
	id: number = 0;
	title: LanguageEntity = new LanguageEntity();
	description?: LanguageEntity;
	price: number = 0;
	icon?: string;
	service: ServiceEntity = new ServiceEntity();
}
