import { Router } from 'express';
import { listarEstados } from '../services/ibge.service.js';

const router = Router();

router.get('/estados', listarEstados);

export default router;
