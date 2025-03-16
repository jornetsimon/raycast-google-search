import { useEffect, useRef } from 'react';
import { open, popToRoot } from '@raycast/api';
import { SearchResult } from './model/search-result.model';

export function useBangRedirect(fallbackText: string | undefined) {
	const processedBangRef = useRef<string | null>(null);
	const bangRegex = /!\w+/;

	useEffect(() => {
		const hasBang = fallbackText ? bangRegex.test(fallbackText) : false;

		if (fallbackText && hasBang && processedBangRef.current !== fallbackText) {
			processedBangRef.current = fallbackText;
			open(`https://unduck.link?q=${encodeURIComponent(fallbackText)}`).then(() =>
				popToRoot()
			);
		}
	}, [fallbackText]);
}

export function useQuickRedirect(fallbackText: string | undefined, searchResults: SearchResult[]) {
	const processedBangRef = useRef<string | null>(null);
	const bangRegex = /\w+\s?!(?!\s)$/;

	useEffect(() => {
		const hasBang = fallbackText ? bangRegex.test(fallbackText) : false;

		if (
			fallbackText &&
			searchResults.length &&
			hasBang &&
			processedBangRef.current !== fallbackText
		) {
			processedBangRef.current = fallbackText;
			open(searchResults[0].link).then(() => popToRoot());
		}
	}, [fallbackText, searchResults]);
}
