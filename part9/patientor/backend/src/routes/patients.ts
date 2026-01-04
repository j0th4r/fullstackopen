import express, { Response } from 'express';
import patientService from '../services/patientService';
import { PublicPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.send(patientService.getPublicPatients());
});

export default router;
