/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Gender, Entry, NewPatient, HealthCheckRating } from "./types";

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseText = (text: any): string => {
  if (!text || !isString(text)) {
    throw new Error("Incorrect or missing text: " + text);
  }
  return text;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseTextArray = (array: any): string[] => {
  if (!array || !Array.isArray(array)) {
    throw new Error("Incorrect or missing array: " + array);
  }

  if (!array.every((item) => isString(item))) {
    throw new Error("Incorrect array content type");
  }

  return array;
};

const parseCheckRating = (rating: any): HealthCheckRating => {
  if (!isCheckRating(rating)) {
    throw new Error("Incorrect or missing rating: " + rating);
  }
  return rating;
};

export const toNewEntry = (object: any): Entry => {
  const baseEntry = {
    id: "",
    description: parseText(object.description),
    date: parseDate(object.date),
    specialist: parseText(object.specialist),
  };

  if (object.diagnosisCodes && object.diagnosisCodes.length > 0)
    Object.assign(baseEntry, {
      diagnosisCodes: parseTextArray(object.diagnosisCodes),
    });

  switch (object.type) {
    case "Hospital":
      return {
        type: "Hospital",
        discharge: {
          date: parseDate(object.dischargeDate),
          criteria: parseText(object.dischargeCriteria),
        },
        ...baseEntry,
      };

    case "OccupationalHealthcare":
      return {
        type: "OccupationalHealthcare",
        employerName: parseText(object.employerName),
        sickLeave: {
          startDate: parseDate(object.startDate),
          endDate: parseDate(object.endDate),
        },
        ...baseEntry,
      };

    case "HealthCheck":
      return {
        type: "HealthCheck",
        healthCheckRating: parseCheckRating(object.healthCheckRating),
        ...baseEntry,
      };

    default:
      throw new Error("Incorrect or missing type");
  }
};

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseText(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseText(object.ssn),
    occupation: parseText(object.occupation),
    gender: parseGender(object.gender),
    entries: [],
  };
};
