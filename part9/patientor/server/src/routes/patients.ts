import express from "express";
import patientService from "../services/patientService";
import { toNewPatient, toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveData());
});

router.get("/:id", (req, res) => {
  res.send(patientService.getPatient(req.params.id));
});

router.post("/", (req, res) => {
  const newPatient = toNewPatient(req.body);
  const addedPatient = patientService.addPatient(newPatient);

  res.json(addedPatient);
});

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const updatedPatient = patientService.addPatientEntry(
      req.params.id,
      newEntry
    );

    res.json(updatedPatient);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Undefined error";
    res.status(400).send({ error: errorMessage });
  }
});

export default router;
