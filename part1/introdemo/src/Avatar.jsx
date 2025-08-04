function Avatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        margin: '10px'
      }}
    />
  );
}

export default Avatar;
