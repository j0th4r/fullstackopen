import { useEffect, useState } from 'react';
import { Diagnosis, Entry, Patient } from '../../types';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { Stack, Typography } from '@mui/material';
import HealthCheck from './HealthCheck';
import Hospital from './Hospital';
import { assertNever } from '../../utils';
import OccupationaHealthcare from './OccupationaHealthcare';

interface EntryDetailsProps {
  diagnoses: Diagnosis[];
  entry: Entry;
}

interface PatientProps {
  diagnoses: Diagnosis[];
}

const GenderIcon = ({ gender }: { gender: Patient['gender'] }) => {
  switch (gender) {
    case 'male':
      return <MaleIcon fontSize="large" />;
    case 'female':
      return <FemaleIcon fontSize="large" />;
    default:
      return null;
  }
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  switch (entry.type) {
    case 'Hospital':
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheck entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationaHealthcare entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage = ({ diagnoses }: PatientProps) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };

    fetchPatient();
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1>{patient.name}</h1>
        <GenderIcon gender={patient.gender} />
      </div>
      <p>ssn: {patient.ssn}</p>
      <p>date of birth: {patient.dateOfBirth}</p>
      <p>occupation: {patient.occupation}</p>

      <h2>entries</h2>
      {patient.entries.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 1 }}>
          no entries
        </Typography>
      ) : (
        <div>
          {patient.entries.map((entry) => (
            <Stack key={entry.id} sx={{ border: 1, borderRadius: 2, padding: 2, my: 2 }}>
              <EntryDetails entry={entry} diagnoses={diagnoses} />
            </Stack>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPage;
