export class Fields {
	label: string = '';
	name: string = '';
	type: 'text' | 'number' | 'select' | 'date' | 'boolean' = 'text';
	dateRange?: boolean;
	store?: any;
	options?: Array<Options>;
	fieldsToShow?: Array<FieldsToShow>;
	select?: string;
	database?: boolean;
}

export class Options {
	value: string | number = '';
	label: string = '';
}

export class FieldsToShow {
	name: string = '';
	relation?: string | undefined;
}
