const BookFilter = ({ books, setGenre }) => {
  const allGenres = [...new Set(books.flatMap((book) => book.genres))].concat('all genres');

  return (
    <div>
      {allGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default BookFilter;
