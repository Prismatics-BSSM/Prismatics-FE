import colorMapper from "../utils/colorMapper";

// mode: "absorption"(흡수) | "emission"(방출)

function Spectrum({ wavelengths, mode = "emission" }) {
  const width = 640;
  const height = 80;
  const start = 380;
  const end = 780;
  const total = end - start + 1;
  const barWidth = 2;

  return (
    <>
      <svg width={width} height={height} style={{ borderRadius: "8px" }}>
        {Array.from({ length: total }).map((_, idx) => {
          const wl = start + idx;
          let color;
          if (mode === "emission") {
            color = wavelengths.includes(wl) ? colorMapper[wl] : "#000";
            console.log("emission")
          } else if (mode === "absorption") {
            color = wavelengths.includes(wl) ? "#000" : colorMapper[wl];
            console.log("absorption");
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
    </>
  );
}

export default Spectrum;
