const BookFilter = ({ books, setGenre }) => {
  const allGenres = [...new Set(books.flatMap((book) => book.genres))];

  return (
    <div>
      {allGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  );
};

export default BookFilter;
