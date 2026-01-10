import { useEffect, useState } from 'react';
import { Diagnosis, Patient } from '../types';
import { useParams } from 'react-router-dom';
import patientService from '../services/patients';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

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

interface PatientProps {
  diagnoses: Diagnosis[];
}

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
        <p>No entries</p>
      ) : (
        <div>
          {patient.entries.map((entry) => (
            <div key={entry.id}>
              <p>
                {entry.date} {entry.description}
              </p>
              <ul>
                {entry.diagnosisCodes?.map((code) => {
                  const diagnosis = diagnoses.find((d) => d.code === code);
                  return (
                    <li key={code}>
                      {code} {diagnosis?.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPage;
