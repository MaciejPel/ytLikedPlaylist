import { AxiosError } from 'axios';
import { InfiniteQueryObserverResult } from 'react-query';
import { VideosListResponse } from '../App';

interface SearchBarProps {
	searchState: {
		playlistId: string;
		text: string;
	};
	setSearchState: React.Dispatch<
		React.SetStateAction<{
			playlistId: string;
			text: string;
		}>
	>;
	fetchNextPage: () => Promise<
		InfiniteQueryObserverResult<VideosListResponse, AxiosError<unknown, any>>
	>;
	isFetchingPossible: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
	searchState,
	setSearchState,
	fetchNextPage,
	isFetchingPossible,
}) => {
	return (
		<div className="pb-4 flex md:flex-row flex-col gap-2">
			<input
				type="text"
				className="rounded-full px-4 py-2 dark:bg-zinc-700 bg-zinc-100 focus:bg-zinc-200 dark:focus:bg-zinc-600 outline-none md:w-80 w-auto"
				placeholder="Playlist ID"
				value={searchState.playlistId}
				onChange={(e) => setSearchState({ ...searchState, playlistId: e.target.value })}
			/>
			<input
				type="text"
				className="rounded-full px-4 py-2 dark:bg-zinc-700 dark:focus:bg-zinc-600 bg-zinc-100 focus:bg-zinc-200 outline-none flex-1"
				placeholder="Search by title/author"
				value={searchState.text}
				onChange={(e) => setSearchState({ ...searchState, text: e.target.value })}
			/>
			<div className="flex gap-2">
				<button
					title="Reset search query"
					type="button"
					onClick={() => setSearchState({ playlistId: 'LL', text: '' })}
					className="dark:bg-zinc-700 px-4 py-2 rounded-lg dark:hover:bg-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-medium md:flex-initial flex-1"
				>
					Reset
				</button>
				<button
					title="Fetch forward if it is possible"
					type="button"
					disabled={isFetchingPossible}
					onClick={() => fetchNextPage()}
					className="dark:bg-zinc-700 px-4 py-2 rounded-lg dark:hover:bg-zinc-600 dark:disabled:bg-red-400 bg-zinc-100 hover:bg-zinc-200 disabled:bg-red-400 font-medium md:flex-initial flex-1"
				>
					Fetch next
				</button>
			</div>
		</div>
	);
};
export default SearchBar;
