import React, { useEffect, useRef } from 'react';

const OBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const os = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 1 + Math.random() * 2,
      size: 16 + Math.random() * 10
    }));

    const drawO = (o) => {
      ctx.save();
      ctx.font = `${o.size}px Arial`;
      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 12;
      ctx.fillText("O", o.x, o.y);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      os.forEach((o) => {
        o.y += o.speed;
        if (o.y > height) {
          o.y = -20;
          o.x = Math.random() * width;
        }
        drawO(o);
      });
      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export default OBackground;
