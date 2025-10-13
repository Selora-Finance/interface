'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Label,
} from 'recharts';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/client/utils';

// Custom label component for current price
const CurrentPriceLabel = ({ viewBox, value, color = '#eab308' }: any) => {
  const { x, y, width } = viewBox;
  const labelX = x + width - 120; // Position near the right edge

  return (
    <g>
      <rect x={labelX} y={y - 15} width="110" height="25" fill={color} rx="4" />
      <text x={labelX + 55} y={y} textAnchor="middle" fill="#000" fontSize="11" fontWeight="600">
        Curr: {value}
      </text>
    </g>
  );
};

// Custom handle component for draggable range
const RangeHandle = ({ viewBox, color, label, isDragging, onMouseDown }: any) => {
  const { x, y, width } = viewBox;
  const handleX = x + width / 2; // Position in the center of the chart
  const panWidth = 60; // Total width of the horizontal bar
  const panHalfWidth = panWidth / 2;
  const panHeight = 8; // Height of the flat handle
  const silverColor = isDragging ? '#999999' : '#C0C0C0'; // Silver color
  const hitAreaHeight = 20; // Larger hit area for easier dragging

  return (
    <g style={{ cursor: 'ns-resize' }}>
      {/* Invisible larger hit area for easier mouse interaction */}
      <rect
        x={handleX - panHalfWidth}
        y={y - hitAreaHeight / 2}
        width={panWidth}
        height={hitAreaHeight}
        fill="transparent"
        style={{ cursor: 'ns-resize', pointerEvents: 'all' }}
        onMouseDown={onMouseDown}
      />

      {/* Flat horizontal handle bar */}
      <rect
        x={handleX - panHalfWidth}
        y={y - panHeight / 2}
        width={panWidth}
        height={panHeight}
        fill={silverColor}
        rx="4"
        ry="4"
        opacity={isDragging ? 1 : 0.9}
        style={{ pointerEvents: 'none' }}
      />

      {/* Grip lines (3 vertical lines for texture) - centered */}
      <line
        x1={handleX - 12}
        y1={y - 3}
        x2={handleX - 12}
        y2={y + 3}
        stroke={isDragging ? '#666666' : '#808080'}
        strokeWidth="1.5"
        opacity={0.8}
        style={{ pointerEvents: 'none' }}
      />
      <line
        x1={handleX}
        y1={y - 3}
        x2={handleX}
        y2={y + 3}
        stroke={isDragging ? '#666666' : '#808080'}
        strokeWidth="1.5"
        opacity={0.8}
        style={{ pointerEvents: 'none' }}
      />
      <line
        x1={handleX + 12}
        y1={y - 3}
        x2={handleX + 12}
        y2={y + 3}
        stroke={isDragging ? '#666666' : '#808080'}
        strokeWidth="1.5"
        opacity={0.8}
        style={{ pointerEvents: 'none' }}
      />
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
  currentValueColor?: string;
  showRange?: boolean;
  rangeOrientation?: 'horizontal' | 'vertical';
  showCurrentLabel?: boolean;
  currentPrice?: number;
  variant?: 'primary' | 'neutral';
}

// Chart container variants
const chartContainerVariants = cva('w-full rounded-lg p-4', {
  variants: {
    variant: {
      primary: 'bg-white',
      neutral: 'bg-[#1a1515]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

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
  currentValueColor = '#eab308',
  showRange = true,
  rangeOrientation = 'vertical',
  showCurrentLabel = false,
  currentPrice,
  variant = 'primary',
}) => {
  const isDarkMode = variant === 'neutral';
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const [tempRange, setTempRange] = useState<{ min?: number; max?: number }>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragStartRef = React.useRef<{ mouseY: number; value: number } | null>(null);

  // Viewport state for pan/zoom (X and Y)
  const [viewportStart, setViewportStart] = useState(0);
  const [viewportEnd, setViewportEnd] = useState(100);
  const [viewportMinY, setViewportMinY] = useState<number | null>(null);
  const [viewportMaxY, setViewportMaxY] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panDirection, setPanDirection] = useState<'horizontal' | 'vertical' | 'both' | null>(null);
  const panStartRef = React.useRef<{
    x: number;
    y: number;
    startIdx: number;
    endIdx: number;
    minY: number;
    maxY: number;
  } | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.x - b.x);
  }, [data]);

  // Calculate initial viewport to show recent data on mount
  React.useEffect(() => {
    if (sortedData.length === 0) return;

    // Show most recent 100 points by default (or all data if less than 100)
    const defaultPoints = Math.min(100, sortedData.length);
    setViewportStart(Math.max(0, sortedData.length - defaultPoints));
    setViewportEnd(sortedData.length - 1);
  }, [sortedData.length]);

  // Get visible data (filtered by X viewport only, Y filtering is done via domain)
  const visibleData = useMemo(() => {
    return sortedData.slice(viewportStart, viewportEnd + 1);
  }, [sortedData, viewportStart, viewportEnd]);

  const displayRangeStart = tempRange.min !== undefined ? tempRange.min : rangeStart;
  const displayRangeEnd = tempRange.max !== undefined ? tempRange.max : rangeEnd;

  // Get min and max Y values from full dataset for scaling
  const yExtent = useMemo(() => {
    const yValues = sortedData.map(d => d.y);
    return {
      min: Math.min(...yValues),
      max: Math.max(...yValues),
    };
  }, [sortedData]);

  // Get current viewport Y extent (what's actually visible)
  const currentYExtent = useMemo(() => {
    let minY: number;
    let maxY: number;

    if (viewportMinY !== null && viewportMaxY !== null) {
      // Use panned viewport
      minY = viewportMinY;
      maxY = viewportMaxY;
    } else {
      // If no Y viewport set, use visible data's Y range
      const visibleYValues = visibleData.map(d => d.y);
      if (visibleYValues.length === 0) {
        return yExtent;
      }
      minY = Math.min(...visibleYValues);
      maxY = Math.max(...visibleYValues);
    }

    // Always include the range handles in the viewport if they exist
    // This ensures ranges are always visible even if outside current viewport
    if (displayRangeStart !== undefined) {
      minY = Math.min(minY, displayRangeStart);
    }
    if (displayRangeEnd !== undefined) {
      maxY = Math.max(maxY, displayRangeEnd);
    }

    // Add buffer around the range for better visibility
    const range = maxY - minY;
    const buffer = range > 0 ? range * 0.15 : Math.abs(maxY) * 0.1; // 15% buffer or 10% of value if range is 0

    return {
      min: Math.max(yExtent.min * 0.5, minY - buffer),
      max: Math.min(yExtent.max * 1.5, maxY + buffer),
    };
  }, [viewportMinY, viewportMaxY, visibleData, yExtent, displayRangeStart, displayRangeEnd]);

  // Handle mouse/touch events for dragging
  const handleMouseDown = useCallback(
    (type: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Store the initial mouse position and value
      const initialValue = type === 'min' ? displayRangeStart : displayRangeEnd;
      if (initialValue !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        dragStartRef.current = {
          mouseY: e.clientY - rect.top,
          value: initialValue,
        };
      }

      if (type === 'min') {
        setIsDraggingMin(true);
      } else {
        setIsDraggingMax(true);
      }
    },
    [displayRangeStart, displayRangeEnd],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current || (!isDraggingMin && !isDraggingMax) || !dragStartRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current.getBoundingClientRect();
      const chartHeight = rect.height - 40; // Account for margins
      const currentMouseY = e.clientY - rect.top;

      // Calculate the delta from the initial click position
      const deltaY = dragStartRef.current.mouseY - currentMouseY;

      // Convert pixel delta to value delta (Y axis is inverted in charts)
      // Use currentYExtent because that's what's displayed on the chart
      const valueRange = currentYExtent.max - currentYExtent.min;
      const pixelToValueRatio = valueRange / chartHeight;
      const valueDelta = deltaY * pixelToValueRatio;

      // Apply delta to initial value to maintain cursor offset
      const newValue = dragStartRef.current.value + valueDelta;

      if (isDraggingMin) {
        // Allow min to go up to just below max (with small buffer)
        const maxAllowed = displayRangeEnd ? displayRangeEnd * 0.99 : yExtent.max;
        const finalValue = Math.max(yExtent.min * 0.5, Math.min(newValue, maxAllowed));
        setTempRange(prev => ({ ...prev, min: finalValue }));
      } else if (isDraggingMax) {
        // Allow max to go down to just above min (with small buffer)
        const minAllowed = displayRangeStart ? displayRangeStart * 1.01 : yExtent.min;
        const finalValue = Math.min(yExtent.max * 1.5, Math.max(newValue, minAllowed));
        setTempRange(prev => ({ ...prev, max: finalValue }));
      }
    },
    [isDraggingMin, isDraggingMax, yExtent, currentYExtent, displayRangeStart, displayRangeEnd],
  );

  const handleMouseUp = useCallback(
    (e?: MouseEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (isDraggingMin || isDraggingMax) {
        const finalMin = tempRange.min !== undefined ? tempRange.min : rangeStart;
        const finalMax = tempRange.max !== undefined ? tempRange.max : rangeEnd;

        if (finalMin && finalMax && onRangeChange) {
          onRangeChange(finalMin, finalMax);
        }

        setTempRange({});
        dragStartRef.current = null;
      }
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    },
    [isDraggingMin, isDraggingMax, tempRange, rangeStart, rangeEnd, onRangeChange],
  );

  // Auto-adjust viewport when range values change to ensure they're visible
  React.useEffect(() => {
    if (displayRangeStart === undefined || displayRangeEnd === undefined) return;

    // Check if ranges are outside current viewport (when panned)
    if (viewportMinY !== null && viewportMaxY !== null) {
      const rangeOutsideViewport = displayRangeStart < viewportMinY || displayRangeEnd > viewportMaxY;

      if (rangeOutsideViewport) {
        // Expand viewport to include the range with buffer
        const newMin = Math.min(viewportMinY, displayRangeStart);
        const newMax = Math.max(viewportMaxY, displayRangeEnd);
        const range = newMax - newMin;
        const buffer = range * 0.15;

        setViewportMinY(Math.max(yExtent.min * 0.5, newMin - buffer));
        setViewportMaxY(Math.min(yExtent.max * 1.5, newMax + buffer));
      }
    }
  }, [displayRangeStart, displayRangeEnd, viewportMinY, viewportMaxY, yExtent]);

  // Pan handlers for dragging the chart
  const handlePanStart = useCallback(
    (e: React.MouseEvent) => {
      // Only pan if not dragging handles
      if (isDraggingMin || isDraggingMax) return;

      e.preventDefault();
      setIsPanning(true);

      const currentMinY = viewportMinY ?? currentYExtent.min;
      const currentMaxY = viewportMaxY ?? currentYExtent.max;

      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startIdx: viewportStart,
        endIdx: viewportEnd,
        minY: currentMinY,
        maxY: currentMaxY,
      };
    },
    [isDraggingMin, isDraggingMax, viewportStart, viewportEnd, viewportMinY, viewportMaxY, currentYExtent],
  );

  const handlePanMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning || !panStartRef.current || !containerRef.current) return;

      e.preventDefault();

      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      const viewportWidth = panStartRef.current.endIdx - panStartRef.current.startIdx;

      // Determine pan direction based on movement
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > 5 || absDeltaY > 5) {
        if (absDeltaX > absDeltaY * 2) {
          setPanDirection('horizontal');
        } else if (absDeltaY > absDeltaX * 2) {
          setPanDirection('vertical');
        } else {
          setPanDirection('both');
        }
      }

      // Horizontal panning (X-axis / time)
      const shiftAmount = Math.round(-deltaX / 2);

      if (shiftAmount !== 0) {
        let newStart = panStartRef.current.startIdx + shiftAmount;
        let newEnd = panStartRef.current.endIdx + shiftAmount;

        // Clamp to data bounds
        if (newStart < 0) {
          newStart = 0;
          newEnd = viewportWidth;
        } else if (newEnd >= sortedData.length) {
          newEnd = sortedData.length - 1;
          newStart = Math.max(0, newEnd - viewportWidth);
        }

        setViewportStart(newStart);
        setViewportEnd(newEnd);
      }

      // Vertical panning (Y-axis / price)
      const rect = containerRef.current.getBoundingClientRect();
      const chartHeight = rect.height - 40;
      const yRange = panStartRef.current.maxY - panStartRef.current.minY;

      // Convert pixel movement to value movement
      const yValueDelta = (deltaY / chartHeight) * yRange;

      if (Math.abs(yValueDelta) > 0) {
        let newMinY = panStartRef.current.minY + yValueDelta;
        let newMaxY = panStartRef.current.maxY + yValueDelta;

        // Check if ranges are close to viewport and expand to include them
        // This brings hidden ranges into view when panning the chart
        const viewportRange = newMaxY - newMinY;
        const proximityThreshold = viewportRange * 0.3; // 30% of viewport

        if (displayRangeStart !== undefined || displayRangeEnd !== undefined) {
          let shouldIncludeRanges = false;

          // Check if we're panning towards hidden ranges
          if (displayRangeStart !== undefined && displayRangeStart < newMinY) {
            const distanceToRange = newMinY - displayRangeStart;
            if (distanceToRange < proximityThreshold) {
              shouldIncludeRanges = true;
            }
          }

          if (displayRangeEnd !== undefined && displayRangeEnd > newMaxY) {
            const distanceToRange = displayRangeEnd - newMaxY;
            if (distanceToRange < proximityThreshold) {
              shouldIncludeRanges = true;
            }
          }

          // Expand viewport to include ranges with buffer
          if (shouldIncludeRanges) {
            if (displayRangeStart !== undefined) {
              newMinY = Math.min(newMinY, displayRangeStart);
            }
            if (displayRangeEnd !== undefined) {
              newMaxY = Math.max(newMaxY, displayRangeEnd);
            }

            const range = newMaxY - newMinY;
            const buffer = range * 0.15;
            newMinY = newMinY - buffer;
            newMaxY = newMaxY + buffer;
          }
        }

        // Clamp to extended data bounds (allow 50% beyond data extent)
        const extendedMin = yExtent.min * 0.5;
        const extendedMax = yExtent.max * 1.5;

        if (newMinY < extendedMin) {
          const diff = extendedMin - newMinY;
          newMinY = extendedMin;
          newMaxY += diff;
        } else if (newMaxY > extendedMax) {
          const diff = newMaxY - extendedMax;
          newMaxY = extendedMax;
          newMinY -= diff;
        }

        // Ensure we don't go below min or above max
        newMinY = Math.max(extendedMin, newMinY);
        newMaxY = Math.min(extendedMax, newMaxY);

        setViewportMinY(newMinY);
        setViewportMaxY(newMaxY);
      }
    },
    [isPanning, sortedData.length, yExtent, displayRangeStart, displayRangeEnd],
  );

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
    setPanDirection(null);
    panStartRef.current = null;
  }, []);

  // Add/remove event listeners for range dragging
  React.useEffect(() => {
    if (isDraggingMin || isDraggingMax) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingMin, isDraggingMax, handleMouseMove, handleMouseUp]);

  // Add/remove event listeners for panning
  React.useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('mouseup', handlePanEnd);

      return () => {
        window.removeEventListener('mousemove', handlePanMove);
        window.removeEventListener('mouseup', handlePanEnd);
      };
    }
  }, [isPanning, handlePanMove, handlePanEnd]);

  // Check if there's more data to scroll
  const hasMoreLeft = viewportStart > 0;
  const hasMoreRight = viewportEnd < sortedData.length - 1;
  const hasMoreAbove = currentYExtent.max < yExtent.max - 0.0001;
  const hasMoreBelow = currentYExtent.min > yExtent.min + 0.0001;

  // Determine cursor based on pan direction
  const getPanningCursor = () => {
    if (!isPanning) return undefined;
    if (panDirection === 'horizontal') return 'ew-resize';
    if (panDirection === 'vertical') return 'ns-resize';
    return 'grabbing';
  };

  return (
    <div
      ref={containerRef}
      className={cn(chartContainerVariants({ variant }), 'relative')}
      style={{
        height: 300,
      }}
    >
      {/* Drag overlay - captures all mouse events during drag */}
      {(isDraggingMin || isDraggingMax) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: 'ns-resize',
            userSelect: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.01)', // Very subtle overlay to show it's active
          }}
          onMouseMove={e => {
            e.preventDefault();
            e.stopPropagation();
            const nativeEvent = e.nativeEvent as MouseEvent;
            handleMouseMove(nativeEvent);
          }}
          onMouseUp={e => {
            e.preventDefault();
            e.stopPropagation();
            handleMouseUp();
          }}
          onMouseLeave={e => {
            // Continue tracking even if mouse leaves window
            e.preventDefault();
          }}
        />
      )}
      {/* Data range indicator */}
      {(hasMoreLeft || hasMoreRight || hasMoreAbove || hasMoreBelow) && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 16,
            padding: '4px 8px',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            fontSize: '10px',
            color: isDarkMode ? '#999' : '#666',
            pointerEvents: 'none',
            zIndex: 10,
            fontFamily: 'monospace',
          }}
        >
          {viewportStart + 1}-{viewportEnd + 1} of {sortedData.length}
          {(hasMoreAbove || hasMoreBelow) && (
            <span style={{ marginLeft: 8, opacity: 0.7 }}>
              | Y: {currentYExtent.min.toFixed(8)}-{currentYExtent.max.toFixed(8)}
            </span>
          )}
        </div>
      )}

      {/* Scroll indicators */}
      {hasMoreLeft && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: isDarkMode ? 'rgba(208, 222, 39, 0.2)' : 'rgba(255, 165, 0, 0.2)',
            border: `2px solid ${isDarkMode ? '#d0de27' : '#ff6600'}`,
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke={isDarkMode ? '#d0de27' : '#ff6600'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {hasMoreRight && (
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: isDarkMode ? 'rgba(208, 222, 39, 0.2)' : 'rgba(255, 165, 0, 0.2)',
            border: `2px solid ${isDarkMode ? '#d0de27' : '#ff6600'}`,
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke={isDarkMode ? '#d0de27' : '#ff6600'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {hasMoreAbove && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 16,
            transform: 'translateX(-50%)',
            background: isDarkMode ? 'rgba(208, 222, 39, 0.2)' : 'rgba(255, 165, 0, 0.2)',
            border: `2px solid ${isDarkMode ? '#d0de27' : '#ff6600'}`,
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke={isDarkMode ? '#d0de27' : '#ff6600'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {hasMoreBelow && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 16,
            transform: 'translateX(-50%)',
            background: isDarkMode ? 'rgba(208, 222, 39, 0.2)' : 'rgba(255, 165, 0, 0.2)',
            border: `2px solid ${isDarkMode ? '#d0de27' : '#ff6600'}`,
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke={isDarkMode ? '#d0de27' : '#ff6600'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {/* Chart wrapper with pan handler */}
      <div
        className={cn({
          'select-none': isPanning,
        })}
        style={{
          position: 'relative',
          width: '100%',
          height: 300,
          cursor: isPanning
            ? 'grabbing'
            : getPanningCursor() || (hasMoreLeft || hasMoreRight || hasMoreAbove || hasMoreBelow ? 'grab' : 'default'),
        }}
        onMouseDown={e => {
          // Only start panning if clicking on the chart background, not on interactive elements like handles
          const target = e.target as HTMLElement;
          const targetTag = target.tagName?.toLowerCase();

          // Allow panning only on the chart surface (background) or wrapper
          const isChartSurface =
            target.classList?.contains('recharts-surface') || target.classList?.contains('recharts-wrapper');

          // Prevent panning on interactive SVG elements (handles, lines, etc)
          const isInteractiveElement =
            targetTag === 'g' ||
            (targetTag === 'rect' && !isChartSurface) ||
            targetTag === 'line' ||
            targetTag === 'text' ||
            target.closest('g[class*="recharts-label"]');

          if (isInteractiveElement) {
            return; // Don't pan, let the element handle its own interactions
          }

          handlePanStart(e);
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={visibleData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={rangeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={rangeColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={isDarkMode ? '#333333' : '#e5e7eb'}
              strokeDasharray="3 3"
              strokeOpacity={isDarkMode ? 0.6 : 0.8}
              vertical={true}
              horizontal={true}
            />
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
              domain={[currentYExtent.min, currentYExtent.max]}
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
                {showRange && displayRangeStart !== undefined && displayRangeEnd !== undefined && (
                  <ReferenceArea
                    y1={displayRangeStart}
                    y2={displayRangeEnd}
                    fill="url(#rangeGradient)"
                    strokeOpacity={0.3}
                  />
                )}

                {/* Horizontal range boundary lines with handles */}
                {showRange && displayRangeStart !== undefined && (
                  <ReferenceLine y={displayRangeStart} stroke={rangeColor} strokeWidth={2} strokeDasharray="3 3">
                    <Label
                      content={
                        <RangeHandle
                          color={rangeColor}
                          label="Min"
                          isDragging={isDraggingMin}
                          onMouseDown={handleMouseDown('min')}
                        />
                      }
                      position="right"
                    />
                  </ReferenceLine>
                )}
                {showRange && displayRangeEnd !== undefined && (
                  <ReferenceLine y={displayRangeEnd} stroke={rangeColor} strokeWidth={2} strokeDasharray="3 3">
                    <Label
                      content={
                        <RangeHandle
                          color={rangeColor}
                          label="Max"
                          isDragging={isDraggingMax}
                          onMouseDown={handleMouseDown('max')}
                        />
                      }
                      position="right"
                    />
                  </ReferenceLine>
                )}

                {/* Current value line (horizontal) */}
                {currentValue !== undefined && (
                  <ReferenceLine y={currentValue} stroke={currentValueColor} strokeWidth={2}>
                    {showCurrentLabel && currentPrice && (
                      <Label
                        content={<CurrentPriceLabel value={currentPrice.toFixed(6)} color={currentValueColor} />}
                        position="insideTopRight"
                      />
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
                  <ReferenceLine x={currentValue} stroke={currentValueColor} strokeWidth={2} strokeDasharray="5 5" />
                )}
              </>
            )}

            {/* Main line */}
            <Line type="monotone" dataKey="y" stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={true} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
