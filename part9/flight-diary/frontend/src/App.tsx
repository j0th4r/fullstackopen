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
          date:
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <div>
          <label>visibility:</label>

          <label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Great}
              checked={visibility === Visibility.Great}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
            />
            {Visibility.Great}
          </label>

          <label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Good}
              checked={visibility === Visibility.Good}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
            />
            {Visibility.Good}
          </label>

          <label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Ok}
              checked={visibility === Visibility.Ok}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
            />
            {Visibility.Ok}
          </label>

          <label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Poor}
              checked={visibility === Visibility.Poor}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
            />
            {Visibility.Poor}
          </label>
        </div>

        <div>
          <label>weather:</label>

          <label>
            <input
              type="radio"
              name="weather"
              value={Weather.Sunny}
              checked={weather === Weather.Sunny}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {Weather.Sunny}
          </label>

          <label>
            <input
              type="radio"
              name="weather"
              value={Weather.Rainy}
              checked={weather === Weather.Rainy}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {Weather.Rainy}
          </label>

          <label>
            <input
              type="radio"
              name="weather"
              value={Weather.Cloudy}
              checked={weather === Weather.Cloudy}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {Weather.Cloudy}
          </label>

          <label>
            <input
              type="radio"
              name="weather"
              value={Weather.Stormy}
              checked={weather === Weather.Stormy}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {Weather.Stormy}
          </label>

          <label>
            <input
              type="radio"
              name="weather"
              value={Weather.Windy}
              checked={weather === Weather.Windy}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {Weather.Windy}
          </label>
        </div>

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
