import express from "express";
import diagnosticService from "../services/diagnosticService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(diagnosticService.getDiagnoses());
});

export default router;
