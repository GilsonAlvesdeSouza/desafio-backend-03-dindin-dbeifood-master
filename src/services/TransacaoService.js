import dbConnect from '../connection/pg_connection.js';
export default class TransacaoService {
	async listar(idUsuario, filtro) {
		let filtroCategoria = '';

		filtro
			? (filtroCategoria = `'${filtro.join("','")}'`)
			: (filtroCategoria = '');

		let query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
			from transacoes	t	join categorias c on c.id = t.categoria_id where t.usuario_id = $1
			${filtroCategoria ? ` and c.descricao in (${filtroCategoria})` : ''}`;

		const { rows } = await dbConnect.query(query, [idUsuario]);

		return rows;
	}

	async detalhar(idTransacao, idUsuario) {
		let query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
		from transacoes t join categorias c on c.id = t.categoria_id where t.usuario_id = $1 and t.id = $2`;

		const { rows, rowCount } = await dbConnect.query(query, [
			idUsuario,
			idTransacao
		]);

		if (!rowCount) {
			return undefined;
		}

		return rows[0];
	}

	async fundir({
		idTransacao,
		idUsuario,
		tipo,
		descricao,
		valor,
		data,
		categoria_id
	}) {
		if (!idTransacao) {
			let query = `insert into transacoes ( descricao, valor, data, categoria_id, usuario_id, tipo )
			values ($1, $2, $3, $4, $5, $6) returning id`;

			const {
				rows: [{ id }]
			} = await dbConnect.query(query, [
				descricao,
				valor,
				data,
				categoria_id,
				idUsuario,
				tipo
			]);

			query = `select t.id, t.tipo, t.descricao , t.valor, t."data", t.usuario_id, t.categoria_id,
			c.descricao as categoria_nome from transacoes t
			join categorias c on t.categoria_id = c.id where t.id = $1;`;

			const { rows } = await dbConnect.query(query, [id]);

			return rows[0];
		}

		let query = `select id from transacoes where id = $1 and usuario_id = $2;`;

		const { rowCount } = await dbConnect.query(query, [idTransacao, idUsuario]);

		if (!rowCount) {
			return undefined;
		}	

		query = `update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6;`;

		await dbConnect.query(query, [
			descricao,
			valor,
			data,
			categoria_id,
			tipo,
			idTransacao
		]);

		return true;
	}

	async excluir(idTransacao, idUsuario) {
		let query = `select id from transacoes where id = $1 and usuario_id = $2`;

		const { rowCount } = await dbConnect.query(query, [idTransacao, idUsuario]);

		if (!rowCount) {
			return undefined;
		}

		query = `delete from transacoes where id = $1`;

		await dbConnect.query(query, [idTransacao]);

		return true;
	}

	async extrato(idUsuario) {
		let query = `select tipo, sum (valor) as total from transacoes where transacoes.usuario_id = $1 group by tipo`;

		const { rows, rowCount } = await dbConnect.query(query, [idUsuario]);

		if (!rowCount) {
			return undefined;
		}

		return rows;
	}
}
