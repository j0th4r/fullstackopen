import axios from 'axios';
import { Diagnosis, NewEntry, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const getPatient = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);

  return data;
};

const createEntry = async (id: string, object: NewEntry) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, object);

  return data;
};

export default {
  getAll,
  getPatient,
  create,
  getDiagnoses,
  createEntry,
};
