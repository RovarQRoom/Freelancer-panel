export class Store<T> {
	data: T[] = [];
	total: number = 0;
	pages?: number;
	currentPage?: number;
	remaining?: number;
}
