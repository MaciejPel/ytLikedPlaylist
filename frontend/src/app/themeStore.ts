import create from 'zustand';

type ThemeTypes = 'light' | 'dark';
interface ThemeState {
	theme: ThemeTypes;
	change: () => void;
}
let defaultTheme: ThemeTypes;

const setTheme = (theme: ThemeTypes) => {
	if (theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
};

if (
	localStorage.theme === 'dark' ||
	(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
	defaultTheme = 'dark';
} else {
	defaultTheme = 'light';
}
setTheme(defaultTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
	theme: defaultTheme,
	change: () => {
		const newTheme = get().theme === 'dark' ? 'light' : 'dark';
		set(() => ({ theme: newTheme }));
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	},
}));
