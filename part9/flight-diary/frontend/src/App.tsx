import { useEffect, useState } from 'react';
import './App.css';
import type { DiaryEntry } from './types';
import { Visibility, Weather } from './types'
import { getAllDiaries } from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = {
      id: diaries.length + 1,
      date,
      weather,
      visibility,
      comment,
    };
    setDiaries(diaries.concat(newDiary));
  };

  return (
    <div>
      <form onSubmit={diaryCreation}>
        <input value={date} onChange={(event) => setDate(event.target.value)} />
        <input value={weather} onChange={(event) => setWeather(event.target.value as Weather)} />
        <input
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as Visibility)}
        />
        <input value={comment} onChange={(event) => setComment(event.target.value)} />
        <button type="submit">add</button>
      </form>
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
