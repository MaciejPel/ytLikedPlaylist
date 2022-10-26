export const serverURL =
	import.meta.env.VITE_ENVIRONMENT === 'production'
		? import.meta.env.VITE_PROD_SERVER_URL
		: import.meta.env.VITE_DEV_SERVER_URL;
