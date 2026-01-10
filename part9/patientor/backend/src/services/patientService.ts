import patients from '../../data/patients';
import { Entry, NewEntry, NewPatient, Patient, PublicPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient?.entries.push(newEntry);

  return newEntry;
};

export default {
  getPatients,
  getPatient,
  getPublicPatients,
  addPatient,
  addEntry,
};
