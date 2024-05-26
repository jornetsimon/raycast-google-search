import { Action, ActionPanel, Icon, List } from '@raycast/api';
import { getFavicon } from '@raycast/utils';
import { useState } from 'react';
import { search } from './google-search.service';
import { SearchResult } from './model/search-result.model';

export default function Command() {
	const [searchText, setSearchText] = useState('');
	const { data, isLoading } = search(searchText);

	const defaultView = (
		<List.EmptyView icon={Icon.MagnifyingGlass} title="Type something to get started" />
	);

	return (
		<List
			isLoading={isLoading}
			onSearchTextChange={setSearchText}
			searchBarPlaceholder="Search Google..."
			throttle
		>
			{!searchText
				? defaultView
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
