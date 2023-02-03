import FavoriteIcon from "@material-ui/icons/Favorite";

import {
  HealthCheckEntry as HealthCheckEntryType,
  HealthCheckRating,
} from "../types";
import BaseEntry from "./BaseEntry";

const healthCheckRatingColors = (rating: HealthCheckRating) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return "secondary";

    case HealthCheckRating.LowRisk:
      return "primary";

    case HealthCheckRating.HighRisk:
      return "inherit";

    case HealthCheckRating.CriticalRisk:
      return "action";

    default:
      return "disabled";
  }
};

const HealthCheckEntry: React.FC<{ entry: HealthCheckEntryType }> = ({
  entry,
}) => (
  <BaseEntry entry={entry}>
    {HealthCheckRating[entry.healthCheckRating]}{" "}
    <FavoriteIcon
      fontSize="inherit"
      color={healthCheckRatingColors(entry.healthCheckRating)}
    />
  </BaseEntry>
);

export default HealthCheckEntry;
