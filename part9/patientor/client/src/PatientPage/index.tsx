import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import AdbIcon from "@material-ui/icons/Adb";
import AndroidIcon from "@material-ui/icons/Android";
import AppleIcon from "@material-ui/icons/Apple";

import { apiBaseUrl } from "../constants";
import { Patient, Entry } from "../types";
import { modifyPatient, useStateValue } from "../state";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import EntryDetails from "./EntryDetails";

const genderIcons = {
  male: <AndroidIcon style={{ marginLeft: "0.5em" }} />,
  female: <AppleIcon style={{ marginLeft: "0.5em" }} />,
  other: <AdbIcon style={{ marginLeft: "0.5em" }} />,
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  const [patient, setPatient] = React.useState<Patient>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  if (id === undefined) return null;

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(modifyPatient(updatedPatient));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const patientFound: Patient | undefined = Object.values(patients).find(
    (patient) => patient.id === id
  );

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(modifyPatient(patientFromApi));
        setPatient(patientFromApi);
      } catch (e) {
        console.error(e);
      }
    };

    if (patientFound && patientFound.ssn) {
      setPatient(patientFound);
    } else {
      void fetchPatient();
    }
  }, [id, patients]);

  return (
    <div className="App">
      <Typography
        variant="h4"
        style={{ marginTop: "1em", marginBottom: "0.5em" }}
      >
        {patient?.name}
        {genderIcons[patient?.gender || "other"]}
      </Typography>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <Typography
        variant="h5"
        style={{ marginTop: "1em", marginBottom: "0.5em" }}
      >
        entries
      </Typography>
      {patient?.entries?.map((entry: Entry) => (
        <div key={entry.id}>
          <EntryDetails entry={entry} />
          <ul>
            {entry.diagnosisCodes?.map((code: string, index: number) => (
              <li key={index}>
                {code} {diagnoses[code]?.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
