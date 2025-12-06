import { useRef, useState, useEffect, useMemo } from "react";

const calculateElectronConfig = (atomicNumber) => {
  const maxElectrons = [2, 8, 18, 32, 32, 18, 8]; 
  const shells = [];
  let remaining = atomicNumber;
  
  for (let i = 0; i < maxElectrons.length && remaining > 0; i++) {
    const count = Math.min(remaining, maxElectrons[i]);
    shells.push(count);
    remaining -= count;
  }

  return shells;
};

// 스펙트럼 정보 있는 원소 번호
const SPECTRUM_AVAILABLE = [
  1, 2, 3, 4, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 35, 36, 37, 38, 39, 42, 43, 44, 45,
  47, 48, 49, 50, 53, 54, 55, 56, 57, 58,
  60, 62, 63, 64, 66, 67, 68, 69, 70, 71,
  72, 73, 74, 77, 78, 79, 80, 81, 82, 83,
  87, 88, 89
];

export default function AtomModel2D({ atomicNumber, onElectronMove = () => {}, size = 400, disableMovement = false }) {
  const canvasRef = useRef(null);
  const electronPositionsRef = useRef([]); 
  const [draggingIndex, setDraggingIndex] = useState(null);
  const initialShellIndexRef = useRef(null);
  const rafRef = useRef(null); 

  const shells = useMemo(() => calculateElectronConfig(atomicNumber), [atomicNumber]);
  const scale = size / 400;
  const center = size / 2;

  useEffect(() => {
    if (!shells || shells.length === 0) return;
    const positions = [];
    const startRadius = 30;
    const shellGap = 25;
    shells.forEach((count, shellIndex) => {
      const radius = (startRadius + shellIndex * shellGap) * scale;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push({
          x: center + radius * Math.cos(angle),
          y: center + radius * Math.sin(angle),
          shellIndex
        });
      }
    });
    electronPositionsRef.current = positions;
  }, [atomicNumber, scale, center, shells]); 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const draw = () => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);

      // 핵
      ctx.beginPath();
      ctx.arc(center, center, 11 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ff3366";
      ctx.fill();

      // 껍질
      const startRadius = 30;
      const shellGap = 25;
      shells.forEach((count, idx) => {
        const radius = (startRadius + idx * shellGap) * scale;
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      });

      // 전자
      electronPositionsRef.current.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#00ccff";
        ctx.fill();
      });
    };

    // 이동
    if (draggingIndex !== null) {
      const animate = () => {
        draw();
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
      
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      draw();
    }
  }, [draggingIndex, shells, size, scale, center]);

  const getShellIndexFromRadius = (radius) => {
    const startRadius = 30;
    const shellGap = 25;
    for (let idx = 0; idx < shells.length; idx++) {
      const shellRadius = (startRadius + idx * shellGap) * scale;
      if (Math.abs(radius - shellRadius) < 20 * scale) {
        return idx;
      }
    }
    return -1;
  };

  const handleMouseDown = (e) => {
    if (disableMovement || !SPECTRUM_AVAILABLE.includes(atomicNumber)) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const index = electronPositionsRef.current.findIndex(
      pos => Math.hypot(pos.x - x, pos.y - y) < 10 * scale
    );
    if (index !== -1) {
      setDraggingIndex(index);
      const pos = electronPositionsRef.current[index];
      const radius = Math.hypot(pos.x - center, pos.y - center);
      initialShellIndexRef.current = getShellIndexFromRadius(radius);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    electronPositionsRef.current = electronPositionsRef.current.map((pos, idx) =>
      idx === draggingIndex ? { ...pos, x, y } : pos
    );
  };

  const handleMouseUp = (e) => {
    if (draggingIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currRadius = Math.hypot(x - center, y - center);
    const startRadius = 30;
    const shellGap = 25;
    const initialRadius = (startRadius + initialShellIndexRef.current * shellGap) * scale;

    if (initialShellIndexRef.current !== null) {
      const radiusDiff = currRadius - initialRadius;
      const threshold = 25 * scale;
      
      // 방출 스펙트럼
      if (radiusDiff < -threshold) {
        onElectronMove("in");
      }
      // 흡수 스펙트럼
      else if (radiusDiff > threshold) {
        onElectronMove("out");
      }
    }

    setDraggingIndex(null);
    initialShellIndexRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ background: "transparent", cursor: "pointer" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}