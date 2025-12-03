import { useRef, useState, useEffect } from "react";

// 전자 배치 규칙: 오가네손(Og) 기준
const calculateElectronConfig = (atomicNumber) => {
  const maxElectrons = [2, 8, 18, 32, 32, 18, 8]; // 각 껍질의 최대 전자 수
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
  const [electronPositions, setElectronPositions] = useState([]);
  const electronPositionsRef = useRef([]); // 실시간 추적용
  const [draggingIndex, setDraggingIndex] = useState(null);
  const initialShellIndexRef = useRef(null);
  const rafRef = useRef(null); // requestAnimationFrame ID

  const shells = calculateElectronConfig(atomicNumber);
  const scale = size / 400;
  const center = size / 2;

  // 전자 초기 위치: 껍질 원 위에 균등 배치
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
  setElectronPositions(positions);
  electronPositionsRef.current = positions;
}, [atomicNumber, scale, center]);

  // 그리기: 핵 + 껍질 + 전자
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

      // 껍질 원
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

      // 전자 (ref에서 읽기)
      electronPositionsRef.current.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#00ccff";
        ctx.fill();
      });
    };

    // 드래그 중이면 계속 그리기
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
      // 드래그 아닐 때는 한 번만
      draw();
    }
  }, [draggingIndex, shells, size, scale, center]);

  // 반지름으로 껍질 인덱스 찾기
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

  // 마우스 이벤트 (전자 이동)
  const handleMouseDown = (e) => {
  // ⭐ 스펙트럼 지원 안 되는 원소면 전자 이동 자체를 막기
  if (!SPECTRUM_AVAILABLE.includes(atomicNumber)) {
    console.log("⚠️ 스펙트럼 정보 없음 → 전자 이동 비활성화");
    return;
  }
  if (disableMovement || !SPECTRUM_AVAILABLE.includes(atomicNumber)) {
    console.log("⚠️ 전자 이동 비활성화");
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

    // ref 업데이트 (즉시 반영)
    electronPositionsRef.current = electronPositionsRef.current.map((pos, idx) =>
      idx === draggingIndex ? { ...pos, x, y } : pos
    );
  };

  const handleMouseUp = (e) => {
    if (draggingIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 현재 반지름 계산
    const currRadius = Math.hypot(x - center, y - center);
    const startRadius = 30;
    const shellGap = 25;
    const initialRadius = (startRadius + initialShellIndexRef.current * shellGap) * scale;

    console.log('🔍 드래그 종료:', {
      initialShell: initialShellIndexRef.current,
      currRadius,
      initialRadius,
      diff: currRadius - initialRadius
    });

    // 초기 위치와 비교 (반지름 기준)
    if (initialShellIndexRef.current !== null) {
      const radiusDiff = currRadius - initialRadius;
      const threshold = 25 * scale;
      
      // 안쪽으로 25px 이상 이동 = 에너지 방출 (방출 스펙트럼)
      if (radiusDiff < -threshold) {
        console.log('✅ in 이벤트 발생 (방출)');
        onElectronMove("in");
      }
      // 바깥쪽으로 25px 이상 이동 = 에너지 흡수 (흡수 스펙트럼)
      else if (radiusDiff > threshold) {
        console.log('✅ out 이벤트 발생 (흡수)');
        onElectronMove("out");
      } else {
        console.log('❌ 이동 거리 부족');
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