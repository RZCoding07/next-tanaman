import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import cookie from 'js-cookie';
import { Tokens } from 'types/token';
import { isWindowAvailable } from 'utils/navigation';

interface PieChartKaryawanProps {
  keterangan: string;
  data: Array<{ name: string, value: number }>;
  dataTotal: string;
}

const PieChartKaryawan: React.FC<PieChartKaryawanProps> = ({ keterangan, data, dataTotal }) => {
  const [detailData, setDetailData] = useState<Array<{ name: string, value: number }> | null>(null);

  useEffect(() => {
    let mediumShades: string[] = [];
    // Define medium green color shades
    if(isWindowAvailable()) {
      if(localStorage.getItem('darkmode') === 'true') {
        mediumShades = [
          "rgb(255, 237, 213)", // bg-orange-100
          "rgb(254, 215, 170)", // bg-orange-200
          "rgb(253, 186, 116)", // bg-orange-300
          "rgb(251, 146, 60)",  // bg-orange-400
          "rgb(249, 115, 22)",  // bg-orange-500
          "rgb(234, 88, 12)",   // bg-orange-600
          "rgb(194, 65, 12)",   // bg-orange-700
          "rgb(154, 52, 18)",   // bg-orange-800
          "rgb(124, 45, 18)"    // bg-orange-900
        ];
        
      } else {
        mediumShades = [
          "rgb(187 247 208)",
          "rgb(134 239 172)",
          "rgb(74, 222, 128)", // bg-green-400
          "rgb(34, 197, 94)",  // bg-green-500
          "rgb(22, 163, 74)",  // bg-green-600
          "rgb(21, 128, 61)",  // bg-green-700
          "rgb(22, 101, 52)",  // bg-green-800
          "rgb(20, 83, 45)",   // bg-green-900
          "rgb(5, 46, 22)"     // bg-green-950
        ];
      
      }
    }

    function urlTitle(str: string, separator: string = '-', lowercase: boolean = false): string {
      // Escape special characters for the separator
      const qSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Define the transformation rules
      const trans = [
        { pattern: /&.+?;/g, replacement: '' },
        { pattern: /[^\w\d\s_-]/g, replacement: '' },
        { pattern: /\s+/g, replacement: separator },
        { pattern: new RegExp(`(${qSeparator})+`, 'g'), replacement: separator },
      ];

      // Strip HTML tags
      str = str.replace(/<[^>]*>?/gm, '');

      // Apply each transformation rule
      for (const { pattern, replacement } of trans) {
        str = str.replace(pattern, replacement);
      }

      // Convert to lowercase if needed
      if (lowercase) {
        str = str.toLowerCase();
      }

      // Trim any leading or trailing separators
      return str.replace(new RegExp(`^${qSeparator}+|${qSeparator}+$`, 'g'), '');
    }

    // Map through data to assign sequential medium green colors
    const dataWithColors = data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: mediumShades[index % mediumShades.length]
      }
    }));

    // Initialize echarts instance
    const chartDom = document.getElementById('pie-chart');
    const myChart = echarts.init(chartDom!);

    // Specify chart configuration and data
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
          name: 'Data Karyawan',
          type: 'pie',
          left: '25%',
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
            formatter: '{b}: {c} ({d}%)',
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
            type: 'text',
            show : true,
            left: '58%',
            top: 'center',
            style: {
              text: dataTotal,
              fill: '#000',
              fontSize: 24,
              fontWeight: 'bold',
            }
          }
        ]
      }
    };


    // Set options
    myChart.setOption(options);

    // Add click event listener
    myChart.on('click', function (params) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const loginData = cookie.get("token");
        const tokenData: Tokens = JSON.parse(loginData || "{}");
        const getDataDetailKaryawan = async () => {
          const res = await fetch(`${apiUrl}/countdashboarddetail?jenis_data=${keterangan}&jenis_keterangan=${urlTitle(params.name, '-', true)}`, {
            method: "GET",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenData.payload.access_token}`,
            },
          });

          const data = await res.json();
          if (data.status_code === 200) {
            // Set the detail data state with the received data
            Object.values(data.payload)
              .map((item: any) => ({
                value: item.value,
                name: item.name,
              }));

            setDetailData(Object.values(data.payload));
          }
        }

        getDataDetailKaryawan();
      } catch (error) {
        console.error("error", error);
      }
    });

    // Clean up
    return () => {
      myChart.dispose();
    };
  }, [data, dataTotal, keterangan]);

  return (
    <>
      <div
        id="pie-chart"
        className='w-full h-96 bg-white dark:bg-navy-900 dark:text-white border border-green-500 dark:border-orange-500 rounded-lg shadow-lg'
        style={{
          width: '100%',
          margin: 'auto',
          float: 'right'
        }}
      ></div>

    </>
  );
};

export default PieChartKaryawan;
