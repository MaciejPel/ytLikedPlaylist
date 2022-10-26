import { useAuthStore } from './app/authStore';
import { useInfiniteQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import Header from './components/Header';
import { useEffect } from 'react';

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

interface VideosListResponse {
	etag: string;
	items: PlaylistItem[];
	kind: string;
	nextPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
}

const App = () => {
	const authStore = useAuthStore();

	const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, isSuccess, refetch } =
		useInfiniteQuery<VideosListResponse, AxiosError>(
			'likedVideos',
			async ({ pageParam = null }) => {
				const res = await axios.get(
					`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&myRating=like&playlistId=LL&maxResults=50&key=${
						import.meta.env.VITE_CLIENT_ID
					}${pageParam ? `&pageToken=${pageParam}` : ''}`,
					{ headers: { Authorization: `Bearer ${authStore.access_token}` } }
				);
				return res.data;
			},
			{
				refetchOnWindowFocus: false,
				enabled: authStore.access_token ? true : false,
				onError: async (e: AxiosError) => {
					if (e.response?.status == 401) {
						const newTokens = await axios.post('http://localhost:3001/api/google-auth/refresh', {
							refreshToken: authStore.refresh_token,
						});
						authStore.setAuth({
							access_token: newTokens.data.access_token,
							id_token: newTokens.data.id_token,
							refresh_token: newTokens.data.refresh_token,
						});
						refetch();
					}
				},
				getNextPageParam: (lastPage, pages) => {
					return lastPage.nextPageToken;
				},
			}
		);

	useEffect(() => {
		const handleScroll = () => {
			const bottom =
				Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

			if (bottom && data?.pages[data.pages.length - 1].nextPageToken) {
				fetchNextPage();
			}
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
				{!authStore.access_token && (
					<div className="container flex justify-center items-center">Login to test</div>
				)}
				{authStore.access_token && (
					<div className="container mx-auto py-4 px-2 md:px-0">
						{isLoading && (
							<div className="flex justify-center items-center h-full">Loading... Stand by</div>
						)}
						<div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
							{isSuccess &&
								data.pages.map((page) =>
									page?.items?.map((item) => {
										if (['Deleted video', 'Private video'].includes(item.snippet.title))
											return null;
										return (
											<a
												key={item.id}
												href={`https://youtu.be/${item?.snippet.resourceId.videoId}`}
												target="_blank"
												rel="noopener"
												className="w-full border-x-[1px] border-b-[1px] dark:border-zinc-700 rounded-lg dark:hover:bg-zinc-900 transition-colors duration-100"
											>
												<img
													className="w-full rounded-t-lg"
													src={item?.snippet?.thumbnails?.medium?.url}
													alt=""
												/>
												<div className="flex flex-col px-2 py-1">
													<div className="font-medium text-sm hover:underline clamp">
														{item?.snippet?.title}
													</div>
													<div className="font-extralight text-xs dark:text-zinc-400 hover:underline">
														{item?.snippet?.videoOwnerChannelTitle}
													</div>
												</div>
											</a>
										);
									})
								)}
						</div>
						{/* <div className="flex justify-center p-4 ">
							{data?.pages[data.pages.length - 1].nextPageToken && (
								<button
									className="hover:underline"
									onClick={() => fetchNextPage()}
								>
									Load More
								</button>
							)}
						</div> */}
					</div>
				)}
			</div>
		</>
	);
};

export default App;

