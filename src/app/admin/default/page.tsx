'use client';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import { FaUserGroup } from "react-icons/fa6";
import React, { useEffect, useRef, useId } from "react";
import { useController, useForm } from "react-hook-form";
import Select from 'react-select';
import * as echarts from 'echarts';


import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, TitleComponent, GridComponent } from 'echarts/components';


import NavLink from "components/link/NavLink";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { isWindowAvailable } from "utils/navigation";
import PieChartDashboard from 'components/charts/PieChartDashboard';

import PieChart from 'components/charts/PieChart';

import cookie from "js-cookie";
import { Tokens } from "types/token";


const Dashboard = () => {

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


  const fetchFilteredData = async () => {
    try {
      const loginData = cookie.get("token");
      const tokenData = JSON.parse(loginData || "{}");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grafik/filter?tahun=2024&bulan=1&rpc=&kebun=&afd=`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.payload.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resultData = await res.json();
      return resultData;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  };

  const processPieData = (setPieData: any, data: any, category: string, stateName: string) => {
    if (data.result && data.result[category]) {
      const categoryData = data.result[category];

      const builderJson = {
        all: categoryData.hitam + categoryData.emas + categoryData.hijau + categoryData.kuning + categoryData.merah,
        charts: {
          hitam: categoryData.hitam,
          emas: categoryData.emas,
          hijau: categoryData.hijau,
          kuning: categoryData.kuning,
          merah: categoryData.merah,
        },
      };

      const downloadJson = {
        hitam: categoryData.hitam,
        emas: categoryData.emas,
        hijau: categoryData.hijau,
        kuning: categoryData.kuning,
        merah: categoryData.merah,
      };

      setPieData({ [`builderJson${stateName}`]: builderJson, [`downloadJson${stateName}`]: downloadJson });
    } else {
      console.error(`Failed to fetch data for ${category}: `, data.message);
    }
  };




  const instanceId = useId();

  const [pieDataTua, setPieDataTua] = React.useState<any>({
    builderJsonTua: null,
    downloadJsonTua: null,
  });
  const [pieDataRemaja, setPieDataRemaja] = React.useState<any>({
    builderJsonRemaja: null,
    downloadJsonRemaja: null,
  });
  const [pieDataRenta, setPieDataRenta] = React.useState<any>({
    builderJsonRenta: null,
    downloadJsonRenta: null,
  });
  const [pieDataMuda, setPieDataMuda] = React.useState<any>({
    builderJsonMuda: null,
    downloadJsonMuda: null,
  });
  const [pieDataDewasa, setPieDataDewasa] = React.useState<any>({
    builderJsonDewasa: null,
    downloadJsonDewasa: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultData = await fetchFilteredData();
        processPieData(setPieDataTua, resultData, 'tua', 'Tua');
        processPieData(setPieDataRemaja, resultData, 'remaja', 'Remaja');
        processPieData(setPieDataRenta, resultData, 'renta', 'Renta');
        processPieData(setPieDataMuda, resultData, 'muda', 'Muda');
        processPieData(setPieDataDewasa, resultData, 'dewasa', 'Dewasa');
      } catch (error) {
        console.error("Error fetching and processing data", error);
      }
    };

    fetchData();

    getAllReport();
  }, []);


  type Gata = {
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


  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Gata>({
    defaultValues: {
      regional: regionalOptions[0],
      kebun: kebunOptions[0],
      tahun: tahunOptions[0],
      bulan: bulanOptions[0],

    },
  });

  return (
    <div className="w-full min-h-screen">

      <div className="mt-10 mb-5">
        <div className="relative overflow-x-auto overflow-y-hidden border-gray-200 rounded-lg shadow-lg dark:border-navy-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white">
          <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-navy-800 dark:text-white">GRAFIK MONITORING PICA</h1>
            <select className="ml-4 p-2 rounded-lg bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 text-navy-800 dark:text-white paddingHorizontal-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" name="filter" id="filter">
              <option value="keseluruhan">Blok</option>
              <option value="regional">Regional</option>
              <option value="kebun">Kebun</option>
              <option value="afdeling">Afdeling</option>
            </select>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="relative overflow-x-auto overflow-y-hidden border-black rounded-lg shadow-lg border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white p-5 flex flex-col justify-center items-center">
          <h3 className="text-center font-bold underline decoration-black">Hitam</h3>
          <h1 className="text-4xl text-center font-bold">{hitam}</h1>
        </div>
        <div className="relative overflow-x-auto overflow-y-hidden border-orange-300 rounded-lg shadow-lg dark:border-orange-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white p-5 flex flex-col justify-center items-center">
          <h3 className="text-center font-bold underline decoration-orange-300">Emas</h3>
          <h1 className="text-4xl text-center font-bold">{emas}</h1>
        </div>
        <div className="relative overflow-x-auto overflow-y-hidden border-green-500 rounded-lg shadow-lg border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white p-5 flex flex-col justify-center items-center">
          <h3 className="text-center font-bold underline decoration-green-500">Hijau</h3>
          <h1 className="text-4xl text-center font-bold">{hijau}</h1>
        </div>
        <div className="relative overflow-x-auto overflow-y-hidden border-yellow-500 rounded-lg shadow-lg dark:border-yellow-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white p-5 flex flex-col justify-center items-center">
          <h3 className="text-center font-bold underline decoration-yellow-500">Kuning</h3>
          <h1 className="text-4xl text-center font-bold">{kuning}</h1>
        </div>
        <div className="relative overflow-x-auto overflow-y-hidden border-red-700 rounded-lg shadow-lg dark:border-red-700 border-opacity-50 border-[2px] backdrop-filter backdrop-blur-lg bg-white dark:bg-navy-800 dark:text-white p-5 flex flex-col justify-center items-center">
          <h3 className="text-center font-bold underline decoration-red-700">Merah</h3>
          <h1 className="text-4xl text-center font-bold">{merah}</h1>
        </div>
      </div>

      <div className="mt-3 grid lg:grid-cols-2 gap-5 sm:grid sm:grid-cols-12">


        <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Tua</h3>
          <div className="flex">
            <PieChartDashboard nameData='Tua' downloadJsonData={pieDataTua.downloadJsonTua} builderJsonData={pieDataTua.builderJsonTua} />
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Remaja</h3>
          <div className="flex">
            <PieChartDashboard nameData='Remaja' downloadJsonData={pieDataRemaja.downloadJsonRemaja} builderJsonData={pieDataRemaja.builderJsonRemaja} />
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Renta</h3>
          <div className="flex">
            <PieChartDashboard nameData='Renta' downloadJsonData={pieDataRenta.downloadJsonRenta} builderJsonData={pieDataRenta.builderJsonRenta} />
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Muda</h3>
          <div className="flex">
            <PieChartDashboard nameData='Muda' downloadJsonData={pieDataMuda.downloadJsonMuda} builderJsonData={pieDataMuda.builderJsonMuda} />
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-3">Dewasa</h3>
          <div className="flex">
            <PieChartDashboard nameData='Dewasa' downloadJsonData={pieDataDewasa.downloadJsonDewasa} builderJsonData={pieDataDewasa.builderJsonDewasa} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
