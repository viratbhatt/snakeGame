import React, { useState, useEffect, useRef } from 'react';

const BOARD_SIZE = 30;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const INITIAL_DIRECTION = 'RIGHT';
const SPEED = 300;

function getRandomFood(snake) {
  let food;
  while (true) {
    food = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      return food;
    }
  }
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const moveRef = useRef(direction);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (moveRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (moveRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (moveRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (moveRef.current !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        switch (moveRef.current) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
          default: break;
        }
        // Check collision
        if (
          head.x < 0 || head.x >= BOARD_SIZE ||
          head.y < 0 || head.y >= BOARD_SIZE ||
          prevSnake.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }
        let newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Snake Game</h1>
      <div
        style={{
          display: 'inline-block',
          background: '#222',
          border: '2px solid #333',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
            gap: 1,
          }}
        >
          {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
            const x = i % BOARD_SIZE;
            const y = Math.floor(i / BOARD_SIZE);
            const isSnake = snake.some(seg => seg.x === x && seg.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  background: isHead
                    ? '#0f0'
                    : isSnake
                    ? '#6f6'
                    : isFood
                    ? '#f00'
                    : '#111',
                  borderRadius: isFood ? '50%' : 4,
                }}
              />
            );
          })}
        </div>
      </div>
      {gameOver && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ color: 'red' }}>Game Over!</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;
