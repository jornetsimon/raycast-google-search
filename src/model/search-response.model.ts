import { SearchResult } from './search-result.model';

export interface SearchResponse {
	kind: string;
	url: {
		type: string;
		template: string;
	};
	queries: {
		previousPage: SearchResponsePage[];
		request: SearchResponsePage[];
		nextPage: SearchResponsePage[];
	};
	promotions: object[];
	context: object;
	searchInformation: {
		searchTime: number;
		formattedSearchTime: string;
		totalResults: string;
		formattedTotalResults: string;
	};
	spelling: {
		correctedQuery: string;
		htmlCorrectedQuery: string;
	};
	items: SearchResult[];
}

interface SearchResponsePage {
	title: string;
	totalResults: string;
	searchTerms: string;
	count: number;
	startIndex: number;
	startPage: number;
	language: string;
	inputEncoding: string;
	outputEncoding: string;
	safe: string;
	cx: string;
	sort: string;
	filter: string;
	gl: string;
	cr: string;
	googleHost: string;
	disableCnTwTranslation: string;
	hq: string;
	hl: string;
	siteSearch: string;
	siteSearchFilter: string;
	exactTerms: string;
	excludeTerms: string;
	linkSite: string;
	orTerms: string;
	relatedSite: string;
	dateRestrict: string;
	lowRange: string;
	highRange: string;
	fileType: string;
	rights: string;
	searchType: string;
	imgSize: string;
	imgType: string;
	imgColorType: string;
	imgDominantColor: string;
}
