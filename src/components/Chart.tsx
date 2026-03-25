import * as colors from '@radix-ui/colors';
import { useThemeContext } from '@radix-ui/themes';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

import { ALT_CHART_COLORS } from '@/constants';

// TODO: add skeleton if series is null, allow nullable series
// TODO: handle resize, right now graph width stays constant
export const Chart = ({
  series,
}: {
  series: {
    name: string;
    data: { x: string; y: number }[];
  }[];
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef<echarts.EChartsType | null>(null);
  const theme = useThemeContext();

  useEffect(() => {
    const primaryColor = colors[theme.accentColor][`${theme.accentColor}9`];

    chartInstanceRef.current = echarts.init(chartRef.current);
    chartInstanceRef.current.setOption({
      color: [primaryColor, ...ALT_CHART_COLORS],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        show: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: ['10%', '10%'],
        axisLabel: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            width: 2,
            color: 'rgba(255,255,255, 0.1)',
          },
        },
      },
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line',
        smooth: 0.8,
        symbol: 'none',
        lineStyle: { width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1.2,
            colorStops: [
              {
                offset: 0,
                color: index === 0 ? primaryColor : ALT_CHART_COLORS[index - 1],
              },
              {
                offset: 1,
                color: theme.appearance === 'dark' ? 'transparent' : '#ffffff',
              },
            ],
          },
        },
        data: s.data.map((point) => [point.x, point.y]),
      })),
    });

    // Cleanup function to dispose of the chart instance
    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, [theme, chartRef, series]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};
