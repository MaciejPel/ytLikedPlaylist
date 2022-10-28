import { useEffect, useState } from 'react';
import { useAuthStore } from './app/authStore';
import { useInfiniteQuery } from 'react-query';
import { serverURL } from './utils/constants';
import axios, { AxiosError } from 'axios';
import Header from './components/Header';
import Loader from './components/Loader';
import VideoCard from './components/VideoCard';
import SearchBar from './components/SearchBar';

type ThumbnailProperties = {
	width: number;
	height: number;
	url: string;
};

interface PlaylistItem {
	contentDetails: {
		videoId: string;
		videoPublishedAt: string;
	};
	etag: string;
	id: string;
	kind: string;
	snippet: {
		channelId: string;
		channelTitle: string;
		description: string;
		playlistId: string;
		position: number;
		publishedAt: string;
		title: string;
		videoOwnerChannelId: string;
		videoOwnerChannelTitle: string;
		resourceId: {
			kind: string;
			videoId: string;
		};
		thumbnails: {
			default: ThumbnailProperties;
			high: ThumbnailProperties;
			medium: ThumbnailProperties;
		};
	};
}

export interface VideosListResponse {
	etag: string;
	items: PlaylistItem[];
	kind: string;
	nextPageToken?: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
}

const App = () => {
	const [searchState, setSearchState] = useState<{ playlistId: string; text: string }>({
		playlistId: 'LL',
		text: '',
	});
	const [error, setError] = useState<boolean>(false);
	const authStore = useAuthStore();

	const { data, isLoading, isFetchingNextPage, fetchNextPage, isSuccess, refetch } =
		useInfiniteQuery<VideosListResponse, AxiosError>(
			['likedVideos', searchState.playlistId],
			async ({ pageParam = null }) => {
				setError(false);
				const res = await axios
					.get(
						`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&myRating=like&playlistId=${
							searchState.playlistId || 'LL'
						}&maxResults=50&key=${import.meta.env.VITE_CLIENT_ID}${
							pageParam ? `&pageToken=${pageParam}` : ''
						}`,
						{ headers: { Authorization: `Bearer ${authStore.access_token}` } }
					)
					.catch(async (e: Error | AxiosError) => {
						if (axios.isAxiosError(e) && e.response?.status === 404) setError(true);
						if (axios.isAxiosError(e) && e.response?.data.error.status === 'UNAUTHENTICATED') {
							const newTokens = await axios.post(`${serverURL}/api/google-auth/refresh`, {
								refreshToken: authStore.refresh_token,
							});
							authStore.setAccess({
								access_token: newTokens.data.access_token,
							});
							setTimeout(refetch, 0);
						}
					});
				if (res) return res.data;
			},
			{
				refetchOnWindowFocus: false,
				enabled: authStore.access_token ? true : false,
				getNextPageParam: (lastPage) => {
					return lastPage ? lastPage.nextPageToken : null;
				},
				onSuccess: () => setError(false),
			}
		);

	useEffect(() => {
		const handleScroll = () => {
			const bottom =
				Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

			if (bottom && data?.pages[data.pages.length - 1].nextPageToken) fetchNextPage();
		};

		window.addEventListener('scroll', handleScroll, {
			passive: true,
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [data?.pages]);

	return (
		<>
			<Header />
			<div className="flex justify-center min-h-[calc(100vh_-_4rem)] dark:bg-zinc-800 dark:text-white text-black">
				{!authStore.access_token ? (
					<div className="container flex justify-center items-center font-medium">
						Login to test
					</div>
				) : (
					<div className="container mx-auto py-4 px-2 md:px-0">
						<SearchBar
							searchState={searchState}
							setSearchState={setSearchState}
							fetchNextPage={fetchNextPage}
							isFetchingPossible={
								isLoading ||
								isFetchingNextPage ||
								(data?.pages && !data.pages[data.pages.length - 1]?.nextPageToken)
									? true
									: false
							}
						/>
						{isLoading && (
							<div className="flex justify-center items-center h-3/4">
								<Loader />
							</div>
						)}
						{error && (
							<div className="flex justify-center items-center h-3/4 font-medium">
								Invalid query parameters
							</div>
						)}
						{!error && (
							<div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-3 gap-2 pb-4">
								{isSuccess &&
									data.pages.map((page) =>
										page?.items
											?.filter((item) => {
												if (['Deleted video', 'Private video'].includes(item?.snippet?.title)) {
													return null;
												}
												return (
													item?.snippet?.title
														.toLowerCase()
														.includes(searchState.text.toLowerCase()) ||
													item?.snippet?.videoOwnerChannelTitle
														.toLowerCase()
														.includes(searchState.text.toLowerCase())
												);
											})
											.map((item) => (
												<VideoCard
													key={item.id}
													id={item.snippet.title}
													videoId={item.snippet.resourceId.videoId}
													title={item.snippet.title}
													thumbnailURL={item.snippet.thumbnails.medium.url}
													videoOwnerChannelId={item.snippet.videoOwnerChannelId}
													videoOwnerChannelTitle={item.snippet.videoOwnerChannelTitle}
												/>
											))
									)}
							</div>
						)}
						{isFetchingNextPage && (
							<div className="flex justify-center">
								<Loader />
							</div>
						)}
						{!error && data?.pages && !data.pages[data.pages.length - 1]?.nextPageToken && (
							<div className="text-right font-medium">End of playlist</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default App;

