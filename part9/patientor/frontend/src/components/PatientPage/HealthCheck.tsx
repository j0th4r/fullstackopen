import { Diagnosis, HealthCheckEntry } from '../../types';
import { Typography } from '@mui/material';
import { Favorite, HealthAndSafety } from '@mui/icons-material';
import DiagnosisList from './DiagnosisList';

const HealthRatingBar = ({ rating }: { rating: number }) => {
  switch (rating) {
    case 0:
      return <Favorite style={{ color: '#00cc00' }} />;
    case 1:
      return <Favorite style={{ color: '#ffff00' }} />;
    case 2:
      return <Favorite style={{ color: '#ff6600' }} />;
    case 3:
      return <Favorite style={{ color: '#ff0000' }} />;
    default:
      return null;
  }
};

const HealthCheck = ({ entry, diagnoses }: { entry: HealthCheckEntry; diagnoses: Diagnosis[] }) => {
  return (
    <div>
      <Typography variant="body1">
        {entry.date} <HealthAndSafety />
      </Typography>
      <Typography variant="body1">
        <em>{entry.description}</em>
      </Typography>
      <HealthRatingBar rating={entry.healthCheckRating} />
      <DiagnosisList diagnoses={diagnoses} entry={entry} />
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

export default HealthCheck;
