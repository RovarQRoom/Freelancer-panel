import { Datetime } from "../Extention/Datetime";
import { LanguageEntity } from "./Language";

export class ServiceEntity extends Datetime {
	id: number = 0;
	title: LanguageEntity = new LanguageEntity();
	description?: string = '';
	demo?: string = '';
	media?: string = '';
	price?: number = 0;
	language: number = 0;
}
