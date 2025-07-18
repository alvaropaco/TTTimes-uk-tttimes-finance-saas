"use client"

import type React from "react"

import { useMemo } from "react"
import { AreaClosed, Line, Bar } from "@visx/shape"
import { curveMonotoneX } from "@visx/curve"
import { GridRows, GridColumns } from "@visx/grid"
import { scaleTime, scaleLinear } from "@visx/scale"
import { withTooltip, defaultStyles } from "@visx/tooltip"
import type { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip"
import { localPoint } from "@visx/event"
import { LinearGradient } from "@visx/gradient"
import { max, extent, bisector } from "d3-array"
import { timeFormat } from "d3-time-format"

const formatDate = timeFormat("%b %d, %Y")
const formatTime = timeFormat("%I:%M %p")
const bisectDate = bisector<DataPoint, Date>((d) => new Date(d.date)).left

type DataPoint = {
  date: string
  requests: number
}

type TooltipData = DataPoint

const background = "#ffffff"
const background2 = "#f8fafc"
const accentColor = "#3b82f6"
const accentColorDark = "#1d4ed8"

// tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  color: "#374151",
}

// accessors
const getDate = (d: DataPoint) => new Date(d.date)
const getRequests = (d: DataPoint) => d.requests

export type AreaProps = {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  data: DataPoint[]
}

const AreaChartComponent = withTooltip<AreaProps, TooltipData>(
  ({
    width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 40, left: 40 },
    data,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, data],
    )

    const requestsScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(data, getRequests) || 0) + 20],
          nice: true,
        }),
      [margin.top, innerHeight, data],
    )

    const handleTooltip = useMemo(
      () => (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 }
        const x0 = dateScale.invert(x)
        const index = bisectDate(data, x0, 1)
        const d0 = data[index - 1]
        const d1 = data[index]
        let d = d0
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: requestsScale(getRequests(d)),
        })
      },
      [showTooltip, requestsScale, dateScale, data],
    )

    if (width < 10) return null

    return (
      <g>
        <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
        <GridRows
          left={margin.left}
          scale={requestsScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke="#e5e7eb"
          strokeOpacity={0.8}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke="#e5e7eb"
          strokeOpacity={0.8}
          pointerEvents="none"
        />
        <AreaClosed<DataPoint>
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => requestsScale(getRequests(d)) ?? 0}
          yScale={requestsScale}
          strokeWidth={2}
          stroke={accentColor}
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColorDark}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColorDark}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </g>
    )
  },
)

export default AreaChartComponent

export function AreaChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <AreaChartComponent
          data={data}
          width={800}
          height={400}
          margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
        />
      </svg>
    </div>
  )
}
