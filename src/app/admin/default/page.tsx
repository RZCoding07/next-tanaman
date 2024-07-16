'use client';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import { FaUserGroup } from "react-icons/fa6";
import React, { useEffect, useRef, useId } from "react";
import { useController, useForm } from "react-hook-form";
import Select from 'react-select';
import * as echarts from 'echarts';

import NavLink from "components/link/NavLink";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { isWindowAvailable } from "utils/navigation";
import PieChartDashboard from 'components/charts/PieChartDashboard';
import cookie from "js-cookie";
import { Tokens } from "types/token";


const Dashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);
  const chartRef4 = useRef<HTMLDivElement>(null);
  const chartRef5 = useRef<HTMLDivElement>(null);

  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark')
  );

  // Mengambil semua class dari elemen body
  const bodyClasses = document.body.classList;

  // Mengambil class pertama dari elemen body (jika ada)
  const firstClass = document.body.classList[0];

  // Mengecek apakah elemen body memiliki class 'dark'
  let hasDarkClass = document.body.classList.contains('dark');

  // Menambahkan class 'dark' ke elemen body jika belum ada

  let color = "dark";

  const handleDarkmode = () => {
    if (hasDarkClass) {
      document.body.classList.remove('dark');

      color = "light";

      setDarkmode(false);
    } else {
      color = "dark";
      document.body.classList.add('dark');
      setDarkmode(true);
    }
  };

  useEffect(() => {
    handleDarkmode();
    if (chartRef.current) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart.setOption<echarts.EChartsOption>(option);
    }
    if (chartRef1.current) {
      const chartDom1 = chartRef1.current;
      const myChart1 = echarts.init(chartDom1);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart1.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart1.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart1.setOption<echarts.EChartsOption>(option);
    }
    if (chartRef2.current) {
      const chartDom2 = chartRef2.current;
      const myChart2 = echarts.init(chartDom2);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart2.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart2.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart2.setOption<echarts.EChartsOption>(option);
    }
    if (chartRef3.current) {
      const chartDom3 = chartRef3.current;
      const myChart3 = echarts.init(chartDom3);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart3.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart3.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart3.setOption<echarts.EChartsOption>(option);
    }
    if (chartRef4.current) {
      const chartDom4 = chartRef4.current;
      const myChart4 = echarts.init(chartDom4);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart4.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart4.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart4.setOption<echarts.EChartsOption>(option);
    }
    if (chartRef5.current) {
      const chartDom5 = chartRef5.current;
      const myChart5 = echarts.init(chartDom5);
      let option: echarts.EChartsOption;


      option = {
        legend: {
          textStyle: {
            color: color === "dark" ? "#000" : "fff",
          }
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
          ],
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      };


      myChart5.on('updateAxisPointer', function (event: any) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart5.setOption<echarts.EChartsOption>({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });

      myChart5.setOption<echarts.EChartsOption>(option);
    }

  }, []);


  if (isWindowAvailable()) {
    document.title = 'Dashboard';
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#F9FAFB', // bg-gray-50
      borderColor: state.isFocused ? '#38A169' : '#38A169', // border-green-600
      color: '#1A202C', // text-gray-900
      borderRadius: '100px', // rounded-full
      paddingLeft: '2.5rem', // pl-10
      padding: '0.1rem', // p-2.5
      boxShadow: state.isFocused ? '0 0 0 2px rgba(56, 161, 105, 0.5)' : null, // focus:ring-2 focus:ring-opacity-50
      '&:hover': {
        borderColor: '#38A169',
      },
      '&:active': {
        outline: 'none',
      },
      '&:focus': {
        outline: 'none',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#A0AEC0', // text-gray-500
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1A202C', // text-gray-900
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  type Data = {
    report: {
      value: string;
      label: string;
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // GET TAHUN DATA
  const [dataReport, setDataReport] = React.useState<any>([]);
  const [dataAllReport, setAllDataReport] = React.useState<any>([]);
  const [bulan, setBulan] = React.useState<any>(1);
  const [tahun, setTahun] = React.useState<any>(2021);
  const [emas, setEmas] = React.useState<any>(0);
  const [hitam, setHitam] = React.useState<any>(0);
  const [hijau, setHijau] = React.useState<any>(0);
  const [kuning, setKuning] = React.useState<any>(0);
  const [merah, setMerah] = React.useState<any>(0);
  const [tua, setTua] = React.useState<any>(0);
  const [muda, setMuda] = React.useState<any>(0);
  const [remaja, setRemaja] = React.useState<any>(0);
  const [renta, setRenta] = React.useState<any>(0);
  const [dewasa, setDewasa] = React.useState<any>(0);





  // Mengambil data kebun dari API
  const getAllReport = async () => {
    const loginData = cookie.get("token");
    const tokenData: Tokens = JSON.parse(loginData || "{}");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report`, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.payload.access_token}`,
      },
    });
    const data = await res.json();
    if (data.status_code === 200) {
      // console.log(data.data);
      // set mappedData to value label

      let bulanOpt = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
      ];
      const mappedData = data.payload.map((item: any) => {
        return {
          value: item.id,
          label: bulanOpt[item.bulan - 1].label + " " + item.tahun
        };
      });

      setDataReport(mappedData);

      setAllDataReport(data.payload);

      setEmas(data.payload[0].emas);
      setHitam(data.payload[0].hitam);
      setHijau(data.payload[0].hijau);
      setKuning(data.payload[0].kuning);
      setMerah(data.payload[0].merah);
      setTua(data.payload[0].tua);
      setMuda(data.payload[0].muda);
      setRemaja(data.payload[0].remaja);
      setRenta(data.payload[0].renta);
      setDewasa(data.payload[0].dewasa);
      setBulan(data.payload[0].bulan);
      setTahun(data.payload[0].tahun);

      console.log(data.payload);

    } else {
      // handle error
      console.error("Failed to fetch data");
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Data>({
    defaultValues: {

    },
  });

  const instanceId = useId();

  useEffect(() => {
    getAllReport();
  }, []);


  return (
    <>
      <div className="w-full min-h-screen">
        <div className="flex ustify-end gap-2 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
            <Select
              instanceId={instanceId}
              inputId="report"
              name="report"
              options={dataReport}
              styles={customStyles}
              placeholder="Pilih Tahun"
              isSearchable={true}
              defaultValue={dataReport[0]}
              isClearable={true}
              {...register('report')}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          <div className="bg-black text-white p-4 rounded-lg shadow-md" style={{ backgroundColor: 'black', color: 'white' }}>
            <h2 className="text-lg font-bold">HITAM</h2>
            <p className="text-2xl">{hitam}</p>

          </div>
          <div className="bg-yellow-500 text-black p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">EMAS</h2>
            <p className="text-2xl">{emas}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">       
            <h2 className="text-lg font-bold">HIJAU</h2>
            <p className="text-2xl">
              {hijau}
            </p></div>
          <div className="bg-yellow-300 text-black p-4 rounded-lg shadow-md">       
            <h2 className="text-lg font-bold">KUNING</h2>
            <p className="text-2xl">{kuning}</p></div>
          <div className="bg-red-700 text-white p-4 rounded-lg shadow-md">       
            <h2 className="text-lg font-bold">MERAH</h2>
            <p className="text-2xl">{merah}</p></div>
        </div>
        <div className="mt-3 grid lg:grid-cols-2 gap-5 sm:grid sm:grid-cols-12">
          <div className="bg-white dark:bg-navy-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Renta</h3>
            <div className="flex">
              <PieChartDashboard />
            </div>
          </div>
          <div className="bg-white dark:bg-navy-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Tua</h3>
            <div className="flex">
            <PieChartDashboard />

            </div>
          </div>
          <div className="bg-white dark:bg-navy-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Dewasa</h3>
            <div className="flex">
            <PieChartDashboard />

            </div>
          </div>
          <div className="bg-white dark:bg-navy-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Muda</h3>
            <div className="flex">
            <PieChartDashboard />

            </div>
          </div>


        </div>


      </div>
    </>
  );
}

export default Dashboard;
