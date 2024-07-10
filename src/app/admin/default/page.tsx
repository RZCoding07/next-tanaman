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

const Dashboard = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
  const chartRef3 = useRef<HTMLDivElement>(null);

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
        title: {
          text: 'PalmCo',
          subtext: 'Fake Data',
          left: 'center'
        },
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
    keterangan: {
      value: string;
      label: string;
    },
    regional: {
      value: string;
      label: string;
    },
    kebun: {
      value: string;
      label: string;
    },
    tahun: {
      value: string;
      label: string;
    },
    bulan: {
      value: string;
      label: string;
    };
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let keteranganOptions = [
    { value: 'master-data', label: 'Master Data' },
    { value: 'lm', label: 'LM' },
  ];

  // Dummy data for dropdown options (replace with actual data)
  let regionalOptions = [
    { value: 'region1', label: 'Region 1' },
    { value: 'region2', label: 'Region 2' },
    // Add more regional options as needed
  ];

  let kebunOptions = [
    { value: 'kebun1', label: 'Kebun 1' },
    { value: 'kebun2', label: 'Kebun 2' },
    // Add more kebun options as needed
  ];

  let tahunOptions = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    // Add more tahun options as needed
  ];

  let bulanOptions = [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    // Add more bulan options as needed
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Data>({
    defaultValues: {
      keterangan: keteranganOptions[0],
      regional: regionalOptions[0],
      kebun: kebunOptions[0],
      tahun: tahunOptions[0],
      bulan: bulanOptions[0],

    },
  });

  const instanceId = useId();

  const { field: keteranganField } = useController({
    name: "keterangan",
    control,
  });

  const handleIsKeteranganSelectChange = (
    value: { value: string; label: string; } | null
  ) => {
    if (value) {
      keteranganField.onChange(value);
      // setValue("keterangan", value); // Set nilai kebun ke yang dipilih oleh pengguna
      console.log(value);
    }
  };

  const handleIsRegionalSelectChange = (
    value: { value: string; label: string; } | null
  ) => {
    if (value) {
      setValue("regional", value); // Set nilai kebun ke yang dipilih oleh pengguna
      console.log(value);
    }
  };

  const handleIsKebunSelectChange = (
    value: { value: string; label: string; } | null
  ) => {
    if (value) {
      setValue("kebun", value); // Set nilai kebun ke yang dipilih oleh pengguna
      console.log(value);
    }
  };

  const handleIsTahunSelectChange = (
    value: { value: string; label: string; } | null
  ) => {
    if (value) {
      setValue("tahun", value); // Set nilai kebun ke yang dipilih oleh pengguna
      console.log(value);
    }
  };


  return (
    <>
      <div className="w-full min-h-screen">
        <div className="flex items-center justify-end gap-2 mt-10">
          <div className="relative w-full mr-4">
          </div>
        </div>

        {/* table */}
        <div className="mt-10">
          <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white">
            <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-end items-center">
              <h1 className="text-lg font-semibold text-navy-800 dark:text-white w-full">MONITORING PICA</h1>
              <div className='w-full'></div>
              <div className="w-full mr-4">
                <Select
                  options={regionalOptions}
                  onChange={handleIsRegionalSelectChange}
                  className=""
                  instanceId={instanceId}
                  placeholder="Pilih Regional"
                  isSearchable={true}
                  styles={customStyles}
                  value={watch("regional")}
                  defaultValue={regionalOptions.find((option) => option.value === "regional1")}
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  {...(register("regional"), { required: true })}
                />
              </div>
              <div className="w-full mr-4">
                <Select
                  options={kebunOptions}
                  onChange={handleIsKebunSelectChange}
                  className=""
                  instanceId={instanceId}
                  placeholder="Pilih Kebun"
                  isSearchable={true}
                  styles={customStyles}
                  value={watch("kebun")}
                  defaultValue={kebunOptions.find((option) => option.value === "kebun1")}
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  {...(register("kebun"), { required: true })}
                />
              </div>
              <div className="w-full mr-4">
                <Select
                  options={tahunOptions}
                  onChange={handleIsTahunSelectChange}
                  className=""
                  instanceId={instanceId}
                  placeholder="Pilih Tahun"
                  isSearchable={true}
                  styles={customStyles}
                  value={watch("tahun")}
                  defaultValue={tahunOptions.find((option) => option.value === "2022")}
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  {...(register("tahun"), { required: true })}
                />
              </div>
              <div className="w-full mr-4">
                <Select
                  options={bulanOptions}
                  onChange={handleIsKebunSelectChange}
                  className=""
                  instanceId={instanceId}
                  placeholder="Pilih Bulan"
                  isSearchable={true}
                  styles={customStyles}
                  value={watch("bulan")}
                  defaultValue={bulanOptions.find((option) => option.value === "january")}
                  menuPortalTarget={document.body}
                  menuPlacement="auto"
                  {...(register("bulan"), { required: true })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ECharts */}
        <p className='pt-5'></p>
        <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-4">
          <div ref={chartRef1} style={{ width: '100%', height: '400px' }}></div>
          <div ref={chartRef2} style={{ width: '100%', height: '400px' }}></div>
          <div ref={chartRef3} style={{ width: '100%', height: '400px' }}></div>
        </div>
        <p className='pt-5'></p>
        <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-900 dark:text-white p-4">
          <div ref={chartRef} style={{ width: '100%', height: '400px' }}>
            <p>mantap</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;