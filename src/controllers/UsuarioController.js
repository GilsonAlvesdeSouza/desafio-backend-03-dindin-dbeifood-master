import yup from 'yup';
import { hash } from 'bcrypt';
import { UsuarioService } from '../services/index.js';

const usuarioService = new UsuarioService();

export default class UsuarioController {
	async detalhar(req, res) {
		const idUsuario = req.usuario_id;

		try {
			const usuario = await usuarioService.detalhar(idUsuario);

			return res.status(200).json(usuario);
		} catch (error) {
			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async cadastrar(req, res) {
		const { nome, email, senha } = req.body;

		const usuarioEsquema = validarUsuarioRequest();

		try {
			await usuarioEsquema.validate(req.body);

			const senhaCriptografada = await hash(String(senha), 10);

			const usuario = await usuarioService.fundir({
				nome,
				email,
				senha: senhaCriptografada
			});

			if (!usuario) {
				return res.status(400).json({
					mensagem: 'Já existe usuário cadastrado com o e-mail informado.'
				});
			}

			return res.status(201).json(usuario);
		} catch (error) {
			if (error.errors) {
				return res.status(400).json({ mensagem: error.errors[0] });
			}

			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async atualizar(req, res) {
		const idUsuario = req.usuario_id;
		const { nome, email, senha } = req.body;

		const usuarioEsquema = validarUsuarioRequest();

		try {
			await usuarioEsquema.validate(req.body);

			const senhaCriptografada = await hash(String(senha), 10);

			const usuario = await usuarioService.fundir({
				id: idUsuario,
				nome,
				email,
				senha: senhaCriptografada
			});

			if (!usuario) {
				return res.status(400).json({
					mensagem:
						'O e-mail informado já está sendo utilizado por outro usuário.'
				});
			}

			return res.status(204).json();
		} catch (error) {
			if (error.errors) {
				return res.status(400).json({ mensagem: error.errors[0] });
			}

			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}

	async login(req, res) {
		const { email, senha } = req.body;

		const loginEsquema = yup.object().shape({
			email: yup.string().required('O campo email é obrigatório.'),
			senha: yup.string().required('O campo senha é obrigatório.')
		});

		try {
			await loginEsquema.validate(req.body);

			const usuario = await usuarioService.login({ email, senha });

			if (!usuario) {
				return res
					.status(400)
					.json({ mensagem: 'Usuário e/ou senha inválido(s).' });
			}

			res.status(200).json(usuario);
		} catch (error) {
			if (error.errors) {
				return res.status(400).json({ mensagem: error.errors[0] });
			}

			return res
				.status(500)
				.json({ mensagem: `Erro interno: ${error.message}` });
		}
	}
}

function validarUsuarioRequest() {
	return yup.object().shape({
		nome: yup.string().required('O campo nome é obrigatório.'),
		email: yup.string().required('O campo email é obrigatório.'),
		senha: yup.string().required('O campo senha é obrigatório.')
	});
}
