import { Diagnosis, HospitalEntry } from '../../types';
import { Typography } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import DiagnosisList from './DiagnosisList';

const Hospital = ({ entry, diagnoses }: { entry: HospitalEntry; diagnoses: Diagnosis[] }) => {
  return (
    <div>
      <Typography variant="body1">
        {entry.date} <LocalHospital />
      </Typography>
      <Typography variant="body1">
        <em>{entry.description}</em>
      </Typography>
      <Typography variant="body1">
        Discharge: {entry.discharge.date} {entry.discharge.criteria}
      </Typography>
      <DiagnosisList diagnoses={diagnoses} entry={entry} />
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </div>
  );
};

export default Hospital;
