import Router from 'express';
import {
	CategoriaController,
	TransacaoController,
	UsuarioController
} from './controllers/index.js';
import autenticacao from './middlewares/Autenticacao.js';

const usuarioController = new UsuarioController();
const categoriaController = new CategoriaController();
const transacaoController = new TransacaoController();

const router = Router();

router.post('/usuario', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

router.use(autenticacao);
router.get('/usuario', usuarioController.detalhar);
router.put('/usuario', usuarioController.atualizar);

router.get('/categoria', categoriaController.listar);

router.post('/transacao', transacaoController.cadastrar);
router.put('/transacao/:id', transacaoController.atualizar);
router.delete('/transacao/:id', transacaoController.excluir);
router.get('/transacao/extrato', transacaoController.extrato);
router.get('/transacao/:id', transacaoController.detalhar);
router.get('/transacao', transacaoController.listar);

export default router;
