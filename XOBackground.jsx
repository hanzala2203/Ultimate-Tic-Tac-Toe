import React, { useEffect, useRef } from 'react';

const XOBackground = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const columns = Array(Math.floor(width / 20)).fill(0);
    const symbols = ['X', 'O'];

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '18px Orbitron';
      ctx.fillStyle = '#00ffff';

      columns.forEach((y, i) => {
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        const x = i * 20;
        ctx.fillText(text, x, y);

        if (y > height + Math.random() * 10000) {
          columns[i] = 0;
        } else {
          columns[i] = y + 20;
        }
      });
    };

    const interval = setInterval(draw, 60);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="background-canvas" />;
};

export default XOBackground;
