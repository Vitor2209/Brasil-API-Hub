import { Router } from 'express';

import { buscarCep } from '../services/cep.service.js';
import { buscarDolar } from '../services/dolar.service.js';
import { buscarFeriados } from '../services/feriados.service.js';
import { buscarClima } from '../services/clima.service.js';

const router = Router();

router.get('/cep/:cep', buscarCep);
router.get('/dolar', buscarDolar);
router.get('/feriados/:ano', buscarFeriados);

/**
 * ⚠️ CLIMA USA QUERY STRING
 * /api/clima?cidade=São Paulo
 */
router.get('/clima', buscarClima);

export default router;


