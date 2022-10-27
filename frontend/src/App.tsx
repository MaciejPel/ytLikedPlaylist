import { useEffect } from 'react';
import { useAuthStore } from './app/authStore';
import { useInfiniteQuery } from 'react-query';
import { serverURL } from './utils/constants';
import axios, { AxiosError } from 'axios';
import Header from './components/Header';
import Loader from './components/Loader';
import VideoCard from './components/VideoCard';

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
	nextPageToken?: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
}

const App = () => {
	const authStore = useAuthStore();

	const { data, isLoading, isFetchingNextPage, fetchNextPage, isSuccess, refetch } =
		useInfiniteQuery<VideosListResponse, AxiosError>(
			'likedVideos',
			async ({ pageParam = null }) => {
				const res = await axios
					.get(
						`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&myRating=like&playlistId=LL&maxResults=50&key=${
							import.meta.env.VITE_CLIENT_ID
						}${pageParam ? `&pageToken=${pageParam}` : ''}`,
						{ headers: { Authorization: `Bearer ${authStore.access_token}` } }
					)
					.catch(async (e: Error | AxiosError) => {
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
					<div className="container flex justify-center items-center">Login to test</div>
				) : (
					<div className="container mx-auto py-4 px-2 md:px-0">
						{isLoading && (
							<div className="flex justify-center items-center h-full">
								<Loader />
							</div>
						)}
						<div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-3 gap-2">
							{isSuccess &&
								data.pages.map((page) =>
									page?.items?.map((item) =>
										['Deleted video', 'Private video'].includes(item?.snippet?.title) ? null : (
											<VideoCard
												key={item.id}
												id={item.snippet.title}
												videoId={item.snippet.resourceId.videoId}
												title={item.snippet.title}
												thumbnailURL={item.snippet.thumbnails.medium.url}
												videoOwnerChannelId={item.snippet.videoOwnerChannelId}
												videoOwnerChannelTitle={item.snippet.videoOwnerChannelTitle}
											/>
										)
									)
								)}
						</div>
						{isFetchingNextPage && (
							<div className="flex justify-center">
								<Loader />
							</div>
						)}
						{data?.pages && !data.pages[data.pages.length - 1]?.nextPageToken && (
							<div className="text-right pt-4">End of playlist</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default App;

