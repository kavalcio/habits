import * as colors from '@radix-ui/colors';
import { useThemeContext } from '@radix-ui/themes';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

// Accessing the alpha variant directly

export const Chart = () => {
  // console.log(echarts);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef<echarts.EChartsType | null>(null);
  const theme = useThemeContext();

  useEffect(() => {
    // initialize the chart instance
    chartInstanceRef.current = echarts.init(chartRef.current);

    // const accent = theme.accentColor;
    // const color1 = colors[accent][`${accent}9`];
    // const color2 = colors[accent][`${accent}9`];
    const color = colors[theme.accentColor][`${theme.accentColor}9`];

    // Apply the options to the chart
    chartInstanceRef.current.setOption({
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        // boundaryGap: [0, '30%'],
        boundaryGap: true,
        show: false,
      },
      yAxis: {
        type: 'value',
        // boundaryGap: false,
        // boundaryGap: [0, '30%'],
        boundaryGap: ['20%', '20%'],
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
      series: [
        {
          type: 'line',
          smooth: 0.6,
          symbol: 'none',
          lineStyle: {
            // color: '#5470C6',
            // color: theme.accentColor,
            // color: 'var(--accent-8)',
            // color: colors[theme.accentColor][`${theme.accentColor}6`],
            color,
            width: 5,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                // { offset: 0, color: '#6f93ff' },
                { offset: 0, color },
                {
                  offset: 1,
                  color:
                    theme.appearance === 'dark' ? 'transparent' : '#ffffff',
                },
              ],
            },
          },
          data: [
            ['2019-10-10', 200],
            ['2019-10-11', 560],
            ['2019-10-12', 750],
            ['2019-10-13', 580],
            ['2019-10-14', 250],
            ['2019-10-15', 300],
            ['2019-10-16', 450],
            ['2019-10-17', 300],
            ['2019-10-18', 100],
          ],
        },
      ],
    });

    // Cleanup function to dispose of the chart instance
    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, [theme, chartRef]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};
