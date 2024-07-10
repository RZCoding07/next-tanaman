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
        </div>


    </>
  );
}

export default Dashboard;