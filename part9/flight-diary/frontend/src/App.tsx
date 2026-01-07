import { useEffect, useState } from 'react';
import './App.css';
import type { DiaryEntry } from './types';
import { Visibility, Weather } from './types';
import { createDiary, getAllDiaries } from './services/diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const addedDiary = {
        date,
        weather,
        visibility,
        comment,
      };
      const newDiary = await createDiary(addedDiary);
      setDiaries(diaries.concat(newDiary));
      setDate('');
      setVisibility(Visibility.Great);
      setWeather(Weather.Sunny);
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const issues = error.response?.data?.error;
        const message = 'Error: ';
        showError(message + issues?.[0].message);
      } else {
        console.error(error);
      }
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={diaryCreation}>
        <label>
          date
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          visibility
          <input
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as Visibility)}
          />
        </label>
        <label>
          weather
          <input value={weather} onChange={(event) => setWeather(event.target.value as Weather)} />
        </label>
        <label>
          comment
          <input value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>
        <button type="submit">add</button>
      </form>

      <h1>Diary entries</h1>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h3>{diary.date}</h3>
            <p>{diary.weather}</p>
            <p>{diary.visibility}</p>
            <p>{diary?.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
