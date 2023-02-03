import { Divider } from "@material-ui/core";
import TodayIcon from "@material-ui/icons/Today";

import { HospitalEntry as HospitalEntryType } from "../types";
import BaseEntry from "./BaseEntry";

const HospitalEntry: React.FC<{ entry: HospitalEntryType }> = ({ entry }) => (
  <BaseEntry entry={entry}>
    <Divider />
    <p>Discharge</p>
    <p>
      <TodayIcon fontSize="inherit" /> {entry.discharge.date}{" "}
      {entry.discharge.criteria}
    </p>
  </BaseEntry>
);

export default HospitalEntry;
