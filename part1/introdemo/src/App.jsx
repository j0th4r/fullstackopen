import React from 'react';

function App() {
  const [colors, setColors] = React.useState([
    '#FFD500',
    '#FF0040',
    '#FF0040',
    '#FF0040',
    '#FF0040',
  ]);
  const [
    numOfVisibleColors,
    setNumOfVisibleColors,
  ] = React.useState(2);

  const visibleColors = colors.slice(0, numOfVisibleColors);

  const colorStops = visibleColors.join(', ');
  const backgroundImage = `linear-gradient(${colorStops})`;

  function addColor() {
    if (numOfVisibleColors >= 5) {
      window.alert('There is a maximum of 5 colors');
      return;
    }

    setNumOfVisibleColors(numOfVisibleColors + 1);
  }

  function removeColor() {
    if (numOfVisibleColors <= 2) {
      window.alert('There is a minimum of 2 colors');
      return;
    }

    setNumOfVisibleColors(numOfVisibleColors - 1);
  }

  return (
    <div className="wrapper">
      <div className="actions">
        <button onClick={removeColor}>Remove color</button>
        <button onClick={addColor}>Add color</button>
      </div>

      <div
        className="gradient-preview"
        style={{
          backgroundImage,
        }}
      />

      <div className="colors">
        {visibleColors.map((color, index) => {
          const colorId = `color-${index}`;
          return (
            <div key={colorId} className="color-wrapper">
              <label htmlFor={colorId}>
                Color {index + 1}:
              </label>
              <div className="input-wrapper">
                <input
                  id={colorId}
                  type="color"
                  value={color}
                  onChange={(event) => {
                    const nextColors = [...colors];
                    nextColors[index] = event.target.value;

                    setColors(nextColors);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;