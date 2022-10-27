import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useThemeStore } from '../app/themeStore';
import { useAuthStore } from '../app/authStore';
import { serverURL } from '../utils/constants';
import axios from 'axios';
import { SunIcon, MoonIcon, BoltIcon } from '@heroicons/react/24/solid';

const Header = () => {
	const authStore = useAuthStore();
	const themeStore = useThemeStore();

	const googleLogin = useGoogleLogin({
		flow: 'auth-code',
		scope: 'https://www.googleapis.com/auth/youtube.readonly',
		onSuccess: async ({ code }) => {
			const tokens = await axios.post(`${serverURL}/api/google-auth`, { code });
			authStore.setAuth({
				access_token: tokens.data.access_token,
				id_token: tokens.data.id_token,
				refresh_token: tokens.data.refresh_token,
			});
		},
		onError: (errorResponse) => console.log(errorResponse),
	});

	return (
		<header className="w-full h-16 dark:bg-zinc-900 dark:text-white bg-zinc-100 text-black flex items-center justify-center">
			<div className="container flex items-center justify-between mx-auto xl:px-24 md:px-16 px-4">
				<div className="font-bold text-lg flex gap-2 select-none">
					<BoltIcon className="w-6 fill-yellow-500" />
					YT Playlist
				</div>
				<nav className="flex gap-4">
					{!authStore.access_token && (
						<button
							title="Login with Google"
							type="button"
							className="hover:underline text-base font-medium"
							onClick={googleLogin}
						>
							Login with Google
						</button>
					)}
					{authStore.access_token && (
						<button
							title="Logout"
							type="button"
							className="hover:underline text-base font-medium"
							onClick={() => {
								authStore.resetAuth();
								googleLogout();
							}}
						>
							Logout
						</button>
					)}
					<button
						title="Change theme"
						type="button"
						onClick={themeStore.change}
					>
						{themeStore.theme === 'light' ? (
							<MoonIcon className="w-6" />
						) : (
							<SunIcon className="w-6" />
						)}
					</button>
				</nav>
			</div>
		</header>
	);
};
export default Header;
