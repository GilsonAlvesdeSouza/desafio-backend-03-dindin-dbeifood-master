import { verify } from 'jsonwebtoken';
import dbConnect from '../connection/pg_connection.js';

export default async function autenticacao(req, res, next) {
	const tokenAutorizacao = req.headers.authorization;

	if (!tokenAutorizacao) {
		return res.status(401).json({
			mensagem: 'Não autorizado.'
		});
	}
	const [, token] = tokenAutorizacao.split(' ');

	try {
		const { id } = verify(token, process.env.JWT_SECRET);

		const query = `select id from usuarios where id = $1`;
		const { rowCount } = await dbConnect.query(query, [id]);
		if (!rowCount) {
			return res.status(404).json({ mensagem: 'Usuario não encontrado.' });
		}

		req.usuario_id = id;

		next();
	} catch (error) {
		res.status(500).json({
			mensagem: `Erro interno: ${error.message}`
		});
	}
}
