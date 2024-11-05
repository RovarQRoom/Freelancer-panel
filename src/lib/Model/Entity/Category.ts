import { Datetime } from "../Extention/Datetime";
import { LanguageEntity } from "./Language";
import type { SubcategoryEntity } from "./Subcategory";

export class CategoryEntity extends Datetime {
	id: number = 0;
	title: LanguageEntity = new LanguageEntity();
	image: string = "";
	icon?: string;
	subcategories?: SubcategoryEntity[] = [];
}
