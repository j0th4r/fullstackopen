import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { isNotNumber } from './utils';
const app = express();

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
    return
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNotNumber(heightNum) || isNotNumber(weightNum)) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
    return
  }

  const bmi = calculateBmi(heightNum, weightNum);
  res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
