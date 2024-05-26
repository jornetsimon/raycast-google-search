import { AsyncState, Response, useFetch } from '@raycast/utils';
import { URLSearchParams } from 'node:url';
import { SearchResult } from './model/search-result.model';
import { SearchResponse } from './model/search-response.model';
import { getPreferenceValues } from '@raycast/api';

const API_BASE_URL = 'https://www.googleapis.com/customsearch/v1';

export function search(query: string): AsyncState<SearchResult[]> {
	const preferences = getPreferenceValues<Preferences>();
	const params = new URLSearchParams({
		q: query,
		cx: preferences.googleSearchEngineId,
		key: preferences.googleApiKey,
	});

	return useFetch(`${API_BASE_URL}?${params}`, {
		parseResponse: searchResponseParser,
		execute: !!query,
	});
}

async function searchResponseParser(response: Response) {
	const json = (await response.json()) as SearchResponse | { code: string; message: string };

	if (!response.ok || 'message' in json) {
		throw new Error('message' in json ? json.message : response.statusText);
	}

	return json.items;
}
