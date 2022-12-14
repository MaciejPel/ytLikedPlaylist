import create from 'zustand';

interface AuthState {
	access_token?: string;
	refresh_token?: string;
	setAuth: (data: { access_token: string; refresh_token: string }) => void;
	setAccess: (data: { access_token: string }) => void;
	resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	access_token: localStorage.getItem('access_token') || undefined,
	refresh_token: localStorage.getItem('refresh_token') || undefined,
	setAuth: (data) => {
		set(() => ({
			access_token: data.access_token,
			refresh_token: data.refresh_token,
		}));
		localStorage.setItem('access_token', data.access_token);
		localStorage.setItem('refresh_token', data.refresh_token);
	},
	resetAuth: () => {
		set(() => ({
			access_token: undefined,
			refresh_token: undefined,
		}));
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
	},
	setAccess: (data) => {
		set(() => ({
			access_token: data.access_token,
		}));
		localStorage.setItem('access_token', data.access_token);
	},
}));
