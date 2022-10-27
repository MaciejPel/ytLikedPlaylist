interface VideoCardProps {
	id: string;
	videoId: string;
	thumbnailURL: string;
	title: string;
	videoOwnerChannelId: string;
	videoOwnerChannelTitle: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
	id,
	videoId,
	thumbnailURL,
	title,
	videoOwnerChannelId,
	videoOwnerChannelTitle,
}) => {
	return (
		<a
			key={id}
			href={`https://youtu.be/${videoId}`}
			target="_blank"
			rel="noopener"
			className="w-full border-x-[1px] border-b-[1px] dark:border-zinc-700 rounded-lg dark:hover:bg-zinc-900 hover:bg-zinc-50 transition-colors duration-100"
		>
			<img
				className="w-full rounded-t-lg"
				src={thumbnailURL}
				alt={title}
			/>
			<div className="flex flex-col px-2 py-1">
				<div className="font-medium text-sm hover:underline clamp">{title}</div>
				<div
					onClick={() => {
						window
							.open(`https://www.youtube.com/channel/${videoOwnerChannelId}`, '_blank')!
							.focus();
					}}
					className="font-extralight text-xs dark:text-zinc-400 hover:underline"
				>
					{videoOwnerChannelTitle}
				</div>
			</div>
		</a>
	);
};

export default VideoCard;
