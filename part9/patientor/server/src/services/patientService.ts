import { v4 as uuidv4 } from "uuid";
import patients from "../../data/patientData";
import { PublicPatient, Patient, NewPatient, Entry } from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitiveData = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { id: uuidv4(), ...patient };

  patients.push(newPatient);

  return newPatient;
};

const addPatientEntry = (patientId: string, entry: Entry): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = entry;

  const newEntry = { id: uuidv4(), ...rest };

  const patient = getPatient(patientId);

  if (!patient) throw new Error(`Patient not found`);

  patient.entries?.push(newEntry);

  return patient;
};

export default {
  getPatients,
  getNonSensitiveData,
  getPatient,
  addPatient,
  addPatientEntry,
};
