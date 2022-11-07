import { AxiosError } from 'axios';
import { InfiniteQueryObserverResult } from 'react-query';
import { VideosListResponse } from '../App';

interface SearchBarProps {
	searchState: {
		playlistId: string;
		text: string;
		infinite: boolean;
	};
	setSearchState: React.Dispatch<
		React.SetStateAction<{
			playlistId: string;
			text: string;
			infinite: boolean;
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
		<div className="pb-4 flex gap-2 justify-between lg:flex-row flex-col">
			<div className="flex gap-2 flex-1">
				<input
					type="text"
					className="rounded-lg px-4 py-2 dark:bg-zinc-700 bg-zinc-100 focus:bg-zinc-200 dark:focus:bg-zinc-600 outline-none w-1/2 lg:w-auto"
					placeholder="Playlist ID"
					value={searchState.playlistId}
					onChange={(e) =>
						setSearchState({ ...searchState, playlistId: e.target.value, infinite: false })
					}
				/>
				<input
					type="text"
					className="rounded-lg px-4 py-2 dark:bg-zinc-700 dark:focus:bg-zinc-600 bg-zinc-100 focus:bg-zinc-200 outline-none flex-1"
					placeholder="Search by title/author"
					value={searchState.text}
					onChange={(e) => setSearchState({ ...searchState, text: e.target.value })}
				/>
			</div>
			<div className="flex gap-2 flex-1 lg:flex-row flex-col justify-end">
				<div className="flex gap-2 lg:flex-initial flex-1">
					<button
						title="Fetch forward if it is possible"
						type="button"
						disabled={isFetchingPossible}
						onClick={() => fetchNextPage()}
						className="dark:bg-zinc-700 px-4 py-2 rounded-lg dark:hover:bg-zinc-600 dark:disabled:bg-red-400 bg-zinc-100 hover:bg-zinc-200 disabled:bg-red-400 font-medium lg:flex-initial flex-1"
					>
						Fetch next
					</button>
					<button
						title="Infinite fetch"
						type="button"
						onClick={() => setSearchState({ ...searchState, infinite: !searchState.infinite })}
						className={`px-4 py-2 rounded-lg font-medium lg:flex-initial flex-1 ${
							searchState.infinite
								? 'bg-green-500 dark:bg-green-600'
								: 'dark:bg-zinc-700 bg-zinc-100 dark:hover:bg-zinc-600 hover:bg-zinc-200'
						}`}
					>
						Fetch all
					</button>
				</div>
				<button
					title="Reset search query"
					type="button"
					onClick={() => setSearchState({ playlistId: 'LL', text: '', infinite: false })}
					className="dark:bg-zinc-700 px-4 py-2 rounded-lg dark:hover:bg-zinc-600 bg-zinc-100 hover:bg-zinc-200 font-medium"
				>
					Reset
				</button>
			</div>
		</div>
	);
};
export default SearchBar;
