import { Divider } from "@material-ui/core";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import TodayIcon from "@material-ui/icons/Today";

import { OccupationalHealthcareEntry as OccupationalHealthcareEntryType } from "../types";
import BaseEntry from "./BaseEntry";

const OccupationalHealthcareEntry: React.FC<{
  entry: OccupationalHealthcareEntryType;
}> = ({ entry }) => (
  <BaseEntry entry={entry}>
    <Divider />
    <p>
      <PermIdentityIcon fontSize="inherit" /> Employer: {entry.employerName}
    </p>
    {entry.sickLeave && (
      <p>
        <TodayIcon fontSize="inherit" /> Sick Leave: {entry.sickLeave.startDate}{" "}
        - {entry.sickLeave.endDate}
      </p>
    )}
  </BaseEntry>
);

export default OccupationalHealthcareEntry;
