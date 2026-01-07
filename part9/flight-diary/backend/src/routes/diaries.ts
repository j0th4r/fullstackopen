import express, { NextFunction, Request, Response } from 'express';
import diaryService from '../services/diaryService';
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';
import { NewEntrySchema } from '../utils';
import z from 'zod';

const router = express.Router();

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
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

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
  return;
});

router.get('/:id', (req, res: Response<NonSensitiveDiaryEntry>) => {
  const diary = diaryService.findById(Number(req.params.id));
  if (!diary) {
    res.sendStatus(404);
    return;
  }
  res.send(diary);
  return;
});

router.post(
  '/',
  newDiaryParser,
  (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
    const addedEntry = diaryService.addDiary(req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
