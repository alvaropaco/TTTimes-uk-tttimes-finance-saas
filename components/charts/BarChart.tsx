"use client"

import { useMemo } from "react"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { GridRows, GridColumns } from "@visx/grid"
import { scaleBand, scaleLinear } from "@visx/scale"
import { withTooltip, Tooltip, defaultStyles } from "@visx/tooltip"
import type { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip"
import { localPoint } from "@visx/event"
import { max } from "d3-array"

type DataPoint = {
  month: string
  cost: number
  requests: number
}

type TooltipData = DataPoint

const background = "#ffffff"
const accentColor = "#3b82f6"
const secondaryColor = "#10b981"

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
const getMonth = (d: DataPoint) => d.month
const getCost = (d: DataPoint) => d.cost
const getRequests = (d: DataPoint) => d.requests

export type BarProps = {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  data: DataPoint[]
}

const BarChartComponent = withTooltip<BarProps, TooltipData>(
  ({
    width = 800,
    height = 400,
    margin = { top: 20, right: 20, bottom: 40, left: 60 },
    data,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: BarProps & WithTooltipProvidedProps<TooltipData>) => {
    const xMax = width - margin.left - margin.right
    const yMax = height - margin.top - margin.bottom

    const xScale = useMemo(
      () =>
        scaleBand<string>({
          range: [0, xMax],
          round: true,
          domain: data.map(getMonth),
          padding: 0.4,
        }),
      [xMax, data],
    )

    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          range: [yMax, 0],
          round: true,
          domain: [0, max(data, getCost) || 0],
        }),
      [yMax, data],
    )

    if (width < 10) return null

    return (
      <div style={{ position: "relative" }}>
        <svg width={width} height={height}>
          <rect width={width} height={height} fill={background} rx={14} />
          <GridRows
            left={margin.left}
            scale={yScale}
            width={xMax}
            strokeDasharray="1,3"
            stroke="#e5e7eb"
            strokeOpacity={0.8}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={xScale}
            height={yMax}
            strokeDasharray="1,3"
            stroke="#e5e7eb"
            strokeOpacity={0.8}
            pointerEvents="none"
          />
          <Group top={margin.top} left={margin.left}>
            {data.map((d) => {
              const month = getMonth(d)
              const barWidth = xScale.bandwidth()
              const barHeight = yMax - (yScale(getCost(d)) ?? 0)
              const barX = xScale(month)
              const barY = yMax - barHeight
              return (
                <Bar
                  key={`bar-${month}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={accentColor}
                  rx={4}
                  onMouseLeave={() => {
                    hideTooltip()
                  }}
                  onMouseMove={(event) => {
                    const eventSvgCoords = localPoint(event)
                    const left = (barX ?? 0) + barWidth / 2
                    showTooltip({
                      tooltipData: d,
                      tooltipTop: eventSvgCoords?.y,
                      tooltipLeft: left,
                    })
                  }}
                />
              )
            })}
          </Group>

          {/* X-axis labels */}
          <Group top={height - margin.bottom + 10} left={margin.left}>
            {data.map((d) => {
              const month = getMonth(d)
              const barWidth = xScale.bandwidth()
              const barX = xScale(month)
              return (
                <text
                  key={`x-label-${month}`}
                  x={(barX ?? 0) + barWidth / 2}
                  y={0}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#6b7280"
                >
                  {month}
                </text>
              )
            })}
          </Group>

          {/* Y-axis labels */}
          <Group top={margin.top} left={margin.left - 10}>
            {yScale.ticks(5).map((tick) => (
              <text
                key={`y-label-${tick}`}
                x={0}
                y={yScale(tick)}
                textAnchor="end"
                fontSize={12}
                fill="#6b7280"
                dy="0.33em"
              >
                ${tick}
              </text>
            ))}
          </Group>
        </svg>
        {tooltipData && (
          <div>
            <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
              <div className="font-semibold">{getMonth(tooltipData)}</div>
              <div className="text-blue-600">Cost: ${getCost(tooltipData).toFixed(2)}</div>
              <div className="text-green-600">Requests: {getRequests(tooltipData).toLocaleString()}</div>
            </Tooltip>
          </div>
        )}
      </div>
    )
  },
)

export default BarChartComponent

export function BarChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <BarChartComponent data={data} width={800} height={400} margin={{ top: 20, right: 20, bottom: 40, left: 60 }} />
      </svg>
    </div>
  )
}
