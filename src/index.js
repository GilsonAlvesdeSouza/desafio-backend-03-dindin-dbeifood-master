import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './routes.js';

const app = express();

const PORT = process.env.PORT_SERVER | 3000;

app.use(express.json());

app.use(cors());

app.use(router);

app.listen(PORT, () => {
	console.log(
		`server is running on the port ${PORT}\n${process.env.HOST_SERVER}${PORT}\npress ctrl + c to exit `
	);
});
