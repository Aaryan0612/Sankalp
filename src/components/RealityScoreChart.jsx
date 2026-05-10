function buildPath(points, width, height, padding) {
  if (!points.length) return "";
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  return points
    .map((point, index) => {
      const x = padding + (usableWidth * index) / Math.max(points.length - 1, 1);
      const y = height - padding - (usableHeight * point.realityScore) / 100;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function RealityScoreChart({ points = [] }) {
  const width = 760;
  const height = 240;
  const padding = 20;
  const path = buildPath(points, width, height, padding);

  return (
    <div className="chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Reality score trend">
        {[0, 25, 50, 75, 100].map((value) => {
          const y = height - padding - ((height - padding * 2) * value) / 100;
          return (
            <g key={value}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} className="chart-grid-line" />
              <text x={0} y={y + 4} className="chart-axis-label">{value}</text>
            </g>
          );
        })}
        {path ? <path d={path} className="chart-line" /> : null}
        {points.map((point, index) => {
          const x = padding + ((width - padding * 2) * index) / Math.max(points.length - 1, 1);
          const y = height - padding - ((height - padding * 2) * point.realityScore) / 100;
          return (
            <g key={`${point.date}-${index}`}>
              <circle cx={x} cy={y} r="5" className="chart-point" />
              <text x={x} y={height - 2} textAnchor="middle" className="chart-date-label">
                {point.date.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
      {!points.length ? <div className="empty-chart">No tracked days yet.</div> : null}
    </div>
  );
}
