import { Card } from "@material-ui/core";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import TodayIcon from "@material-ui/icons/Today";

import { Entry } from "../types";

const BaseEntry: React.FC<{ entry: Entry }> = ({ entry, children }) => (
  <Card variant="outlined" style={{ padding: 10 }}>
    <p>
      <TodayIcon fontSize="inherit" /> {entry.date}
    </p>
    <p>
      <AssignmentIcon fontSize="inherit" /> {entry.description}
    </p>
    <p>
      <AccessibilityIcon fontSize="inherit" /> {entry.specialist}
    </p>
    {children}
  </Card>
);

export default BaseEntry;
