import type { LanguageEntity } from '$lib/Model/Entity/Language';
import { languageTag } from '$lib/paraglide/runtime';

export function getLanguage(language: LanguageEntity) {
	return language[languageTag()];
}
