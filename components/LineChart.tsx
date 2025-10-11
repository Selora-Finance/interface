'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
  Label,
} from 'recharts';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';

// Custom label component for current price
const CurrentPriceLabel = ({ viewBox, value }: any) => {
  const { x, y, width } = viewBox;
  const labelX = x + width - 120; // Position near the right edge

  return (
    <g>
      <rect x={labelX} y={y - 15} width="110" height="25" fill="#d0de27" rx="4" />
      <text x={labelX + 55} y={y} textAnchor="middle" fill="#000" fontSize="11" fontWeight="600">
        Curr: {value}
      </text>
    </g>
  );
};

interface DataPoint {
  x: number;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  rangeStart?: number;
  rangeEnd?: number;
  currentValue?: number;
  onRangeChange?: (start: number, end: number) => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  rangeColor?: string;
  showRange?: boolean;
  rangeOrientation?: 'horizontal' | 'vertical';
  showCurrentLabel?: boolean;
  currentPrice?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  rangeStart,
  rangeEnd,
  currentValue,
  onRangeChange,
  xAxisLabel,
  yAxisLabel,
  lineColor = '#ffffff',
  rangeColor = '#d0de27',
  showRange = true,
  rangeOrientation = 'vertical',
  showCurrentLabel = false,
  currentPrice,
}) => {
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.x - b.x);
  }, [data]);

  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel !== undefined) {
      setDragStart(e.activeLabel);
    }
  }, []);

  const handleMouseUp = useCallback(
    (e: any) => {
      if (dragStart !== null && e && e.activeLabel !== undefined) {
        const start = Math.min(dragStart, e.activeLabel);
        const end = Math.max(dragStart, e.activeLabel);
        onRangeChange?.(start, end);
        setDragStart(null);
      }
    },
    [dragStart, onRangeChange],
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={sortedData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <defs>
          <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={rangeColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={rangeColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="x"
          type="number"
          domain={['dataMin', 'dataMax']}
          stroke={isDarkMode ? '#333333' : '#d9d9d9'}
          tick={{ fill: isDarkMode ? '#666666' : '#999999', fontSize: 10 }}
          tickFormatter={value => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
          label={
            xAxisLabel
              ? { value: xAxisLabel, position: 'bottom', offset: 0, fill: isDarkMode ? '#999999' : '#666666' }
              : undefined
          }
        />
        <YAxis
          dataKey="y"
          stroke={isDarkMode ? '#333333' : '#d9d9d9'}
          tick={{ fill: isDarkMode ? '#666666' : '#999999', fontSize: 10 }}
          tickFormatter={value => {
            if (value < 0.001) {
              return value.toFixed(8);
            } else if (value < 1) {
              return value.toFixed(4);
            } else {
              return value.toLocaleString();
            }
          }}
          width={70}
          label={
            yAxisLabel
              ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: isDarkMode ? '#999999' : '#666666' }
              : undefined
          }
        />

        {/* Range area and boundaries */}
        {rangeOrientation === 'horizontal' ? (
          <>
            {/* Horizontal range area */}
            {showRange && rangeStart !== undefined && rangeEnd !== undefined && (
              <ReferenceArea y1={rangeStart} y2={rangeEnd} fill="url(#rangeGradient)" strokeOpacity={0.3} />
            )}

            {/* Horizontal range boundary lines */}
            {showRange && rangeStart !== undefined && (
              <ReferenceLine
                y={rangeStart}
                stroke={rangeColor}
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ value: 'Min', position: 'right', fill: rangeColor, fontSize: 10 }}
              />
            )}
            {showRange && rangeEnd !== undefined && (
              <ReferenceLine
                y={rangeEnd}
                stroke={rangeColor}
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ value: 'Max', position: 'right', fill: rangeColor, fontSize: 10 }}
              />
            )}

            {/* Current value line (horizontal) */}
            {currentValue !== undefined && (
              <ReferenceLine y={currentValue} stroke={rangeColor} strokeWidth={2}>
                {showCurrentLabel && currentPrice && (
                  <Label content={<CurrentPriceLabel value={currentPrice.toFixed(6)} />} position="insideTopRight" />
                )}
              </ReferenceLine>
            )}
          </>
        ) : (
          <>
            {/* Vertical range area */}
            {showRange && rangeStart !== undefined && rangeEnd !== undefined && (
              <ReferenceArea x1={rangeStart} x2={rangeEnd} fill="url(#rangeGradient)" strokeOpacity={0.3} />
            )}

            {/* Vertical range boundary lines */}
            {showRange && rangeStart !== undefined && (
              <ReferenceLine x={rangeStart} stroke={rangeColor} strokeWidth={2} strokeDasharray="3 3" />
            )}
            {showRange && rangeEnd !== undefined && (
              <ReferenceLine x={rangeEnd} stroke={rangeColor} strokeWidth={2} strokeDasharray="3 3" />
            )}

            {/* Current value line (vertical) */}
            {currentValue !== undefined && (
              <ReferenceLine x={currentValue} stroke={rangeColor} strokeWidth={2} strokeDasharray="5 5" />
            )}
          </>
        )}

        {/* Main line */}
        <Line type="monotone" dataKey="y" stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={true} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
