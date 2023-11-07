import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;
const dbConnect = new Pool({
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE
});

export default dbConnect;
