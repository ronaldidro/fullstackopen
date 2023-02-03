import express from "express";
import cors from "cors";
import diagnosticRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosticRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
