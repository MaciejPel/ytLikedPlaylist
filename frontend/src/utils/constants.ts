const environment = import.meta.env.VITE_ENVIRONMENT;
export const serverURL =
	environment === 'production'
		? import.meta.env.VITE_DEV_SERVER_URL
		: import.meta.env.VIDE_PROD_SERVER_URL;
