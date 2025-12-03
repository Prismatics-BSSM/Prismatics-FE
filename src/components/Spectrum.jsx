import colorMapper from "../utils/colorMapper";
import { useState, useEffect } from 'react';
import axios from 'axios';

// mode: "absorption"(흡수) | "emission"(방출)

function Spectrum({ wavelengths = [], mode = "emission" }) {
  const width = 640;
  const height = 80;
  const start = 380;
  const end = 780;
  const total = end - start + 1;
  const barWidth = 2;

  const [waves, setWaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://prismatics-api-xwmrfrdamq-du.a.run.app/elements/spectrums?ids=1")
      .then(res => {
        setWaves(res.data.waves);
        setLoading(false);
      })
      .catch(err => {
        console.error("API 요청 에러:", err);
        setLoading(false);
      });
  }, []);

  const wavesToUse = wavelengths.length ? wavelengths : waves;

  if (loading) return <p>로딩 중...</p>;

  return (
    <svg width={width} height={height} style={{ borderRadius: "8px" }}>
      {Array.from({ length: total }).map((_, idx) => {
        const wl = start + idx;
        let color;
        if (mode === "emission") {
          color = waves.includes(wl) ? colorMapper[wl] : "#000";
        } else if (mode === "absorption") {
          color = waves.includes(wl) ? "#000" : colorMapper[wl];
        }
        return (
          <rect
            key={wl}
            x={idx * barWidth}
            y={0}
            width={barWidth}
            height={height}
            fill={color}
            style={{ shapeRendering: "optimizeSpeed" }}
          />
        );
      })}
    </svg>
  );
}

export default Spectrum;