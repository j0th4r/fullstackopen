import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { isNotNumber } from './utils';
const app = express();

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
    return;
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNotNumber(heightNum) || isNotNumber(weightNum)) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
    return;
  }

  const bmi = calculateBmi(heightNum, weightNum);
  res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.use(express.json());

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as {
    daily_exercises?: unknown;
    target?: unknown;
  };

  if (!daily_exercises || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (!Array.isArray(daily_exercises) || isNotNumber(target)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const hours = daily_exercises.map((exercise) => Number(exercise));

  if (hours.some((exercise) => isNotNumber(exercise))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const result = calculateExercises(hours, Number(target));
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
