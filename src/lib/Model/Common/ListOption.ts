export interface GenericListOptions extends FilteringOptions {
	page?: number;
	limit?: number;
	sortField?: string;
	fieldOption?: string;
	fieldOptionSearch?: string;
	sortType?: string;
	select?: string;
	orderBy?: string;
	order?: boolean;
	[key: string]: any;
}

interface FilteringOptions {
	search?: string;
	from?: string | Date;
	to?: string | Date;
	status?: number;
	ids?: string[];
	id?: string;
	equal?: string;
	notEqual?: string;
	in?: string[];
	isEmpty?: boolean;
	notEmpty?: boolean;
	notIn?: string[];
}
