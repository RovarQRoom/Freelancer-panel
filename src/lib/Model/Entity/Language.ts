import { Datetime } from '../Extention/Datetime';

export class LanguageEntity extends Datetime {
	id: number = 0;
	en: string = '';
	ar?: string = '';
	ckb?: string = '';
}
