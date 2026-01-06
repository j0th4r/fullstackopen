import patients from '../../data/patients';
import { NewPatient, Patient, PublicPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPublicPatients,
  addPatient
};
