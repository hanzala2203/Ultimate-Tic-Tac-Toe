import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './component/GameBoard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const modes = [
  { label: 'Classic (3x3)', value: 'classic' },
  { label: 'Ultimate (9x9)', value: 'ultimate' }
];

const players = [
  { label: 'Human vs Human', value: 'human' },
  { label: 'Human vs AI', value: 'ai' }
];

export default function App() {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedPlayerMode, setSelectedPlayerMode] = useState(null);
  const canvasRef = useRef(null);
  const selectorRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const os = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 1 + Math.random() * 2,
      size: 18 + Math.random() * 10
    }));

    function drawO(o) {
      ctx.save();
      ctx.font = `${o.size}px Arial`;
      ctx.fillStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 12;
      ctx.fillText('O', o.x, o.y);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const selectorRect = selectorRef.current?.getBoundingClientRect();

      os.forEach(o => {
        o.y += o.speed;
        if (o.y > height) {
          o.y = -20;
          o.x = Math.random() * width;
        }

        if (
          selectorRect &&
          o.x >= selectorRect.left &&
          o.x <= selectorRect.right &&
          o.y >= selectorRect.top &&
          o.y <= selectorRect.bottom
        ) {
          return;
        }

        drawO(o);
      });

      requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
  }, []);

  if (selectedMode && selectedPlayerMode) {
    return (
      <GameBoard
        mode={selectedMode}
        playerType={selectedPlayerMode}
        goBack={() => {
          setSelectedMode(null);
          setSelectedPlayerMode(null);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <motion.div
        ref={selectorRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 p-8 rounded-xl neon-panel text-center max-w-md w-full bg-black bg-opacity-70 backdrop-blur-md"
      >
        <h1 className="text-4xl font-bold neon-title mb-6">Ultimate Tic Tac Toe</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Choose Game Mode:</h2>
            {modes.map(mode => (
              <Button
                key={mode.value}
                className={`w-full ${selectedMode === mode.value ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setSelectedMode(mode.value)}
              >
                {mode.label}
              </Button>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Choose Player Mode:</h2>
            {players.map(player => (
              <Button
                key={player.value}
                className={`w-full ${selectedPlayerMode === player.value ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setSelectedPlayerMode(player.value)}
              >
                {player.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
