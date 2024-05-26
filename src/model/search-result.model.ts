export interface SearchResult {
	kind: string;
	title: string;
	htmlTitle: string;
	link: string;
	displayLink: string;
	snippet: string;
	htmlSnippet: string;
	cacheId: string;
	formattedUrl: string;
	htmlFormattedUrl: string;
	pagemap: object;
	mime: string;
	fileFormat: string;
	image: {
		contextLink: string;
		height: number;
		width: number;
		byteSize: number;
		thumbnailLink: string;
		thumbnailHeight: number;
		thumbnailWidth: number;
	};
	labels: [
		{
			name: string;
			displayName: string;
			label_with_op: string;
		},
	];
}
