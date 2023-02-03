interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  avarage: number;
}

interface Params {
  target: number;
  daily_exercises: Array<number>;
}

const parseArguments = (args: Array<string>): Params => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (
    !isNaN(Number(args[2])) &&
    args.slice(3, args.length).every((value) => !isNaN(Number(value)))
  ) {
    return {
      target: Number(args[2]),
      daily_exercises: args.slice(3, args.length).map(Number),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  target: number,
  daily_exercises: Array<number>
): Result => {
  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.filter((value) => value > 0).length;
  const avarage = daily_exercises.reduce((a, b) => a + b, 0) / periodLength;
  let success = false;
  let rating = 0;
  let ratingDescription = "";

  if (avarage < target / 2) {
    rating = 1;
    ratingDescription = "bad";
  } else if (avarage >= target / 2 && avarage < target) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else if (avarage >= target) {
    rating = 3;
    ratingDescription = "good";
    success = true;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    avarage,
  };
};

try {
  const { target, daily_exercises } = parseArguments(process.argv);
  console.log(calculateExercises(target, daily_exercises));
} catch (e) {
  if (e instanceof Error) {
    console.log("Error, something bad happened, message: ", e.message);
  }
}
