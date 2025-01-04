import { Datetime } from '../Extention/Datetime';
import { CategoryEntity } from './Category';
import { LanguageEntity } from './Language';

export class SubcategoryEntity extends Datetime {
	id: number = 0;
	title: LanguageEntity = new LanguageEntity();
	description?: LanguageEntity = new LanguageEntity();
	category?: CategoryEntity = new CategoryEntity();
}
