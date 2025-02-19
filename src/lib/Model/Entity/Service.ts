import { Datetime } from '../Extention/Datetime';
import { LanguageEntity } from './Language';
import type { RatingEntity } from './Rating';
import { SubcategoryEntity } from './Subcategory';
import { UserEntity } from './User';

export class ServiceEntity extends Datetime {
	id: number = 0;
	demo?: string = '';
	price?: number = 0;
	tags?: string[] = [];
	supports?: string[] = [];
	average_rating?: number = 0;
	subcategory?: SubcategoryEntity = new SubcategoryEntity();
	media?: LanguageEntity = new LanguageEntity();
	title: LanguageEntity = new LanguageEntity();
	description?: LanguageEntity = new LanguageEntity();
	supervised_by?: UserEntity = new UserEntity();
	created_by?: UserEntity = new UserEntity();
	users?: UserEntity[] = [];
	ratings?: RatingEntity[] = [];
}
