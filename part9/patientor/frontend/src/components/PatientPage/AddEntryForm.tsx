import { useState } from 'react';
import { Diagnosis, EntryType, NewEntry } from '../../types';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  entryType: EntryType | undefined;
  diagnoses: Diagnosis[];
  onValidationError: (msg: string | null) => void;
}

const AddEntryForm = ({ onSubmit, onCancel, entryType, diagnoses, onValidationError }: Props) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);

  const healthCheckRatingOptions = [
    { value: 0, label: 'Healthy' },
    { value: 1, label: 'Low risk' },
    { value: 2, label: 'High risk' },
    { value: 3, label: 'Critical risk' },
  ];

  const isValidDateRange = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    return new Date(start) <= new Date(end);
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    switch (entryType) {
      case EntryType.HealthCheck:
        onSubmit({
          type: EntryType.HealthCheck,
          description,
          date,
          specialist,
          diagnosisCodes: selectedDiagnoses,
          healthCheckRating,
        });
        break;
      case EntryType.Hospital:
        onSubmit({
          type: EntryType.Hospital,
          description,
          date,
          specialist,
          diagnosisCodes: selectedDiagnoses,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
      case EntryType.OccupationalHealthcare:
        if (!isValidDateRange(sickLeaveStartDate, sickLeaveEndDate)) {
          onValidationError('Sick leave start date must be earlier than or equal to end date');
          return; // do not call onSubmit
        }

        onValidationError(null);

        let sickLeave = undefined;
        if (sickLeaveStartDate || sickLeaveEndDate) {
          sickLeave = {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          };
        }
        onSubmit({
          type: EntryType.OccupationalHealthcare,
          description,
          date,
          specialist,
          diagnosisCodes: selectedDiagnoses,
          employerName,
          sickLeave,
        });
        break;
      default:
        throw new Error('Unknown entry type');
    }
  };

  return (
    <Box sx={{ border: '2px dashed grey', borderRadius: 2, padding: 2, mt: 2 }}>
      <Typography variant="h6">New {entryType} entry</Typography>
      <form onSubmit={addEntry}>
        <TextField
          sx={{ my: 1 }}
          label="Description"
          variant="standard"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          sx={{ my: 1 }}
          type="date"
          label="Date"
          variant="standard"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ my: 1 }}
          label="Specialist"
          variant="standard"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        {entryType === EntryType.HealthCheck && (
          <TextField
            sx={{ my: 1 }}
            select
            label="Health check rating"
            variant="standard"
            fullWidth
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(parseInt(target.value))}
          >
            {healthCheckRatingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        {entryType === EntryType.OccupationalHealthcare && (
          <>
            <TextField
              sx={{ my: 1 }}
              label="Employee"
              variant="standard"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              sx={{ my: 1 }}
              type="date"
              label="Sick leave start date"
              variant="standard"
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ my: 1 }}
              type="date"
              label="Sick leave end date"
              variant="standard"
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}
        {entryType === EntryType.Hospital && (
          <>
            <TextField
              sx={{ my: 1 }}
              type="date"
              label="Discharge date"
              variant="standard"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              sx={{ my: 1 }}
              label="Discharge criteria"
              variant="standard"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}
        <FormControl sx={{ my: 1 }} variant="standard" fullWidth>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={selectedDiagnoses}
            onChange={({ target }) =>
              setSelectedDiagnoses(
                typeof target.value === 'string' ? target.value.split(',') : target.value,
              )
            }
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid sx={{ pb: 4 }}>
          <Grid item>
            <Button
              color="warning"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right',
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;
