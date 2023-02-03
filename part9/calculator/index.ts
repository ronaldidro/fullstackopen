import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

interface ExercisesRequest {
  body: ExercisesBody;
}

interface ExercisesBody {
  target: number;
  daily_exercises: Array<number>;
}

const app = express();

app.use(express.json());

app.get("/greeting", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (
    ((!height || !weight) && isNaN(Number(height))) ||
    isNaN(Number(weight))
  ) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(Number(height), Number(weight));
  return res.send({ height, weight, bmi });
});

app.post("/exercises", (req: ExercisesRequest, res) => {
  const { target, daily_exercises } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (
    isNaN(Number(target)) ||
    daily_exercises.some((value: number) => isNaN(Number(value)))
  ) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const stats = calculateExercises(target, daily_exercises);
  return res.send(stats);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
