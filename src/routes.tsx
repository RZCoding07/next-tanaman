import React from 'react';

// Admin Imports
import { GiMagnifyingGlass } from "react-icons/gi";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from 'react-icons/md';

import {
  FaUsers
} from 'react-icons/fa6';

import { FaTreeCity } from "react-icons/fa6";

import { PiTreePalmFill } from "react-icons/pi";

import { BsFileEarmarkBarGraph } from "react-icons/bs";

import { PiChartScatterDuotone } from "react-icons/pi";

// why 
import { TbAdjustmentsQuestion } from "react-icons/tb";
import { GiFertilizerBag } from "react-icons/gi";


const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Grafik Kuadran',
    layout: '/admin',
    path: 'grafik',
    icon: <PiChartScatterDuotone className="h-6 w-6" />,
  },
  {
    name: 'Pupuk',
    layout: '/admin',
    path: 'pupuk',
    icon: <GiFertilizerBag className="h-6 w-6" />,
  },
  {
    name: 'Identifikasi Masalah',
    layout: '/admin',
    path: 'identifikasi-masalah',
    icon: < GiMagnifyingGlass className="h-6 w-6" />,
  },
  {
    name: 'Data Users',
    layout: '/admin',
    icon: <FaUsers className="h-6 w-6" />,
    path: 'users',
  },
  {
    name: 'Data Regional',
    layout: '/admin',
    icon: <FaTreeCity className="h-6 w-6" />,
    path: 'regional',
  },
  {
    name: 'Data Kebun',
    layout: '/admin',
    icon: <PiTreePalmFill className="h-6 w-6" />,
    path: 'kebun',
  },
  {
    name: 'Data Kuadran',
    layout: '/admin',
    path: 'kuadran',
    icon: <BsFileEarmarkBarGraph className="h-6 w-6" />,
  },
  {
    name: 'Data Why',
    layout: '/admin',
    path: 'why',
    icon: <TbAdjustmentsQuestion className="h-6 w-6" />,
  },

];
export default routes;
