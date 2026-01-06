import express, { Response } from 'express';
import diaryService from '../services/diaryService';
import { NonSensitiveDiaryEntry } from '../types';
import toNewDiaryEntry from '../utils';

const router = express.Router();

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

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

  return;
});

export default router;
