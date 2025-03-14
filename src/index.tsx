import { Action, ActionPanel, Icon, LaunchProps, List, open, popToRoot } from '@raycast/api';
import { getFavicon } from '@raycast/utils';
import { useEffect, useRef, useState } from 'react';
import { search as searchGoogle } from './google-search.service';
import { SearchResult } from './model/search-result.model';

export default function Command(props: LaunchProps) {
	const [searchText, setSearchText] = useState('');
	const processedBangRef = useRef<string | null>(null);

	const fallbackQuery = props.fallbackText;

	useEffect(() => {
		const bangRegex = /!\w+/;
		const hasBang = fallbackQuery ? bangRegex.test(fallbackQuery) : false;

		if (fallbackQuery && hasBang && processedBangRef.current !== fallbackQuery) {
			processedBangRef.current = fallbackQuery;
			open(`https://unduck.link?q=${encodeURIComponent(fallbackQuery)}`).then(() =>
				popToRoot()
			);
		}
	}, [props.fallbackText]);

	const { data, isLoading } = searchGoogle(searchText);

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
