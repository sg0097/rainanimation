import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const GRID_ROWS = 15;
const GRID_COLS = 20;
const DROP_LENGTH = 6;
const OPACITIES = [0.1, 0.2, 0.4, 0.6, 0.8, 1]; // Opacity levels for the raindrop effect
const MIN_DROPS = 12;
const DROP_INTERVAL = 100;// ms
const FALL_INTERVAL = 75; // ms
const COLOR_CHANGE_INTERVAL = 1500; // ms

// 🎨 Predefined bright color palette
const COLOR_PALETTE = [
  '#ffcc00', // bright yellow
  '#ff0000', // red
  '#ffffff', // white
  '#ff9900', // orange
  '#00ccff', // bright blue
  '#ff66cc'  // pink
];

// Get a random color from the palette
const getColorFromPalette = () => {
  const index = Math.floor(Math.random() * COLOR_PALETTE.length);
  return COLOR_PALETTE[index];
};

const generateDrop = (col) => ({
  id: Math.random(),
  col: col ?? Math.floor(Math.random() * GRID_COLS),
  row: -2
});

const App = () => {
  const [rainDrops, setRainDrops] = useState([]);
  const [currentColor, setCurrentColor] = useState(getColorFromPalette());

  const addDrop = useCallback(() => {
    setRainDrops(prevDrops => {
      const activeDrops = prevDrops.filter(drop => drop.row < GRID_ROWS + DROP_LENGTH - 1);
      if (activeDrops.length < MIN_DROPS) {
        return [...activeDrops, generateDrop()];
      }
      return activeDrops;
    });
  }, []);

  // Change global color every COLOR_CHANGE_INTERVAL
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor(getColorFromPalette());
    }, COLOR_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Add raindrops
  useEffect(() => {
    const interval = setInterval(addDrop, DROP_INTERVAL);
    return () => clearInterval(interval);
  }, [addDrop]);

  // Animate raindrops falling
  useEffect(() => {
    const interval = setInterval(() => {
      setRainDrops(prevDrops =>
        prevDrops
          .map(drop => ({ ...drop, row: drop.row + 1 }))
          .filter(drop => drop.row < GRID_ROWS + DROP_LENGTH)
      );
    }, FALL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className="grid">
        {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {Array.from({ length: GRID_COLS }).map((_, colIndex) => {
              const drop = rainDrops.find(
                drop =>
                  drop.col === colIndex &&
                  rowIndex >= drop.row &&
                  rowIndex < drop.row + DROP_LENGTH
              );

              const opacityIndex = rowIndex - (drop ? drop.row : 0);
              const opacity = drop ? OPACITIES[opacityIndex] || 0 : 1;

              const backgroundColor = drop ? currentColor : 'black';

              return (
                <div
                  key={colIndex}
                  className="grid-cell"
                  style={{
                    backgroundColor,
                    opacity,
                    
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
