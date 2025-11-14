/**
 * Charts Component
 *
 * Componentes de gráficos usando SVG puro (sem dependências externas).
 * Inclui Line, Bar, Pie, Area e Donut charts com tooltips e responsividade.
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={[
 *     { label: 'Jan', value: 100 },
 *     { label: 'Fev', value: 150 }
 *   ]}
 *   height={300}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
}

/**
 * LineChart - Gráfico de linhas
 */
export interface LineChartProps extends ChartProps {
  smooth?: boolean;
  showDots?: boolean;
  fillArea?: boolean;
}

export function LineChart({
  data,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  colors = ['#5053c4'],
  smooth = false,
  showDots = true,
  fillArea = false,
  className,
}: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;
  const chartX = padding.left;
  const chartY = padding.top;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const valueRange = maxValue - minValue || 1;

  const stepX = chartWidth / (data.length - 1 || 1);

  // Calcula pontos
  const points = data.map((d, i) => ({
    x: chartX + i * stepX,
    y: chartY + chartHeight - ((d.value - minValue) / valueRange) * chartHeight,
    data: d,
    index: i,
  }));

  // Cria path
  const linePath = smooth
    ? createSmoothPath(points)
    : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const areaPath = fillArea
    ? `${linePath} L ${points[points.length - 1].x},${chartY + chartHeight} L ${chartX},${chartY + chartHeight} Z`
    : '';

  return (
    <div className={cn('w-full', className)}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${height}`}
        className="overflow-visible"
      >
        {/* Grid */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartY + chartHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={chartX}
                  y1={y}
                  x2={chartX + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Area */}
        {fillArea && areaPath && (
          <path
            d={areaPath}
            fill={colors[0]}
            fillOpacity="0.1"
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={colors[0]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          points.map((point) => (
            <circle
              key={point.index}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === point.index ? 6 : 4}
              fill={colors[0]}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(point.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}

        {/* X Axis labels */}
        {data.map((d, i) => {
          const x = chartX + i * stepX;
          return (
            <text
              key={i}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {d.label}
            </text>
          );
        })}

        {/* Y Axis labels */}
        {[0, 0.5, 1].map((ratio) => {
          const value = minValue + valueRange * (1 - ratio);
          const y = chartY + chartHeight * ratio;
          return (
            <text
              key={ratio}
              x={chartX - 10}
              y={y}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {Math.round(value)}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && (
        <div className="mt-2 p-2 bg-gray-900 text-white text-sm rounded shadow-lg">
          <div className="font-medium">{data[hoveredIndex].label}</div>
          <div>{data[hoveredIndex].value}</div>
        </div>
      )}
    </div>
  );
}

/**
 * BarChart - Gráfico de barras
 */
export interface BarChartProps extends ChartProps {
  horizontal?: boolean;
  stacked?: boolean;
}

export function BarChart({
  data,
  height = 300,
  showGrid = true,
  showTooltip = true,
  colors = ['#5053c4'],
  horizontal = false,
  className,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 600;
  const chartHeight = height - padding.top - padding.bottom;
  const chartX = padding.left;
  const chartY = padding.top;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = 0;
  const valueRange = maxValue - minValue || 1;

  if (horizontal) {
    // Horizontal bars
    const barHeight = chartHeight / data.length;
    const barPadding = barHeight * 0.2;
    const actualBarHeight = barHeight - barPadding;

    return (
      <div className={cn('w-full', className)}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${height}`}
        >
          {/* Grid */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const x = chartX + chartWidth * ratio;
                return (
                  <line
                    key={ratio}
                    x1={x}
                    y1={chartY}
                    x2={x}
                    y2={chartY + chartHeight}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          )}

          {/* Bars */}
          {data.map((d, i) => {
            const barWidth = (d.value / valueRange) * chartWidth;
            const y = chartY + i * barHeight + barPadding / 2;
            const color = d.color || colors[i % colors.length];

            return (
              <g key={i}>
                <rect
                  x={chartX}
                  y={y}
                  width={barWidth}
                  height={actualBarHeight}
                  fill={color}
                  opacity={hoveredIndex === i ? 1 : 0.8}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  rx="4"
                />
                <text
                  x={chartX - 10}
                  y={y + actualBarHeight / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-sm fill-gray-700"
                >
                  {d.label}
                </text>
                <text
                  x={chartX + barWidth + 5}
                  y={y + actualBarHeight / 2}
                  alignmentBaseline="middle"
                  className="text-xs fill-gray-600"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Vertical bars
  const barWidth = chartWidth / data.length;
  const barPadding = barWidth * 0.2;
  const actualBarWidth = barWidth - barPadding;

  return (
    <div className={cn('w-full', className)}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${height}`}
      >
        {/* Grid */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartY + chartHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={chartX}
                  y1={y}
                  x2={chartX + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / valueRange) * chartHeight;
          const x = chartX + i * barWidth + barPadding / 2;
          const y = chartY + chartHeight - barHeight;
          const color = d.color || colors[i % colors.length];

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={actualBarWidth}
                height={barHeight}
                fill={color}
                opacity={hoveredIndex === i ? 1 : 0.8}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                rx="4"
              />
              <text
                x={x + actualBarWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Y Axis labels */}
        {[0, 0.5, 1].map((ratio) => {
          const value = valueRange * (1 - ratio);
          const y = chartY + chartHeight * ratio;
          return (
            <text
              key={ratio}
              x={chartX - 10}
              y={y}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-600"
            >
              {Math.round(value)}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && (
        <div className="mt-2 p-2 bg-gray-900 text-white text-sm rounded shadow-lg inline-block">
          <div className="font-medium">{data[hoveredIndex].label}</div>
          <div>{data[hoveredIndex].value}</div>
        </div>
      )}
    </div>
  );
}

/**
 * PieChart - Gráfico de pizza
 */
export interface PieChartProps extends Omit<ChartProps, 'height'> {
  size?: number;
  innerRadius?: number; // Para donut chart
  showPercentage?: boolean;
}

export function PieChart({
  data,
  size = 300,
  showTooltip = true,
  showLegend = true,
  colors = ['#5053c4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  innerRadius = 0,
  showPercentage = true,
  className,
}: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = Math.min(size, size) / 2 - 20;

  let currentAngle = -90; // Começa no topo

  const slices = data.map((d, i) => {
    const percentage = (d.value / total) * 100;
    const sliceAngle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    currentAngle = endAngle;

    const color = d.color || colors[i % colors.length];

    return {
      data: d,
      percentage,
      startAngle,
      endAngle,
      color,
      index: i,
    };
  });

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice) => {
          const path = createArcPath(
            centerX,
            centerY,
            radius,
            innerRadius,
            slice.startAngle,
            slice.endAngle
          );

          // Posição do label (no meio do slice)
          const labelAngle = (slice.startAngle + slice.endAngle) / 2;
          const labelRadius = radius * (innerRadius > 0 ? 0.7 : 0.6);
          const labelX =
            centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
          const labelY =
            centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

          return (
            <g key={slice.index}>
              <path
                d={path}
                fill={slice.color}
                opacity={hoveredIndex === slice.index ? 1 : 0.9}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {showPercentage && slice.percentage >= 5 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-xs font-medium fill-white"
                  pointerEvents="none"
                >
                  {slice.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Center label para donut */}
        {innerRadius > 0 && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-lg font-bold fill-gray-900"
          >
            {total}
          </text>
        )}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-3 justify-center">
          {slices.map((slice) => (
            <div
              key={slice.index}
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-gray-700">
                {slice.data.label} ({slice.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && hoveredIndex !== null && (
        <div className="p-2 bg-gray-900 text-white text-sm rounded shadow-lg">
          <div className="font-medium">{data[hoveredIndex].label}</div>
          <div>{data[hoveredIndex].value}</div>
        </div>
      )}
    </div>
  );
}

/**
 * DonutChart - Gráfico de rosca (wrapper do PieChart)
 */
export function DonutChart(props: Omit<PieChartProps, 'innerRadius'>) {
  return <PieChart {...props} innerRadius={props.size ? props.size * 0.3 : 90} />;
}

/**
 * AreaChart - Gráfico de área (wrapper do LineChart)
 */
export function AreaChart(props: Omit<LineChartProps, 'fillArea'>) {
  return <LineChart {...props} fillArea />;
}

/**
 * Helper functions
 */

function createSmoothPath(
  points: Array<{ x: number; y: number }>
): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    const midX = (current.x + next.x) / 2;

    path += ` C ${midX},${current.y} ${midX},${next.y} ${next.x},${next.y}`;
  }

  return path;
}

function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  if (innerRadius === 0) {
    // Pie slice
    return `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
  } else {
    // Donut slice
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    return `M ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} L ${x3},${y3} A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${x4},${y4} Z`;
  }
}
