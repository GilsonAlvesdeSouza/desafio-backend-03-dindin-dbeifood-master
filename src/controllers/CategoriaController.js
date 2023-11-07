import { CategoriaService } from '../services/index.js';

const categoriaService = new CategoriaService();

export default class CategoriaController {
	async listar(req, res) {
		try {
			const categorias = await categoriaService.listar();

			if (categorias.length < 1) {
				return res.status(200).json([]);
			}
			return res.status(200).json(categorias);
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}
}
