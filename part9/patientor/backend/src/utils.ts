import z from 'zod';
import { Gender, HealthCheckRating } from './types';

const DiagnosisCodeSchema = z.string();

const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string(),
});

const BaseNewEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(DiagnosisCodeSchema).optional(),
});

const HealthCheckEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const OccupationalHealthcareEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

const HospitalEntrySchema = BaseNewEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema,
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});
