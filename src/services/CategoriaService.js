import dbConnect from '../connection/pg_connection.js';

export default class CategoriaService {
	async listar() {
		const query = `select * from categorias`;

		const { rows } = await dbConnect.query(query);

		return rows;
	}
}
