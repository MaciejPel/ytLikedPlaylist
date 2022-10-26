const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { OAuth2Client, UserRefreshClient } = require('google-auth-library');

const app = express();

app.use(cors());
app.use(express.json());

const oAuth2Client = new OAuth2Client(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	'postmessage'
);

if (process.env.ENVIRONMENT === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, '../', 'frontend', 'dist', 'index.html'))
	);
} else {
	app.get('/', (req, res) => res.send('Please set to production'));
}

app.post('/api/google-auth', async (req, res) => {
	const { tokens } = await oAuth2Client.getToken(req.body.code);

	res.json(tokens);
});

app.post('/api/google-auth/refresh', async (req, res) => {
	const user = new UserRefreshClient(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		req.body.refreshToken
	);
	const { credentials } = await user.refreshAccessToken();

	res.json(credentials);
});

app.listen(process.env.PORT || 3000, () => console.log(`server is running`));
