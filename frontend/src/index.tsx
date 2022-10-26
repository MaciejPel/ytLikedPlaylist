import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
				<App />
			</GoogleOAuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
);

