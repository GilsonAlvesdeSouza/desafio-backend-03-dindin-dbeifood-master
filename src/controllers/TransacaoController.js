import yup, { reach } from 'yup';
import { TransacaoService } from '../services/index.js';

const transacaoService = new TransacaoService();

export default class TransacaoController {
	async listar(req, res) {
		const idUsuario = req.usuario_id;
		const filtro = req.query.filtro;

		try {
			const transacoes = await transacaoService.listar(idUsuario, filtro);

			if (transacoes.length < 1) {
				return res.status(200).json([]);
			}

			return res.status(200).json(transacoes);
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async detalhar(req, res) {
		const idTransacao = req.params.id;
		const idUsuario = req.usuario_id;

		try {
			const transacao = await transacaoService.detalhar(idTransacao, idUsuario);

			if (!transacao) {
				return res.status(404).json({ mensagem: 'Transação não encontrada.' });
			}

			return res.status(200).json(transacao);
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async cadastrar(req, res) {
		const { tipo, descricao, valor, data, categoria_id } = req.body;
		const idUsuario = req.usuario_id;

		const transacaoEsquema = validarTransacaoRequest();

		if (validarTipoTransacao(tipo)) {
			return res
				.status(400)
				.json({ mensagem: "O tipo precisa ser 'entrada' ou 'saida'." });
		}

		try {
			await transacaoEsquema.validate(req.body);

			const transacao = await transacaoService.fundir({
				idUsuario,
				tipo,
				descricao,
				valor,
				data,
				categoria_id
			});

			return res.json(transacao);
		} catch (error) {
			if (error.errors) {
				return res.status(400).json({ mensagem: error.errors[0] });
			}

			if (error.code === '23503') {
				return res.status(404).json({ mensagem: 'Categoria não encontrada' });
			}

			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async atualizar(req, res) {
		const idTransacao = req.params.id;
		const { tipo, descricao, valor, data, categoria_id } = req.body;
		const idUsuario = req.usuario_id;

		const transacaoEsquema = validarTransacaoRequest();

		if (validarTipoTransacao(tipo)) {
			return res
				.status(400)
				.json({ mensagem: "O tipo precisa ser 'entrada' ou 'saida'." });
		}

		try {
			await transacaoEsquema.validate(req.body);

			const transacao = await transacaoService.fundir({
				tipo,
				descricao,
				valor,
				data,
				categoria_id,
				idTransacao,
				idUsuario
			});

			if (!transacao) {
				return res.status(404).json({ mensagem: 'Transação não encontrada.' });
			}

			return res.status(204).json();
		} catch (error) {
				if (error.errors) {
				return res.status(400).json({ mensagem: error.errors[0] });
			}

			if (error.code === '23503') {
				return res.status(404).json({ mensagem: 'Categoria não encontrada' });
			}

			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async excluir(req, res) {
		const idTransacao = req.params.id;
		const idUsuario = req.usuario_id;

		try {
			const transacao = await transacaoService.excluir(idTransacao, idUsuario);

			if (!transacao) {
				return res.status(404).json({ mensagem: 'Transação não encontrada.' });
			}

			return res.status(204).json();
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async extrato(req, res) {
		const idUsuario = req.usuario_id;

		const retorno = {
			entrada: 0,
			saida: 0
		};

		try {
			const extrato = await transacaoService.extrato(idUsuario);

			if (!extrato) {
				return res.status(204).json();
			}

			for (const i of extrato) {
				if (i.tipo === 'saida') {
					retorno.saida = Number(i.total);
				}

				if (i.tipo === 'entrada') {
					retorno.entrada = Number(i.total);
				}
			}

			return res.status(200).json(retorno);
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}
}

function validarTransacaoRequest() {
	return yup.object().shape({
		tipo: yup.string().required('O campo tipo é obrigatório.'),
		descricao: yup.string().required('O campo descricao é obrigatório.'),
		valor: yup.string().required('O campo valor é obrigatório.'),
		data: yup.string().required('O campo data é obrigatório.'),
		categoria_id: yup.string().required('O campo categoria_id é obrigatório.')
	});
}

function validarTipoTransacao(tipo) {
	const tipos = {
		entrada: 'entrada',
		saida: 'saida'
	};

	if (!tipos[tipo]) {
		return true;
	}
}
