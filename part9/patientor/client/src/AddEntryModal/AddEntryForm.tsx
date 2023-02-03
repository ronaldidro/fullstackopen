import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  DiagnosisSelection,
  SelectField,
  EntryOption,
  NumberField,
} from "../components/FormField";
import { Entry, EntryType, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

export type EntryFormValues = Omit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryOptions: EntryOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" },
  { value: EntryType.HealthCheck, label: "Health Check" },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  const [type, setType] = useState<EntryType>(EntryType.Hospital);

  const changeType = (option: string) => setType(option as EntryType);

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: EntryType.Hospital,
        dischargeDate: "",
        dischargeCriteria: "",
        employerName: "",
        startDate: "",
        endDate: "",
        healthCheckRating: 0,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};

        if (!values.description) errors.description = requiredError;
        if (!values.date) errors.date = requiredError;
        if (!values.specialist) errors.specialist = requiredError;

        if (values.type === EntryType.Hospital) {
          if (!values.dischargeDate) errors.dischargeDate = requiredError;
          if (!values.dischargeCriteria)
            errors.dischargeCriteria = requiredError;
        }

        if (values.type === EntryType.OccupationalHealthcare) {
          if (!values.employerName) errors.employerName = requiredError;
          if (!values.startDate) errors.startDate = requiredError;
          if (!values.endDate) errors.endDate = requiredError;
        }

        if (values.type === EntryType.HealthCheck) {
          if (
            values.healthCheckRating < HealthCheckRating.Healthy ||
            values.healthCheckRating > HealthCheckRating.CriticalRisk
          ) {
            errors.healthCheckRating = "Value out range";
          }
        }

        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Name"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <SelectField
              label="Type"
              name="type"
              options={entryOptions}
              defaultValue={values.type}
              setFieldValue={setFieldValue}
              handleChange={changeType}
            />
            {type === EntryType.Hospital && (
              <>
                <Field
                  label="Discharge Date"
                  placeholder="YYYY-MM-DD"
                  name="dischargeDate"
                  component={TextField}
                />
                <Field
                  label="Discharge Criteria"
                  placeholder="Criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
              </>
            )}
            {type === EntryType.OccupationalHealthcare && (
              <>
                <Field
                  label="Employer"
                  placeholder="Name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Start date"
                  placeholder="YYYY-MM-DD"
                  name="startDate"
                  component={TextField}
                />
                <Field
                  label="End date"
                  placeholder="YYYY-MM-DD"
                  name="endDate"
                  component={TextField}
                />
              </>
            )}
            {type === EntryType.HealthCheck && (
              <Field
                label="Health Rating"
                name="healthCheckRating"
                placeholder="0"
                component={NumberField}
              />
            )}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
