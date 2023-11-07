import dbConnect from '../connection/pg_connection.js';
import 'dotenv/config';
import { compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export default class UsuarioService {
	async detalhar(id) {
		const query = `select id, nome, email from usuarios where id = $1`;

		const { rows } = await dbConnect.query(query, [id]);

		return rows[0];
	}

	async fundir({ id, nome, email, senha }) {
		let query;
		if (!id) {
			query = `select id from usuarios where email = $1;`;

			const { rowCount } = await dbConnect.query(query, [email]);

			if (rowCount) {
				return false;
			}

			query = `insert into usuarios (nome, email, senha)
			values ( $1, $2, $3) returning id, nome, email`;

			const { rows } = await dbConnect.query(query, [nome, email, senha]);

			return rows[0];
		}

		query = `select id from usuarios where email = $1 and id != $2`;

		const result = await dbConnect.query(query, [email, id]);

		if (result.rowCount) {
			return false;
		}

		query = `update usuarios set nome = $1, email = $2, senha = $3 where id = $4;`;

		await dbConnect.query(query, [nome, email, senha, id]);

		return true;
	}

	async login({ email, senha }) {
		const query = `select * from usuarios where email = $1`;

		const { rows } = await dbConnect.query(query, [email]);

		const usuario = rows[0];

		if (!usuario) {
			return false;
		}

		const compararSenha = await compare(String(senha), usuario.senha);

		if (!compararSenha) {
			return false;
		}

		const token = sign({ id: usuario.id }, process.env.JWT_SECRET, {
			expiresIn: '1d'
		});

		return {
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email
			},
			token
		};
	}
}
