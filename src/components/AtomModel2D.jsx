import { useRef, useState, useEffect } from "react";
import calculateElectronConfig from "../utils/calculateElectronConfig";

export default function AtomModel2D({ atomicNumber, onElectronMove = () => {}, size = 400 }) {
  const canvasRef = useRef(null);
  const [electronPositions, setElectronPositions] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const initialShellIndexRef = useRef(null); // 드래그 시작 시 껍질 인덱스

  const shells = calculateElectronConfig(atomicNumber);
  console.log(atomicNumber);
  const scale = size / 400; // 크기 비율 계산
  const center = size / 2; // 중심점

  // 전자 초기 위치: 껍질 원 위에 균등 배치
  useEffect(() => {
    const positions = [];
    let shellIndex = 0;
    shells.forEach(count => {
      const radius = (60 + shellIndex * 40) * scale;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push({
          x: center + radius * Math.cos(angle),
          y: center + radius * Math.sin(angle),
          shellIndex
        });
      }
      shellIndex++;
    });
    setElectronPositions(positions);
  }, [atomicNumber, scale, center]);

  // 그리기: 핵 + 껍질 + 전자
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    // 핵
    ctx.beginPath();
    ctx.arc(center, center, 20 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#ff3366";
    ctx.fill();

    // 껍질 원
    shells.forEach((count, idx) => {
      const radius = (60 + idx * 40) * scale;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    });

    // 전자
    electronPositions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#00ccff";
      ctx.fill();
    });
  }, [electronPositions, shells, size, scale, center]);

  // 반지름으로 껍질 인덱스 찾기
  const getShellIndexFromRadius = (radius) => {
    for (let idx = 0; idx < shells.length; idx++) {
      const shellRadius = (60 + idx * 40) * scale;
      if (Math.abs(radius - shellRadius) < 20 * scale) {
        return idx;
      }
    }
    return -1;
  };

  // 마우스 이벤트 (전자 이동)
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const index = electronPositions.findIndex(pos => Math.hypot(pos.x - x, pos.y - y) < 10 * scale);
    if (index !== -1) {
      setDraggingIndex(index);
      // 드래그 시작 시 현재 껍질 인덱스 저장
      const pos = electronPositions[index];
      const radius = Math.hypot(pos.x - center, pos.y - center);
      initialShellIndexRef.current = getShellIndexFromRadius(radius);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 전자 위치 업데이트
    setElectronPositions(ep =>
      ep.map((pos, idx) => (idx === draggingIndex ? { ...pos, x, y } : pos))
    );
  };

  const handleMouseUp = (e) => {
    if (draggingIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 현재 반지름 계산
    const currRadius = Math.hypot(x - center, y - center);
    const initialRadius = (60 + initialShellIndexRef.current * 40) * scale;

    console.log('🔍 드래그 종료:', {
      initialShell: initialShellIndexRef.current,
      currRadius,
      initialRadius,
      diff: currRadius - initialRadius
    });

    // 초기 위치와 비교 (반지름 기준)
    if (initialShellIndexRef.current !== null) {
      const radiusDiff = currRadius - initialRadius;
      const threshold = 30 * scale;
      
      // 안쪽으로 30px 이상 이동 = 에너지 방출 (방출 스펙트럼)
      if (radiusDiff < -threshold) {
        console.log('✅ in 이벤트 발생 (방출)');
        onElectronMove("in");
      }
      // 바깥쪽으로 30px 이상 이동 = 에너지 흡수 (흡수 스펙트럼)
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