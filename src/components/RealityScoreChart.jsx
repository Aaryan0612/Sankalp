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

function formatLabel(date, rangeKey) {
  if (rangeKey === "7d") return date.slice(5);
  if (rangeKey === "30d") return date.slice(5);
  return `${date.slice(2, 4)}/${date.slice(5, 7)}`;
}

export default function RealityScoreChart({ points = [], rangeKey = "30d" }) {
  const width = 760;
  const height = 240;
  const padding = 20;
  const path = buildPath(points, width, height, padding);
  const labelStep = rangeKey === "7d" ? 1 : rangeKey === "30d" ? 3 : rangeKey === "6m" ? 5 : 8;

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
              {index % labelStep === 0 || index === points.length - 1 ? (
                <text x={x} y={height - 2} textAnchor="middle" className="chart-date-label">
                  {formatLabel(point.date, rangeKey)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {!points.length ? <div className="empty-chart">No tracked days yet.</div> : null}
    </div>
  );
}
