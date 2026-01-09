import { useEffect, useState } from 'react';
import { Patient } from '../types';
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

const PatientPage = () => {
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

      <h2>Entries</h2>
      {patient.entries.length === 0 ? (
        <p>No entries yet</p>
      ) : (
        <ul>
          {patient.entries.map((_entry, index) => (
            <li key={index}>/* later you’ll render real Entry fields */</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientPage;
