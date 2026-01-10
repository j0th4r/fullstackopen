import { Diagnosis, Entry } from '../../types';

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  entry: Entry;
}

const DiagnosisList = ({ diagnoses, entry }: DiagnosisListProps) => {
  if (!entry.diagnosisCodes || entry.diagnosisCodes.length === 0) return null;

  return (
    <ul>
      {entry.diagnosisCodes?.map((code) => (
        <li key={code}>
          {code} {diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
        </li>
      ))}
    </ul>
  );
};

export default DiagnosisList;
