const Loader = () => {
	return (
		<div className="flex gap-3 text-6xl">
			<div className="animate-pulsate h-3 w-3 bg-red-500 rounded-full inline-block" />
			<div
				className="animate-pulsate h-3 w-3 bg-yellow-500 rounded-full inline-block"
				style={{ animationDelay: '150ms' }}
			/>
			<div
				className="animate-pulsate h-3 w-3 bg-green-500 rounded-full inline-block"
				style={{ animationDelay: '300ms' }}
			/>
		</div>
	);
};

export default Loader;
