import { Typography } from '@mui/material';
import DiagnosisList from './DiagnosisList';
import { Work } from '@mui/icons-material';
import { Diagnosis, OccupationalHealthcareEntry } from '../../types';

const OccupationaHealthcare = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <Typography variant="body1">
        {entry.date} <Work /> {entry.employerName}
      </Typography>
      <Typography variant="body1">
        <em>{entry.description}</em>
      </Typography>
      {entry.sickLeave && (
        <Typography variant="body1">
          Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </Typography>
      )}
      <DiagnosisList diagnoses={diagnoses} entry={entry} />
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

export default OccupationaHealthcare;
