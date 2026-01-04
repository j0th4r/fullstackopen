import patients from '../../data/patients';
import { Patient, PublicPatient } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest);
};

export default {
  getPatients,
  getPublicPatients,
};
