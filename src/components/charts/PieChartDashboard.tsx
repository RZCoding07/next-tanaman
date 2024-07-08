import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import image1 from '/public/img/usia.png';
import image2 from '/public/img/pendidikan.png';
import image3 from '/public/img/jenis kelamin.png';
import image4 from '/public/img/status karyawan.png';
import image5 from '/public/img/job grade.png';
import image6 from '/public/img/person grade.png';


import Image from 'next/image';

import { isWindowAvailable } from 'utils/navigation';

interface PieChartDashboardProps {
  keterangan: string;
  data: Array<{ name: string, value: number }>;
  jenis: string;
}

const PieChartDashboard: React.FC<PieChartDashboardProps> = ({ keterangan, data, jenis }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  function getImage(jenis) {
    if (jenis == "usia") {
      return image1.src;
    }
    if (jenis == "pendidikan") {
      return image2.src;
    }
    if (jenis == "job_grade") {
      return image5.src;
    }
    if (jenis == "person_grade") {
      return image6.src;
    }
    if (jenis == "jenkel") {
      return image3.src;
    }
    if (jenis == "status_karyawan") {
      return image4.src;
    }
    return ''; // fallback in case jenis doesn't match any known type
  }

  useEffect(() => {
    const generateRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
  
    const dataWithColors = data.map(item => ({
      ...item,
      itemStyle: {
        color: generateRandomColor()
      }
    }));
  
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
  
      const options = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: '#ddd',
          borderWidth: 1,
          padding: 10,
          textStyle: {
            fontSize: 14
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          padding: 10,
        },
        series: [
          {
            type: 'pie',
            left: 'center',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 5,
              borderColor: '#fff'
            },
            label: {
              show: true,
              position: 'outside',
              align: 'right',
              fontSize: 14,
              fontWeight: 'bold',
              formatter: '{b}: \n ({d}%)',
              zIndex: 9999
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 10,
              lineStyle: {
                width: 2
              }
            },
            data: dataWithColors
          }
        ],
        graphic: {
          elements: [
            {
              type: 'image',
              style: {
                image: getImage(jenis),
                width: 145,
                height: 145,
              },
              left: 'center',
              top: 'center',
            }
          ]
        }
      };
  
      myChart.setOption(options);
  
      return () => {
        myChart.dispose();
      };
    }
  }, [data, keterangan, jenis]);
  

  return (
    <div
      ref={chartRef}
      className='w-full h-96 bg-white dark:bg-navy-900 dark:text-white border border-green-500 dark:border-orange-500 rounded-lg shadow-lg'
      style={{
        width: '100%',
        height: '400px', // Ensure the container has a height
        margin: 'auto',
        float: 'right'
      }}
    ></div>
  );
};

export default PieChartDashboard;
