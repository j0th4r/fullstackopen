import { useEffect, useState } from 'react';
import { Diagnosis, Entry, EntryType, NewEntry, Patient } from '../../types';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import HealthCheck from './HealthCheck';
import Hospital from './Hospital';
import { assertNever } from '../../utils';
import OccupationaHealthcare from './OccupationaHealthcare';
import axios from 'axios';
import AddEntryForm from './AddEntryForm';

interface EntryDetailsProps {
  diagnoses: Diagnosis[];
  entry: Entry;
}

interface PatientProps {
  diagnoses: Diagnosis[];
}

type BackendError = { error: { message: string }[] } | { error: string };

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
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>('');
  const [entryType, setEntryType] = useState<EntryType>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showEntryOptions, setShowEntryOptions] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
        <CircularProgress />
      </Box>
    );
  }

  const toggleForm = () => {
    setShowForm(!showForm);
    setError(null);
  };

  const handleSelectingEntryType = (entryType: EntryType) => {
    setEntryType(entryType);
    setShowEntryOptions(false);
    setShowForm(true);
  };

  const submitNewEntry = async (values: NewEntry) => {
    try {
      const patient = await patientService.createEntry(String(id), values);
      setPatient(patient);
      toggleForm();
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data) {
        const data = e.response.data as BackendError;

        if (
          Array.isArray(data.error) &&
          data.error.length > 0 &&
          typeof data.error[0].message === 'string'
        ) {
          setError(data.error[0].message);
        } else if (typeof data.error === 'string') {
          setError(data.error);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }} display="flex" alignItems="center">
        {patient.name}
        <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!showForm && showEntryOptions && (
        <ButtonGroup variant="text" aria-label="text button group">
          <Button
            sx={{ mt: 3, mr: 3 }}
            variant="contained"
            onClick={() => handleSelectingEntryType(EntryType.HealthCheck)}
          >
            New HealthCheck entry
          </Button>
          <Button
            sx={{ mt: 3, mr: 3 }}
            variant="contained"
            onClick={() => handleSelectingEntryType(EntryType.Hospital)}
          >
            New Hospital entry
          </Button>
          <Button
            sx={{ mt: 3, mr: 3 }}
            variant="contained"
            onClick={() => handleSelectingEntryType(EntryType.OccupationalHealthcare)}
          >
            New OccupationalHealthcare entry
          </Button>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="error"
            onClick={() => setShowEntryOptions(false)}
          >
            Cancel
          </Button>
        </ButtonGroup>
      )}
      {!showForm && !showEntryOptions && (
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => setShowEntryOptions(true)}>
          New entry
        </Button>
      )}
      {showForm && (
        <AddEntryForm
          onCancel={toggleForm}
          onSubmit={submitNewEntry}
          entryType={entryType}
          diagnoses={diagnoses}
          onValidationError={setError}
        />
      )}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <Stack key={entry.id} sx={{ border: 1, borderRadius: 2, padding: 2, my: 2 }}>
          <EntryDetails entry={entry} diagnoses={diagnoses} />
        </Stack>
      ))}
      {patient.entries.length === 0 && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          no entries
        </Typography>
      )}
    </Box>
  );
};

export default PatientPage;
