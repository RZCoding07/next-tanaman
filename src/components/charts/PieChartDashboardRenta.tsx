import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const builderJson = {
      all: 10887,
      charts: {
        hitam: 3237,
        emas: 2164,
        hijau: 7561,
        kuning: 7778,
        merah: 7355
      },
      ie: 9743
    };

    const downloadJson = {
      'hitam': 23546,
      'emas': 17365,
      'hijau': 4079,
      'kuning': 6929,
      'merah': 14890,
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 100;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.font = '20px Microsoft Yahei';
    ctx.translate(50, 50);
    ctx.rotate(-Math.PI / 4);

    const colors = [
      "#1a1a1a",
      "#FAC858",
      "#8EC872",
      "#ffff66",
      "#EE6667"
    ];

    const option = {
      backgroundColor: {
        type: 'pattern',
        image: canvas,
        repeat: 'repeat'
      },
      tooltip: {},
      title: [
        {
          text: 'Renta',
          subtext: 'Total ' + builderJson.all,
          left: '25%',
          textAlign: 'center'
        },
        {
          text: 'Renta',
          subtext: 'Total ' + Object.keys(downloadJson).reduce(function (all, key) {
            return all + downloadJson[key];
          }, 0),
          left: '75%',
          textAlign: 'center'
        }
      ],
      grid: [
        {
          top: 50,
          width: '50%',
          bottom: '0%',
          left: 10,
          containLabel: true
        }
      ],
      xAxis: [
        {
          type: 'value',
          max: builderJson.all,
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: Object.keys(builderJson.charts),
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          type: 'bar',
          stack: 'chart',
          z: 3,
          label: {
            position: 'right',
            show: true
          },
          data: Object.keys(builderJson.charts).map(function (key, index) {
            return {
              name: key,
              value: builderJson.charts[key],
              itemStyle: {
                color: colors[index % colors.length]
              }
            };
          })
        },
        {
          type: 'bar',
          stack: 'chart',
          silent: true,
          itemStyle: {
            color: '#eee'
          },
          data: Object.keys(builderJson.charts).map(function (key) {
            return {
              name: key,
              value: builderJson.all - builderJson.charts[key]
            };
          })
        },
        {
          type: 'pie',
          radius: [0, '50%'],
          center: ['75%', '50%'],
          data: Object.keys(downloadJson).map(function (key, index) {
            return {
              itemStyle: {
                color: colors[index % colors.length]
              },
              name: key.replace('.js', ''),
              value: downloadJson[key]
            };
          })
        }
      ]
    };

    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={chartRef}
      className='w-full h-96 bg-white dark:bg-navy-900 dark:text-white border border-green-500 dark:border-orange-500 rounded-lg shadow-lg'
      style={{
        width: '100%',
        height: '400px',
        margin: 'auto',
        float: 'right'
      }}
    ></div>
  );
};

export default EChartsComponent;
