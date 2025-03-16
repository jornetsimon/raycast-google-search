import { Action, ActionPanel, Icon, LaunchProps, List, open, popToRoot } from '@raycast/api';
import { getFavicon } from '@raycast/utils';
import { useEffect, useRef, useState } from 'react';
import { search as searchGoogle } from './google-search.service';
import { SearchResult } from './model/search-result.model';

export default function Command(props: LaunchProps) {
	const [searchText, setSearchText] = useState('');

	const fallbackQuery = props.fallbackText;

	useBangRedirect(fallbackQuery);

	const { data, isLoading } = searchGoogle(searchText);

	useQuickRedirect(fallbackQuery, data ?? []);

	const emptyView = (
		<List.EmptyView icon={Icon.MagnifyingGlass} title="Type something to get started" />
	);

	const loadingView = <List.EmptyView icon={Icon.Waveform} />;

	const isLaunchedWithParam = props.arguments?.query === undefined;

	return (
		<List
			isLoading={isLoading}
			onSearchTextChange={setSearchText}
			searchBarPlaceholder="Search Google..."
			throttle
		>
			{isLoading && isLaunchedWithParam
				? loadingView
				: !searchText
					? emptyView
					: data?.map((searchResult) => (
							<SearchListItem
								key={searchResult.link}
								searchTerm={searchText}
								searchResult={searchResult}
							/>
						))}
		</List>
	);
}

function SearchListItem({
	searchTerm,
	searchResult,
}: {
	searchTerm: string;
	searchResult: SearchResult;
}) {
	return (
		<List.Item
			title={searchResult.title}
			icon={getFavicon(searchResult.link)}
			subtitle={searchResult.displayLink}
			actions={
				<ActionPanel>
					<Action.OpenInBrowser url={searchResult.link} />
					<Action.OpenInBrowser
						title="Search in Browser..."
						url={`https://www.google.com/search?q=${searchTerm}`}
						shortcut={{ modifiers: ['cmd'], key: 'enter' }}
					/>
					<ActionPanel.Section>
						<Action.CopyToClipboard
							title="Copy URL"
							content={`${searchResult.link}`}
							shortcut={{ modifiers: ['cmd'], key: 'c' }}
						/>
					</ActionPanel.Section>
				</ActionPanel>
			}
		/>
	);
}

function useBangRedirect(fallbackText: string | undefined) {
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

function useQuickRedirect(fallbackText: string | undefined, searchResults: SearchResult[]) {
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
