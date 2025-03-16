import { Action, ActionPanel, Icon, LaunchProps, List } from '@raycast/api';
import { getFavicon } from '@raycast/utils';
import { useState } from 'react';
import { useBangRedirect, useQuickRedirect } from './bang-hooks';
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
