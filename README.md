# 📺 YT Liked Playlist

App made for visualizing really long playlists (the problem is that YouTube runs out of memory at some point, and throws error crashing page). App is capable of taking different playlist IDs, fetching them until the end and search through fetched videos. Light and dark mode available.

## 🍞 Stack

- Vite
- TypeScript
- Zustand
- Tailwind
- axios & React Query
- express

## ⚡ Installation

You need to create google project with oAuth first. Then configure main `.env` as shown in `.envexample` and `./fronted/.env`.

Run `npm i` in both `./frontend` and `./` to install dependencies.

To debug both server and client locally run `npm run dev`.

## 🧬 Public usage

There is a live site running, but Google is really strict about their apps & APIs, so it is only available for people who requested this app in 'test mode', which you can set up in your app project properties.

If you think this project might be usefull in your problem feel free to fork it and work as you please.
