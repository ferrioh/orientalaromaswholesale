import { useEffect, useRef } from 'react';

// A small, event-driven prismatic trail. No WebGL context or render loop at rest.
export default function ChromaticTrail() {
  const ref = useRef(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles = [], frame = 0, last = { x: -1000, y: -1000 };
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > .025);
      particles.forEach(p => {
        p.life *= .93; p.x += p.vx; p.y += p.vy; p.radius += .4;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        g.addColorStop(0, `hsla(${p.hue}, 75%, 70%, ${p.life * .24})`);
        g.addColorStop(.5, `hsla(${p.hue + 50}, 85%, 58%, ${p.life * .15})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      });
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    };
    const move = e => {
      if (e.pointerType === 'touch') return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      if (Math.hypot(dx, dy) < 5) return;
      particles.push({ x: e.clientX, y: e.clientY, vx: Math.max(-2, Math.min(2, dx * -.02)), vy: Math.max(-2, Math.min(2, dy * -.02)), hue: (e.clientX * .35 + e.clientY * .3) % 360, life: 1, radius: 22 });
      if (particles.length > 45) particles.shift();
      last = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', move); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="chromatic-trail" aria-hidden="true" />;
}
