import express, { NextFunction, Request, Response } from 'express';
import patientService from '../services/patientService';
import { NewEntry, NewPatient, Patient, PublicPatient } from '../types';
import z from 'zod';
import { NewEntrySchema, NewPatientSchema } from '../utils';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.send(patientService.getPublicPatients());
});

router.get('/:id', (req: Request, res: Response<Patient>) => {
  const patient = patientService.getPatient(String(req.params.id));
  if (!patient) {
    res.sendStatus(404);
    return;
  }
  res.send(patient);
  return;
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Patient>) => {
    const addedEntry = patientService.addEntry(String(req.params.id), req.body);
    if (!addedEntry) {
      res.sendStatus(404);
      return;
    }
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
