import { isNotNumber } from './utils';

const enum Rating {
  Bad = 1,
  NotTooBad = 2,
  Good = 3,
}

const enum RatingDescription {
  Bad = 'You can do better!',
  NotTooBad = 'Not too bad but could be better!',
  Good = 'Good job!',
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  dailyHours: number[];
  target: number;
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 2) throw new Error('Not enough arguments');

  const processedData = args.map((a) => {
    if (isNotNumber(a)) throw new Error('Provided values were not numbers!');
    return Number(a);
  });

  return {
    dailyHours: processedData.slice(1),
    target: processedData[0],
  };
};

const calculateRating = (average: number, target: number): Rating => {
  if (average < target / 2) return Rating.Bad;
  if (average < target) return Rating.NotTooBad;
  return Rating.Good;
};

const getRatingDescription = (rating: Rating): string => {
  switch (rating) {
    case Rating.Bad:
      return RatingDescription.Bad;
    case Rating.NotTooBad:
      return RatingDescription.NotTooBad;
    case Rating.Good:
      return RatingDescription.Good;
    default:
      throw new Error('Invalid rating!');
  }
};

export const calculateExercises = (dailyHours: number[], target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  const rating = calculateRating(average, target);
  const ratingDescription = getRatingDescription(rating);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { dailyHours, target } = parseArguments(process.argv.slice(2));
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
